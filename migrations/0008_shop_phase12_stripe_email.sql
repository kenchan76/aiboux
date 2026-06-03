ALTER TABLE shop_settings ADD COLUMN stripe_account_id TEXT;
ALTER TABLE shop_settings ADD COLUMN stripe_connect_state TEXT NOT NULL DEFAULT 'not_connected';
ALTER TABLE shop_settings ADD COLUMN stripe_onboarding_url TEXT;
ALTER TABLE shop_settings ADD COLUMN stripe_onboarding_expires_at INTEGER;
ALTER TABLE shop_settings ADD COLUMN stripe_business_data_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE shop_settings ADD COLUMN stripe_last_synced_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_shop_settings_tenant_stripe_state
  ON shop_settings(tenant_id, stripe_connect_state);

ALTER TABLE shop_email_notification_logs ADD COLUMN delivery_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE shop_email_notification_logs ADD COLUMN last_attempt_at INTEGER;
ALTER TABLE shop_email_notification_logs ADD COLUMN provider TEXT NOT NULL DEFAULT 'resend';

CREATE INDEX IF NOT EXISTS idx_shop_email_notification_logs_queue
  ON shop_email_notification_logs(delivery_status, created_at);
