require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./pool');
const config = require('../config');

const run = async () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Schema applied');

  const passwordHash = await bcrypt.hash('Admin@Pass123', config.bcryptRounds);

  const adminResult = await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
  [
      'System Administrator User',
      'admin@storeplatform.com',
      passwordHash,
      '123 Admin Headquarters Building, Central Business District, Metropolitan City 10001',
    ]
  );

  const owner1Hash = await bcrypt.hash('Owner@Pass123', config.bcryptRounds);
  const owner1 = await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, 'store_owner')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [
      'Premium Coffee Shop Owner',
      'owner1@storeplatform.com',
      owner1Hash,
      '456 Coffee Lane, Downtown District, Metropolitan City 10002',
    ]
  );

  const owner2Hash = await bcrypt.hash('Owner@Pass123', config.bcryptRounds);
  const owner2 = await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, 'store_owner')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [
      'Gourmet Restaurant Owner',
      'owner2@storeplatform.com',
      owner2Hash,
      '789 Gourmet Street, Culinary Quarter, Metropolitan City 10003',
    ]
  );

  const userHash = await bcrypt.hash('User@Pass123', config.bcryptRounds);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, 'user')
     ON CONFLICT (email) DO NOTHING`,
    [
      'Regular Platform User Name',
      'user@storeplatform.com',
      userHash,
      '321 Residential Avenue, Suburban Area, Metropolitan City 10004',
    ]
  );

  if (owner1.rows[0]) {
    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (owner_id) DO NOTHING`,
      [
        'Premium Coffee House Downtown',
        'coffee@premiumhouse.com',
        '100 Main Street, Downtown District, Metropolitan City 10002',
        owner1.rows[0].id,
      ]
    );
  }

  if (owner2.rows[0]) {
    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (owner_id) DO NOTHING`,
      [
        'Gourmet Bistro Restaurant',
        'bistro@gourmetrest.com',
        '200 Culinary Avenue, Food District, Metropolitan City 10003',
        owner2.rows[0].id,
      ]
    );
  }

  console.log('Seed data applied');
  console.log('Admin: admin@storeplatform.com / Admin@Pass123');
  console.log('User: user@storeplatform.com / User@Pass123');
  console.log('Owner1: owner1@storeplatform.com / Owner@Pass123');
  console.log('Owner2: owner2@storeplatform.com / Owner@Pass123');

  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
