require('dotenv').config();

console.log('Environment variables loaded:');
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
console.log('DB_PASSWORD value:', JSON.stringify(process.env.DB_PASSWORD));
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
