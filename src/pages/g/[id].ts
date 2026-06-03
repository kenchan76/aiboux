import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  getTempLogShare,
  getTempLogShareHeaders,
  isTempLogShareExpired,
} from '@/lib/server/tempLogShares';
import {
  buildTempImageResponse,
  getTempImageShare,
  getTempImageShareHeaders,
  isTempImageShareExpired,
} from '@/lib/server/tempImageShares';

export const prerender = false;

const shortLogShares: Record<string, string> = {
  m3g27: 'mail-mobile-ui-improvement-g-20260527',
  spr: 'shop-product-registration-final-20260527',
  ssn: 'shop-navigation-settings-final-20260527',
  sfb: 'shop-font-backend-final-20260527',
  scu: 'shop-core-ux-inventory-documents-final-20260527',
  sfd: 'shop-font-documents-final-20260527',
  s8: 'shop-enterprise-ux-final-20260527',
  s9: 'shop-beginner-ux-final-20260527',
  m10: 'aiboux-master-document-20260528',
  s10: 'shop-tripartite-final-20260528',
  m11: 'aiboux-master-document-phase11-20260528',
  s11: 'shop-external-infra-final-20260528',
  m12: 'aiboux-master-document-phase12-20260528',
  s12: 'shop-stripe-email-final-20260528',
  m13: 'aiboux-master-document-phase13-20260528',
  s13: 'shop-production-ops-final-20260528',
  m14: 'aiboux-master-document-phase14-20260528',
  s14: 'shop-seo-feed-final-20260528',
  m15: 'aiboux-master-document-phase15-20260528',
  s15: 'shop-omnichannel-final-20260528',
  m16: 'aiboux-master-document-phase16-20260528',
  s16: 'shop-settings-consolidation-final-20260528',
  m17: 'aiboux-master-document-phase17-20260528',
  s17: 'shop-layout-order-sns-final-20260528',
  m18: 'aiboux-master-document-phase18-20260528',
  s18: 'shop-system-audit-final-20260528',
  m19: 'aiboux-master-document-phase19-20260528',
  s19: 'shop-mall-refund-final-20260528',
  m20: 'aiboux-master-document-phase20-20260528',
  s20: 'shop-storefront-builder-final-20260528',
  m21: 'aiboux-master-document-phase21-20260528',
  s21: 'shop-marketplace-storefront-final-20260528',
  m22: 'aiboux-master-document-phase22-20260528',
  s22: 'shop-static-ui-enforcement-final-20260528',
  m24: 'aiboux-master-document-phase24-20260528',
  s24: 'shop-absolute-storefront-override-final-20260528',
  m25: 'aiboux-master-document-phase25-20260528',
  s25: 'shop-shadcn-storefront-final-20260528',
  mc1: 'aiboux-master-document-core-phase1-20260528',
  c1: 'core-pim-inventory-hub-final-20260528',
  mc2: 'aiboux-master-document-core-phase2-20260528',
  c2: 'core-master-form-final-20260528',
  mc3: 'aiboux-master-document-core-phase3-20260528',
  c3: 'core-business-documents-final-20260528',
  mc35: 'aiboux-master-document-core-phase3-5-20260528',
  c35: 'core-document-form-ui-hotfix-final-20260528',
  mc4: 'aiboux-master-document-core-phase4-20260528',
  c4: 'core-document-print-e2e-final-20260528',
  mc5: 'aiboux-master-document-core-phase5-20260528',
  c5: 'core-phase5-ui-redesign-final-20260528',
  mcsui: 'aiboux-master-document-core-shop-ui-20260529',
  csui: 'aiboux-core-shop-ui-final-20260529',
  mcfull: 'aiboux-master-document-core-full-ui-20260529',
  cfull: 'core-full-ui-redesign-final-20260529',
  mcdeliv: 'aiboux-master-document-core-delivery-detail-ui-20260529',
  cdeliv: 'core-delivery-detail-ui-final-20260529',
  mcdeliv2: 'aiboux-master-document-core-delivery-create-ui-rework-20260529',
  cdeliv2: 'core-delivery-create-ui-rework-final-20260529',
  mcdeliv3: 'aiboux-master-document-core-delivery-workspace-density-20260529',
  cdeliv3: 'core-delivery-workspace-density-final-20260529',
  mcdeliv4: 'aiboux-master-document-core-delivery-workspace-fullwidth-20260529',
  cdeliv4: 'core-delivery-workspace-fullwidth-final-20260529',
  mcdeliv5: 'aiboux-master-document-core-delivery-vertical-spacing-20260529',
  cdeliv5: 'core-delivery-vertical-spacing-final-20260529',
  cdocui: 'core-document-management-ui-unification-final-20260530',
  cdocui2: 'core-document-management-rejection-fix-final-20260530',
  cdocui3: 'core-document-workspace-unification-final-20260530',
  cdocui4: 'core-document-ui-semantic-config-final-20260530',
  cdocui5: 'core-document-ui-public-review-final-20260530',
  cdocui6: 'core-document-ui-grok-cloudflare-final-20260530',
  cdeliv6: 'core-delivery-create-final-reference-match-20260530',
  deployrule: 'production-deployment-rule-update-final-20260530',
  deploychk: 'production-deployment-rule-contradiction-check-20260530',
  hermes1: 'hermes-agent-minimal-audit-setup-20260530',
  hermes2: 'hermes-provider-and-first-audit-20260530',
  hermes3: 'hermes-gated-completion-rule-20260530',
  hermes4: 'hermes-current-state-and-bark-notification-20260530',
  cdeliv7: 'core-delivery-detail-print-preview-final-20260530',
  cdeliv8: 'core-delivery-detail-print-rejection-fix-blocked-20260530',
  cdeliv9: 'core-delivery-detail-typography-user-approved-deploy-20260531',
  cdeliv9b: 'core-delivery-detail-print-bark-grok-blocked-20260530',
  cdeliv10: 'bark-required-notification-gate-blocked-20260530',
  imgpolicy: 'codex-imagegen-url-policy-20260530',
  m68: 'aiboux-full-japanese-master-20260601',
  l68: 'aiboux-full-japanese-master-log-20260601',
  d68: 'aiboux-full-japanese-master-screen-20260601',
};

const shortImageShares: Record<string, string> = {};

export const GET: APIRoute = async ({ params, url }) => {
  const shortId = params.id ?? '';
  const share = getTempLogShare(shortLogShares[shortId]);

  if (share) {
    if (isTempLogShareExpired(share)) {
      return new Response('This temporary log URL has expired.', {
        status: 410,
        headers: getTempLogShareHeaders(share),
      });
    }

    const versionMetadata = (env as unknown as { CF_VERSION_METADATA?: { id?: string; tag?: string; timestamp?: string } })
      .CF_VERSION_METADATA;
    const content = share.content
      .replaceAll('__WORKER_VERSION_ID__', versionMetadata?.id ?? 'UNAVAILABLE_IN_RUNTIME')
      .replaceAll('__WORKER_VERSION_TAG__', versionMetadata?.tag ?? 'UNAVAILABLE_IN_RUNTIME')
      .replaceAll('__WORKER_VERSION_TIMESTAMP__', versionMetadata?.timestamp ?? 'UNAVAILABLE_IN_RUNTIME');

    return new Response(content, {
      status: 200,
      headers: {
        ...getTempLogShareHeaders(share),
        'content-type': 'text/markdown; charset=utf-8',
        'content-disposition': `inline; filename="${share.filename}"`,
      },
    });
  }

  const imageShare = getTempImageShare(shortImageShares[shortId]);

  if (imageShare) {
    if (isTempImageShareExpired(imageShare)) {
      return new Response('This temporary image URL has expired.', {
        status: 410,
        headers: getTempImageShareHeaders(imageShare),
      });
    }

    return buildTempImageResponse(imageShare, url.origin);
  }

  return new Response('Not found', {
    status: 404,
    headers: getTempLogShareHeaders(),
  });
};
