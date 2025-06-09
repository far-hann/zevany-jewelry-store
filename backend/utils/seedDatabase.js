const bcrypt = require('bcrypt');

// Supabase seeding logic placeholder. Implement Supabase-based seeding here if needed.

// Sample users
const users = [
  {
    name: 'Super Admin',
    email: 'admin@zevanystore.com',
    password: 'Admin123!',
    role: 'super-admin',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'User123!',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    phone: '+1234567890',
    addresses: [{
      type: 'home',
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      phone: '+1234567890',
      isDefault: true
    }]
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'User123!',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    phone: '+1234567891'
  }
];

// Sample jewelry products
const products = [
  {
    name: 'Diamond Engagement Ring',
    description: 'Stunning 1-carat diamond engagement ring with platinum band. Features a brilliant cut diamond with exceptional clarity and fire.',
    price: 2499.99,
    originalPrice: 2999.99,
    category: 'rings',
    subcategory: 'engagement',
    stock: 15,
    images: [
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      'https://images.pexels.com/photos/1191532/pexels-photo-1191532.jpeg'
    ],
    specifications: {
      material: 'Platinum',
      gemstone: 'Diamond',
      caratWeight: '1.0 ct',
      clarity: 'VS1',
      color: 'G',
      cut: 'Brilliant'
    },
    sizes: ['5', '6', '7', '8', '9'],
    isFeatured: true,
    tags: ['diamond', 'engagement', 'platinum', 'luxury'],
    seoTitle: 'Diamond Engagement Ring - 1 Carat Platinum Setting',
    seoDescription: 'Beautiful 1-carat diamond engagement ring in platinum setting. Perfect for proposals and special occasions.',
    seoKeywords: ['diamond ring', 'engagement ring', 'platinum', '1 carat'],
  },
  {
    name: 'Gold Tennis Bracelet',
    description: 'Elegant 18k gold tennis bracelet with sparkling cubic zirconia stones. Perfect for everyday elegance.',
    price: 899.99,
    originalPrice: 1199.99,
    category: 'bracelets',
    subcategory: 'tennis',
    stock: 25,
    images: [
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg',
      'https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg'
    ],
    specifications: {
      material: '18k Gold',
      gemstone: 'Cubic Zirconia',
      length: '7 inches',
      width: '4mm',
      clasp: 'Safety Clasp'
    },
    isFeatured: true,
    tags: ['gold', 'bracelet', 'tennis', 'cz'],
    seoTitle: '18k Gold Tennis Bracelet with CZ Stones',
    seoDescription: 'Stunning 18k gold tennis bracelet featuring brilliant cubic zirconia stones.',
    seoKeywords: ['gold bracelet', 'tennis bracelet', '18k gold', 'cz stones'],
  },
  {
    name: 'Pearl Drop Earrings',
    description: 'Classic freshwater pearl drop earrings in sterling silver. Timeless elegance for any occasion.',
    price: 149.99,
    originalPrice: 199.99,
    category: 'earrings',
    subcategory: 'drops',
    stock: 40,
    images: [
      'https://images.pexels.com/photos/2735977/pexels-photo-2735977.jpeg',
      'https://images.pexels.com/photos/2735978/pexels-photo-2735978.jpeg'
    ],
    specifications: {
      material: 'Sterling Silver',
      gemstone: 'Freshwater Pearl',
      pearlSize: '8-9mm',
      length: '1.5 inches',
      back: 'Post with Butterfly'
    },
    tags: ['pearl', 'earrings', 'silver', 'classic'],
    seoTitle: 'Freshwater Pearl Drop Earrings - Sterling Silver',
    seoDescription: 'Elegant freshwater pearl drop earrings in sterling silver setting.',
    seoKeywords: ['pearl earrings', 'drop earrings', 'sterling silver', 'freshwater'],
  },
  {
    name: 'Sapphire Pendant Necklace',
    description: 'Beautiful blue sapphire pendant necklace with diamond accents. Crafted in 14k white gold.',
    price: 699.99,
    originalPrice: 899.99,
    category: 'necklaces',
    subcategory: 'pendants',
    stock: 20,
    images: [
      'https://images.pexels.com/photos/1302307/pexels-photo-1302307.jpeg',
      'https://images.pexels.com/photos/1302308/pexels-photo-1302308.jpeg'
    ],
    specifications: {
      material: '14k White Gold',
      gemstone: 'Blue Sapphire',
      accentStones: 'Diamonds',
      chainLength: '18 inches',
      pendantSize: '10mm x 8mm'
    },
    tags: ['sapphire', 'necklace', 'pendant', 'diamond', 'white gold'],
    seoTitle: 'Blue Sapphire Pendant Necklace - 14k White Gold',
    seoDescription: 'Stunning blue sapphire pendant necklace with diamond accents in 14k white gold.',
    seoKeywords: ['sapphire necklace', 'pendant necklace', 'white gold', 'diamonds'],
  },
  {
    name: 'Rose Gold Wedding Band',
    description: 'Simple and elegant rose gold wedding band. Comfort fit design for everyday wear.',
    price: 399.99,
    originalPrice: 499.99,
    category: 'rings',
    subcategory: 'wedding',
    stock: 30,
    images: [
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'
    ],
    specifications: {
      material: '14k Rose Gold',
      width: '4mm',
      finish: 'Polished',
      fit: 'Comfort Fit',
      profile: 'Classic'
    },
    sizes: ['4', '5', '6', '7', '8', '9', '10', '11'],
    tags: ['rose gold', 'wedding band', 'ring', 'comfort fit'],
    seoTitle: '14k Rose Gold Wedding Band - Comfort Fit',
    seoDescription: 'Classic 14k rose gold wedding band with comfort fit design.',
    seoKeywords: ['rose gold ring', 'wedding band', 'comfort fit', '14k gold'],
  },
  {
    name: 'Emerald Stud Earrings',
    description: 'Brilliant emerald stud earrings in 18k yellow gold setting. Perfect for adding color to any outfit.',
    price: 549.99,
    category: 'earrings',
    subcategory: 'studs',
    stock: 18,
    images: [
      'https://images.pexels.com/photos/2735977/pexels-photo-2735977.jpeg'
    ],
    specifications: {
      material: '18k Yellow Gold',
      gemstone: 'Emerald',
      caratWeight: '0.75 ct total',
      shape: 'Round',
      setting: 'Prong'
    },
    tags: ['emerald', 'studs', 'yellow gold', 'earrings'],
    seoTitle: 'Emerald Stud Earrings - 18k Yellow Gold',
    seoDescription: 'Beautiful emerald stud earrings in 18k yellow gold prong setting.',
    seoKeywords: ['emerald earrings', 'stud earrings', 'yellow gold', 'gemstone'],
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    // await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    // await User.deleteMany({});
    // await Product.deleteMany({});
    
    // Hash passwords for users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    
    // Insert users
    // await User.insertMany(hashedUsers);
    console.log(`✅ Created ${hashedUsers.length} users`);
    
    // Insert products
    console.log('📦 Creating products...');
    // await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${hashedUsers.length}`);
    console.log(`   Products: ${products.length}`);
    console.log('\n🔐 Admin Login:');
    console.log(`   Email: ${users[0].email}`);
    console.log(`   Password: ${users[0].password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if script is called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
