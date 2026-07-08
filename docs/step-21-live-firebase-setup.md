# Step 21 - Live Firebase Setup

Bu adım Arrivio web, admin ve provider panellerini canlı Firebase projesine bağlamak için kullanılır.

---

## 1. Firebase Project

Firebase Console içinde yeni proje aç:

```text
Arrivio Production
```

Aktifleştirilecek servisler:

```text
Authentication
Firestore Database
Storage
```

MVP için Authentication tarafında Email/Password provider yeterlidir.

---

## 2. Web App Config

Firebase Console içinde web app oluştur ve config değerlerini al.

Netlify Environment Variables içine şu değerler girilecek:

```text
NEXT_PUBLIC_FIREBASE_WEB_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_DEFAULT_AIRPORT=BJV
NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER=
```

Kod içine gerçek Firebase key yazma. Değerler Netlify env üzerinden okunacak.

---

## 3. Firestore Rules

Repo kökünde:

```text
firestore.rules
firebase.json
```

`firebase.json` dosyası rules deploy için `firestore.rules` dosyasını gösterir.

Rules mantığı:

```text
Public user:
- transferRequests create
- carRentalRequests create
- hotelRequests create
- ticketRequests create
- qrEvents create
- qrSources read

Admin:
- users/providers/request/qr/commission/adminLogs yönetir

Provider:
- sadece kendi assignedProviderId değerine sahip transfer requestleri okur
- sadece status, providerNote, estimatedTotalPrice, updatedAt alanlarını günceller
```

---

## 4. First Admin User

Firebase Authentication içinde ilk admin email/password kullanıcısını oluştur.

Sonra Firestore `users/{uid}` dokümanı oluştur:

```text
uid: Firebase Auth UID
role: admin
email: admin email
displayName: Faruk / FK Digital Admin
```

Admin panel bu profil üzerinden role kontrolü yapar.

---

## 5. First Provider User

Önce admin panelden provider doc oluştur.

Sonra Firebase Authentication içinde provider email/password kullanıcısı oluştur.

Ardından admin panelden veya Firestore'dan `users/{providerUid}` dokümanı oluştur:

```text
uid: Firebase Auth UID
role: provider
providerId: providers koleksiyonundaki doc id
email: provider email
displayName: provider adı
```

Provider panel `users/{uid}.providerId` değerini okuyarak sadece kendi transferlerini listeler.

---

## 6. Netlify Setup

Repo kökünde `netlify.toml` vardır. Netlify site ayarında root repo bağlandığında web app build ayarı buradan okunur.

```text
Build command: pnpm --filter @arrivio/web build
Publish directory: apps/web/.next
Node: 18.18.0
PNPM: 9.0.0
```

İlk canlı deploy web app içindir. Admin ve provider ayrı subdomain/site olarak deploy edilecekse ayrıca config açılmalıdır.

Örnek:

```text
admin.arrivio...
provider.arrivio...
```

---

## 7. Smoke Test

Canlı env girildikten sonra test sırası:

```text
/ ?lang=tr
/transfer?lang=tr
/car-rental?lang=tr
/hotel?lang=tr
/ticket?lang=tr
/qr/bjv-domestic-arrivals?lang=tr
```

Her formdan test talebi at.

Firestore koleksiyonlarını kontrol et:

```text
transferRequests
carRentalRequests
hotelRequests
ticketRequests
qrEvents
```

Admin testi:

```text
/login
/transfers
/car-rental
/hotel
/ticket
/providers
/qr
```

Provider testi:

```text
/login
/transfers
```

---

## 8. Not Done Yet

Bu dosya kurulum rehberidir. Gerçek Firebase Console kurulumu, Netlify deploy ve build/typecheck sonucu ayrıca doğrulanmalıdır.
