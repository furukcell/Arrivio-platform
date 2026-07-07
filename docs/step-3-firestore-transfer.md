# Step 3 — Firestore Transfer Write

Bu adımda web transfer formu placeholder servisten çıkarıldı ve gerçek Firestore yazma akışına bağlandı.

## Eklenenler

- `packages/firebase/src/client.ts`
- `packages/firebase/src/requests.ts` güncellendi
- `.env.example` eklendi

## Transfer Akışı

1. Yolcu `/transfer` sayfasında formu doldurur.
2. Web tarafı `createTransferRequestCode()` ile talep kodu üretir.
3. `mapTransferFormToRequest()` formu `TransferRequest` payload yapısına çevirir.
4. `createTransferRequest()` Firestore `transferRequests` koleksiyonuna kayıt atar.
5. Kayıt `createdAt` ve `updatedAt` timestamp alanlarıyla oluşur.

## Gerekli Env Alanları

```text
NEXT_PUBLIC_FIREBASE_WEB_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Not: Firebase web key public config olduğu için client tarafında kullanılır. Gerçek değerler `.env.local` içine yazılmalı, repoya commit edilmemelidir.
