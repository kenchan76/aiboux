import type { TenantPlan, TenantPlanLimits } from './types';

export const PLAN_LABELS: Record<TenantPlan, string> = {
  free: 'Free',
  standard: 'Standard',
  premium: 'Premium',
};

export function canCreateMailAddress(currentCount: number, limits: TenantPlanLimits): boolean {
  return limits.max_mail_addresses < 0 || currentCount < limits.max_mail_addresses;
}

export function shouldShowAds(limits: TenantPlanLimits): boolean {
  return limits.ads_enabled === 1;
}

export function retentionDaysToLabel(days: number): string {
  if (days >= 365) {
    return '長期保管';
  }

  return `${days}日保管`;
}
