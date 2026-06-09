-- migrations/002_update_accounts.sql
ALTER TABLE accounts
ADD COLUMN institution_id BIGINT;

ALTER TABLE accounts
ADD COLUMN account_type VARCHAR;

ALTER TABLE accounts
ADD COLUMN currency_code VARCHAR;

ALTER TABLE accounts
ADD COLUMN is_active BOOLEAN;

ALTER TABLE accounts
ADD COLUMN created_at TIMESTAMP;
