import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const sweets = [
  { name: 'Gulab Jamun', category: 'Milk Based', description: 'Soft, spongy milk balls soaked in sweet rose-flavored syrup' },
  { name: 'Rasgulla', category: 'Milk Based', description: 'Juicy cottage cheese balls in light sugar syrup' },
  { name: 'Rasmalai', category: 'Milk Based', description: 'Creamy cottage cheese dumplings in sweetened milk with cardamom' },
  { name: 'Kaju Katli', category: 'Dry Fruit', description: 'Diamond-shaped cashew fudge with silver leaf garnish' },
  { name: 'Barfi', category: 'Milk Based', description: 'Rich, fudge-like sweet made from condensed milk' },
  { name: 'Ladoo', category: 'Flour Based', description: 'Round, golden sweet balls made from chickpea flour and ghee' },
  { name: 'Jalebi', category: 'Fried', description: 'Crispy spiral-shaped sweet soaked in saffron syrup' },
  { name: 'Kalakand', category: 'Milk Based', description: 'Soft, grainy milk cake with cardamom flavor' },
  { name: 'Peda', category: 'Milk Based', description: 'Soft, fudge-like sweet made from khoya and sugar' },
  { name: 'Sandesh', category: 'Bengali', description: 'Delicate cottage cheese sweet with light sweetness' },
  { name: 'Soan Papdi', category: 'Flour Based', description: 'Flaky, melt-in-mouth sweet with crispy texture' },
  { name: 'Mysore Pak', category: 'South Indian', description: 'Rich, buttery sweet made from chickpea flour and ghee' },
  { name: 'Motichoor Ladoo', category: 'Flour Based', description: 'Orange-colored tiny boondi balls sweetened and shaped into rounds' },
  { name: 'Besan Ladoo', category: 'Flour Based', description: 'Aromatic chickpea flour balls with ghee and cardamom' },
  { name: 'Coconut Ladoo', category: 'Dry Fruit', description: 'Sweet coconut balls with condensed milk' },
  { name: 'Rava Ladoo', category: 'Flour Based', description: 'Semolina sweet balls with nuts and raisins' },
  { name: 'Milk Cake', category: 'Milk Based', description: 'Dense, crumbly sweet made from milk solids' },
  { name: 'Gujiya', category: 'Fried', description: 'Crispy half-moon pastries filled with khoya and dry fruits' },
  { name: 'Balushahi', category: 'Fried', description: 'Flaky, donut-like sweet glazed with sugar syrup' },
  { name: 'Kheer', category: 'Milk Based', description: 'Creamy rice pudding with cardamom and saffron' },
  { name: 'Gajar Halwa', category: 'Milk Based', description: 'Warm carrot pudding with ghee, milk, and nuts' },
  { name: 'Moong Dal Halwa', category: 'Flour Based', description: 'Rich yellow lentil pudding with ghee and cardamom' },
  { name: 'Sooji Halwa', category: 'Flour Based', description: 'Golden semolina pudding with nuts and raisins' },
  { name: 'Chum Chum', category: 'Bengali', description: 'Oval-shaped cottage cheese sweet with coconut coating' },
  { name: 'Khaja', category: 'Fried', description: 'Crispy, layered pastry soaked in sugar syrup' },
  { name: 'Imarti', category: 'Fried', description: 'Bright orange, spiral-shaped sweet with crispy texture' },
  { name: 'Malpua', category: 'Fried', description: 'Sweet pancakes soaked in sugar syrup with cardamom' },
  { name: 'Shrikhand', category: 'Milk Based', description: 'Creamy strained yogurt dessert with saffron and cardamom' },
  { name: 'Basundi', category: 'Milk Based', description: 'Thick, sweetened milk with nuts and saffron' },
  { name: 'Phirni', category: 'Milk Based', description: 'Creamy rice pudding served in earthen pots' },
  { name: 'Seviyan', category: 'Milk Based', description: 'Sweet vermicelli cooked in milk with dry fruits' },
  { name: 'Kheer Kadam', category: 'Bengali', description: 'Brown balls with white cottage cheese filling' },
  { name: 'Paneer Jalebi', category: 'Fried', description: 'Cottage cheese spirals in saffron syrup' },
  { name: 'Rabri', category: 'Milk Based', description: 'Thick, sweetened condensed milk with dry fruits' },
  { name: 'Mawa Barfi', category: 'Milk Based', description: 'Dense fudge made from milk solids and sugar' },
  { name: 'Pista Barfi', category: 'Dry Fruit', description: 'Green pistachio fudge with silver leaf' },
  { name: 'Kaju Roll', category: 'Dry Fruit', description: 'Rolled cashew fudge with cardamom flavor' },
  { name: 'Anjeer Roll', category: 'Dry Fruit', description: 'Fig-based sweet rolls with nuts' },
  { name: 'Dry Fruit Barfi', category: 'Dry Fruit', description: 'Mixed nuts fudge with rich flavors' },
  { name: 'Chocolate Barfi', category: 'Milk Based', description: 'Chocolate-flavored fudge with creamy texture' },
  { name: 'Kesar Peda', category: 'Milk Based', description: 'Saffron-flavored soft milk sweet' },
  { name: 'Mathri Ladoo', category: 'Flour Based', description: 'Crispy flour balls with jaggery coating' },
  { name: 'Til Ladoo', category: 'Dry Fruit', description: 'Sesame seed balls with jaggery' },
  { name: 'Nariyal Ladoo', category: 'Dry Fruit', description: 'Fresh coconut balls with condensed milk' },
  { name: 'Chandrakala', category: 'Fried', description: 'Crescent-shaped pastries with khoya filling' },
  { name: 'Pootharekulu', category: 'South Indian', description: 'Paper-thin sweet layers with sugar and ghee' },
  { name: 'Ariselu', category: 'South Indian', description: 'Rice flour sweet discs with jaggery' },
  { name: 'Bobbatlu', category: 'South Indian', description: 'Sweet flatbread filled with lentil and jaggery' },
  { name: 'Puran Poli', category: 'Flour Based', description: 'Stuffed flatbread with sweet lentil filling' },
  { name: 'Modak', category: 'Flour Based', description: 'Steamed rice flour dumplings with coconut filling' }
];

async function seedSweets() {
  try {
    console.log('🍬 Starting to seed sweets...\n');

    // Clear existing sweets (optional)
    await pool.query('DELETE FROM sweets');
    console.log('✓ Cleared existing sweets\n');

    let count = 0;
    for (const sweet of sweets) {
      const price = (Math.random() * 9 + 1).toFixed(2); // Price between $1 and $10
      const quantity = Math.floor(Math.random() * 100) + 10; // Quantity between 10 and 110

      await pool.query(
        'INSERT INTO sweets (name, category, price, quantity, description) VALUES ($1, $2, $3, $4, $5)',
        [sweet.name, sweet.category, parseFloat(price), quantity, sweet.description]
      );

      count++;
      console.log(`✓ Added: ${sweet.name.padEnd(20)} | ${sweet.category.padEnd(15)} | $${price.padEnd(5)} | Qty: ${quantity}`);
    }

    console.log(`\n🎉 Successfully seeded ${count} sweets!`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sweets:', error);
    process.exit(1);
  }
}

seedSweets();
