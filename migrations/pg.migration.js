/* eslint-disable @typescript-eslint/no-var-requires */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

console.log('Using connection string:', process.env.DATABASE_URL);

let defaultPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureDatabaseExists() {
  const dbName = 'product_api';
  try {
    const result = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (result.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await defaultPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
    throw error;
  }
}

async function runMigrationUsers() {
  const checkTableExistsQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'users'
    );
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(400) NOT NULL
    );
  `;

  try {
    console.log('Checking if table "users" exists...');
    const result = await defaultPool.query(checkTableExistsQuery);
    const tableExists = result.rows[0].exists;

    if (tableExists) {
      console.log('Table "users" already exists. Skipping creation.');
    } else {
      console.log('Table "users" does not exist. Creating...');
      await defaultPool.query(createTableQuery);
      console.log('Table "users" created successfully.');
    }
    
  } catch (error) {
    console.error('Error running migration for "users":', error);
    throw error;
  }
}

async function runMigrationUserAccessLevels() {
  const checkTableExistsQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'user_access_levels'
    );
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_access_levels (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      scope VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  const insertInitialAccessLevelQuery = `
    INSERT INTO user_access_levels (user_id, scope)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;

  try {
    console.log('Checking if table "user_access_levels" exists...');
    const result = await defaultPool.query(checkTableExistsQuery);
    const tableExists = result.rows[0].exists;

    if (tableExists) {
      console.log('Table "user_access_levels" already exists. Skipping creation.');
    } else {
      console.log('Table "user_access_levels" does not exist. Creating...');
      await defaultPool.query(createTableQuery);
      console.log('Table "user_access_levels" created successfully.');
    }
  } catch (error) {
    console.error('Error running migration for "user_access_levels":', error);
    throw error;
  }
}

async function runMigrationFavorites() {
  const checkTableExistsQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'favorites'
    );
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  try {
    console.log('Checking if table "favorites" exists...');
    const result = await defaultPool.query(checkTableExistsQuery);
    const tableExists = result.rows[0].exists;

    if (tableExists) {
      console.log('Table "favorites" already exists. Skipping creation.');
    } else {
      console.log('Table "favorites" does not exist. Creating...');
      await defaultPool.query(createTableQuery);
      console.log('Table "favorites" created successfully.');
    }
  } catch (error) {
    console.error('Error running migration for "favorites":', error);
    throw error;
  }
}

async function insertAdminUser() {
  const insertInitialUserQuery = `
    INSERT INTO users (id, email, name, password)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING;
  `;

  const insertInitialAccessLevelQuery = `
    INSERT INTO user_access_levels (user_id, scope)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;

  try {
    console.log('Inserting initial admin user...');

    const initialUserId = 1;
    const initialUserEmail = process.env.ADMIN_EMAIL;
    if (!initialUserEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set.');
    }
    const initialUserPassword = process.env.ADMIN_PASSWORD;
    if (!initialUserPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }
    const hashedPassword = await bcrypt.hash(initialUserPassword, 10);
    const initialUserName = 'Admin';

    await defaultPool.query(insertInitialUserQuery, [initialUserId, initialUserEmail, initialUserName, hashedPassword]);
    console.log(`Initial admin user with id ${initialUserId} added successfully.`);

    const initialScope = 'admin';
    await defaultPool.query(insertInitialAccessLevelQuery, [initialUserId, initialScope]);
    console.log(`Initial access level for user_id ${initialUserId} added successfully.`);
  } catch (error) {
    console.error('Error inserting initial admin user:', error);
    throw error;
  }
}

(async () => {
  try {
    await ensureDatabaseExists();
    await runMigrationUsers();
    await runMigrationUserAccessLevels();
    await runMigrationFavorites();
    await insertAdminUser();
  } catch (error) {
    console.error('Migration process failed:', error);
  } finally {
    await defaultPool.end();
  }
})();
