**残存問題なし**

**理由:**

- **changeSection**: ガード条件 `hasUnsavedInventory && activeSection === "inventory" && section !== "inventory"` が正しく、confirm → (ok時) `setHasUnsavedInventory(false)` → `setActiveSection` + `pushState` の順で一貫。depsに両値が入っておりstale closureもない。

- **popstate**: 同一のガード条件で明示的に実装済み。`!ok` 時は `pushState` で現在のinventory状態を復元してreturn、ok時は `set false` の後に `setActiveSection`。depsに `[activeSection, hasUnsavedInventory]` が正しく付いており、listenerが常に最新値を閉じ込めている。URL/履歴操作も正しいキャンセルパターン。

- **InventoryTableの商品クリック**: 行の `<button onClick={() => onOpenProduct?.(item.productId)}>` → renderSection内のラッパー → shellの `openProduct` に到達。`openProduct` 側に `hasUnsavedInventory && activeSection === "inventory"` のガード（専用文言付き）+ `set false` + 遷移/push が存在し、バイパスされていない。

- **beforeunload**: InventoryTable内部で `hasUnsavedStock`（ローカルdraft vs saved比較）依存のeffectが正しくattach/remove。Tableがinventory sectionでのみマウントされるため、SPA遷移でunmount時にlistenerが確実に外れ、dispatch(false)クリーンアップも同時に走る。page離脱時のみ発火する設計として整合。

dispatch (`aiboux:unsaved-inventory`) と shellの受信effect([] deps)の連携、unmount時のfalse dispatch、openOrderがinventory文脈から呼ばれない事実も含め、指定の4経路で警告ロジックは完全に揃っている。
