**Blockers (strict review - do not approve):**

1. **Table overflow + mobile/tablet/desktop layout failures (critical, across multiple components)**:  
   - `ShopRecentOrders.tsx`: `<Table className="min-w-[980px]">` inside `<div className="overflow-hidden ...">`. No `overflow-x-auto` wrapper.  
   - `ProductsTable.tsx`: `min-w-[1040px]`.  
   - `CustomersTable.tsx`: `min-w-[900px]`.  
   - `InventoryTable.tsx`: `min-w-[860px]`.  
   - `ShopCategoryManager.tsx`: `min-w-[920px]`.  
   These fixed min-widths + `overflow-hidden` (or no scroll container) cause horizontal clipping/forced scroll on mobile (<768px) and tablet. Product list, order list, customer, inventory, and category views all break responsive requirements. Desktop (xl+) is acceptable but the pattern violates the explicit "table overflow" + "layout on mobile/tablet/desktop" criteria. All list views need consistent `<div className="overflow-x-auto">` + responsive column hiding or fluid widths.

2. **Order cancellation/refund dialog UX broken from list view**:  
   In `ShopRecentOrders.tsx` dropdown:  
   ```tsx
   <DropdownMenuItem className="text-red-700 focus:text-red-700">キャンセルする</DropdownMenuItem>
   ```  
   Zero `onClick`, no handler, no navigation to detail or dialog. The title even advertises "発送情報の入力・印刷・キャンセル" but cancel is dead. `ShopOrderDetailPage.tsx` dialog itself is reasonably structured (warning box, sm:max-w-lg, status grid, reason textarea, loading execute button, inventory restore feedback), but the end-to-end flow from list is non-functional. This is a direct blocker for "order cancellation/refund dialog UX".

3. **ShopSettingsPanel.tsx incomplete/truncated + missing SNS/LINE implementation**:  
   - References undefined components: `SocialLineOperationsCard`, `EmailNotificationHistory`, `ControlledInput`, `Loader2Icon` (import only has `Loader2`).  
   - `OmnichannelAutomationCard` is cut off mid-function (`await f`).  
   - Integrations tab exists structurally but the actual SNS/LINE advanced settings UI + posted URL history (types show `postedUrl`, `SocialPostHistory`, etc.) are not implemented/reviewable in the provided code.  
   This directly blocks review of "SNS/LINE advanced settings and posted URL history". API smoke tests are irrelevant if the consuming UI is broken/missing. (Also affects settings layout consistency on mobile/desktop.)

4. **Terminology + related consistency (minor but strict)**:  
   No `カテゴリー` instances found (matches rg validation). `ShopCategoryManager.tsx` correctly uses `カテゴリ` (title, labels, toasts, etc.). However, `ProductsTable.tsx` uses `分類` for the category column + "店内の分類名" in the category manager. This is not a hard violation of the "カテゴリ not カテゴリー" rule but creates inconsistent Japanese terminology for category-related features. Recommend standardizing to `カテゴリ` where it refers to the managed entity.

**Other strict observations (not blockers but must be fixed before approval):**
- Card spacing is mostly consistent (px-4 py-3 headers, gap-3 grids, shadow-none vs shadow-sm mix) but varies slightly between order detail (tight), category manager, and settings. Add a shared pattern or audit for mobile padding.
- `ShopOrderDetailPage.tsx` layout is good (flex-wrap top bar, xl grid, stacked billing/shipping on smaller screens). Cancel dialog UX inside the detail page is acceptable.
- No other `カテゴリー` slips in provided files.
- Known validations (build, astro, API smoke, 409 conflict) are noted but do not override the above UI/UX issues.

**Recommendation**: Fix the table wrappers + overflow, wire the cancel menu item (or remove it), complete the SNS/LINE cards + history UI in settings (with posted URLs visible), and standardize terminology. Re-submit for re-review. Do not approve in current state.
