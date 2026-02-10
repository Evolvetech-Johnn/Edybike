const jadlogService = require('../services/jadlog.service');
const { calcularPesoFinal } = require('../utils/pesoCubado');

/**
 * Cache simples de cálculos de frete
 * Evita chamadas excessivas à API
 */
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

function getCacheKey(cepDestino, peso, valor) {
  return `${cepDestino}-${peso}-${valor}`;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Controller de frete para e-commerce
 */
const freteController = {
  
  /**
   * POST /api/calcular-frete
   * Calcula opções de frete para o checkout
   */
  async simularFrete(req, res) {
    try {
      const { cepDestino, peso, valor, dimensoes } = req.body;

      // Validações
      if (!cepDestino || !peso || !valor) {
        return res.status(400).json({
          erro: 'Parâmetros inválidos',
          detalhe: 'cepDestino, peso e valor são obrigatórios'
        });
      }

      // Validar formato CEP
      const cepLimpo = cepDestino.replace(/\D/g, '');
      if (cepLimpo.length !== 8) {
        return res.status(400).json({
          erro: 'CEP inválido',
          detalhe: 'CEP deve conter 8 dígitos'
        });
      }

      // Verificar cache
      const cacheKey = getCacheKey(cepLimpo, peso, valor);
      const cached = getFromCache(cacheKey);
      
      if (cached) {
        return res.json({
          ...cached,
          fromCache: true
        });
      }

      // Calcular peso final (real vs cubado)
      const pesoFinal = calcularPesoFinal(peso, dimensoes);

      const opcoes = [];
      const cepOrigem = process.env.LOJA_CEP || '86010000'; // Londrina/PR

      // 1. Jadlog (se configurado)
      if (jadlogService.isConfigured()) {
        try {
          // .Package (econômico)
          const packageFrete = await jadlogService.calcularFrete({
            cepOrigem,
            cepDestino: cepLimpo,
            peso: pesoFinal,
            valorDeclarado: valor,
            modalidade: 3
          });

          opcoes.push({
            id: 'jadlog-package',
            transportadora: 'Jadlog',
            tipo: '.Package',
            valor: parseFloat(packageFrete.vltotal) || 0,
            prazo: packageFrete.prazo || '3 a 7 dias úteis'
          });

          // .COM (expresso)
          const comFrete = await jadlogService.calcularFrete({
            cepOrigem,
            cepDestino: cepLimpo,
            peso: pesoFinal,
            valorDeclarado: valor,
            modalidade: 4
          });

          opcoes.push({
            id: 'jadlog-com',
            transportadora: 'Jadlog',
            tipo: '.COM',
            valor: parseFloat(comFrete.vltotal) || 0,
            prazo: comFrete.prazo || '1 a 3 dias úteis'
          });
          
        } catch (error) {
          console.error('Erro Jadlog:', error.message);
          // Continua para outras transportadoras
        }
      }

      // 2. Fallback: usar cálculo frontend
      if (opcoes.length === 0) {
        // Importar lógica do freteService.ts do frontend
        const { calcularTodasOpcoes } = require('../utils/freteSimulado');
        
        const opcoesSimuladas = calcularTodasOpcoes({
          cep: cepLimpo,
          pesoTotal: pesoFinal,
          valorTotal: valor
        });

        opcoes.push(...opcoesSimuladas);
      }

      // Ordenar por valor (mais barato primeiro)
      opcoes.sort((a, b) => a.valor - b.valor);

      const resposta = {
        opcoes,
        pesoCalculado: pesoFinal,
        dimensoesUsadas: dimensoes || null
      };

      // Salvar no cache
      setCache(cacheKey, resposta);

      res.json(resposta);
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      res.status(500).json({
        erro: 'Erro ao calcular frete',
        detalhe: error.message
      });
    }
  },

  /**
   * GET /api/frete/limpar-cache
   * Limpa cache de fretes (admin)
   */
  async limparCache(req, res) {
    cache.clear();
    res.json({ mensagem: 'Cache limpo com sucesso' });
  }
};

module.exports = freteController;
