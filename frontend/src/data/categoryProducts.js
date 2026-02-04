// Produtos mockados por categoria
// Cada produto tem: id, nome, marca, modelo, preço, imagem, características

export const mountainBikes = [
  {
    id: 'mtb-1',
    name: 'Trek Marlin 7',
    brand: 'Trek',
    model: 'Marlin 7 2024',
    price: 4299.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Aro 29"', 'Suspensão RockShox', '21 marchas', 'Freio a disco hidráulico'],
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 'mtb-2',
    name: 'Specialized Rockhopper',
    brand: 'Specialized',
    model: 'Rockhopper Sport 29',
    price: 3899.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Aro 29"', 'Quadro alumínio', '24 marchas Shimano', 'Suspensão SR Suntour'],
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'mtb-3',
    name: 'Cannondale Trail 6',
    brand: 'Cannondale',
    model: 'Trail 6 Full Suspension',
    price: 5499.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Aro 27.5"', 'Full Suspension', '27 marchas', 'Quadro carbono'],
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 'mtb-4',
    name: 'Scott Aspect 970',
    brand: 'Scott',
    model: 'Aspect 970 2024',
    price: 4799.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Aro 29"', 'Freio hidráulico Shimano', '30 marchas', 'Suspensão lockout'],
    inStock: false,
    rating: 4.7,
    reviews: 156
  }
];

export const urbanBikes = [
  {
    id: 'urban-1',
    name: 'Caloi City Tour',
    brand: 'Caloi',
    model: 'City Tour 2024',
    price: 1299.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Aro 26"', '7 marchas Shimano', 'Cesta inclusa', 'Bagageiro traseiro'],
    inStock: true,
    rating: 4.4,
    reviews: 312
  },
  {
    id: 'urban-2',
    name: 'Groove Urban',
    brand: 'Groove',
    model: 'Urban 700c',
    price: 1899.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Aro 700c', 'Design minimalista', 'Cambio interno', 'Ideal mobilidade urbana'],
    inStock: true,
    rating: 4.5,
    reviews: 198
  },
  {
    id: 'urban-3',
    name: 'Tito Urban Classic',
    brand: 'Tito',
    model: 'Urban Classic Vintage',
    price: 2199.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Estilo vintage', '3 marchas', 'Para-lamas cromados', 'Banco em couro sintético'],
    inStock: true,
    rating: 4.7,
    reviews: 87
  },
  {
    id: 'urban-4',
    name: 'Trek FX 2',
    brand: 'Trek',
    model: 'FX 2 Disc',
    price: 2899.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Híbrida urbana', '18 marchas', 'Freio a disco mecânico', 'Suporte fitness tracker'],
    inStock: true,
    rating: 4.8,
    reviews: 241
  }
];

export const electricBikes = [
  {
    id: 'ebike-1',
    name: 'Caloi E-Vibe',
    brand: 'Caloi',
    model: 'E-Vibe Urbana',
    price: 8999.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Motor 350W', 'Bateria 36V 10.4Ah', 'Autonomia até 60km', 'Display digital LED'],
    inStock: true,
    rating: 4.6,
    reviews: 94
  },
  {
    id: 'ebike-2',
    name: 'Specialized Turbo Vado',
    brand: 'Specialized',
    model: 'Turbo Vado 4.0',
    price: 12999.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Motor Specialized Turbo', 'Autonomia 90km', 'GPS integrado', 'App conectividade'],
    inStock: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: 'ebike-3',
    name: 'Trek Powerfly',
    brand: 'Trek',
    model: 'Powerfly 5 MTB',
    price: 15499.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['MTB Elétrica', 'Motor Bosch Performance', 'Bateria 500Wh', 'Suspensão 120mm'],
    inStock: false,
    rating: 5.0,
    reviews: 78
  },
  {
    id: 'ebike-4',
    name: 'Sense Impulse E-Urban',
    brand: 'Sense',
    model: 'Impulse E-Urban 2024',
    price: 9499.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Motor 250W', 'Design urbano elegante', '5 níveis assistência', 'Bateria removível'],
    inStock: true,
    rating: 4.5,
    reviews: 67
  }
];

export const kidsBikes = [
  {
    id: 'kids-1',
    name: 'Caloi Ceci',
    brand: 'Caloi',
    model: 'Ceci Aro 16',
    price: 599.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Aro 16"', 'Rodinhas laterais', 'Cor: Rosa/Branco', 'Idade: 5-8 anos'],
    inStock: true,
    rating: 4.6,
    reviews: 523
  },
  {
    id: 'kids-2',
    name: 'Nathor Extreme',
    brand: 'Nathor',
    model: 'Extreme Aro 20',
    price: 699.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Aro 20"', 'Freio V-brake', 'Cor: Azul/Preto', 'Idade: 8-12 anos'],
    inStock: true,
    rating: 4.4,
    reviews: 298
  },
  {
    id: 'kids-3',
    name: 'Caloi Hot Wheels',
    brand: 'Caloi',
    model: 'Hot Wheels Aro 16',
    price: 799.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Tema Hot Wheels', 'Aro 16"', 'Capacete incluso', 'Adesivos personalizáveis'],
    inStock: true,
    rating: 4.8,
    reviews: 412
  },
  {
    id: 'kids-4',
    name: 'Monark BMX Kids',
    brand: 'Monark',
    model: 'BMX Freestyle Aro 20',
    price: 899.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Estilo BMX', 'Aro 20"', 'Guidão rotativo 360°', 'Pegs para manobras'],
    inStock: false,
    rating: 4.7,
    reviews: 187
  }
];

// Função auxiliar para formatar preço
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};
