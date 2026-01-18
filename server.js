import express from 'express';
import pool from './db.js';
import path from 'path';

// ADD THESE IMPORTS
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';

const app = express();
const PORT = 3000;

// Native JSON parsing
app.use(express.json());

// LOAD SWAGGER FILE
// const swaggerDocument = YAML.load(
//   path.join(process.cwd(), 'swagger', 'openapi.yaml')
// );

// EXPOSE SWAGGER UI
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

/**
 * POST - Create Scheduling Group
 */
app.post('/scheduling-groups', async (req, res) => {
  console.log('POST /scheduling-groups called with body:', req.body);
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
 * GET - Fetch all Scheduling Groups
 */
app.get('/scheduling-groups', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scheduling_groups ORDER BY ID DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

/**
 * DELETE - Delete Scheduling Group by ID
 */
app.delete('/scheduling-groups/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing ID parameter' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM scheduling_groups WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scheduling group not found' });
    }

    res.json({ message: 'Scheduling group deleted successfully', deletedGroup: result.rows[0] });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

/**
 * DELETE - Delete Scheduling Groups by Status
 */
app.delete('/scheduling-groups/status/:status', async (req, res) => {
  console.log('DELETE /scheduling-groups/status/:status called with status:', req.params.status);
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({ error: 'Missing status parameter' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM scheduling_groups WHERE status = $1 RETURNING *',
      [status]
    );

    res.json({
      message: `${result.rows.length} scheduling group(s) deleted successfully`,
      deletedGroups: result.rows
    });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running at http://localhost:${PORT}`);
  // console.log(`Swagger UI available at http://localhost:${PORT}/swagger`);
});