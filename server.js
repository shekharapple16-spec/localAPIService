import express from 'express';
import pool from './db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
const PORT = 3000;

/* =========================
   Middleware
========================= */
app.use(express.json());

/* =========================
   Swagger
========================= */

// Raw Swagger JSON (for Playwright / automation)
app.get('/v3/api-docs', (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =========================
   DB Connection Test
========================= */
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

/* =========================
   APIs
========================= */

/**
 * @swagger
 * /scheduling-groups:
 *   post:
 *     summary: Create Scheduling Group
 *     tags: [Scheduling Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupName, createdBy, status]
 *             properties:
 *               groupName:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
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
    console.error(err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

/**
 * @swagger
 * /scheduling-groups:
 *   get:
 *     summary: Fetch all scheduling groups
 *     tags: [Scheduling Groups]
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

/**
 * @swagger
 * /scheduling-groups/{id}:
 *   delete:
 *     summary: Delete scheduling group by ID
 *     tags: [Scheduling Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
app.delete('/scheduling-groups/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM scheduling_groups WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({
      message: 'Deleted successfully',
      deletedGroup: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

/**
 * @swagger
 * /scheduling-groups/status/{status}:
 *   delete:
 *     summary: Delete scheduling groups by status
 *     tags: [Scheduling Groups]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 */
app.delete('/scheduling-groups/status/:status', async (req, res) => {
  const { status } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM scheduling_groups WHERE status = $1 RETURNING *',
      [status]
    );

    res.json({
      message: `${result.rows.length} group(s) deleted`,
      deletedGroups: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

/* =========================
   Start server
========================= */
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  console.log(`Swagger UI at http://localhost:${PORT}/swagger`);
  console.log(`Swagger JSON at http://localhost:${PORT}/v3/api-docs`);
});
