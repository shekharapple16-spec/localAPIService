import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Gmail@2025@',
  database: 'automation_practice'
});

export default pool;
