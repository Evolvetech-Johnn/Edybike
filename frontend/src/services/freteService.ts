/**
 * Serviço de cálculo de frete
 * Simula cálculo de frete de transportadoras (Correios, Jadlog, Loggi)
 */

export interface FreteOption {
  id: string;
  transportadora: string;
  tipo: string; // 'Econômico' | 'Padrão' | 'Expresso'
  valor: number;
  prazo: string;
  prazoMin: number;
  prazoMax: number;
}

export interface FreteParams {
  cep: string;
  pesoTotal: number; // em kg
  valorTotal: number;
}

// Tabela simplificada de regiões por CEP
const getRegiao = (cep: string): 'mesma-cidade' | 'mesmo-estado' | 'sudeste' | 'outras' => {
  const cepNum = parseInt(cep.replace(/\D/g, ''));
  
  // SP Capital (01000-000 a 05999-999)
  if (cepNum >= 1000000 && cepNum <= 5999999) {
    return 'mesma-cidade';
  }
  
  // SP Interior (06000-000 a 19999-999)
  if (cepNum >= 6000000 && cepNum <= 19999999) {
    return 'mesmo-estado';
  }
  
  // Sudeste (20000-000 a 29999-999 RJ, 30000-000 a 39999-999 MG, etc)
  if ((cepNum >= 20000000 && cepNum <= 29999999) || 
      (cepNum >= 30000000 && cepNum <= 39999999)) {
    return 'sudeste';
  }
  
  return 'outras';
};

export const calcularFreteCorreios = (params: FreteParams): FreteOption[] => {
  const regiao = getRegiao(params.cep);
  const opcoes: FreteOption[] = [];
  
  // Tabela de preços base por região
  const tabelaPrecos = {
    'mesma-cidade': { base: 15, porKg: 2, prazoMin: 1, prazoMax: 2 },
    'mesmo-estado': { base: 30, porKg: 3.5, prazoMin: 3, prazoMax: 5 },
    'sudeste': { base: 50, porKg: 5, prazoMin: 5, prazoMax: 8 },
    'outras': { base: 70, porKg: 6.5, prazoMin: 7, prazoMax: 12 }
  };
  
  const tabela = tabelaPrecos[regiao];
  const valorBase = tabela.base + (params.pesoTotal * tabela.porKg);
  
  // PAC (Econômico)
  opcoes.push({
    id: 'correios-pac',
    transportadora: 'Correios',
    tipo: 'PAC (Econômico)',
    valor: valorBase,
    prazo: `${tabela.prazoMin + 2} a ${tabela.prazoMax + 3} dias úteis`,
    prazoMin: tabela.prazoMin + 2,
    prazoMax: tabela.prazoMax + 3
  });
  
  // SEDEX (Padrão)
  opcoes.push({
    id: 'correios-sedex',
    transportadora: 'Correios',
    tipo: 'SEDEX (Padrão)',
    valor: valorBase * 1.5,
    prazo: `${tabela.prazoMin} a ${tabela.prazoMax} dias úteis`,
    prazoMin: tabela.prazoMin,
    prazoMax: tabela.prazoMax
  });
  
  // SEDEX 10 (Expresso) - apenas para mesma cidade/estado
  if (regiao === 'mesma-cidade' || regiao === 'mesmo-estado') {
    opcoes.push({
      id: 'correios-sedex10',
      transportadora: 'Correios',
      tipo: 'SEDEX 10 (Expresso)',
      valor: valorBase * 2.5,
      prazo: 'Até 1 dia útil',
      prazoMin: 1,
      prazoMax: 1
    });
  }
  
  return opcoes;
};

export const calcularFreteJadlog = (params: FreteParams): FreteOption[] => {
  const regiao = getRegiao(params.cep);
  const opcoes: FreteOption[] = [];
  
  const tabelaPrecos = {
    'mesma-cidade': { base: 18, porKg: 2.5, prazoMin: 1, prazoMax: 2 },
    'mesmo-estado': { base: 35, porKg: 4, prazoMin: 2, prazoMax: 4 },
    'sudeste': { base: 55, porKg: 5.5, prazoMin: 4, prazoMax: 7 },
    'outras': { base: 75, porKg: 7, prazoMin: 6, prazoMax: 10 }
  };
  
  const tabela = tabelaPrecos[regiao];
  const valorBase = tabela.base + (params.pesoTotal * tabela.porKg);
  
  // .Package (Econômico)
  opcoes.push({
    id: 'jadlog-package',
    transportadora: 'Jadlog',
    tipo: '.Package (Econômico)',
    valor: valorBase,
    prazo: `${tabela.prazoMin + 1} a ${tabela.prazoMax + 2} dias úteis`,
    prazoMin: tabela.prazoMin + 1,
    prazoMax: tabela.prazoMax + 2
  });
  
  // .COM (Padrão)
  opcoes.push({
    id: 'jadlog-com',
    transportadora: 'Jadlog',
    tipo: '.COM (Padrão)',
    valor: valorBase * 1.4,
    prazo: `${tabela.prazoMin} a ${tabela.prazoMax} dias úteis`,
    prazoMin: tabela.prazoMin,
    prazoMax: tabela.prazoMax
  });
  
  return opcoes;
};

export const calcularFreteLoggi = (params: FreteParams): FreteOption[] => {
  const regiao = getRegiao(params.cep);
  
  // Loggi opera apenas em grandes centros urbanos
  if (regiao !== 'mesma-cidade') {
    return [];
  }
  
  return [
    {
      id: 'loggi-standard',
      transportadora: 'Loggi',
      tipo: 'Entrega no mesmo dia',
      valor: 25 + (params.pesoTotal * 3),
      prazo: 'Até 4 horas',
      prazoMin: 0,
      prazoMax: 0
    }
  ];
};

export const calcularTodasOpcoes = (params: FreteParams): FreteOption[] => {
  const opcoes: FreteOption[] = [];
  
  // Adicionar opções de todas transportadoras
  opcoes.push(...calcularFreteCorreios(params));
  opcoes.push(...calcularFreteJadlog(params));
  opcoes.push(...calcularFreteLoggi(params));
  
  // Ordenar por prazo (mais rápido primeiro)
  return opcoes.sort((a, b) => a.prazoMin - b.prazoMin);
};

export const validarCEP = (cep: string): boolean => {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  return cepLimpo.length === 8;
};

export const formatarCEP = (cep: string): string => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    return cep;
  }
  
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
};

export default {
  calcularFreteCorreios,
  calcularFreteJadlog,
  calcularFreteLoggi,
  calcularTodasOpcoes,
  validarCEP,
  formatarCEP
};
