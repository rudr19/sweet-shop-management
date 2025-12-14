const { Pool } = require('pg');

async function testConnection(password) {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'sweet_shop',
    user: 'postgres',
    password: password,
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ SUCCESS with password:', JSON.stringify(password));
    console.log('Connection result:', result.rows[0]);
    await pool.end();
    return true;
  } catch (error) {
    console.log('❌ FAILED with password:', JSON.stringify(password));
    console.log('Error:', error.message);
    await pool.end();
    return false;
  }
}

async function runTests() {
  console.log('Testing different password variations...\n');

  const passwords = [
    'rudra',
    'rudra.',
    '@rudra',
    '@rudra.',
  ];

  for (const pwd of passwords) {
    await testConnection(pwd);
    console.log('---');
  }
}

runTests();
