# Step 6 — Provider Assigned Transfers

Bu adımda provider panelde kendisine atanmış transfer taleplerini görme ve status güncelleme akışı eklendi.

## Eklenenler

- `packages/firebase/src/requests.ts` içine:
  - `listTransferRequestsForProvider()`
  - `updateTransferStatus()`
- `apps/provider/src/providerTransferModel.ts`
- `apps/provider/pages/index.tsx`
- `apps/provider/pages/transfers.tsx`

## MVP Akışı

1. Admin `/providers` ekranında transfer provider oluşturur.
2. Admin `/transfers` ekranında talebi provider'a atar.
3. Transfer talebinde `assignedProviderId` alanı provider document id olur.
4. Provider panelde `/transfers?providerId=PROVIDER_DOC_ID` açılır.
5. Panel sadece `assignedProviderId == providerId` olan transfer taleplerini çeker.
6. Provider status güncelleyebilir:
   - `confirmed`
   - `passenger_waiting`
   - `passenger_picked_up`
   - `completed`
   - `cancelled`

## Auth Notu

Bu adım MVP test için query parametreli çalışır. Güvenli canlı sürümde providerId URL'den değil Firebase Auth + `users/{uid}.providerId` üzerinden alınmalıdır.
