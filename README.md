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
| Step 5 | Done / MVP | Admin provider oluşturma ve transfer atama: `apps/admin/pages/providers.tsx` + `/transfers` |
| Step 6 | Done / MVP | Provider kendi atanmış transferlerini görür ve status günceller: `apps/provider/pages/transfers.tsx` |
| Step 7 | Done / Partial | Provider login, Auth profile ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Next | Firestore rules, admin guard ve provider query fallback kaldırma. |

Para kazandıracak ilk sürüm için kritik hedef olan Step 1–6 MVP seviyesinde tamamlandı. Step 7 ile provider tarafı Auth mimarisine bağlandı.

---

## Net Konumlandırma

- Yolcu Arrivio'ya ödeme yapmaz.
- Yolcu transfer, rent a car, otel veya bilet hizmetini sağlayıcı/acente üzerinden alır.
- Arrivio komisyonu iş gerçekleştiğinde hizmet sağlayıcıdan veya acenteden alır.
- Transfer tarafında sadece belge kontrolünden geçmiş sağlayıcılar listelenir.
- İlk canlı ürün mobil web/PWA'dır. Play Store / App Store süreci beklenmez.
- Online ödeme, WhatsApp API ve Flight API ilk MVP'de yoktur.

---

## Repo Yapısı

```text
arrivio-platform/
  apps/
    web/        -> Next.js mobil web / PWA / landing / QR sayfaları
    admin/      -> Next.js admin panel
    provider/   -> Next.js sağlayıcı paneli
    mobile/     -> Expo React Native mobil uygulama (2. faz)
  packages/
    shared/     -> type'lar, status listeleri, sabitler, yardımcı fonksiyonlar
    firebase/   -> firebase client, firestore servisleri, auth servisleri
    ui-kit/     -> package name: @arrivio/ui, ortak renk/token yapısı
  docs/
    provider-login-flow.md
    step-3-firestore-transfer.md
    step-5-admin-provider-assignment.md
    step-6-provider-assigned-transfers.md
    step-7-auth-provider-security.md
    claude-implementation-brief.md
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
```

`/transfer` yolcu transfer talebi toplar. Form verisi Firestore `transferRequests` koleksiyonuna yazılır.

### Admin

```text
/
/transfers
/providers
```

`/transfers` Firestore'dan transfer taleplerini listeler ve transfer sağlayıcıya atama yapar.

`/providers` Firestore `providers` koleksiyonuna sağlayıcı oluşturur ve mevcut sağlayıcıları listeler.

### Provider

```text
/
/login
/transfers
/transfers?providerId=PROVIDER_DOC_ID
```

`/login` provider email/password girişi yapar.

`/transfers` Firebase Auth current user üzerinden `users/{uid}` profilini okur, `providerId` değerini bulur ve sadece o provider'a atanmış transferleri listeler.

`/transfers?providerId=...` query fallback sadece lokal MVP test içindir. Canlıya çıkmadan önce kaldırılmalıdır.

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
9. Firestore rules + admin guard + query fallback kaldırma. Next
10. Rent a car / otel / bilet formları.
11. QR kaynak takibi.
12. Komisyon takibi.
13. Marka tasarımı, logo, landing UI.
14. Mobil uygulama 2. faz.

Detaylı adımlar için: [`ROADMAP.md`](./ROADMAP.md)
