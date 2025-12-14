import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  // First connect to the default 'postgres' database
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // Connect to default database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Connecting to PostgreSQL...');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('Port:', process.env.DB_PORT || '5432');
    console.log('User:', process.env.DB_USER || 'postgres');

    // Check if database exists
    const result = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'sweet_shop']
    );

    if (result.rowCount === 0) {
      // Database doesn't exist, create it
      console.log(`Creating database ${process.env.DB_NAME || 'sweet_shop'}...`);
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'sweet_shop'}`);
      console.log('Database created successfully');
    } else {
      console.log('Database already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('Database creation complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database creation failed:', error);
      process.exit(1);
    });
}

export default createDatabase;
