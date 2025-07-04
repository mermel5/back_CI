const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'shortline.proxy.rlwy.net',
  database: 'railway',
  password: 'vtJWkOYsHGlJjgrsETnEabgVJfhWsPTz',
  port: 49813,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
