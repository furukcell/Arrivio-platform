# Step 7 — Auth and Provider Security

Bu adımda provider panelde providerId bilgisinin URL'den değil Firebase Auth oturumundan ve `users/{uid}` profilinden okunması için temel yapı eklendi.

## Eklenenler

- `packages/firebase/src/client.ts` içinde Auth client export'u
- `packages/firebase/src/auth.ts`
- `packages/firebase/src/users.ts`
- `apps/provider/pages/login.tsx`
- `apps/provider/src/providerSessionModel.ts`
- `apps/provider/pages/transfers.tsx` Auth profile okuyacak şekilde güncellendi

## Provider Akışı

1. Provider `/login` ekranında email/password ile giriş yapar.
2. Firebase Auth current user alınır.
3. `users/{uid}` Firestore dokümanı okunur.
4. Kullanıcı profili provider role ise `providerId` alınır.
5. `/transfers` sadece `assignedProviderId == providerId` olan transferleri çeker.
6. Provider transfer status güncelleyebilir.

## users/{uid} Beklenen Şema

```text
uid: string
role: provider
providerId: string
email: string
displayName?: string
```

Admin için:

```text
uid: string
role: admin
email: string
displayName?: string
```

## Canlıya Çıkmadan Önce

- Firestore Security Rules yazılmalı.
- Admin role kontrolü admin paneline de bağlanmalı.
- Provider query fallback tamamen kaldırılmalı.
- Admin sağlayıcıya kullanıcı daveti veya manuel uid bağlama ekranı eklenmeli.
