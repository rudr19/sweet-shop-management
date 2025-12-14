import pool from '../config/database';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Clear existing users (optional - comment out if you want to keep existing users)
    await pool.query('DELETE FROM users');
    console.log('✓ Cleared existing users');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    // Create Admin user
    await pool.query(
      `INSERT INTO users (email, password, is_admin)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@sweetshop.com', adminPassword, true]
    );
    console.log('✓ Created admin user: admin@sweetshop.com / admin123');

    // Create Customer user
    await pool.query(
      `INSERT INTO users (email, password, is_admin)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      ['customer@sweetshop.com', customerPassword, false]
    );
    console.log('✓ Created customer user: customer@sweetshop.com / customer123');

    // Create additional test users
    await pool.query(
      `INSERT INTO users (email, password, is_admin)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      ['john@example.com', await bcrypt.hash('password123', 10), false]
    );
    console.log('✓ Created test user: john@example.com / password123');

    console.log('\n🎉 Users seeded successfully!');
    console.log('\n📝 LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('👑 ADMIN LOGIN:');
    console.log('   Email: admin@sweetshop.com');
    console.log('   Password: admin123');
    console.log('\n👤 CUSTOMER LOGIN:');
    console.log('   Email: customer@sweetshop.com');
    console.log('   Password: customer123');
    console.log('\n👤 TEST USER LOGIN:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('═══════════════════════════════════════\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
