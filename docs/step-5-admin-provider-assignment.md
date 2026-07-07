# Step 5 — Admin Provider Creation and Transfer Assignment

Bu adımda admin panelde sağlayıcı oluşturma ve transfer talebini sağlayıcıya atama akışı eklendi.

## Eklenenler

- `packages/firebase/src/providers.ts`
- `packages/firebase/src/requests.ts` içinde `assignTransferProvider()`
- `apps/admin/pages/providers.tsx`
- `apps/admin/src/providerAdminModel.ts`
- `apps/admin/pages/transfers.tsx` içine provider select ve assignment butonu

## Akış

1. Admin `/providers` ekranında sağlayıcı oluşturur.
2. Oluşturulan sağlayıcı Firestore `providers` koleksiyonuna yazılır.
3. Admin `/transfers` ekranında transfer talebini görür.
4. Admin aktif transfer provider seçer.
5. `assignTransferProvider()` transfer talebine şu alanları yazar:
   - `assignedProviderId`
   - `providerName`
   - `status = provider_pending`
   - `updatedAt`

## Notlar

Bu adımda henüz Provider Auth yapılmadı. Sağlayıcı hesabıyla login olup kendisine atanmış talepleri görme işi Step 6'dır.
