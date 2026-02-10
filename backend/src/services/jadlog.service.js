const axios = require('axios');
const config = require('../config/jadlog');

const api = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': config.token
  },
  timeout: 15000 // 15 segundos
});

/**
 * Serviço de integração com API da Jadlog
 */
const jadlogService = {
  
  /**
   * Calcula valor e prazo do frete
   * 
   * @param {Object} params - Parâmetros do frete
   * @param {string} params.cepOrigem - CEP de origem
   * @param {string} params.cepDestino - CEP de destino
   * @param {number} params.peso - Peso em kg
   * @param {number} params.valorDeclarado - Valor da mercadoria
   * @param {number} params.modalidade - Código da modalidade (opcional)
   * @returns {Promise<Object>} Dados do frete
   */
  async calcularFrete({ cepOrigem, cepDestino, peso, valorDeclarado, modalidade }) {
    try {
      const payload = {
        frete: [
          {
            cepori: cepOrigem.replace(/\D/g, ''),
            cepdes: cepDestino.replace(/\D/g, ''),
            peso: Number(peso),
            cnpj: config.cnpj,
            conta: config.conta,
            modalidade: modalidade || config.defaults.modalidade,
            tpentrega: config.defaults.tipoEntrega,
            tpseguro: config.defaults.tipoSeguro,
            vldeclarado: Number(valorDeclarado) || 0,
            vlcoleta: config.defaults.valorColeta
          }
        ]
      };

      const { data } = await api.post('/frete/valor', payload);
      
      if (!data.frete || !data.frete[0]) {
        throw new Error('Resposta inválida da Jadlog');
      }

      return data.frete[0];
      
    } catch (error) {
      console.error('Erro ao calcular frete Jadlog:', error.message);
      
      if (error.response) {
        throw new Error(`Jadlog API: ${error.response.data?.mensagem || error.response.statusText}`);
      }
      
      throw error;
    }
  },

  /**
   * Cria um pedido/embarque na Jadlog
   * 
   * @param {Object} pedido - Dados do pedido
   * @returns {Promise<Object>} Resposta da Jadlog
   */
  async criarPedido(pedido) {
    try {
      const payload = {
        codCliente: config.conta || '000000',
        conteudo: pedido.conteudo || 'Produtos E-commerce',
        pedido: [pedido.id],
        totPeso: pedido.pesoTotal,
        totValor: pedido.valorTotal,
        modalidade: pedido.modalidade || config.defaults.modalidade,
        tipoFrete: config.defaults.tipoFrete,

        // Remetente (loja)
        rem: {
          nome: config.origem.nome,
          cnpjCpf: config.origem.cnpjCpf,
          endereco: config.origem.endereco,
          numero: config.origem.numero,
          bairro: config.origem.bairro,
          cidade: config.origem.cidade,
          uf: config.origem.uf,
          cep: config.origem.cep,
          telefone: config.origem.telefone
        },

        // Destinatário (cliente)
        des: {
          nome: pedido.destinatario.nome,
          cnpjCpf: pedido.destinatario.cpfCnpj,
          endereco: pedido.destinatario.endereco,
          numero: pedido.destinatario.numero,
          bairro: pedido.destinatario.bairro || '',
          complemento: pedido.destinatario.complemento || '',
          cidade: pedido.destinatario.cidade,
          uf: pedido.destinatario.uf,
          cep: pedido.destinatario.cep,
          telefone: pedido.destinatario.telefone
        },

        // Volumes
        volume: pedido.volumes || []
      };

      const { data } = await api.post('/pedido/incluir', payload);
      
      return data;
      
    } catch (error) {
      console.error('Erro ao criar pedido Jadlog:', error.message);
      throw error;
    }
  },

  /**
   * Rastreia um pedido
   * 
   * @param {string} codigo - Código de rastreio Jadlog
   * @returns {Promise<Object>} Status e eventos do rastreio
   */
  async rastrear(codigo) {
    try {
      const { data } = await api.post(
        'https://prd-traffic.jadlogtech.com.br/embarcador/api/tracking/consultar',
        {
          consulta: [{ codigo }]
        }
      );

      return data;
      
    } catch (error) {
      console.error('Erro ao rastrear Jadlog:', error.message);
      throw error;
    }
  },

  /**
   * Verifica se a integração está configurada
   * 
   * @returns {boolean} True se configurado
   */
  isConfigured() {
    return !!(config.token && config.cnpj);
  }
};

module.exports = jadlogService;
