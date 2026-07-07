# Arrivio

**Airport Transfer • Car Rental • Nearby Hotels • Flight Requests**

Arrivio, havalimanına gelen yolcular için TR/EN destekli yolcu hizmet pazarıdır. İlk hedef ürün, uygulama beklemeden yayına alınacak mobil web/PWA, sağlayıcı paneli ve operasyonu yönetecek admin panelidir.

İlk pazar: **Milas-Bodrum Havalimanı (BJV)**

---

## Güncel MVP Durumu

| Step | Durum | Repo karşılığı |
|---|---|---|
| Step 1 | Done / Partial | Monorepo iskeleti oluşturuldu. |
| Step 2 | Done | Web transfer formu: `apps/web/pages/transfer.tsx` |
| Step 3 | Done | Firestore transfer kayıt servisi: `packages/firebase/src/requests.ts` |
| Step 4 | Done / MVP | Admin transfer listesi: `apps/admin/pages/transfers.tsx` |
| Step 5 | Done / MVP | Admin provider oluşturma ve transfer atama eklendi. |
| Step 6 | Done / MVP | Provider kendi atanmış transferlerini görür ve status günceller. |
| Step 7 | Done / Partial | Provider login ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Done / Draft | Firestore rules draft repoya eklendi. |
| Step 9 | Done / Partial | Admin login ve admin guard eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı ve provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi. |
| Step 12 | Done / MVP | QR source ve QR event takibi eklendi. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listeleme eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listeleme eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listeleme eklendi. |
| Step 16 | Done / MVP | Admin lead status update eklendi: rent a car, hotel ve ticket listelerinden status değiştirilebilir. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi. |
| Step 18 | Done / Partial | Ana sayfada TR/EN başlangıcı ve formlarda WhatsApp destek eklendi. |
| Step 19 | Next | Provider panel güçlendirme. |

Mobilden önceki web/admin MVP omurgası tamamlandı: transfer, rent a car, otel ve bilet talebi toplanabiliyor; admin panel bu talepleri görebiliyor, status güncelleyebiliyor ve temel detay/operasyon notu akışı başladı.

---

## Net Konumlandırma

- Yolcu Arrivio'ya ödeme yapmaz.
- Yolcu transfer, rent a car, otel veya bilet hizmetini sağlayıcı/acente üzerinden alır.
- Arrivio komisyonu iş gerçekleştiğinde hizmet sağlayıcıdan veya acenteden alır.
- Transfer tarafında sadece belge kontrolünden geçmiş sağlayıcılar listelenir.
- İlk canlı ürün mobil web/PWA'dır. Play Store / App Store süreci beklenmez.
- Online ödeme, WhatsApp API ve Flight API ilk MVP'de yoktur.
- WhatsApp destek sadece normal `wa.me` linkidir; API entegrasyonu değildir.

---

## Repo Yapısı

```text
arrivio-platform/
  apps/
    web/        -> Next.js mobil web / PWA / landing / QR sayfaları
    admin/      -> Next.js admin panel
    provider/   -> Next.js sağlayıcı paneli
    mobile/     -> Expo React Native mobil uygulama
  packages/
    shared/     -> type'lar, status listeleri, sabitler, yardımcı fonksiyonlar
    firebase/   -> firebase client, firestore servisleri, auth servisleri
    ui-kit/     -> package name: @arrivio/ui, ortak renk/token yapısı
  docs/
    step-3-firestore-transfer.md
    step-5-admin-provider-assignment.md
    step-6-provider-assigned-transfers.md
    step-7-auth-provider-security.md
    step-8-firestore-rules.md
    step-9-admin-auth-guard.md
    step-10-provider-user-linking.md
    step-11-commission-tracking.md
    step-12-qr-tracking.md
    step-13-car-rental-form.md
    step-14-hotel-request-form.md
    step-15-ticket-request-form.md
    step-17-request-detail-screens.md
    step-18-web-language-support.md
  README.md
  ROADMAP.md
```

Not: `packages/ui` yolu araç filtresine takıldığı için workspace paketi `packages/ui-kit` klasöründe tutuldu. Paket adı yine `@arrivio/ui` olduğu için workspace dependency çözülür.

---

## Çalışan Route'lar

### Web

```text
/
/transfer
/car-rental
/hotel
/ticket
/qr/[slug]
```

- `/` ana sayfada servis aksiyonları, TR/EN başlangıç linkleri ve WhatsApp destek vardır.
- `/transfer` yolcu transfer talebi toplar ve WhatsApp destek gösterir.
- `/car-rental` yolcu araç kiralama talebi toplar ve WhatsApp destek gösterir.
- `/hotel` yolcu otel uygunluk talebi toplar ve WhatsApp destek gösterir.
- `/ticket` yolcu bilet talebi toplar ve WhatsApp destek gösterir.
- `/qr/[slug]` QR source event kaydeder ve yolcuyu talep akışına taşır.

### Admin

```text
/
/login
/transfers
/transfers/[id]
/car-rental
/car-rental/[id]
/hotel
/hotel/[id]
/ticket
/providers
/qr
```

- `/login` admin email/password girişidir.
- `/transfers` transfer taleplerini listeler, provider atama ve komisyon takibi yapar.
- `/transfers/[id]` transfer detay, komisyon ve admin operasyon notu ekranıdır.
- `/car-rental` araç kiralama taleplerini listeler ve lead status günceller.
- `/car-rental/[id]` araç kiralama detay ve admin operasyon notu ekranıdır.
- `/hotel` otel uygunluk taleplerini listeler ve lead status günceller.
- `/hotel/[id]` otel detay ve admin operasyon notu ekranıdır.
- `/ticket` bilet taleplerini listeler ve lead status günceller.
- `/providers` sağlayıcı oluşturma ve provider Auth UID bağlama ekranıdır.
- `/qr` QR source oluşturma ve QR event listeleme ekranıdır.

### Provider

```text
/
/login
/transfers
```

- `/login` provider email/password girişidir.
- `/transfers` Firebase Auth current user üzerinden `users/{uid}` profilini okur, `providerId` değerini bulur ve sadece o provider'a atanmış transferleri listeler.

---

## Firebase Env

Local geliştirmede `.env.local` içine şu değerler gerekir:

```text
NEXT_PUBLIC_FIREBASE_WEB_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER=
```

---

## Firestore User Profile Şeması

Provider hesabı için `users/{uid}` dokümanı:

```text
uid: string
role: provider
providerId: string
email: string
displayName?: string
```

Admin hesabı için:

```text
uid: string
role: admin
email: string
displayName?: string
```

---

## Ana Modüller

1. Transfer Bul
2. Kiralık Araç Bul
3. Yakındaki Oteller
4. Bilet Sor
5. Uçuş Takip
6. QR Kaynak Takibi
7. Provider Panel
8. Admin Komisyon Takibi
9. WhatsApp Destek Linki

---

## Çalışma Sırası

1. Web + admin + provider + shared packages iskeleti. Done / Partial
2. Firebase veri modeli. Done / Partial
3. Transfer talep formu. Done
4. Transfer formu Firestore kaydı. Done
5. Admin transfer talep listesi. Done / MVP
6. Admin sağlayıcı oluşturma ve talep atama. Done / MVP
7. Provider kendi atanmış talep listesi. Done / MVP
8. Firebase Auth + role/providerId güvenliği. Done / Partial
9. Firestore rules + admin guard + query fallback kaldırma. Done / Draft
10. QR kaynak takibi. Done / MVP
11. Komisyon takibi. Done / MVP
12. Rent a car formu. Done / MVP
13. Otel formu. Done / MVP
14. Bilet formu. Done / MVP
15. Admin lead status güncelleme. Done / MVP
16. Talep detay ekranı ve operasyon notları. Done / Partial
17. Web TR/EN + WhatsApp destek. Done / Partial
18. Provider panel güçlendirme. Next
19. Mobil uygulama. Pending

Detaylı adımlar için: [`ROADMAP.md`](./ROADMAP.md)
