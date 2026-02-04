import { Product, ProductWithDiscount } from '../types';

// Função auxiliar para formatar preço
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export const mountainBikes: Product[] = [
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

export const urbanBikes: Product[] = [
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

export const electricBikes: Product[] = [
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

export const kidsBikes: Product[] = [
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

export const parts: Product[] = [
  {
    id: 'part-1',
    name: 'Freio a Disco Shimano',
    brand: 'Shimano',
    model: 'Deore XT M8100',
    price: 899.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Hidráulico', '4 pistões', 'Rotor 180mm', 'Potência superior'],
    inStock: true,
    rating: 4.9,
    reviews: 342
  },
  {
    id: 'part-2',
    name: 'Cambio Traseiro SRAM',
    brand: 'SRAM',
    model: 'GX Eagle 12v',
    price: 1299.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['12 velocidades', 'Cage longa', 'Tecnologia X-Sync', 'Compatível Eagle'],
    inStock: true,
    rating: 4.8,
    reviews: 278
  },
  {
    id: 'part-3',
    name: 'Suspensão RockShox',
    brand: 'RockShox',
    model: 'Pike Ultimate 140mm',
    price: 3499.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Travel 140mm', 'Ajuste de compressão', 'Eixo Boost 15mm', 'Charger 2.1 damper'],
    inStock: true,
    rating: 5.0,
    reviews: 156
  },
  {
    id: 'part-4',
    name: 'Pedivela Shimano',
    brand: 'Shimano',
    model: 'Deore M6100 1x12',
    price: 749.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['1x12 velocidades', 'Comprimento 170mm', 'Coroa 32T', 'Hollow Tech II'],
    inStock: false,
    rating: 4.7,
    reviews: 198
  }
];

export const accessories: Product[] = [
  {
    id: 'acc-1',
    name: 'Capacete Ciclismo',
    brand: 'Giro',
    model: 'Fixture MIPS',
    price: 349.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Proteção MIPS', '18 entradas de ar', 'Ajuste Roc Loc', 'Certificado CPSC'],
    inStock: true,
    rating: 4.8,
    reviews: 524
  },
  {
    id: 'acc-2',
    name: 'Luva Ciclismo',
    brand: 'Specialized',
    model: 'Body Geometry Gel',
    price: 129.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Proteção gel', 'Respirável', 'Dedos longos', 'Touchscreen compatível'],
    inStock: true,
    rating: 4.6,
    reviews: 412
  },
  {
    id: 'acc-3',
    name: 'Bomba de Ar Portátil',
    brand: 'Topeak',
    model: 'RaceRocket HP',
    price: 189.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Pressão até 160 PSI', 'Cabeça SmartHead', 'Alumínio CNC', 'Leve 95g'],
    inStock: true,
    rating: 4.7,
    reviews: 267
  },
  {
    id: 'acc-4',
    name: 'Garrafa Térmica',
    brand: 'Camelbak',
    model: 'Podium Chill 620ml',
    price: 99.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Isolamento térmico', '620ml capacidade', 'Bico auto-fechante', 'Sem BPA'],
    inStock: true,
    rating: 4.9,
    reviews: 689
  }
];

export const apparel: Product[] = [
  {
    id: 'app-1',
    name: 'Camisa Ciclismo',
    brand: 'Pearl Izumi',
    model: 'Select LTD Jersey',
    price: 279.00,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Tecido SELECT Transfer', '3 bolsos traseiros', 'Zíper completo', 'Proteção UV 50+'],
    inStock: true,
    rating: 4.7,
    reviews: 298
  },
  {
    id: 'app-2',
    name: 'Bermuda Ciclismo',
    brand: 'Specialized',
    model: 'RBX Sport Bib',
    price: 399.00,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['Bretelle anatômica', 'Forro Body Geometry', 'Compressão graduada', 'Costura plana'],
    inStock: true,
    rating: 4.8,
    reviews: 356
  },
  {
    id: 'app-3',
    name: 'Jaqueta Corta-Vento',
    brand: 'Castelli',
    model: 'Squadra Stretch',
    price: 549.00,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Tecido Gore Windstopper', 'Compacta dobrável', 'Zíperes ventilação', 'Refletivos 360°'],
    inStock: false,
    rating: 4.9,
    reviews: 187
  },
  {
    id: 'app-4',
    name: 'Sapatilha MTB',
    brand: 'Shimano',
    model: 'ME5 SPD',
    price: 699.00,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Sistema SPD', 'Solado Michelin', 'Proteção reforçada', 'Fechamento BOA'],
    inStock: true,
    rating: 4.8,
    reviews: 423
  }
];

export const deals: ProductWithDiscount[] = [
  {
    id: 'deal-1',
    name: 'Trek FX 1 (Outlet)',
    brand: 'Trek',
    model: 'FX 1 Disc 2023',
    price: 1899.00,
    originalPrice: 2699.00,
    discount: 30,
    image: '/src/assets/img/bikes/61qlTVSccxL._AC_UF350,350_QL80.png',
    features: ['Freio a disco', 'Aro 700c', '21 marchas', 'Modelo 2023 - Último estoque'],
    inStock: true,
    rating: 4.6,
    reviews: 167
  },
  {
    id: 'deal-2',
    name: 'Kit Ferramentas Completo',
    brand: 'Park Tool',
    model: 'Essential Tool Kit',
    price: 899.00,
    originalPrice: 1299.00,
    discount: 31,
    image: '/src/assets/img/bikes/D_NQ_NP_978518-MLB82319281383_02.png',
    features: ['26 ferramentas', 'Chave torque', 'Maleta organizada', 'Garantia vitalícia'],
    inStock: true,
    rating: 4.9,
    reviews: 542
  },
  {
    id: 'deal-3',
    name: 'Caloi Elite Carbon (Demo)',
    brand: 'Caloi',
    model: 'Elite Carbon Racing',
    price: 8999.00,
    originalPrice: 12999.00,
    discount: 31,
    image: '/src/assets/img/bikes/MTBs-full-suspension-para-homens.png',
    features: ['Quadro carbono', 'Grupo Shimano 105', 'Rodas aero', 'Bike de demonstração'],
    inStock: true,
    rating: 5.0,
    reviews: 34
  },
  {
    id: 'deal-4',
    name: 'Combo Segurança Premium',
    brand: 'Kryptonite',
    model: 'New York + Messenger',
    price: 549.00,
    originalPrice: 799.00,
    discount: 31,
    image: '/src/assets/img/bikes/Pinarello-Dogma-65.1-Think-2.png',
    features: ['Cadeado NY Lock', 'Cabo reforçado 1.2m', '2 chaves', 'Nível segurança 10/10'],
    inStock: false,
    rating: 4.9,
    reviews: 712
  }
];
