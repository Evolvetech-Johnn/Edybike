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

const importData = async () => {
  await connectDB();

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@edybike.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';

    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
        console.log('Admin user already exists');
        process.exit();
    }

    const adminUser = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
    });

    await adminUser.save();

    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
    // destroyData(); // Not implemented to be safe
} else {
    importData();
}
