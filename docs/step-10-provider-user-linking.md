# Step 10 — Provider User Linking

Bu adımda provider paneldeki geçici query fallback kaldırıldı ve admin panelden provider kullanıcı bağlama akışı eklendi.

## Eklenenler

- `apps/provider/pages/transfers.tsx` artık `providerId` query parametresi kabul etmez.
- Provider sadece Firebase Auth oturumu ve `users/{uid}.providerId` üzerinden kendi transferlerini görür.
- `apps/admin/pages/providers.tsx` içine provider kartlarında Auth UID bağlama alanı eklendi.
- Admin `upsertAppUser()` ile `users/{uid}` dokümanı oluşturur/günceller.

## Provider Login Akışı

1. Firebase Auth içinde provider email/password kullanıcısı oluşturulur.
2. Admin `/providers` ekranında ilgili provider kartına gider.
3. Firebase Auth UID alanına kullanıcının UID değeri yazılır.
4. Link Auth User butonuna basılır.
5. Firestore `users/{uid}` dokümanı şu hale gelir:

```text
uid: AUTH_UID
role: provider
providerId: PROVIDER_DOC_ID
email: provider@example.com
displayName: Provider Name
```

6. Provider `/login` ile giriş yapar.
7. Provider `/transfers` açar.
8. Sistem `users/{uid}.providerId` ile sadece kendisine atanmış transferleri listeler.

## Canlı Güvenlik Notu

`firestore.rules` canlıya alındığında provider artık başka provider'ın transferlerini okuyamaz. Query fallback kaldırıldığı için URL'den providerId denemesi işe yaramaz.
