\set ON_ERROR_STOP on
\if :{?runtime_password}
\else
  \echo 'runtime_password must be supplied with psql --set'
  \quit 2
\endif

BEGIN;

DO $role$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'reference_application_app') THEN
    CREATE ROLE reference_application_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION;
  END IF;
END
$role$;

SELECT format('ALTER ROLE reference_application_app PASSWORD %L', :'runtime_password') \gexec
ALTER ROLE reference_application_app CONNECTION LIMIT 20;
ALTER ROLE reference_application_app SET statement_timeout = '8s';
ALTER ROLE reference_application_app SET lock_timeout = '3s';
ALTER ROLE reference_application_app SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE reference_application NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;

ALTER DATABASE reference_application OWNER TO postgres;
REVOKE ALL ON DATABASE reference_application FROM PUBLIC;
GRANT CONNECT ON DATABASE reference_application TO reference_application_app;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO reference_application_app;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

GRANT SELECT (id, email, password_hash, role, name, is_active) ON TABLE users TO reference_application_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE sessions TO reference_application_app;
GRANT INSERT ON TABLE inquiries TO reference_application_app;
GRANT SELECT (id, created_at) ON TABLE inquiries TO reference_application_app;
GRANT USAGE ON TYPE user_role TO reference_application_app;

COMMIT;
