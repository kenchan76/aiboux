# Phase 18 Tenant/API Static Audit

Generated: 2026-05-28

## DB prepare occurrences

### src/pages/shop/api/categories/list.ts
22:    const { results } = await env.DB.prepare(

### src/pages/shop/api/categories/save.ts
45:    await env.DB.prepare(

### src/pages/shop/api/feed-sync/status.ts
19:    const rows = await env.DB.prepare(

### src/pages/shop/api/inventory/update-stock.ts
28:    const product = await env.DB.prepare(
48:    const result = await env.DB.prepare(

### src/pages/shop/api/notifications/email-logs.ts
27:        await env.DB.prepare(

### src/pages/shop/api/orders/cancel-refund.ts
55:    const b2bUpdate = await env.DB.prepare(
69:    await env.DB.prepare(
204:    await env.DB.prepare(
230:    ? await env.DB.prepare(
250:  return env.DB.prepare(

### src/pages/shop/api/orders/update-shipping.ts
34:    const update = await env.DB.prepare(
50:    await env.DB.prepare(

### src/pages/shop/api/products/save.ts
83:    await env.DB.prepare(
191:    await env.DB.prepare(
224:      await env.DB.prepare(
269:  const existing = await env.DB.prepare(
277:    await env.DB.prepare(
307:  await env.DB.prepare(

### src/pages/shop/api/settings/omnichannel.ts
17:    const row = await env.DB.prepare(
58:    await env.DB.prepare(
96:  await env.DB.prepare(

### src/pages/shop/api/settings/onboarding.ts
30:    await env.DB.prepare(

### src/pages/shop/api/settings/profile.ts
47:    const row = await env.DB.prepare(
131:      env.DB.prepare(
182:      env.DB.prepare(
298:  const existing = await env.DB.prepare(

### src/pages/shop/api/settings/social.ts
52:    const row = await env.DB.prepare(
98:    await env.DB.prepare(

### src/pages/shop/api/social/approve.ts
25:    const existing = await env.DB.prepare(
36:    await env.DB.prepare(

### src/pages/shop/api/social/history.ts
25:    const { results } = await env.DB.prepare(

### src/pages/shop/api/stripe/onboard.ts
39:    const existing = await env.DB.prepare(
85:    await env.DB.prepare(

### src/pages/shop/api/stripe/status.ts
36:    const row = await env.DB.prepare(
61:      await env.DB.prepare(

### src/pages/shop/api/stripe/webhook.ts
53:  const result = await env.DB.prepare(

### src/pages/shop/admin/orders/mark-shipped.ts
31:  const order = await env.DB.prepare(
56:  const result = await env.DB.prepare(

### src/lib/server/shopFeedSyncConsumer.ts
34:  await env.DB.prepare(
49:  const row = await env.DB.prepare(
211:  await env.DB.prepare(

### src/lib/server/shopNotificationEmail.ts
53:  await env.DB.prepare(

### src/lib/server/shopProductCache.ts
18:  const tenant = await env.DB.prepare("SELECT slug, host_name FROM tenants WHERE id = ? LIMIT 1")

### src/lib/server/shopStripeConnect.ts
76:  await env.DB.prepare(
105:  const row = await env.DB.prepare(

### src/workers/shop-email-queue.ts
35:    await env.DB.prepare(
57:      await env.DB.prepare(
77:      await env.DB.prepare(
106:  const result = await env.DB.prepare(

### src/workers/shop-social-cron.ts
17:  const result = await env.DB.prepare(
35:      await env.DB.prepare(
47:      await env.DB.prepare(

## Button/API sweep after fixes
Buttons without direct onClick/asChild/disabled are mostly dropdown/popover/dialog triggers listed below for manual review:
src/components/shop/ShopSettingsPanel.tsx:726:              <Button variant="outline" size="sm" className="h-8 gap-2 bg-white">
src/components/shop/ShopSettingsPanel.tsx:897:            <Button
src/components/shop/CollectionsTable.tsx:67:                        <Button variant="ghost" size="icon-sm" aria-label={`${collection.name}の操作`}>
src/components/shop/ProductsTable.tsx:139:                      <Button variant="ghost" size="icon-sm" aria-label="商品操作">
src/components/shop/ShopTopbar.tsx:93:          <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
src/components/shop/ShopTopbar.tsx:145:          <Button variant="ghost" className="h-9 gap-2 px-2">
src/components/shop/DiscountsTable.tsx:95:                        <Button variant="ghost" size="icon-sm" aria-label={`${discount.code}の操作`}>
src/components/shop/categories/ShopCategoryManager.tsx:325:            <Button
src/components/shop/categories/ShopCategoryManager.tsx:359:        <Button
src/components/shop/ShopRecentOrders.tsx:196:                      <Button variant="ghost" size="icon-sm" aria-label={`${order.id}の操作メニュー`} title="発送情報の入力・印刷・キャンセル">
src/components/shop/CustomersTable.tsx:68:                        <Button variant="ghost" size="icon-sm" aria-label={`${customer.name}の操作`}>
src/components/shop/products/ShopProductWizard.tsx:297:              <Button

## Remaining mock/TBD occurrences
src/lib/server/shopStripeConnect.ts:11:  dataSource: "phase13_failsafe_mock",
src/lib/server/shopStripeConnect.ts:45:export function buildMockStripeAccountId(tenantId: string): string {
src/lib/server/shopStripeConnect.ts:47:  return `acct_mock_${suffix}`;
src/lib/server/shopStripeConnect.ts:145:    dataSource: hasRealData ? "shop_settings" : "phase13_failsafe_mock",
src/lib/server/shopFeedSyncConsumer.ts:24:  mode: "mock" | "api";
src/lib/server/shopFeedSyncConsumer.ts:87:      mode: "mock",
src/lib/server/shopFeedSyncConsumer.ts:102:      mode: "mock",
src/lib/server/shopFeedSyncConsumer.ts:164:      mode: "mock",
src/lib/server/shopFeedSyncConsumer.ts:174:        : "https://merchant.bingads.microsoft.com/api/feed-sync/mock";
src/workers/shop-email-queue.ts:14:  mocked: number;
src/workers/shop-email-queue.ts:51:  let mocked = 0;
src/workers/shop-email-queue.ts:71:        .bind(result.providerMessageId, result.mocked ? "mock_send_without_resend_api_key" : "", now, now, row.id, row.tenant_id)
src/workers/shop-email-queue.ts:74:      if (result.mocked) mocked += 1;
src/workers/shop-email-queue.ts:99:    mocked,
src/workers/shop-email-queue.ts:127:): Promise<{ providerMessageId: string; mocked: boolean }> {
src/workers/shop-email-queue.ts:160:  return { providerMessageId: data.id, mocked: false };
src/components/shop/ShopSettingsPanel.tsx:92:  apiMode?: "stripe_api" | "mock";
src/components/shop/ShopSettingsPanel.tsx:965:  if (value.includes("mock_send_without_resend_api_key")) return "Resend APIキー未設定のため、現在は安全なモック送信として記録しています。";
src/components/shop/ShopSettingsPanel.tsx:1046:      toast.success(data.apiMode === "mock" ? "決済連携の準備状態を保存しました" : "Stripe連携ページを作成しました");
src/components/shop/ShopSettingsPanel.tsx:1066:  const businessLabelSuffix = businessData.dataSource === "phase13_failsafe_mock" || businessData.dataSource === "phase12_test_mock" ? "（未設定）" : "";
src/components/shop/ShopSettingsPanel.tsx:1096:          {status?.apiMode === "mock" ? <span className="mt-1 block text-neutral-500">現在はAPIキー未設定のため、モック連携で状態保存します。</span> : null}
src/components/shop/ShopSettingsPanel.tsx:1098:          {businessData.dataSource === "phase13_failsafe_mock" || businessData.dataSource === "phase12_test_mock" ? <span className="mt-1 block text-amber-700">事業者情報が未設定のため、Stripe連携はまだ開始しません。先に一般・ストア情報を保存してください。</span> : null}
src/components/shop/StatusBadges.tsx:13:  発送準備中: "border-amber-100 bg-amber-50 text-amber-700",
src/pages/shop/api/stripe/onboard.ts:5:  buildMockStripeAccountId,
src/pages/shop/api/stripe/onboard.ts:53:    let mode: "stripe_api" | "mock" = "mock";
src/pages/shop/api/stripe/onboard.ts:57:      accountId = buildMockStripeAccountId(tenant.tenantId);
src/pages/shop/api/stripe/onboard.ts:63:        if (accountId.startsWith("acct_mock_")) {
src/pages/shop/api/stripe/onboard.ts:73:        if (accountId && !accountId.startsWith("acct_mock_")) throw error;
src/pages/shop/api/stripe/onboard.ts:74:        mode = "mock";
src/pages/shop/api/stripe/onboard.ts:76:        accountId = buildMockStripeAccountId(tenant.tenantId);
src/pages/shop/api/stripe/onboard.ts:77:        onboardingUrl = `${origin}/shop/settings?stripe=mock_onboarding&account=${encodeURIComponent(accountId)}`;
src/pages/shop/api/stripe/onboard.ts:80:      accountId = accountId || buildMockStripeAccountId(tenant.tenantId);
src/pages/shop/api/stripe/onboard.ts:81:      onboardingUrl = `${origin}/shop/settings?stripe=mock_onboarding&account=${encodeURIComponent(accountId)}`;
src/pages/shop/api/stripe/onboard.ts:121:      message: warning || (mode === "mock" ? "Stripe APIキー未設定のため、モック連携として保存しました。" : "Stripe連携URLを作成しました。"),
src/pages/shop/api/stripe/status.ts:56:    if (stripeSecret && row.stripe_account_id && !row.stripe_account_id.startsWith("acct_mock_")) {
src/pages/shop/api/stripe/status.ts:85:      apiMode: stripeSecret ? "stripe_api" : "mock",
src/pages/shop/api/stripe/status.ts:115:    if (parsed.dataSource === "phase12_test_mock") return getStripeBusinessData(env, tenantId);
src/components/shop/onboarding/ShopOnboardingWizard.tsx:45:  apiMode?: "stripe_api" | "mock";
src/components/shop/onboarding/ShopOnboardingWizard.tsx:236:      toast.success(data.apiMode === "mock" ? "決済連携の準備状態を保存しました" : "Stripe連携ページを作成しました");
src/components/shop/onboarding/ShopOnboardingWizard.tsx:372:            <StatusPanel icon={Globe2} title="店舗URL" rows={[storeName, `${subdomain || "store"}.mall.aiboux.com`, "SSL: 自動", "Mall連携: 準備中"]} />
src/components/shop/onboarding/ShopOnboardingWizard.tsx:400:                    {stripeLoading ? "連携を準備中..." : stripeState === "active" ? "決済受付準備済み" : "決済連携を開始"}
src/components/shop/ProductEditor.tsx:224:                <Field label="販売状態" help="販売する=購入可能、下書き=準備中、販売停止=購入者に表示しません。保存後に反映します。">
src/pages/shop/api/lookup/corporate.ts:50:    source: 'mock',
src/pages/shop/api/lookup/zipcode.ts:53:    source: zipcodeRecords[postalCode] ? 'mock' : 'mock_fallback',
src/pages/shop/api/orders/cancel-refund.ts:138:  status: "not_required" | "mock_refunded" | "stripe_refunded" | "failed";
src/pages/shop/api/orders/cancel-refund.ts:140:  mode: "mock" | "stripe";
src/pages/shop/api/orders/cancel-refund.ts:147:      mode: "mock",
src/pages/shop/api/orders/cancel-refund.ts:155:      status: "mock_refunded",
src/pages/shop/api/orders/cancel-refund.ts:156:      refundId: `mock_refund_${crypto.randomUUID()}`,
src/pages/shop/api/orders/cancel-refund.ts:157:      mode: "mock",
src/pages/shop/api/orders/cancel-refund.ts:166:    status: "mock_refunded",
src/pages/shop/api/orders/cancel-refund.ts:167:    refundId: `mock_refund_${crypto.randomUUID()}`,
src/pages/shop/api/orders/cancel-refund.ts:168:    mode: "mock",
src/pages/shop/[tenant]/product/[id].astro:160:                商品画像を準備中
src/pages/shop/api/products/ai-generate.ts:45:    source: "mock",
src/pages/shop/api/products/process-image.ts:15:  const imageKey = textValue(body.imageKey, "imageKey", { maxLength: 260 }) || `mock-upload/${sanitizeFileName(imageName)}`;
src/pages/shop/api/products/process-image.ts:22:    source: "ai-processing-mock",
