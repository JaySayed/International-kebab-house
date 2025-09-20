-- Database initialization script for International Kabab House
-- This will be used by Docker PostgreSQL container

-- Create database if it doesn't exist
-- (PostgreSQL container will handle this via POSTGRES_DB env var)

-- Set up basic configurations
SET timezone = 'UTC';

-- Create a simple health check table for monitoring
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health status
INSERT INTO health_check (status) VALUES ('initialized') ON CONFLICT DO NOTHING;

-- Grant necessary permissions
-- Note: In production, create dedicated user with limited permissions
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;