const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('🗄️  Limpando banco de dados...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('📁 Criando categorias...');
    
    // Categoria: Bicicletas
    const bikesCategory = await Category.create({ 
      name: 'Bicicletas' 
    });
    console.log(`✅ Categoria criada: ${bikesCategory.name}`);

    // Categoria: Acessórios para Bike
    const bikeAccessoriesCategory = await Category.create({ 
      name: 'Acessórios para Bike' 
    });
    console.log(`✅ Categoria criada: ${bikeAccessoriesCategory.name}`);

    // Categoria: Acessórios para Ciclista
    const cyclistAccessoriesCategory = await Category.create({ 
      name: 'Acessórios para Ciclista' 
    });
    console.log(`✅ Categoria criada: ${cyclistAccessoriesCategory.name}`);

    console.log('\n🎨 Criando produtos...\n');

    // ====== BICICLETAS ======
    const bikes = [
      {
        name: 'Oggi Big Wheel 7.1',
        description: 'Bicicleta MTB Aro 29 com quadro em alumínio, suspensão dianteira e sistema de transmissão Shimano Alivio/Deore. Ideal para trilhas e uso misto.',
        price: 3499.90,
        category: bikesCategory._id,
        stock: 8,
        imageUrl: '/src/assets/img/bikes/Bicicleta Oggi Big Wheel 7.1 aro 29 18v - Shimano Alivio- Deore 2022.png',
        active: true
      },
      {
        name: 'Caloi Explorer Comp',
        description: 'Mountain Bike Aro 29 18V com grupo Shimano Alivio, freios a disco hidráulicos e suspensão com trava no guidão. Perfeita para aventuras off-road.',
        price: 2999.90,
        category: bikesCategory._id,
        stock: 12,
        imageUrl: '/src/assets/img/bikes/bicicleta_caloi_explorer_comp_Aro 29 18V - Shimano  Alivio - 2021.png',
        active: true
      },
      {
        name: 'Caloi Explorer Expert',
        description: 'MTB profissional Aro 29 20V com componentes Shimano Deore, suspensão de alta performance e geometria otimizada para competições.',
        price: 4299.90,
        category: bikesCategory._id,
        stock: 6,
        imageUrl: '/src/assets/img/bikes/bicicleta_caloi_explorer_expert Aro 29 20V - ShimanoDeore - 2021.png',
        active: true
      },
      {
        name: 'Caloi Mobylet Elétrica',
        description: 'Bicicleta elétrica urbana Aro 20 com motor de 350W, bateria de longa duração e 7 velocidades. Ideal para mobilidade urbana sustentável.',
        price: 5999.90,
        category: bikesCategory._id,
        stock: 4,
        imageUrl: '/src/assets/img/bikes/bicicleta_eletrica_caloi_mobylet Aro 20 7V - 2022 - Preta.png',
        active: true
      },
      {
        name: 'Oggi Big Wheel 8.3 E-MTB',
        description: 'E-bike MTB Aro 29 com motor elétrico, transmissão Shimano Deore 11V e bateria integrada. Tecnologia de ponta para trilhas desafiadoras.',
        price: 12999.90,
        category: bikesCategory._id,
        stock: 3,
        imageUrl: '/src/assets/img/bikes/bicicleta_eletrica_oggi_big_wheel 8.3 Aro 29 - Shimano Deore 11V - 2022.png',
        active: true
      }
    ];

    for (const bike of bikes) {
      const product = await Product.create(bike);
      console.log(`✅ Produto criado: ${product.name} - R$ ${product.price}`);
    }

    // ====== ACESSÓRIOS PARA BIKE ======
    const bikeAccessories = [
      {
        name: 'Suporte de Chão Universal',
        description: 'Suporte de chão para bicicleta com base antiderrapante e ajuste de altura. Mantém sua bike em pé com segurança.',
        price: 129.90,
        category: bikeAccessoriesCategory._id,
        stock: 25,
        imageUrl: '/src/assets/img/acessorios-para-bike/suporte_de_chao_para_bicicleta.png',
        active: true
      },
      {
        name: 'Suporte de Parede Vertical Altmayer',
        description: 'Suporte de parede vertical para economia de espaço. Capacidade para 1 bicicleta, fácil instalação.',
        price: 79.90,
        category: bikeAccessoriesCategory._id,
        stock: 30,
        imageUrl: '/src/assets/img/acessorios-para-bike/suporte_de_parede_vertical_altmayer.png',
        active: true
      },
      {
        name: 'Suporte de Parede Duplo Altmayer',
        description: 'Suporte de parede vertical para 2 bicicletas. Design compacto e robusto, ideal para garagens.',
        price: 149.90,
        category: bikeAccessoriesCategory._id,
        stock: 20,
        imageUrl: '/src/assets/img/acessorios-para-bike/suporte_de_parede_vertical_altmayer - 2 bicicletas.png',
        active: true
      }
    ];

    for (const accessory of bikeAccessories) {
      const product = await Product.create(accessory);
      console.log(`✅ Produto criado: ${product.name} - R$ ${product.price}`);
    }

    // ====== ACESSÓRIOS PARA CICLISTA ======
    const cyclistAccessories = [
      {
        name: 'Capacete Abus Macator',
        description: 'Capacete de ciclismo profissional com tecnologia In-Mold, sistema de ventilação e ajuste personalizado. Segurança e conforto.',
        price: 549.90,
        category: cyclistAccessoriesCategory._id,
        stock: 15,
        imageUrl: '/src/assets/img/acessorios-para-ciclista/capacete_de_ciclismo_abus_macator.png',
        active: true
      },
      {
        name: 'Capacete Abus Viantor',
        description: 'Capacete aerodinâmico com viseira integrada, sistema de ventilação otimizado e proteção MIPS.',
        price: 649.90,
        category: cyclistAccessoriesCategory._id,
        stock: 12,
        imageUrl: '/src/assets/img/acessorios-para-ciclista/capacete_de_ciclismo_abus_viantor.png',
        active: true
      },
      {
        name: 'Capacete GTA NX Inmold',
        description: 'Capacete esportivo cinza e vermelho com tecnologia In-Mold, ajuste por catraca e forro removível.',
        price: 299.90,
        category: cyclistAccessoriesCategory._id,
        stock: 20,
        imageUrl: '/src/assets/img/acessorios-para-ciclista/capacete_gta_nx_inmold_cinza_e_vermelho.png',
        active: true
      },
      {
        name: 'Sapatilha LeTour MTB',
        description: 'Sapatilha para mountain bike preta e branca com sistema de encaixe SPD, solado antiderrapante e ventilação.',
        price: 399.90,
        category: cyclistAccessoriesCategory._id,
        stock: 18,
        imageUrl: '/src/assets/img/acessorios-para-ciclista/sapatilha_de_ciclismo_letour_para mtb- preto e branco.png',
        active: true
      },
      {
        name: 'Sapatilha TSW New Fit MTB',
        description: 'Sapatilha de alta performance para MTB com fechamento por velcro, solado rígido e design ergonômico.',
        price: 449.90,
        category: cyclistAccessoriesCategory._id,
        stock: 14,
        imageUrl: '/src/assets/img/acessorios-para-ciclista/sapatilha_tsw_new_fit_para_mtb.png',
        active: true
      }
    ];

    for (const accessory of cyclistAccessories) {
      const product = await Product.create(accessory);
      console.log(`✅ Produto criado: ${product.name} - R$ ${product.price}`);
    }

    // Criar usuário admin se não existir
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@edybike.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';

    const userExists = await User.findOne({ email: adminEmail });

    if (!userExists) {
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log(`\n✅ Admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`\n✅ Admin user already exists: ${adminEmail}`);
    }

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log(`\n📊 Resumo:`);
    console.log(`   - ${await Category.countDocuments()} Categorias`);
    console.log(`   - ${await Product.countDocuments()} Produtos`);
    console.log(`   - ${await User.countDocuments()} Usuário(s)`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Erro no seed: ${error}`);
    process.exit(1);
  }
};

seedData();
