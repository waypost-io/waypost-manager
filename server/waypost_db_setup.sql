-- From the postgres cli, run the command while connected to a different database:
-- \i /path/TO/waypost_db_setup.sql

CREATE DATABASE waypost;

\c waypost

CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT 'No description',
    status BOOLEAN NOT NULL DEFAULT FALSE,
    percentage_split SMALLINT NOT NULL CHECK (percentage_split >= 0 AND percentage_split <= 100) DEFAULT 100,
    hash_offset INTEGER NOT NULL DEFAULT 0,
    is_experiment BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_assignments (
 id SERIAL PRIMARY KEY,
 user_id TEXT NOT NULL,
 flag_id INTEGER REFERENCES flags (id) NOT NULL,
 status BOOLEAN NOT NULL DEFAULT TRUE,
 UNIQUE (user_id, flag_id)
);

CREATE TABLE flag_events (
    id SERIAL PRIMARY KEY,
    flag_id INTEGER NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE connection (
    id SERIAL PRIMARY KEY,
    pg_user VARCHAR(100) NOT NULL,
    pg_host VARCHAR(255) NOT NULL,
    pg_port INTEGER NOT NULL,
    pg_database VARCHAR(255),
    pg_password VARCHAR(255),
    expt_table_query VARCHAR(255)
);

CREATE TABLE keys (
    sdk_key VARCHAR(37) PRIMARY KEY UNIQUE
);

CREATE TABLE experiments (
    id SERIAL PRIMARY KEY,
    flag_id INTEGER REFERENCES flags (id),
    date_started DATE NOT NULL DEFAULT CURRENT_DATE,
    date_ended DATE,
    duration INTEGER NOT NULL DEFAULT 90,
    name VARCHAR(50),
    description VARCHAR(255)
);

CREATE TABLE exposures (
  id SERIAL PRIMARY KEY,
  experiment_id INTEGER REFERENCES experiments (id) NOT NULL,
  variant VARCHAR(7) NOT NULL,
  num_users INTEGER NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  query_string TEXT NOT NULL,
  type VARCHAR(10) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE experiment_metrics (
 experiment_id INTEGER REFERENCES experiments (id) NOT NULL,
 metric_id INTEGER REFERENCES metrics (id) NOT NULL,
 mean_test FLOAT,
 mean_control FLOAT,
 interval_start FLOAT,
 interval_end FLOAT,
 p_value FLOAT,
 PRIMARY KEY (experiment_id, metric_id)
);
