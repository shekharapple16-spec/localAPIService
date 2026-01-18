-- Create the database (if not already created by POSTGRES_DB)
-- Note: POSTGRES_DB is set in docker-compose, so this might not be needed

-- Create the scheduling_groups table
CREATE TABLE IF NOT EXISTS scheduling_groups (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);