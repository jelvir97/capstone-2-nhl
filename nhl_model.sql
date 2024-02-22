\echo 'Delete and recreate nhl_model db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE nhl_model;
CREATE DATABASE nhl_model;
\connect nhl_model

\i nhl_model-schema.sql
-- \i nhl_model-seed.sql

\echo 'Delete and recreate nhl_model_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE nhl_model_test;
CREATE DATABASE nhl_model_test;
\connect nhl_model_test

\i nhl_model-schema.sql