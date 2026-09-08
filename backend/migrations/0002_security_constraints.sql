BEGIN;

UPDATE users SET email = lower(btrim(email)) WHERE email <> lower(btrim(email));
UPDATE inquiries SET email = lower(btrim(email)) WHERE email <> lower(btrim(email));

CREATE UNIQUE INDEX users_email_lower_uidx ON users (lower(email));
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);
CREATE INDEX sessions_last_seen_at_idx ON sessions (last_seen_at);

ALTER TABLE users
  ADD CONSTRAINT users_email_normalized_chk CHECK (email = lower(btrim(email)) AND char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT users_name_length_chk CHECK (char_length(btrim(name)) BETWEEN 1 AND 120);

ALTER TABLE sessions
  ADD CONSTRAINT sessions_expiry_chk CHECK (expires_at > created_at),
  ADD CONSTRAINT sessions_last_seen_chk CHECK (last_seen_at >= created_at);

ALTER TABLE inquiries
  ADD CONSTRAINT inquiries_company_length_chk CHECK (char_length(btrim(company)) BETWEEN 1 AND 120),
  ADD CONSTRAINT inquiries_name_length_chk CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  ADD CONSTRAINT inquiries_email_length_chk CHECK (email = lower(btrim(email)) AND char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT inquiries_phone_length_chk CHECK (phone IS NULL OR char_length(phone) <= 40),
  ADD CONSTRAINT inquiries_project_type_chk CHECK (project_type IN ('Website', 'Web-App', 'Mobile App', 'Kassensystem', 'Integration / API', 'Individuelle Software', 'Bestehendes System erweitern', 'Sonstiges')),
  ADD CONSTRAINT inquiries_budget_chk CHECK (budget IS NULL OR budget IN ('bis_5000', '5000_15000', '15000_50000', 'ab_50000')),
  ADD CONSTRAINT inquiries_message_length_chk CHECK (char_length(btrim(message)) BETWEEN 10 AND 5000);

ALTER TABLE invoices
  ADD CONSTRAINT invoices_amounts_nonnegative_chk CHECK (net_amount >= 0 AND tax_amount >= 0 AND gross_amount >= 0),
  ADD CONSTRAINT invoices_due_date_chk CHECK (due_date >= issue_date),
  ADD CONSTRAINT invoices_currency_chk CHECK (currency ~ '^[A-Z]{3}$');

COMMIT;
