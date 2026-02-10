/**
 * Calcula o peso cubado (volumétrico) de uma encomenda
 * Fórmula: (Altura x Largura x Comprimento) / 6000
 * 
 * @param {number} altura - Altura em centímetros
 * @param {number} largura - Largura em centímetros
 * @param {number} comprimento - Comprimento em centímetros
 * @returns {number} Peso cubado em quilogramas
 */
function calcularPesoCubado(altura, largura, comprimento) {
  if (!altura || !largura || !comprimento) {
    throw new Error('Dimensões inválidas para cálculo de peso cubado');
  }
  
  return (altura * largura * comprimento) / 6000;
}

/**
 * Determina o peso a ser cobrado (maior entre real e cubado)
 * 
 * @param {number} pesoReal - Peso real em kg
 * @param {Object} dimensoes - Dimensões do pacote
 * @param {number} dimensoes.altura - Altura em cm
 * @param {number} dimensoes.largura - Largura em cm
 * @param {number} dimensoes.comprimento - Comprimento em cm
 * @returns {number} Peso final para cobrança
 */
function calcularPesoFinal(pesoReal, dimensoes = {}) {
  if (!pesoReal || pesoReal <= 0) {
    throw new Error('Peso real deve ser maior que zero');
  }
  
  // Se não tiver dimensões, usa peso real
  if (!dimensoes.altura || !dimensoes.largura || !dimensoes.comprimento) {
    return pesoReal;
  }
  
  const pesoCubado = calcularPesoCubado(
    dimensoes.altura,
    dimensoes.largura,
    dimensoes.comprimento
  );
  
  // Retorna o maior peso (evita prejuízo)
  return Math.max(pesoReal, pesoCubado);
}

/**
 * Calcula dimensões aproximadas baseado no peso (fallback)
 * Útil quando produto não tem dimensões cadastradas
 * 
 * @param {number} peso - Peso em kg
 * @returns {Object} Dimensões estimadas
 */
function estimarDimensoes(peso) {
  // Fórmula aproximada: assume densidade média de produtos
  const volumeAproximado = peso * 1000; // cm³
  const lado = Math.cbrt(volumeAproximado); // cubo perfeito
  
  return {
    altura: Math.ceil(lado),
    largura: Math.ceil(lado),
    comprimento: Math.ceil(lado)
  };
}

module.exports = {
  calcularPesoCubado,
  calcularPesoFinal,
  estimarDimensoes
};
