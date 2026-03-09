-- SpiTractors production-oriented MySQL schema
-- Target: Core PHP backend + MySQL 8.0+
-- Notes:
--   * Uses CHAR(36) UUID keys (default UUID())
--   * Enforces critical job request state transitions with triggers
--   * Includes audit timestamps, constraints, indexes, and history logging

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- USERS / AUTH
-- =========================

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('FARMER','TRACTOR_OWNER','ADMIN') NOT NULL,
  status ENUM('PENDING_VERIFICATION','ACTIVE','SUSPENDED','DEACTIVATED') NOT NULL DEFAULT 'PENDING_VERIFICATION',
  email_verified_at DATETIME NULL,
  phone_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  avatar_url TEXT NULL,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Lagos',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_addresses (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  label VARCHAR(80) NOT NULL DEFAULT 'primary',
  country VARCHAR(80) NOT NULL,
  state VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  street_address TEXT NOT NULL,
  postal_code VARCHAR(32) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_user_addresses_lat CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
  CONSTRAINT chk_user_addresses_lng CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_email_verification_tokens_hash (token_hash),
  CONSTRAINT fk_email_verification_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_email_verification_expiry CHECK (expires_at > created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_password_reset_tokens_hash (token_hash),
  CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_password_reset_expiry CHECK (expires_at > created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- TRACTORS
-- =========================

CREATE TABLE IF NOT EXISTS tractors (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  owner_user_id CHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  registration_id VARCHAR(100) NOT NULL,
  model VARCHAR(100) NULL,
  brand VARCHAR(100) NULL,
  year_of_manufacture INT NULL,
  horsepower INT NULL,
  base_rate_per_hour DECIMAL(12,2) NOT NULL,
  status ENUM('DRAFT','ACTIVE','MAINTENANCE','UNAVAILABLE','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  last_known_latitude DECIMAL(10,7) NULL,
  last_known_longitude DECIMAL(10,7) NULL,
  last_location_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tractors_owner_registration (owner_user_id, registration_id),
  KEY idx_tractors_owner (owner_user_id),
  KEY idx_tractors_status (status),
  CONSTRAINT fk_tractors_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_tractors_rate CHECK (base_rate_per_hour >= 0),
  CONSTRAINT chk_tractors_year CHECK (year_of_manufacture IS NULL OR year_of_manufacture BETWEEN 1950 AND 2100),
  CONSTRAINT chk_tractors_hp CHECK (horsepower IS NULL OR horsepower > 0),
  CONSTRAINT chk_tractors_lat CHECK (last_known_latitude IS NULL OR (last_known_latitude BETWEEN -90 AND 90)),
  CONSTRAINT chk_tractors_lng CHECK (last_known_longitude IS NULL OR (last_known_longitude BETWEEN -180 AND 180))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tractor_capabilities (
  tractor_id CHAR(36) NOT NULL,
  service ENUM('PLOUGHING','HARROWING','RIDGING','PLANTING','HARVESTING','OTHER') NOT NULL,
  rate_per_hour DECIMAL(12,2) NULL,
  PRIMARY KEY (tractor_id, service),
  CONSTRAINT fk_tractor_capabilities_tractor FOREIGN KEY (tractor_id) REFERENCES tractors(id) ON DELETE CASCADE,
  CONSTRAINT chk_tractor_capabilities_rate CHECK (rate_per_hour IS NULL OR rate_per_hour >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tractor_availability_slots (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  tractor_id CHAR(36) NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_tractor_slots_tractor_time (tractor_id, start_at, end_at),
  CONSTRAINT fk_tractor_slots_tractor FOREIGN KEY (tractor_id) REFERENCES tractors(id) ON DELETE CASCADE,
  CONSTRAINT chk_tractor_slots_range CHECK (end_at > start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- REQUESTS / MATCHING
-- =========================

CREATE TABLE IF NOT EXISTS job_requests (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  request_code VARCHAR(32) NOT NULL,
  farmer_user_id CHAR(36) NOT NULL,
  accepted_tractor_id CHAR(36) NULL,
  service ENUM('PLOUGHING','HARROWING','RIDGING','PLANTING','HARVESTING','OTHER') NOT NULL,
  farm_address TEXT NOT NULL,
  farm_size_acres DECIMAL(12,2) NULL,
  preferred_date DATE NULL,
  notes TEXT NULL,

  status ENUM('SENT','RECEIVED','ACCEPTED','EN_ROUTE','ARRIVED','WORK_STARTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SENT',

  farm_latitude DECIMAL(10,7) NULL,
  farm_longitude DECIMAL(10,7) NULL,

  distance_km DECIMAL(10,2) NULL,
  eta_minutes INT NULL,
  rate_per_hour DECIMAL(12,2) NULL,
  estimated_hours DECIMAL(8,2) NULL,
  travel_fee DECIMAL(12,2) NULL,
  estimated_total DECIMAL(12,2) NULL,

  accepted_at DATETIME NULL,
  completed_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  cancellation_reason TEXT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_job_requests_code (request_code),
  KEY idx_job_requests_farmer_status (farmer_user_id, status),
  KEY idx_job_requests_tractor_status (accepted_tractor_id, status),
  KEY idx_job_requests_created (created_at),
  KEY idx_job_requests_preferred_date (preferred_date),
  KEY idx_job_requests_service_status (service, status),

  CONSTRAINT fk_job_requests_farmer FOREIGN KEY (farmer_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_job_requests_accepted_tractor FOREIGN KEY (accepted_tractor_id) REFERENCES tractors(id) ON DELETE SET NULL,

  CONSTRAINT chk_job_requests_farm_size CHECK (farm_size_acres IS NULL OR farm_size_acres > 0),
  CONSTRAINT chk_job_requests_lat CHECK (farm_latitude IS NULL OR (farm_latitude BETWEEN -90 AND 90)),
  CONSTRAINT chk_job_requests_lng CHECK (farm_longitude IS NULL OR (farm_longitude BETWEEN -180 AND 180)),
  CONSTRAINT chk_job_requests_distance CHECK (distance_km IS NULL OR distance_km >= 0),
  CONSTRAINT chk_job_requests_eta CHECK (eta_minutes IS NULL OR eta_minutes >= 0),
  CONSTRAINT chk_job_requests_rate CHECK (rate_per_hour IS NULL OR rate_per_hour >= 0),
  CONSTRAINT chk_job_requests_est_hours CHECK (estimated_hours IS NULL OR estimated_hours >= 0),
  CONSTRAINT chk_job_requests_travel_fee CHECK (travel_fee IS NULL OR travel_fee >= 0),
  CONSTRAINT chk_job_requests_est_total CHECK (estimated_total IS NULL OR estimated_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_request_status_history (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_request_id CHAR(36) NOT NULL,
  from_status ENUM('SENT','RECEIVED','ACCEPTED','EN_ROUTE','ARRIVED','WORK_STARTED','IN_PROGRESS','COMPLETED','CANCELLED') NULL,
  to_status ENUM('SENT','RECEIVED','ACCEPTED','EN_ROUTE','ARRIVED','WORK_STARTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL,
  actor_user_id CHAR(36) NULL,
  reason TEXT NULL,
  metadata JSON NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_job_request_status_history_request (job_request_id, changed_at),
  CONSTRAINT fk_history_job_request FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_actor_user FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS request_matches (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  job_request_id CHAR(36) NOT NULL,
  tractor_id CHAR(36) NOT NULL,
  owner_user_id CHAR(36) NOT NULL,
  status ENUM('PROPOSED','SHORTLISTED','ACCEPTED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PROPOSED',
  distance_km DECIMAL(10,2) NULL,
  eta_minutes INT NULL,
  quoted_rate_per_hour DECIMAL(12,2) NULL,
  quoted_travel_fee DECIMAL(12,2) NULL,
  expires_at DATETIME NULL,
  responded_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_request_matches_request_tractor (job_request_id, tractor_id),
  KEY idx_request_matches_request_status (job_request_id, status),
  KEY idx_request_matches_expires_at (expires_at),
  CONSTRAINT fk_request_matches_request FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_request_matches_tractor FOREIGN KEY (tractor_id) REFERENCES tractors(id) ON DELETE CASCADE,
  CONSTRAINT fk_request_matches_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_request_matches_distance CHECK (distance_km IS NULL OR distance_km >= 0),
  CONSTRAINT chk_request_matches_eta CHECK (eta_minutes IS NULL OR eta_minutes >= 0),
  CONSTRAINT chk_request_matches_rate CHECK (quoted_rate_per_hour IS NULL OR quoted_rate_per_hour >= 0),
  CONSTRAINT chk_request_matches_fee CHECK (quoted_travel_fee IS NULL OR quoted_travel_fee >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- WALLET / PAYMENTS
-- =========================

CREATE TABLE IF NOT EXISTS wallet_accounts (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  available_balance DECIMAL(14,2) NOT NULL DEFAULT 0,
  held_balance DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wallet_accounts_user (user_id),
  CONSTRAINT fk_wallet_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_wallet_available_balance CHECK (available_balance >= 0),
  CONSTRAINT chk_wallet_held_balance CHECK (held_balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  job_request_id CHAR(36) NOT NULL,
  payer_user_id CHAR(36) NOT NULL,
  provider ENUM('PAYSTACK','FLUTTERWAVE','STRIPE','MANUAL') NOT NULL,
  method ENUM('CARD','WALLET','BANK_TRANSFER') NOT NULL,
  status ENUM('PENDING','AUTHORIZED','SUCCEEDED','FAILED','REFUNDED','PARTIALLY_REFUNDED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  amount DECIMAL(14,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  provider_reference VARCHAR(128) NULL,
  idempotency_key VARCHAR(128) NOT NULL,
  failure_reason TEXT NULL,
  metadata JSON NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payments_idempotency (idempotency_key),
  KEY idx_payments_request_status (job_request_id, status),
  KEY idx_payments_provider_reference (provider_reference),
  KEY idx_payments_created_status (created_at, status),
  CONSTRAINT fk_payments_request FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE RESTRICT,
  CONSTRAINT fk_payments_payer FOREIGN KEY (payer_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_payments_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  wallet_account_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  job_request_id CHAR(36) NULL,
  payment_id CHAR(36) NULL,
  txn_type ENUM('CREDIT','DEBIT','HOLD','RELEASE','REVERSAL') NOT NULL,
  status ENUM('PENDING','POSTED','FAILED','REVERSED') NOT NULL DEFAULT 'PENDING',
  amount DECIMAL(14,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  reference_code VARCHAR(128) NOT NULL,
  description TEXT NULL,
  metadata JSON NULL,
  posted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wallet_tx_reference (reference_code),
  KEY idx_wallet_transactions_user_created (user_id, created_at),
  KEY idx_wallet_transactions_request (job_request_id),
  CONSTRAINT fk_wallet_transactions_wallet FOREIGN KEY (wallet_account_id) REFERENCES wallet_accounts(id) ON DELETE RESTRICT,
  CONSTRAINT fk_wallet_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_wallet_transactions_request FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE SET NULL,
  CONSTRAINT fk_wallet_transactions_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  CONSTRAINT chk_wallet_transactions_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  provider ENUM('PAYSTACK','FLUTTERWAVE','STRIPE','MANUAL') NOT NULL,
  event_type VARCHAR(120) NOT NULL,
  signature_hash VARCHAR(255) NULL,
  provider_event_id VARCHAR(128) NULL,
  payload JSON NOT NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payment_webhooks_provider_event (provider, provider_event_id),
  KEY idx_payment_webhooks_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- NOTIFICATIONS
-- =========================

CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  channel ENUM('EMAIL','SMS','PUSH','IN_APP') NOT NULL,
  template_key VARCHAR(120) NOT NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  status ENUM('QUEUED','SENT','DELIVERED','FAILED') NOT NULL DEFAULT 'QUEUED',
  dedupe_key VARCHAR(128) NULL,
  metadata JSON NULL,
  sent_at DATETIME NULL,
  delivered_at DATETIME NULL,
  failed_at DATETIME NULL,
  failure_reason TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_notifications_dedupe (dedupe_key),
  KEY idx_notifications_user_created (user_id, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- REQUEST STATUS / AUDIT TRIGGERS (phpMyAdmin-safe syntax)
-- =========================

DROP TRIGGER IF EXISTS trg_job_requests_before_update;
DROP TRIGGER IF EXISTS trg_job_requests_after_insert;
DROP TRIGGER IF EXISTS trg_job_requests_after_update;

-- Single-statement trigger (no BEGIN...END) for broader SQL tool compatibility.
CREATE TRIGGER trg_job_requests_before_update
BEFORE UPDATE ON job_requests
FOR EACH ROW
SET
  NEW.accepted_at = IF(NEW.status = 'ACCEPTED' AND NEW.accepted_at IS NULL, NOW(), NEW.accepted_at),
  NEW.completed_at = IF(NEW.status = 'COMPLETED' AND NEW.completed_at IS NULL, NOW(), NEW.completed_at),
  NEW.cancelled_at = IF(NEW.status = 'CANCELLED' AND NEW.cancelled_at IS NULL, NOW(), NEW.cancelled_at),
  NEW.cancellation_reason = IF(NEW.status = 'CANCELLED', NEW.cancellation_reason, NULL);

CREATE TRIGGER trg_job_requests_after_insert
AFTER INSERT ON job_requests
FOR EACH ROW
INSERT INTO job_request_status_history (job_request_id, from_status, to_status, reason)
VALUES (NEW.id, NULL, NEW.status, 'initial status');

CREATE TRIGGER trg_job_requests_after_update
AFTER UPDATE ON job_requests
FOR EACH ROW
INSERT INTO job_request_status_history (job_request_id, from_status, to_status, reason)
SELECT NEW.id, OLD.status, NEW.status, 'status changed'
WHERE OLD.status <> NEW.status;

SET FOREIGN_KEY_CHECKS = 1;
