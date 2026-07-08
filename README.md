# Arrivio

**Airport Transfer • Car Rental • Nearby Hotels • Flight Requests**

Arrivio, havalimanına gelen yolcular için TR/EN destekli yolcu hizmet pazarıdır. İlk hedef ürün mobil web/PWA'dır; yolcu uygulama indirmeden transfer, araç kiralama, otel ve bilet talebi bırakır. Operasyon admin panelden yönetilir, transfer sağlayıcıları ise provider panelden kendilerine atanmış işleri takip eder.

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
| Step 8 | Done | Firestore rules canlı public/admin/provider akışına göre güncellendi. |
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
| Step 19 | Done / MVP | Provider WhatsApp, fiyat/not ve aktif/tamamlanan iş ayrımı eklendi. |
| Step 20 | Done / MVP | Web formları merkezi `webCopy.ts` üzerinden tam TR/EN metin, hata, başarı ve talep kodu mesajlarıyla genişletildi. |
| Step 21 | Done / Partial | Firebase Production projesi açıldı, Auth/Firestore/rules/admin user hazırlandı, Netlify web deploy ayarı yapıldı ve web canlı deploy alındı. |
| Step 22 | Current | Canlı web UI iyileştirme, landing component mimarisi ve gerçek talep smoke test. |
| Step 23 | Next Big Feature | Transfer pazaryeri: açık iş havuzu, puan bazlı bildirim dalgaları, ilk onaylayan işi alır. |
| Step 24 | Pending | Admin/provider ayrı deploy veya subdomain. |
| Step 25 | Pending | Mobil MVP. |

Mobilden önceki web/admin/provider MVP omurgası tamamlandı. Web formları TR/EN destekli çalışır; Türkçe karakterli metinler merkezi `apps/web/src/webCopy.ts` dosyasından yönetilir; transfer, rent a car, otel ve bilet talebi toplanabilir; admin panel talepleri yönetir; provider kendi işlerinde müşteriye WhatsApp'tan geçebilir ve fiyat/not girebilir.

Canlı bağlantı tarafında Firebase Production projesi oluşturuldu. Firestore ve Email/Password Auth aktif edildi. İlk admin `users/{uid}` dokümanı oluşturuldu. Firestore rules Console'a yayınlandı. Netlify web deploy tamamlandı. İlk canlı görünüm sonrası web ana sayfası modern landing mantığına taşındı ve componentlere bölündü.

---

## Net Konumlandırma

- Yolcu Arrivio'ya ödeme yapmaz.
- Yolcu transfer, rent a car, otel veya bilet hizmetini sağlayıcı/acente üzerinden alır.
- Arrivio komisyonu iş gerçekleştiğinde hizmet sağlayıcıdan veya acenteden alır.
- Transfer tarafında sadece belge kontrolünden geçmiş sağlayıcılarla çalışılması hedeflenir.
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

## Canlı Web / Netlify

Netlify root config:

```text
Build command: pnpm --filter @arrivio/web build
Publish directory: apps/web/.next
```

`netlify.toml` içinde Next.js plugin, Node/PNPM versiyonları ve public Firebase web key için Netlify secret scan istisnası bulunur.

```text
SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_FIREBASE_WEB_KEY"
```

Bu key frontend'de görünmesi beklenen Firebase Web API key'dir. Güvenlik Firestore rules ile sağlanır.

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

- `/` ana sayfa modern landing olarak tasarlandı; TR/EN geçişi, servis kartları, sekmeli talep paneli ve WhatsApp destek vardır.
- `/transfer?lang=tr` veya `/transfer?lang=en` yolcu transfer talebi toplar.
- `/car-rental?lang=tr` veya `/car-rental?lang=en` araç kiralama talebi toplar.
- `/hotel?lang=tr` veya `/hotel?lang=en` otel uygunluk talebi toplar.
- `/ticket?lang=tr` veya `/ticket?lang=en` bilet talebi toplar.
- `/qr/[slug]?lang=tr` veya `/qr/[slug]?lang=en` QR source event kaydeder ve seçili dili transfer formuna taşır.

### Web Landing Yapısı

- `apps/web/pages/index.tsx` ana sayfa state ve Firebase submit akışını yönetir.
- `apps/web/src/landingContent.ts` Türkçe/İngilizce landing metinlerini ve landing tiplerini içerir.
- `apps/web/src/components/LandingNav.tsx` üst bant ve menüyü yönetir.
- `apps/web/src/components/LandingHero.tsx` hero ve sağ mockup alanını yönetir.
- `apps/web/src/components/RequestPanel.tsx` sekmeli transfer/araç/otel/bilet talep panelini yönetir.
- `apps/web/src/components/MarketingSections.tsx` modül, avantaj, süreç ve gelir modeli bölümlerini yönetir.
- `apps/web/src/components/LandingFooter.tsx` footer alanını yönetir.
- `apps/web/src/styles/landingAtmosphere.css` ana landing CSS dosyasıdır.
- `apps/web/src/styles/landingTurquoiseCards.css` turkuaz kart/section görsel iyileştirmelerini içerir.

### Web Dil Sistemi

- `apps/web/src/webCopy.ts` dosyası Türkçe/İngilizce görünür metinlerin merkezidir.
- `apps/web/src/supportModel.ts` dosyası `getLanguage()`, WhatsApp destek linki ve validasyon mesajı çeviri helperlarını içerir.
- Formlar `?lang=tr` veya `?lang=en` değerini okur.
- Form gönderildiğinde Firestore payload içindeki `language` alanı seçili dile göre yazılır.
- QR landing sayfası `lang` bilgisini `/transfer` formuna taşır.

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
- `/transfers` içinde aktif işler ve tamamlanan işler ayrı gösterilir.
- Provider transfer kartından yolcuya WhatsApp linkiyle geçebilir.
- Provider transfer kartına fiyat ve not girebilir.

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
10. TR/EN Web Dil Desteği
11. Firebase Production Bağlantısı
12. Netlify Web Deploy
13. Modern Landing UI
14. Transfer Pazaryeri / Açık İş Havuzu
15. Provider Puanlama ve Bildirim Dalgaları

---

## Next Big Feature: Transfer Pazaryeri ve Otomatik Eşleşme

Bu bölüm Arrivio'nun form sitesi olmaktan çıkıp gerçek bir havalimanı transfer pazaryerine dönüşmesi için yapılacak ana geliştirmedir.

### Temel fikir

```text
Yolcu transfer isteği oluşturur
↓
Sistem uygun sağlayıcı/şoförleri bulur
↓
İş önce en yüksek puanlı gruba bildirilir
↓
İlk onaylayan işi alır
↓
İş transaction ile o sağlayıcıya kilitlenir
↓
Yolcu ve sağlayıcı telefonları açılır
↓
Komisyon pending olarak yazılır
↓
İş tamamlanınca komisyon kesinleşir
```

### Anlık transfer ve rezervasyon

Sistem sadece o an havalimanında olan yolcu için değil, önceden rezervasyon için de çalışmalıdır.

```text
Anlık transfer:
Bugün / birkaç saat içinde BJV çıkışlı transfer.

Rezervasyon:
Yolcu İstanbul'dayken 2 gün sonraki Bodrum uçuşu için transfer ayarlayabilir.
```

Her iki durumda da iş sağlayıcı havuzuna düşer. Yolcu uçuş tarihi, uçuş saati, uçuş kodu, rota, kişi sayısı ve araç tipi seçer.

### Form yerine seçim odaklı akış

İlk ekran uzun form olmamalı. Önce seçim yaptırılmalı:

```text
Nereye gidiyorsun?
Ne zaman?
Kaç kişi?
Araç tipi ne?
```

Sonra sistem tahmini fiyat/araç kartı gösterir. Yolcu kartı seçince sadece son adımda şu bilgiler alınır:

```text
Ad soyad
Telefon
Uçuş kodu / geliş saati
```

### Provider/şoför bildirim dalgaları

Sistemde 100 şoför/sağlayıcı varsa iş herkese aynı anda gitmemeli. Önce en güvenilir ve yüksek puanlılara gitmeli.

Örnek dalga modeli:

```text
0. dakika:
En yüksek puanlı ilk 10 sağlayıcıya bildirim gider.

5. dakika:
İş alınmadıysa sonraki 40 sağlayıcıya açılır.

10. dakika:
Hâlâ alınmadıysa kalan 50 sağlayıcıya açılır.
```

Bu model kaliteli sağlayıcıları ödüllendirir. İşi sürekli alan, iptal etmeyen ve müşteriyi mağdur etmeyen sağlayıcılar yeni işleri önce görür.

### İlk onaylayan işi alır

İş açıkken birden fazla sağlayıcı görebilir ama sadece ilk onaylayan işi almalıdır.

Teknik kural:

```text
Provider "İşi Al" butonuna basar
↓
Firestore transaction çalışır
↓
Sistem request status hâlâ open mı kontrol eder
↓
Open ise provider atanır ve iş kilitlenir
↓
Open değilse "Bu iş başka sağlayıcı tarafından alındı" döner
```

Bu akış race condition riskini azaltır. Normal update ile yapılmamalı; transaction kullanılmalıdır.

### Telefon gizleme kuralı

Yolcu telefonu iş alınmadan görünmemelidir.

```text
İş açıkken:
+90 5xx *** ** 42

İş alındıktan sonra:
+90 5xx xxx xx xx
```

Bu kural sistemi bypass etmeyi azaltır. Sağlayıcı işi almadan yolcuyla doğrudan bağlantı kuramaz.

### Komisyon kuralı

İş alındığı anda komisyon pending oluşmalıdır.

```text
Transfer fiyatı: 2.700 TL
Komisyon oranı: %15
Arrivio komisyonu: 405 TL
Durum: pending
```

İş tamamlanınca komisyon kesinleşir. İş iptal edilirse iptal hakkı ve admin inceleme kuralları devreye girer.

### İptal hakkı ve kötüye kullanım önleme

Sağlayıcı işi alıp sonra sürekli "anlaşamadım" diyememelidir.

Önerilen kural:

```text
Her sağlayıcıya ayda 1 ücretsiz iptal hakkı verilir.
```

Ayda 1 hakkını kullandıktan sonra tekrar işi alıp bırakırsa:

```text
Öncelik puanı düşer
Yeni işleri daha geç görür
Admin incelemesine düşer
Gerekirse komisyon borcu kalır veya ceza uygulanır
```

Gerçek istisnalar için admin müdahalesi gerekir:

```text
Yolcu yanlış numara yazdı
Uçuş iptal oldu
Yolcu cevap vermedi
Mücbir sebep oluştu
```

### Provider puanlama sistemi

Her provider/şoför 100 puanla başlar. Sistem bu puana göre bildirim sırasını belirler.

Önerilen puanlama:

```text
Başlangıç puanı: 100
İşi tamamladı: +2
Hızlı dönüş yaptı: +1
Yolcu memnuniyeti yüksek: +3
İşi alıp iptal etti: -10
Yolcu şikâyeti: -20
Admin güven düşürdü: manuel eksi puan
```

Bu puan sadece görünür yıldız değildir; operasyon sıralamasını belirleyen gerçek algoritma olmalıdır.

### Gerekli veri modeli genişletmeleri

Provider dokümanına eklenecek alanlar:

```text
serviceAreas: string[]
vehicleTypes: string[]
whatsappPhone: string
commissionRate: number
score: number
monthlyCancelAllowance: number
lastCancelAllowanceMonth: string
isActive: boolean
isVerified: boolean
priorityGroup?: number
```

Transfer request dokümanına eklenecek alanlar:

```text
routeFrom: string
routeTo: string
vehicleType: string
pickupDate: string
pickupTime: string
flightCode?: string
estimatedPrice: number
broadcastStatus: open | accepted | expired | cancelled
broadcastWave: 1 | 2 | 3
broadcastOpenedAt: timestamp
nextWaveAt: timestamp
acceptedProviderId?: string
acceptedAt?: timestamp
commissionRate: number
commissionAmount: number
commissionStatus: pending | invoiced | paid | cancelled
```

Broadcast event dokümanı:

```text
requestId: string
providerId: string
wave: number
sentAt: timestamp
seenAt?: timestamp
acceptedAt?: timestamp
status: sent | seen | accepted | missed | expired
```

### MVP yapım sırası

```text
1. Transfer talebine rota, tarih/saat, araç tipi ve tahmini fiyat ekle.
2. Admin panelde rota/fiyat/araç tipi yönetimi oluştur.
3. Provider modeline hizmet bölgeleri, araç tipleri, WhatsApp, komisyon oranı ve score ekle.
4. Provider paneline "Açık İşler" ekranı ekle.
5. İş açıkken telefonu maskele.
6. İlk onaylayan alır transaction fonksiyonu yaz.
7. İş alınınca telefonları aç.
8. Komisyonu pending olarak otomatik oluştur.
9. Aylık 1 iptal hakkı ekle.
10. Provider puanlama sistemini ekle.
11. 5 dakikalık bildirim dalgalarını ekle.
12. Admin panelde broadcast ve iptal inceleme ekranı ekle.
```

### Ürün değeri

Bu modelle Arrivio sadece talep formu olmaz. Havalimanı transfer işlerini gerçek zamanlı sağlayıcı havuzuna dağıtan, ilk onaylayan sağlayıcıya işi kilitleyen, telefonları iş alındıktan sonra açan ve komisyonu otomatik hesaplayan bir operasyon platformuna dönüşür.

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
9. Firestore rules + admin guard + query fallback kaldırma. Done
10. QR kaynak takibi. Done / MVP
11. Komisyon takibi. Done / MVP
12. Rent a car formu. Done / MVP
13. Otel formu. Done / MVP
14. Bilet formu. Done / MVP
15. Admin lead status güncelleme. Done / MVP
16. Talep detay ekranı ve operasyon notları. Done / Partial
17. Web TR/EN + WhatsApp destek. Done / Partial
18. Provider panel güçlendirme. Done / MVP
19. Full web TR/EN language cleanup. Done / MVP
20. Firebase canlı kurulum + Netlify web deploy. Done / Partial
21. Canlı web UI iyileştirme ve gerçek talep smoke test. Current
22. Transfer pazaryeri / açık iş havuzu. Next
23. Provider puanlama ve 5 dakikalık bildirim dalgaları. Next
24. İlk onaylayan işi alır transaction sistemi. Next
25. Admin/provider ayrı deploy veya subdomain. Pending
26. Mobil uygulama. Pending

Detaylı adımlar için: [`ROADMAP.md`](./ROADMAP.md)
