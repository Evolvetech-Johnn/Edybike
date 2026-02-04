export const mockProducts = [
  // --- BICICLETAS (8 Items) ---
  {
    _id: '1',
    name: 'Mountain Bike Xtreme 29"',
    description: 'Bicicleta de alta performance para trilhas difíceis. Suspensão a ar, freios hidráulicos e quadro em fibra de carbono.',
    price: 3500.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1576435728678-be95e39e565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '2',
    name: 'Speed Road Master',
    description: 'Para quem ama velocidade no asfalto. Pneus finos, aerodinâmica otimizada e leveza incomparável.',
    price: 4200.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '3',
    name: 'Urban City Bike',
    description: 'Perfeita para o dia a dia na cidade. Cesta frontal, bagageiro e conforto ergonômico.',
    price: 1800.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-08acdf9b7457?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '101',
    name: 'BMX Freestyle Pro',
    description: 'Resistência total para manobras radicais. Quadro reforçado e pneus de alta aderência.',
    price: 1200.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1528629250493-275dcb4b8364?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '102',
    name: 'E-Bike City Cruiser',
    description: 'Bicicleta elétrica com autonomia de 50km. Ideal para ir ao trabalho sem suar.',
    price: 5500.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '103',
    name: 'Kids Adventure 20"',
    description: 'A primeira bicicleta off-road para os pequenos aventureiros. Segura e divertida.',
    price: 850.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '104',
    name: 'Vintage Classic',
    description: 'Estilo retrô com tecnologia moderna. Charmosa e confortável para passeios no parque.',
    price: 2100.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1505705693707-24a64b670007?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '105',
    name: 'Gravel Explorer',
    description: 'Versatilidade pura. Encara asfalto e terra com a mesma eficiência.',
    price: 3800.00,
    category: { _id: 'cat1', name: 'Bicicletas' },
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1475666675596-cca2035b3d79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },

  // --- ACESSÓRIOS (8 Items) ---
  {
    _id: '4',
    name: 'Capacete Pro Safety',
    description: 'Proteção máxima com ventilação aerodinâmica. Certificado internacionalmente.',
    price: 250.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1559087316-6b2633cc48b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '5',
    name: 'Luvas Gel Comfort',
    description: 'Luvas com acolchoamento em gel para reduzir impacto e vibração.',
    price: 89.90,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1598516087853-2daee2205510?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '6',
    name: 'Garrafa Térmica Sport',
    description: 'Mantenha sua água gelada por até 12 horas. Material livre de BPA.',
    price: 45.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-01114192003b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '201',
    name: 'Cadeado U-Lock',
    description: 'Segurança máxima contra furtos. Aço reforçado e chave codificada.',
    price: 180.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1622643033830-22c60ee1f24d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '202',
    name: 'Kit Ferramentas',
    description: 'Kit compacto com chaves Allen, chave de corrente e espátulas.',
    price: 120.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '203',
    name: 'Luz LED Traseira',
    description: 'Recarregável via USB. Visibilidade de até 500 metros para sua segurança noturna.',
    price: 65.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 25,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1678727129596-b67323b0a09e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '204',
    name: 'Bomba de Ar Portátil',
    description: 'Leve e eficiente. Enche pneus de alta pressão (120psi).',
    price: 95.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1618397351654-7389df0587d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  },
  {
    _id: '205',
    name: 'Suporte Celular',
    description: 'Navegue com GPS com segurança. Fixação firme e à prova de chuva.',
    price: 55.00,
    category: { _id: 'cat2', name: 'Acessórios' },
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1522066224391-705fe9e4367f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    active: true
  }
];

export const mockCategories = [
    { _id: 'cat1', name: 'Bicicletas' },
    { _id: 'cat2', name: 'Acessórios' }
];
