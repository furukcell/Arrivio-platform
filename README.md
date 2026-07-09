# Arrivio

**Airport Transfer • Car Rental • Nearby Hotels • Ticket Requests • Provider Price Marketplace**

Arrivio, havalimanına gelen veya havalimanına gidecek yolcular için TR/EN destekli yolcu hizmet pazarıdır. İlk ürün mobil web/PWA'dır; yolcu uygulama indirmeden transfer, araç kiralama, otel ve bilet talebi bırakır. Operasyon admin panelden yönetilir; transferci, rent a car firması, otel/apart ve acenta gibi hizmet verenler provider panelden kendi fiyatlarını ve işlerini yönetir.

İlk pazar: **Milas-Bodrum Havalimanı (BJV)**

---

## Güncel MVP Durumu

| Step | Durum | Repo karşılığı |
|---|---|---|
| Step 1 | Done / Partial | Monorepo iskeleti oluşturuldu. |
| Step 2 | Done | Web transfer formu: `apps/web/pages/transfer.tsx` |
| Step 3 | Done | Firestore request servisleri: `packages/firebase/src/requests.ts` |
| Step 4 | Done / MVP | Admin transfer listesi: `apps/admin/pages/transfers.tsx` |
| Step 5 | Done / MVP | Admin provider oluşturma ve transfer atama eklendi. |
| Step 6 | Done / MVP | Provider kendi atanmış transferlerini görür ve status günceller. |
| Step 7 | Done / MVP | Provider login ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Done | Firestore rules public/admin/provider/fiyat akışına göre güncellendi. |
| Step 9 | Done / Partial | Admin login ve admin guard eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı ve provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi. |
| Step 12 | Done / MVP | QR source ve QR event takibi eklendi. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listeleme eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listeleme eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listeleme eklendi. |
| Step 16 | Done / MVP | Admin lead status update eklendi. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi. |
| Step 18 | Done / MVP | Ana sayfa TR/EN landing, servis sekmeleri ve WhatsApp destek eklendi. |
| Step 19 | Done / MVP | Provider WhatsApp, fiyat/not ve aktif/tamamlanan iş ayrımı eklendi. |
| Step 20 | Done / MVP | Web formları merkezi `webCopy.ts` üzerinden TR/EN metinlerle çalışır. |
| Step 21 | Done / Partial | Firebase Production, Auth, Firestore, rules ve Netlify web deploy ayarları yapıldı. |
| Step 22 | Done / MVP | Transfer/rent a car/hotel yolcu akışı seçim + tahmini min-max fiyat + uygun araç/tesis sayısı modeline çevrildi. |
| Step 23 | Done / MVP | Provider fiyat koleksiyonları eklendi: `transferRoutePrices`, `carRentalDailyPrices`, `hotelNightlyPrices`. |
| Step 24 | Done / MVP | Provider `/prices` ekranı gerçek fiyat giriş formuna çevrildi. |
| Step 25 | Current | Canlı deploy smoke test, gerçek provider fiyat girme ve yolcu min-max fiyat doğrulama. |
| Step 26 | Next Big Feature | Açık iş havuzu: providerlara iş yayma, ilk onaylayan işi alır transaction, telefon maskeleme. |
| Step 27 | Pending | Admin/provider ayrı deploy veya subdomain. |
| Step 28 | Pending | Mobil MVP. |

Mobilden önceki web/admin/provider MVP omurgası hazırlandı. Yolcu tarafı artık sadece düz form değildir; transfer, rent a car ve hotel seçimlerine göre sistem provider fiyat kayıtlarını okuyup tahmini min-max fiyat aralığı ve uygun araç/tesis sayısı gösterir. Gerçek provider fiyatı yoksa fallback/seed fiyat mantığı boş ekran oluşmasını engeller.

---

## Net Konumlandırma

- Yolcu Arrivio'ya platform ücreti ödemez.
- Yolcu transfer, rent a car, otel veya bilet hizmetini sağlayıcı/acente üzerinden alır.
- Arrivio komisyonu iş gerçekleştiğinde hizmet sağlayıcıdan veya acenteden alır.
- Provider şemsiyesi altında transferci, rent a car firması, otel/apart ve acenta bulunur.
- Yolcu tarafında firma adı gösterilmez; sadece kategori, tahmini fiyat aralığı ve uygun araç/tesis sayısı gösterilir.
- Bu model komisyon kaçırmayı azaltır ve yolcunun karar vermesini kolaylaştırır.
- İlk canlı ürün mobil web/PWA'dır. Play Store / App Store süreci beklenmez.
- Online ödeme, WhatsApp API ve Flight API ilk MVP'de yoktur.
- WhatsApp destek ve provider-yolcu geçişi normal `wa.me` linkidir; API entegrasyonu değildir.

---

## Repo Yapısı

```text
arrivio-platform/
  apps/
    web/        -> Next.js mobil web / PWA / landing / QR sayfaları
    admin/      -> Next.js admin panel
    provider/   -> Next.js sağlayıcı paneli
    mobile/     -> Expo React Native mobil uygulama placeholder
  packages/
    shared/     -> type'lar, status listeleri, sabitler, yardımcı fonksiyonlar
    firebase/   -> firebase client, firestore servisleri, auth servisleri, provider fiyat servisleri
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
    step-19-provider-panel-strengthening.md
    step-20-full-web-language-cleanup.md
    step-21-live-firebase-setup.md
  firestore.rules
  firebase.json
  netlify.toml
  README.md
  ROADMAP.md
```

---

## Çalışan Route'lar

### Web

```text
/
/partner-login
/transfer
/car-rental
/hotel
/ticket
/qr/[slug]
```

- `/` ana sayfa modern landing olarak tasarlandı; TR/EN geçişi, servis kartları, sekmeli talep paneli ve WhatsApp destek vardır.
- Sağ üstte `Hizmet Veren Girişi / Partner Login` linki bulunur.
- `/partner-login` provider ve admin giriş kapısıdır.
- `/transfer?lang=tr` veya `/transfer?lang=en` yolcu transfer talebi toplar.
- `/car-rental?lang=tr` veya `/car-rental?lang=en` araç kiralama talebi toplar.
- `/hotel?lang=tr` veya `/hotel?lang=en` otel uygunluk talebi toplar.
- `/ticket?lang=tr` veya `/ticket?lang=en` bilet talebi toplar.
- `/qr/[slug]?lang=tr` veya `/qr/[slug]?lang=en` QR source event kaydeder ve servis yönlendirme sayfası açar.

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
- `/hotel` otel uygunluk taleplerini listeler ve lead status günceller.
- `/ticket` bilet taleplerini listeler ve lead status günceller.
- `/providers` sağlayıcı oluşturma ve provider Auth UID bağlama ekranıdır.
- `/qr` QR source oluşturma ve QR event listeleme ekranıdır.

### Provider

```text
/
/login
/transfers
/prices
/profile
```

- `/login` provider email/password girişidir.
- `/` provider dashboard ekranıdır; Auth current user üzerinden `users/{uid}` profilini okur.
- `/transfers` sadece provider'a atanmış transferleri listeler.
- `/prices` provider fiyat giriş ekranıdır.
- `/profile` provider profil hazırlık ekranıdır.
- Provider transfer kartından yolcuya WhatsApp linkiyle geçebilir.
- Provider transfer kartına final fiyat ve not girebilir.

---

## Provider Fiyat Sistemi

Provider fiyat sistemi Arrivio'nun yolcu tarafındaki min-max tahmini fiyat ekranını gerçek hizmet veren verisine bağlar.

### Firestore koleksiyonları

```text
transferRoutePrices
carRentalDailyPrices
hotelNightlyPrices
```

### Transfer fiyat kaydı

```text
providerId: string
airportCode: BJV
transferDirection: from_airport | to_airport
destination: string
vehicleClass: economic | vip | minibus | luxury
price: number
currency: TRY
isActive: boolean
isVerified: boolean
```

### Rent a car fiyat kaydı

```text
providerId: string
airportCode: BJV
pickupLocation: string
carClass: economic | middle | suv | luxury
transmission: manual | automatic
dailyPrice: number
currency: TRY
airportDelivery: boolean
depositAmount?: number
isActive: boolean
isVerified: boolean
```

### Hotel fiyat kaydı

```text
providerId: string
airportCode: BJV
accommodationType: airport_hotel | bodrum_center | apart_pension | family_room | luxury_hotel
nightlyPrice: number
currency: TRY
maxGuests?: number
hasTransfer?: boolean
isActive: boolean
isVerified: boolean
```

### Yolcu tarafında hesaplama

```text
Provider fiyatları yüklenir
↓
Yolcu filtre seçer
↓
Sistem uygun aktif/doğrulanmış fiyatları bulur
↓
En düşük ve en yüksek fiyat hesaplanır
↓
Yolcuya firma adı göstermeden fiyat aralığı + uygun araç/tesis sayısı gösterilir
```

Örnek:

```text
VIP / Vito Transfer
Tahmini: 2.000 - 3.200 TL
5 uygun araç
```

```text
Ekonomik Otomatik Rent a Car
Tahmini: 950 - 1.500 TL / gün
6 uygun araç
```

```text
Bodrum Merkez Otel
Tahmini: 2.000 - 4.500 TL / gece
8 uygun tesis
```

---

## Firebase Env

Local geliştirmede ve Netlify Environment Variables içinde şu değerler gerekir:

```text
NEXT_PUBLIC_FIREBASE_WEB_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_DEFAULT_AIRPORT=BJV
NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER=
NEXT_PUBLIC_PROVIDER_URL=
NEXT_PUBLIC_ADMIN_URL=
```

`NEXT_PUBLIC_PROVIDER_URL` ve `NEXT_PUBLIC_ADMIN_URL`, `/partner-login` sayfasının provider/admin giriş linklerini ayrı deploy veya subdomain'e yönlendirmesi için kullanılır. Tek domain rewrite yapısında boş bırakılabilir.

---

## Firestore User Profile Şeması

Provider hesabı için `users/{uid}` dokümanı:

```text
uid: string
role: provider
providerId: string
providerType?: transfer | carRental | hotel | agency
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

## Firestore Rules Özeti

- Public yolcu sadece request oluşturabilir.
- Public yolcu aktif/doğrulanmış provider fiyatlarını okuyabilir.
- Provider sadece kendi `providerId` fiyatlarını oluşturabilir, okuyabilir ve düzenleyebilir.
- Provider sadece kendisine atanmış transfer request kayıtlarını okuyabilir.
- Admin tüm operasyon kayıtlarını okuyabilir ve yönetebilir.
- Telefon ve komisyon bilgileri admin/provider kurallarıyla korunur.

---

## Ana Modüller

1. Transfer Bul
2. Kiralık Araç Bul
3. Yakındaki Oteller
4. Bilet Sor
5. QR Kaynak Takibi
6. Provider Panel
7. Provider Fiyat Girişi
8. Admin Komisyon Takibi
9. WhatsApp Destek Linki
10. TR/EN Web Dil Desteği
11. Firebase Production Bağlantısı
12. Netlify Web Deploy
13. Modern Landing UI
14. Partner Login Kapısı
15. Transfer Pazaryeri / Açık İş Havuzu
16. Provider Puanlama ve Bildirim Dalgaları
17. White-label / Şablonlaştırılabilir Arayüz Potansiyeli

---

## White-label / Şablon Ürün Potansiyeli

Arrivio arayüzü ileride başka şirketlere satılabilir bir şablon ürün haline getirilebilir. Bunun için Arrivio markasına gömülü metin, renk, servis listesi, havalimanı kodu, destek numarası ve Firebase proje bağlantıları tenant/config bazlı yönetilmelidir.

Hedef yapı:

```text
Aynı kod tabanı
↓
Farklı müşteri config'i
↓
Farklı marka / renk / servis / domain
↓
Müşteriye özel web + admin + provider panel
```

Örnek kullanım alanları:

- Havalimanı transfer platformu
- Turizm acentesi talep toplama sitesi
- Rent a car bayi ağı
- Otel/apart müsaitlik pazarı
- Yerel hizmet pazaryeri
- Klinik/kuaför/rezervasyon talep pazarı

Bu modelde satılacak şey sadece tasarım değil; yolcu formu, admin panel, provider panel, fiyat aralığı mantığı, QR kaynak takibi ve komisyon takip omurgasıdır.

---

## Next Big Feature: Açık İş Havuzu ve Otomatik Eşleşme

Sıradaki büyük geliştirme Arrivio'yu min-max fiyat gösteren talep pazarından gerçek zamanlı iş dağıtım platformuna taşımaktır.

```text
Yolcu talep oluşturur
↓
Sistem uygun providerları bulur
↓
İş provider havuzuna açılır
↓
İlk onaylayan işi alır
↓
Firestore transaction ile iş kilitlenir
↓
Telefonlar iş alındıktan sonra açılır
↓
Komisyon pending olarak yazılır
```

Bu aşama yapılmadan önce canlıda en az birkaç gerçek provider fiyatı girilmeli ve yolcu tarafındaki min-max fiyatların doğru hesaplandığı smoke test edilmelidir.

---

## Çalışma Sırası

1. Web + admin + provider + shared packages iskeleti. Done / Partial
2. Firebase veri modeli. Done / Partial
3. Transfer talep formu. Done
4. Transfer formu Firestore kaydı. Done
5. Admin transfer talep listesi. Done / MVP
6. Admin sağlayıcı oluşturma ve talep atama. Done / MVP
7. Provider kendi atanmış talep listesi. Done / MVP
8. Firebase Auth + role/providerId güvenliği. Done / MVP
9. Firestore rules + admin guard + query fallback kaldırma. Done
10. QR kaynak takibi. Done / MVP
11. Komisyon takibi. Done / MVP
12. Rent a car formu. Done / MVP
13. Otel formu. Done / MVP
14. Bilet formu. Done / MVP
15. Admin lead status güncelleme. Done / MVP
16. Talep detay ekranı ve operasyon notları. Done / Partial
17. Web TR/EN + WhatsApp destek. Done / MVP
18. Provider panel güçlendirme. Done / MVP
19. Full web TR/EN language cleanup. Done / MVP
20. Firebase canlı kurulum + Netlify web deploy. Done / Partial
21. Yolcu seçim + min-max fiyat aralığı sistemi. Done / MVP
22. Provider fiyat giriş sistemi. Done / MVP
23. Partner login kapısı. Done / MVP
24. Canlı provider fiyat smoke test. Current
25. Açık iş havuzu. Next
26. İlk onaylayan işi alır transaction sistemi. Next
27. Telefon maskeleme. Next
28. Provider puanlama ve bildirim dalgaları. Next
29. White-label config mimarisi. Planned
30. Admin/provider ayrı deploy veya subdomain. Pending
31. Mobil uygulama. Pending

Detaylı adımlar için: [`ROADMAP.md`](./ROADMAP.md)
