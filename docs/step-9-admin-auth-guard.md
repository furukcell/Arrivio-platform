# Step 9 — Admin Auth Guard

Bu adımda admin panel Firebase Auth ve `users/{uid}.role` kontrolüne bağlandı.

## Eklenenler

- `apps/admin/pages/login.tsx`
- `apps/admin/pages/transfers.tsx` admin guard ile güncellendi
- `apps/admin/pages/providers.tsx` admin guard ile güncellendi

## Admin Akışı

1. Admin `/login` ekranında email/password ile giriş yapar.
2. Firebase Auth current user alınır.
3. Firestore `users/{uid}` dokümanı okunur.
4. `role == admin` ise admin ekranları veriyi çeker.
5. Admin değilse `/transfers` ve `/providers` ekranları veri göstermez ve işlem yaptırmaz.

## İlk Admin Profili

Firebase Auth'ta admin kullanıcısı oluşturulduktan sonra Firestore içinde şu doküman manuel oluşturulmalıdır:

```text
collection: users
document id: AUTH_UID
uid: AUTH_UID
role: admin
email: admin@example.com
displayName: Admin
```

## Not

Firestore rules canlıya alınmadan önce ilk admin profili oluşturulmalıdır. Aksi halde admin panel veri okuyamaz.
