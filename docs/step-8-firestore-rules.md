# Step 8 — Firestore Rules

Bu adımda root dizine `firestore.rules` dosyası eklendi.

## Amaç

Canlıya çıkmadan önce Firestore tarafında şu kapılar kapanmalıdır:

- Yolcu sadece transfer talebi oluşturabilir.
- Yolcu içerideki talepleri okuyamaz.
- Admin tüm operasyon koleksiyonlarını yönetebilir.
- Provider sadece kendi `providerId` değerine atanmış transfer taleplerini okuyabilir.
- Provider sadece izin verilen transfer status değerlerini güncelleyebilir.
- Başka provider'ın müşterisini göremez.

## Firebase Console'a Koyma

1. Firebase Console aç.
2. Firestore Database bölümüne gir.
3. Rules sekmesini aç.
4. Repo içindeki `firestore.rules` dosyasının içeriğini kopyala.
5. Rules alanına yapıştır.
6. Publish de.

## İlk Admin Kullanıcısı

Rules aktifken `users/{uid}` içine ilk admin profilini manuel oluşturmak gerekir.

Beklenen admin profili:

```text
uid: AUTH_UID
role: admin
email: admin@example.com
displayName: Admin
```

Provider profili:

```text
uid: AUTH_UID
role: provider
providerId: PROVIDER_DOC_ID
email: provider@example.com
displayName: Provider Name
```

## Not

`firestore.rules` canlıya konmadan önce lokal test veya staging Firebase projesinde denenmelidir.
