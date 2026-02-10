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
    
    console.log('📁 Criando categorias específicas...');
    
    const mtbCategory = await Category.create({ name: 'Mountain Bike' });
    const urbanCategory = await Category.create({ name: 'Urbana' });
    const electricCategory = await Category.create({ name: 'Elétrica' });
    const kidsCategory = await Category.create({ name: 'Infantil' });
    const partsCategory = await Category.create({ name: 'Peças' });
    const accessoriesCategory = await Category.create({ name: 'Acessórios' });
    const apparelCategory = await Category.create({ name: 'Vestuário' });
    
    console.log('✅ Categorias criadas!');

    console.log('\n🎨 Criando produtos...\n');

    // ====== MOUNTAIN BIKES ======
    const mtbBikes = [
      {
        name: 'Oggi Big Wheel 7.1',
        description: 'Bicicleta MTB Aro 29 com quadro em alumínio, suspensão dianteira e sistema de transmissão Shimano Alivio/Deore.',
        price: 3499.90,
        category: mtbCategory._id,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-be95e39e565c?auto=format&fit=crop&q=80&w=800',
        active: true
      },
      {
        name: 'Caloi Explorer Comp',
        description: 'Mountain Bike Aro 29 18V com grupo Shimano Alivio, freios a disco hidráulicos e suspensão com trava.',
        price: 2999.90,
        category: mtbCategory._id,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1511994298220-4127046f224d?auto=format&fit=crop&q=80&w=800',
        active: true
      },
      {
        name: 'Caloi Explorer Expert',
        description: 'MTB profissional Aro 29 20V com componentes Shimano Deore e suspensão de alta performance.',
        price: 4299.90,
        category: mtbCategory._id,
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1596568359553-a56de6970068?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    // ====== URBANAS ======
    const urbanBikes = [
       {
        name: 'Caloi City Tour',
        description: 'Bicicleta urbana leve e rápida, ideal para deslocamento na cidade. Pneus 700c e freios a disco.',
        price: 2199.90,
        category: urbanCategory._id,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e224f7a1dcfe?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Sense Move 2023',
        description: 'Design moderno e conforto para o dia a dia. Quadro em alumínio e geometria relaxada.',
        price: 1899.90,
        category: urbanCategory._id,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1507035895480-080074937d3d?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    // ====== ELÉTRICAS ======
    const electricBikes = [
      {
        name: 'Caloi Mobylet Elétrica',
        description: 'Bicicleta elétrica urbana Aro 20 com motor de 350W, bateria de longa duração e 7 velocidades.',
        price: 5999.90,
        category: electricCategory._id,
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Oggi Big Wheel 8.3 E-MTB',
        description: 'E-bike MTB Aro 29 com motor elétrico, transmissão Shimano Deore 11V e bateria integrada.',
        price: 12999.90,
        category: electricCategory._id,
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1623062089290-7cb528205753?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    // ====== INFANTIL ======
    const kidsBikes = [
      {
        name: 'Caloi Cecil Aro 20',
        description: 'Bicicleta infantil com cestinha e design clássico. Ideal para passeios no parque.',
        price: 899.90,
        category: kidsCategory._id,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1549487922-446759c258d4?auto=format&fit=crop&q=80&w=800',
        active: true
      },
      {
        name: 'Nathor Verden Aro 16',
        description: 'Bicicleta robusta e segura para os primeiros pedaladas. Acompanha rodinhas laterais.',
        price: 649.90,
        category: kidsCategory._id,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1614742785084-25c7cc649c20?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    // ====== PEÇAS ======
    const parts = [
      {
        name: 'Câmbio Traseiro Shimano Deore',
        description: 'Câmbio traseiro de 10/11 velocidades com tecnologia Shadow RD+ para estabilidade da corrente.',
        price: 450.00,
        category: partsCategory._id,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1563214227-814a6012059c?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Pedal Clip Shimano PD-M520',
        description: 'Pedal de encaixe clássico, robusto e confiável. Acompanha tacos.',
        price: 320.00,
        category: partsCategory._id,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1582650711925-502693992257?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Pneu Continental Race King',
        description: 'Pneu de competição para MTB, rápido e com boa aderência. 29x2.2.',
        price: 280.00,
        category: partsCategory._id,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1580974511818-df3d68df83cc?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    // ====== ACESSÓRIOS ======
    const accessories = [
      {
        name: 'Suporte de Chão Universal',
        description: 'Suporte de chão para bicicleta com base antiderrapante.',
        price: 129.90,
        category: accessoriesCategory._id,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1510255567332-965db0d6621f?auto=format&fit=crop&q=80&w=800',
        active: true
      },
      {
        name: 'Cadeado U-Lock Onguard',
        description: 'Cadeado de alta segurança tipo U-Lock.',
        price: 189.90,
        category: accessoriesCategory._id,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1622398925373-b46f5e82b04f?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Farol LED Recarregável',
        description: 'Farol dianteiro com 500 lumens e carregamento USB.',
        price: 99.90,
        category: accessoriesCategory._id,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1622292435649-166258284534?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];
    
    // ====== VESTUÁRIO ======
    const apparel = [
       {
        name: 'Capacete Abus Macator',
        description: 'Capacete de ciclismo profissional com tecnologia In-Mold.',
        price: 549.90,
        category: apparelCategory._id,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1558507306-4b13d2a01344?auto=format&fit=crop&q=80&w=800',
        active: true
      },
      {
        name: 'Camisa Ciclismo Mauro Ribeiro',
        description: 'Camisa com tecido tecnológico, proteção UV e bolsos traseiros.',
        price: 249.90,
        category: apparelCategory._id,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead23475?auto=format&fit=crop&q=80&w=800',
        active: true
      },
       {
        name: 'Sapatilha LeTour MTB',
        description: 'Sapatilha para mountain bike com sistema de encaixe SPD.',
        price: 399.90,
        category: apparelCategory._id,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1512909481869-0eaa1e9817ba?auto=format&fit=crop&q=80&w=800',
        active: true
      }
    ];

    const allProducts = [
        ...mtbBikes,
        ...urbanBikes,
        ...electricBikes,
        ...kidsBikes,
        ...parts,
        ...accessories,
        ...apparel
    ];

    for (const prod of allProducts) {
      const product = await Product.create(prod);
      console.log(`✅ Produto criado: ${product.name}`);
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
