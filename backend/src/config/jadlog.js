module.exports = {
  baseUrl: 'https://www.jadlog.com.br/embarcador/api',
  token: process.env.JADLOG_TOKEN || '',
  cnpj: process.env.JADLOG_CNPJ || '',
  conta: process.env.JADLOG_CONTA || null,
  
  // Configurações do remetente (sua loja)
  origem: {
    nome: process.env.LOJA_NOME || 'Edy Bike',
    cnpjCpf: process.env.LOJA_CNPJ || '',
    endereco: process.env.LOJA_ENDERECO || 'Rua Exemplo',
    numero: process.env.LOJA_NUMERO || '123',
    bairro: process.env.LOJA_BAIRRO || 'Centro',
    cidade: process.env.LOJA_CIDADE || 'São Paulo',
    uf: process.env.LOJA_UF || 'SP',
    cep: process.env.LOJA_CEP || '01001000',
    telefone: process.env.LOJA_TELEFONE || '',
  },
  
  // Modalidades disponíveis
  modalidades: {
    package: 3,  // .Package - mais comum em e-commerce
    com: 4,      // .COM - expresso
    rodoviario: 5 // Rodoviário
  },
  
  // Configurações padrão
  defaults: {
    modalidade: 3,           // .Package
    tipoEntrega: 'D',        // Delivery
    tipoSeguro: 'N',         // Sem seguro adicional
    valorColeta: 0,
    tipoFrete: 0             // CIF (vendedor paga)
  }
};
