# Arrivio

**Airport Transfer • Car Rental • Nearby Hotels • Flight Requests**

Arrivio, havalimanına gelen yolcular için TR/EN destekli yolcu hizmet pazarıdır. İlk hedef ürün, uygulama beklemeden yayına alınacak **mobil web/PWA**, sağlayıcı paneli ve operasyonu yönetecek **admin panelidir**.

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
| Step 7 | Next | Firebase Auth + role/providerId güvenliği |

Para kazandıracak ilk sürüm için kritik hedef olan **Step 1–6** MVP seviyesinde tamamlandı. Canlıya daha güvenli çıkmak için sıradaki kritik iş Step 7'dir.

---

## Net Konumlandırma

- Yolcu Arrivio'ya ödeme yapmaz.
- Yolcu transfer, rent a car, otel veya bilet hizmetini sağlayıcı/acente üzerinden alır.
- Arrivio komisyonu iş gerçekleştiğinde **hizmet sağlayıcıdan / acenteden** alır.
- Transfer tarafında sadece belge kontrolünden geçmiş sağlayıcılar listelenir.
- Rent a car tarafında sadece yasal/kurumsal kiralama sağlayıcıları alınır.
- Otel modülü ilk aşamada canlı rezervasyon değil, **uygunluk talebi** mantığıyla çalışır.
- Bilet modülü doğrudan bilet satışı değil, **yetkili acenteye talep yönlendirme** modülüdür.
- İlk canlı ürün mobil web/PWA'dır. Play Store / App Store süreci beklenmez.
- Mobil uygulama web yayındayken paralel geliştirilir ve aynı Firebase backend'i kullanır.

---

## MVP Kararı

MVP'nin amacı mükemmel uygulama çıkarmak değil, sezonda hızlıca gerçek talep toplamaktır.

İlk MVP'de:

- Yolcu hesap açmaz.
- Yolcu form doldurur, telefon girer, sistem talep kodu üretir.
- Sağlayıcı hesabı olur ve Firebase Auth ile giriş yapar.
- Sağlayıcı sadece kendisine atanan talepleri görür.
- Sağlayıcı talebi kabul eder / reddeder ve durum günceller.
- Admin panel tüm talepleri görür ve sağlayıcıya yönlendirir.
- Admin gerektiğinde sağlayıcı adına düzeltme yapabilir.
- Uçuş kodu alanı bulunur ama Flight API entegrasyonu zorunlu değildir.
- Online ödeme yoktur.
- WhatsApp API yoktur.

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
    claude-implementation-brief.md
  README.md
  ROADMAP.md
```

**Neden tek repo?** Transfer, rent a car, otel ve bilet talepleri hem webde hem admin'de hem provider panelde hem ileride mobilde aynı veriyle çalışacak. Status değerleri, komisyon hesaplama, telefon formatlama ve talep kodu üretme gibi ortak mantık `packages/shared` üzerinden tek yerden yönetilir.

Not: `packages/ui` yolu araç filtresine takıldığı için workspace paketi `packages/ui-kit` klasöründe tutuldu. Paket adı yine `@arrivio/ui` olduğu için workspace dependency çözülür.

---

## Çalışan Route'lar

### Web

```text
/
/transfer
```

`/transfer` yolcu transfer talebi toplar. Form verisi `createTransferRequest()` üzerinden Firestore `transferRequests` koleksiyonuna yazılır.

### Admin

```text
/
/transfers
/providers
```

`/transfers` Firestore'dan son transfer taleplerini listeler ve transfer sağlayıcıya atama yapar.

`/providers` Firestore `providers` koleksiyonuna sağlayıcı oluşturur ve mevcut sağlayıcıları listeler.

### Provider

```text
/
/transfers?providerId=PROVIDER_DOC_ID
```

`/transfers?providerId=...` sadece ilgili provider'a atanmış transfer taleplerini listeler ve provider status güncellemesi yapar. Bu query parametreli yapı MVP test içindir; canlıda Firebase Auth + `users/{uid}.providerId` ile değiştirilecektir.

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

Firebase web config değerindeki `apiKey`, projede `NEXT_PUBLIC_FIREBASE_WEB_KEY` olarak kullanılır.

---

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Web | Next.js |
| Admin | Next.js |
| Provider Panel | Next.js |
| Mobil | Expo React Native |
| Backend | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Auth |
| Hosting | Vercel veya Firebase Hosting |
| Package Manager | pnpm workspace |

---

## Ana Modüller

1. **Transfer Bul** — ana gelir kaynağı.
2. **Kiralık Araç Bul** — ikinci ana gelir kaynağı.
3. **Yakındaki Oteller** — son dakika konaklama ve transfer kombinasyonu.
4. **Bilet Sor** — yetkili acenteye lead yönlendirme.
5. **Uçuş Takip** — güven/fark yaratıcı özellik, 2. faz API.
6. **QR Kaynak Takibi** — havalimanı reklam/QR performansını ölçme.
7. **Provider Panel** — sağlayıcının kendi taleplerini yönetmesi.
8. **Admin Komisyon Takibi** — gerçekleşen işlerden komisyon mutabakatı.

---

## Roller

### Yolcu

- Hesap açmaz.
- Transfer / rent a car / otel / bilet formu doldurur.
- Talep kodu alır: `TRF-1001`, `RAC-2001`, `HTL-3001`, `TKT-4001`.
- Durumunu telefon + talep kodu ile sorgular.
- Uygulamaya/web'e ücret ödemez.

### Sağlayıcı

- Transfer firması, rent a car, otel/apart veya acente olabilir.
- Firebase Auth ile giriş yapar.
- Sadece kendisine atanmış talepleri görür.
- Talebi kabul eder / reddeder.
- Status günceller.
- Fiyat ve not girer.
- Komisyonlarını görür.
- Belgelerini ve profil bilgilerini görür/günceller.

### Admin / Operasyon

- Tüm talepleri görür.
- Sağlayıcı oluşturur ve kullanıcı daveti verir.
- Sağlayıcı atar.
- Status günceller.
- Komisyon tutarı ve komisyon durumunu takip eder.
- QR kaynak performansını izler.
- Sağlayıcı belgelerini ve notlarını yönetir.
- Gerektiğinde sağlayıcı adına düzeltme yapabilir.

---

## Talep Kodları

- `TRF-1001` -> Transfer
- `RAC-2001` -> Rent a Car
- `HTL-3001` -> Otel
- `TKT-4001` -> Bilet

Kodlar komisyon takibi, sağlayıcı mutabakatı ve yolcu durum sorgulaması için zorunludur.

---

## Provider Panel MVP

Sağlayıcı paneli sade olacak.

MVP testte:

- Provider ana ekranı var.
- Provider document id ile atanmış transferleri görebilir.
- Provider transfer status güncelleyebilir.
- Auth hardening Step 7'de yapılacaktır.

Canlı sürümde sağlayıcı sadece `assignedProviderId` kendisine eşit olan talepleri Firebase Auth + Firestore rules ile görebilir.

---

## Komisyon Mantığı

Arrivio'nun temel geliri komisyon modelidir.

- Transfer: rota bazlı sabit komisyon veya %10.
- Rent a car: toplam kiralama tutarından yüzde komisyon.
- Otel: gerçekleşen konaklamadan sabit veya yüzde komisyon.
- Bilet: acenteci ile anlaşmaya göre satış başı komisyon.

Detaylı kurallar için: [`docs/commission-rules.md`](./docs/commission-rules.md)

---

## MVP'de Olmayacaklar

- Online ödeme
- Yolcu hesabı
- Canlı otel stok entegrasyonu
- Canlı rent a car stok entegrasyonu
- WhatsApp API
- Flight API zorunluluğu
- Tüm havalimanları
- Dalaman / Antalya / İzmir genişlemesi

---

## Çalışma Sırası

1. Web + admin + provider + shared packages iskeleti. Done / Partial
2. Firebase veri modeli. Done / Partial
3. Transfer talep formu. Done
4. Transfer formu Firestore kaydı. Done
5. Admin transfer talep listesi. Done / MVP
6. Admin sağlayıcı oluşturma ve talep atama. Done / MVP
7. Provider kendi atanmış talep listesi. Done / MVP
8. Firebase Auth + role/providerId güvenliği. Next
9. Rent a car / otel / bilet formları.
10. QR kaynak takibi.
11. Komisyon takibi.
12. Marka tasarımı, logo, landing UI.
13. Mobil uygulama 2. faz.

Detaylı adımlar için: [`ROADMAP.md`](./ROADMAP.md)

Claude için tek parça teknik talimat: [`docs/claude-implementation-brief.md`](./docs/claude-implementation-brief.md)
