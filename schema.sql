PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'standard', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'canceled')),
  custom_domain TEXT UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS tenant_plan_limits (
  plan TEXT PRIMARY KEY CHECK (plan IN ('free', 'standard', 'premium')),
  monthly_price_jpy INTEGER NOT NULL,
  max_mail_addresses INTEGER NOT NULL,
  r2_retention_days INTEGER NOT NULL,
  ads_enabled INTEGER NOT NULL DEFAULT 0 CHECK (ads_enabled IN (0, 1)),
  client_ai_enabled INTEGER NOT NULL DEFAULT 1 CHECK (client_ai_enabled IN (0, 1)),
  client_excel_enabled INTEGER NOT NULL DEFAULT 1 CHECK (client_excel_enabled IN (0, 1)),
  client_optimizer_enabled INTEGER NOT NULL DEFAULT 1 CHECK (client_optimizer_enabled IN (0, 1))
);

INSERT INTO tenant_plan_limits (
  plan,
  monthly_price_jpy,
  max_mail_addresses,
  r2_retention_days,
  ads_enabled,
  client_ai_enabled,
  client_excel_enabled,
  client_optimizer_enabled
) VALUES
  ('free', 0, 5, 7, 1, 1, 1, 1),
  ('standard', 500, 10, 7, 0, 1, 1, 1),
  ('premium', 980, -1, 365, 0, 1, 1, 1)
ON CONFLICT(plan) DO UPDATE SET
  monthly_price_jpy = excluded.monthly_price_jpy,
  max_mail_addresses = excluded.max_mail_addresses,
  r2_retention_days = excluded.r2_retention_days,
  ads_enabled = excluded.ads_enabled,
  client_ai_enabled = excluded.client_ai_enabled,
  client_excel_enabled = excluded.client_excel_enabled,
  client_optimizer_enabled = excluded.client_optimizer_enabled;

CREATE TABLE IF NOT EXISTS tenant_users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'disabled')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS mail_addresses (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  local_part TEXT NOT NULL,
  domain TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, local_part, domain)
);

CREATE TABLE IF NOT EXISTS mail_folders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  system_key TEXT CHECK (system_key IN ('inbox', 'sent', 'drafts', 'archive', 'spam', 'trash')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES tenant_users(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, user_id, name),
  UNIQUE (tenant_id, user_id, system_key)
);

CREATE TABLE IF NOT EXISTS mail_threads (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subject_normalized TEXT NOT NULL,
  latest_message_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mail_messages (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  thread_id TEXT,
  mailbox_id TEXT NOT NULL,
  folder_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'draft')),
  provider_message_id TEXT,
  in_reply_to TEXT,
  from_address TEXT NOT NULL,
  to_json TEXT NOT NULL DEFAULT '[]',
  cc_json TEXT NOT NULL DEFAULT '[]',
  bcc_json TEXT NOT NULL DEFAULT '[]',
  subject TEXT NOT NULL DEFAULT '',
  body_text TEXT,
  body_html TEXT,
  preview_text TEXT NOT NULL DEFAULT '',
  unsubscribe_url TEXT,
  raw_r2_key TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'queued', 'sent', 'draft', 'archived', 'trash', 'spam', 'failed')),
  is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
  is_starred INTEGER NOT NULL DEFAULT 0 CHECK (is_starred IN (0, 1)),
  received_at INTEGER,
  sent_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (thread_id) REFERENCES mail_threads(id) ON DELETE SET NULL,
  FOREIGN KEY (mailbox_id) REFERENCES mail_addresses(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES mail_folders(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, provider_message_id)
);

CREATE TABLE IF NOT EXISTS mail_attachments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  content_sha256 TEXT,
  optimizer_status TEXT NOT NULL DEFAULT 'client_optimized' CHECK (optimizer_status IN ('client_optimized', 'original', 'failed')),
  retention_expires_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mail_labels (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#2563eb',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES tenant_users(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, user_id, name)
);

CREATE TABLE IF NOT EXISTS mail_message_labels (
  message_id TEXT NOT NULL,
  label_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  PRIMARY KEY (message_id, label_id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES mail_labels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mail_send_jobs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error TEXT,
  scheduled_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  sent_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mail_ai_artifacts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('summary', 'voice_summary', 'reply_draft', 'speech_reply_draft', 'extracted_task', 'classification')),
  content_json TEXT NOT NULL,
  engine TEXT NOT NULL DEFAULT 'browser_native',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mail_audit_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_user_id) REFERENCES tenant_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mail_blocked_senders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('email', 'domain')),
  block_pattern TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, block_type, block_pattern)
);

CREATE TABLE IF NOT EXISTS public_file_transfers (
  id TEXT PRIMARY KEY,
  download_code TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL CHECK (file_size >= 0),
  file_type TEXT NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tenants_status_plan ON tenants(status, plan);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_role ON tenant_users(tenant_id, role, status);
CREATE INDEX IF NOT EXISTS idx_mail_addresses_tenant_status ON mail_addresses(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_mail_folders_tenant_user ON mail_folders(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_mail_threads_tenant_latest ON mail_threads(tenant_id, latest_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_mail_messages_tenant_folder_time ON mail_messages(tenant_id, folder_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mail_messages_tenant_mailbox_time ON mail_messages(tenant_id, mailbox_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mail_messages_thread ON mail_messages(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_mail_messages_status ON mail_messages(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mail_attachments_tenant_message ON mail_attachments(tenant_id, message_id);
CREATE INDEX IF NOT EXISTS idx_mail_attachments_retention ON mail_attachments(retention_expires_at);
CREATE INDEX IF NOT EXISTS idx_mail_labels_tenant_user ON mail_labels(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_mail_send_jobs_status_schedule ON mail_send_jobs(status, scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_mail_ai_artifacts_message_type ON mail_ai_artifacts(message_id, artifact_type);
CREATE INDEX IF NOT EXISTS idx_mail_audit_events_tenant_time ON mail_audit_events(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mail_blocked_senders_lookup ON mail_blocked_senders(tenant_id, block_type, block_pattern, is_active);
CREATE INDEX IF NOT EXISTS idx_public_file_transfers_code_expiry ON public_file_transfers(download_code, expires_at);
CREATE INDEX IF NOT EXISTS idx_public_file_transfers_expiry ON public_file_transfers(expires_at);
