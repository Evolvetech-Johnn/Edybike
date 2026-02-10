/**
 * Versão simplificada do cálculo de frete (fallback)
 * Baseado no freteService.ts do frontend
 * 
 * Usado quando APIs reais não estão disponíveis
 */

function getRegiao(cep) {
  const cepNum = parseInt(cep.substring(0, 5));
  
  // São Paulo Capital
  if (cepNum >= 1000 && cepNum <= 5999) {
    return 'mesma-cidade';
  }
  // São Paulo Interior
  if (cepNum >= 6000 && cepNum <= 19999) {
    return 'mesmo-estado';
  }
  // Sudeste (RJ, MG, ES)
  if (cepNum >= 20000 && cepNum <= 39999) {
    return 'sudeste';
  }
  // Resto do Brasil
  return 'outras';
}

function calcularCorreios(cep, peso) {
  const regiao = getRegiao(cep);
  
  const tabelaPAC = {
    'mesma-cidade': { base: 15, porKg: 2 },
    'mesmo-estado': { base: 25, porKg: 3 },
    'sudeste': { base: 35, porKg: 4.5 },
    'outras': { base: 50, porKg: 6 }
  };
  
  const tabelaSEDEX = {
    'mesma-cidade': { base: 25, porKg: 3.5 },
    'mesmo-estado': { base: 40, porKg: 5 },
    'sudeste': { base: 55, porKg: 7 },
    'outras': { base: 75, porKg: 9 }
  };

  const valorPAC = tabelaPAC[regiao].base + (peso * tabelaPAC[regiao].porKg);
  const valorSEDEX = tabelaSEDEX[regiao].base + (peso * tabelaSEDEX[regiao].porKg);

  const opcoes = [
    {
      id: 'correios-pac',
      transportadora: 'Correios',
      tipo: 'PAC',
      valor: valorPAC,
      prazo: regiao === 'mesma-cidade' ? '3 a 5 dias úteis' : '5 a 10 dias úteis'
    },
    {
      id: 'correios-sedex',
      transportadora: 'Correios',
      tipo: 'SEDEX',
      valor: valorSEDEX,
      prazo: regiao === 'mesma-cidade' ? '1 a 2 dias úteis' : '2 a 5 dias úteis'
    }
  ];

  // SEDEX 10 apenas para mesma cidade/estado
  if (regiao === 'mesma-cidade' || regiao === 'mesmo-estado') {
    opcoes.push({
      id: 'correios-sedex10',
      transportadora: 'Correios',
      tipo: 'SEDEX 10',
      valor: valorSEDEX * 1.5,
      prazo: '1 dia útil'
    });
  }

  return opcoes;
}

function calcularJadlog(cep, peso) {
  const regiao = getRegiao(cep);
  
  const tabela = {
    'mesma-cidade': { base: 18, porKg: 2.5 },
    'mesmo-estado': { base: 30, porKg: 3.5 },
    'sudeste': { base: 45, porKg: 5.5 },
    'outras': { base: 65, porKg: 7.5 }
  };

  const valorBase = tabela[regiao].base + (peso * tabela[regiao].porKg);

  return [
    {
      id: 'jadlog-package',
      transportadora: 'Jadlog',
      tipo: '.Package',
      valor: valorBase,
      prazo: regiao === 'mesma-cidade' ? '2 a 4 dias úteis' : '4 a 8 dias úteis'
    },
    {
      id: 'jadlog-com',
      transportadora: 'Jadlog',
      tipo: '.COM',
      valor: valorBase * 1.4,
      prazo: regiao === 'mesma-cidade' ? '1 a 2 dias úteis' : '2 a 4 dias úteis'
    }
  ];
}

function calcularLoggi(cep, peso) {
  const regiao = getRegiao(cep);
  
  // Loggi apenas para mesma cidade
  if (regiao !== 'mesma-cidade') {
    return [];
  }

  const valor = 20 + (peso * 3);

  return [
    {
      id: 'loggi-express',
      transportadora: 'Loggi',
      tipo: 'Entrega Rápida',
      valor,
      prazo: 'Mesmo dia'
    }
  ];
}

function calcularTodasOpcoes({ cep, pesoTotal, valorTotal }) {
  const cepLimpo = cep.replace(/\D/g, '');
  
  const opcoes = [
    ...calcularCorreios(cepLimpo, pesoTotal),
    ...calcularJadlog(cepLimpo, pesoTotal),
    ...calcularLoggi(cepLimpo, pesoTotal)
  ];

  // Ordenar por valor
  return opcoes.sort((a, b) => a.valor - b.valor);
}

module.exports = {
  calcularTodasOpcoes,
  calcularCorreios,
  calcularJadlog,
  calcularLoggi
};
