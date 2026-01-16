import express from 'express';
import pool from './db.js';
import path from 'path';

// 🔹 ADD THESE IMPORTS
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';

const app = express();
const PORT = 3000;

// Native JSON parsing
app.use(express.json());

// 🔹 LOAD SWAGGER FILE
// const swaggerDocument = YAML.load(
//   path.join(process.cwd(), 'swagger', 'openapi.yaml')
// );

// 🔹 EXPOSE SWAGGER UI
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * POST – Create Scheduling Group
 */
app.post('/scheduling-groups', async (req, res) => {
  const { groupName, createdBy, status } = req.body;

  if (!groupName || !createdBy || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO scheduling_groups (group_name, created_by, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [groupName, createdBy, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

/**
 * GET – Fetch all Scheduling Groups
 */
app.get('/scheduling-groups', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scheduling_groups ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

// expose raw swagger spec
// app.get('/swagger.json', (_req, res) => {
//   res.json(swaggerDocument);
// });

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  // console.log(`Swagger UI available at http://localhost:${PORT}/swagger`);
});
