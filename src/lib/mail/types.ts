export type TenantPlan = 'free' | 'standard' | 'premium';
export type TenantStatus = 'active' | 'suspended' | 'canceled';
export type MailDirection = 'inbound' | 'outbound' | 'draft';
export type MailMessageStatus = 'received' | 'queued' | 'sent' | 'draft' | 'archived' | 'trash' | 'spam' | 'failed';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  custom_domain: string | null;
  created_at: number;
  updated_at: number;
}

export interface TenantPlanLimits {
  plan: TenantPlan;
  monthly_price_jpy: number;
  max_mail_addresses: number;
  r2_retention_days: number;
  ads_enabled: 0 | 1;
  client_ai_enabled: 0 | 1;
  client_excel_enabled: 0 | 1;
  client_optimizer_enabled: 0 | 1;
}

export interface MailMessageListItem {
  id: string;
  tenant_id: string;
  from_address: string;
  subject: string;
  preview_text: string;
  status: MailMessageStatus;
  is_read: 0 | 1;
  is_starred: 0 | 1;
  created_at: number;
}
