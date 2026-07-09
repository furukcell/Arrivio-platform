# Arrivio Yol Haritası

Öncelik: **canlı web smoke test + gerçek provider fiyatları + açık iş havuzu + white-label şablonlaşma hazırlığı.** Mobil uygulama daha sonra gelecek.

---

## Güncel Step Durumu

| Step | Durum | Açıklama |
|---|---|---|
| Step 1 | Done / Partial | Monorepo iskeleti oluşturuldu. |
| Step 2 | Done | Web transfer formu eklendi. |
| Step 3 | Done | Transfer formu Firestore kaydı eklendi. |
| Step 4 | Done / MVP | Admin transfer listesi eklendi. |
| Step 5 | Done / MVP | Admin provider oluşturma ve transfer atama eklendi. |
| Step 6 | Done / MVP | Provider kendi transferlerini görür ve status günceller. |
| Step 7 | Done / MVP | Provider login ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Done | Firestore rules public/admin/provider/fiyat akışına göre güncellendi. |
| Step 9 | Done / Partial | Admin login ve admin guard eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı, provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi. |
| Step 12 | Done / MVP | QR source ve QR event takibi eklendi. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listesi eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listesi eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listesi eklendi. |
| Step 16 | Done / MVP | Admin rent a car, otel ve bilet status güncelleyebilir. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi. Ticket detay bekliyor. |
| Step 18 | Done / MVP | Ana sayfada TR/EN landing, servis sekmeleri ve WhatsApp destek eklendi. |
| Step 19 | Done / MVP | Provider WhatsApp, fiyat/not ve aktif/tamamlanan iş ayrımı eklendi. |
| Step 20 | Done / MVP | Web formları merkezi `webCopy.ts` üzerinden Türkçe karakterli TR/EN metinlerle çalışır. |
| Step 21 | Done / Partial | Firebase Production, Auth, Firestore, rules, admin user, Netlify web deploy ve build fixleri tamamlandı. |
| Step 22 | Done / MVP | Transfer yönü, rota, araç tipi, tarih/saat ve tahmini min-max fiyat akışı eklendi. |
| Step 23 | Done / MVP | Rent a car ve hotel sekmeleri min-max fiyat + uygun araç/tesis sayısı mantığına taşındı. |
| Step 24 | Done / MVP | Sağ üst `Hizmet Veren Girişi / Partner Login` ve `/partner-login` kapısı eklendi. |
| Step 25 | Done / MVP | Provider dashboard geçici ID ekranından çıkarıldı; Auth profile üzerinden çalışır hale getirildi. |
| Step 26 | Done / MVP | Provider fiyat koleksiyonları eklendi: `transferRoutePrices`, `carRentalDailyPrices`, `hotelNightlyPrices`. |
| Step 27 | Done / MVP | Provider `/prices` ekranı gerçek fiyat giriş formuna çevrildi. |
| Step 28 | Current | Canlı deploy smoke test: provider fiyat girme, yolcu min-max fiyat hesaplama ve request payload doğrulama. |
| Step 29 | Next | Açık iş havuzu ve ilk onaylayan işi alır transaction sistemi. |
| Step 30 | Next | Telefon maskeleme ve işi alan providera tam telefon açma. |
| Step 31 | Next | Provider puanlama ve bildirim dalgaları. |
| Step 32 | Planned | White-label / şablon ürün config mimarisi. |
| Step 33 | Pending | Admin/provider ayrı deploy veya subdomain. |
| Step 34 | Pending | Mobil MVP. |

---

## Faz 1 — Web MVP

- [x] Ana sayfa servis aksiyonları var.
- [x] Ana sayfa modern landing olarak yeniden tasarlandı.
- [x] Ana sayfa componentlere bölündü.
- [x] Landing CSS ayrı dosyalara taşındı.
- [x] Transfer formu var.
- [x] Rent a car formu var.
- [x] Otel uygunluk formu var.
- [x] Bilet talep formu var.
- [x] Tüm formlar Firestore'a kayıt atar.
- [x] Tüm formlar talep kodu üretir.
- [x] Tüm formlar WhatsApp destek gösterir.
- [x] `?lang=tr` ve `?lang=en` çalışır.
- [x] Türkçe/İngilizce metinler `apps/web/src/webCopy.ts` içinde merkezi yönetilir.
- [x] Formlar seçili dili Firestore `language` alanına yazar.
- [x] QR landing seçili dili forma taşır.
- [x] Ana yolcu ekranı transfer/rent a car/hotel için min-max fiyat aralığı gösterir.
- [x] Ana yolcu ekranı uygun araç/tesis sayısı gösterir.
- [x] Yolcuya firma adı göstermeden fiyat aralığı gösterilir.
- [ ] Canlı sitede provider fiyatı girildikten sonra yolcu ekranında fiyat aralığı değişiyor mu test edilecek.
- [ ] Canlı sitede transfer/rent a car/hotel/ticket formları Firestore'a düşüyor mu test edilecek.

---

## Faz 2 — Admin Panel

- [x] Admin login var.
- [x] Admin role guard var.
- [x] Firebase Auth içinde ilk admin user oluşturuldu.
- [x] Firestore `users/{uid}` admin dokümanı oluşturuldu.
- [x] Transfer talepleri listelenir.
- [x] Rent a car talepleri listelenir.
- [x] Otel talepleri listelenir.
- [x] Bilet talepleri listelenir.
- [x] Transfer provider'a atanabilir.
- [x] Transfer komisyonu girilebilir.
- [x] Rent a car, otel ve bilet status güncellenebilir.
- [x] Transfer, rent a car ve otel detay ekranları başladı.
- [x] Provider oluşturma ve provider Auth UID bağlama var.
- [x] QR source ve QR event ekranı var.
- [ ] Admin panelde provider fiyat kayıtlarını izleme/denetleme ekranı eklenecek.
- [ ] Provider fiyatları için admin onay/aktif-pasif yönetimi eklenecek.
- [ ] Admin panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.
- [ ] Ticket detay ekranı tamamlanacak.
- [ ] Admin listelerinden detay sayfasına link akışı temizlenecek.

---

## Faz 3 — Provider Panel

- [x] Provider login var.
- [x] Provider dashboard var.
- [x] Provider sadece kendisine atanmış transferleri görür.
- [x] Provider status güncelleyebilir.
- [x] Provider final fiyat/not girebilir.
- [x] Provider yolcuya WhatsApp linkiyle geçebilir.
- [x] Aktif işler ve tamamlanan işler ayrı görünür.
- [x] Provider komisyon bilgisini görür.
- [x] Provider `/prices` ekranı var.
- [x] Transfer provider rota/araç tipi fiyatı girebilir.
- [x] Rent a car provider günlük araç fiyatı girebilir.
- [x] Hotel provider gecelik fiyat ve max kişi girebilir.
- [x] Provider kendi fiyat kayıtlarını listeleyebilir.
- [ ] Fiyat silme/güncelleme butonları eklenecek.
- [ ] Provider tipine göre sadece ilgili fiyat formu gösterilecek.
- [ ] İlk gerçek provider Auth user oluşturulacak.
- [ ] Provider user, admin panelde provider doc ile bağlanacak.
- [ ] Provider panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.

---

## Faz 4 — Provider Fiyat Sistemi

Amaç: Yolcu tarafındaki fiyat aralığını seed/fallback veriden çıkarıp gerçek hizmet veren fiyatlarından hesaplamak.

### 4.1 Veri modeli

- [x] `TransferRoutePrice` tipi eklendi.
- [x] `CarRentalDailyPrice` tipi eklendi.
- [x] `HotelNightlyPrice` tipi eklendi.
- [x] `transferRoutePrices` koleksiyonu eklendi.
- [x] `carRentalDailyPrices` koleksiyonu eklendi.
- [x] `hotelNightlyPrices` koleksiyonu eklendi.
- [x] `providerType` alanı `AppUser` modeline eklendi.

### 4.2 Firebase servisleri

- [x] `createTransferRoutePrice()` eklendi.
- [x] `createCarRentalDailyPrice()` eklendi.
- [x] `createHotelNightlyPrice()` eklendi.
- [x] `listProviderTransferRoutePrices()` eklendi.
- [x] `listProviderCarRentalDailyPrices()` eklendi.
- [x] `listProviderHotelNightlyPrices()` eklendi.
- [x] `listPublicTransferRoutePrices()` eklendi.
- [x] `listPublicCarRentalDailyPrices()` eklendi.
- [x] `listPublicHotelNightlyPrices()` eklendi.

### 4.3 Yolcu tarafı

- [x] Ana sayfa public provider fiyatlarını yükler.
- [x] `/transfer` public transfer fiyatlarını yükler.
- [x] `/car-rental` public rent a car fiyatlarını yükler.
- [x] `/hotel` public hotel fiyatlarını yükler.
- [x] Talep payload'ına min/max fiyat ve uygun provider sayısı yazılır.
- [ ] Gerçek canlı fiyatlarla test edilecek.
- [ ] Fiyat yoksa kullanıcıya daha net fallback mesajı gösterilecek.

### 4.4 Firestore rules

- [x] Provider kendi fiyat kaydını oluşturabilir.
- [x] Provider kendi fiyat kaydını okuyabilir.
- [x] Provider kendi fiyat kaydını güncelleyebilir/silebilir.
- [x] Public yolcu sadece `isActive == true` ve `isVerified == true` fiyatları okuyabilir.
- [x] Admin tüm fiyat kayıtlarını okuyabilir/yönetebilir.

---

## Faz 5 — QR Takibi

- [x] QR source modeli var.
- [x] QR event modeli var.
- [x] `/qr/[slug]` açılınca QR event yazılır.
- [x] QR source id forma taşınır.
- [x] QR linkindeki `lang` bilgisi forma taşınır.
- [x] QR landing transfer-only olmaktan çıkarılıp servis seçimi veren sayfaya çevrildi.
- [x] Admin QR ekranı son eventleri gösterir.
- [ ] Test QR kodları basılacak.
- [ ] Havalimanı içi QR noktaları için ayrı source slug listesi çıkarılacak.

---

## Faz 6 — Canlıya Hazırlık

- [x] Firebase projesi açıldı: Arrivio Production.
- [x] Firestore aktif edildi.
- [x] Authentication Email/Password aktif edildi.
- [x] Web app config alındı ve Netlify env içine girildi.
- [x] İlk admin kullanıcısı oluşturuldu.
- [x] Firestore `users/{uid}` admin profili oluşturuldu.
- [x] Firestore rules uygulanıp yayınlandı.
- [x] `firebase.json` eklendi.
- [x] `netlify.toml` eklendi.
- [x] Netlify web deploy alındı.
- [x] Next monorepo build hataları düzeltildi.
- [x] Firebase client lazy initialize edildi.
- [x] Netlify public Firebase key secrets scan istisnası eklendi.
- [ ] Canlı web arayüz son hali telefonda tekrar kontrol edilecek.
- [ ] Canlı provider fiyat girişi yapılacak.
- [ ] Canlı yolcu ekranında provider fiyatından min-max değişimi kontrol edilecek.
- [ ] Canlı transfer talebi Firestore'a düşüyor mu test edilecek.
- [ ] Canlı rent a car / hotel / ticket formları Firestore'a düşüyor mu test edilecek.
- [ ] Admin panel canlı Firebase ile login/list test edilecek.
- [ ] Provider panel canlı Firebase ile login/list/fiyat test edilecek.
- [ ] En az 3 belgeli transfer sağlayıcıyla görüşülecek.
- [ ] En az 3 rent a car firmasıyla görüşülecek.
- [ ] En az 3 otel/apart ile görüşülecek.
- [ ] 1 acente ile bilet/transfer/rent a car komisyon şartı netleşecek.
- [ ] İlk 10 talep canlı yönetilecek.
- [ ] İlk komisyon mutabakatı çıkarılacak.

---

## Faz 7 — Açık İş Havuzu ve İlk Onaylayan Alır

Amaç: Arrivio'yu fiyat aralığı gösteren talep pazarından **puan bazlı açık iş havuzu + ilk onaylayan işi alır + otomatik komisyon** modeline taşımak.

### 7.1 Veri modeli hazırlığı

- [ ] Provider dokümanına `score` alanı eklenecek. Başlangıç: `100`.
- [ ] Provider dokümanına `serviceAreas` eklenecek.
- [ ] Provider dokümanına `vehicleTypes` eklenecek.
- [ ] Provider dokümanına `whatsappPhone` eklenecek.
- [ ] Provider dokümanına `commissionRate` eklenecek.
- [ ] Provider dokümanına `monthlyCancelAllowance` eklenecek. Varsayılan: `1`.
- [ ] Transfer request dokümanına `broadcastStatus`, `broadcastWave`, `broadcastOpenedAt`, `nextWaveAt`, `acceptedProviderId`, `acceptedAt` eklenecek.
- [ ] `transferOffers` veya `broadcastEvents` koleksiyonu eklenecek.

### 7.2 Provider açık iş havuzu

- [ ] Provider paneline `Açık İşler` ekranı eklenecek.
- [ ] Provider sadece kendisine açılmış teklifleri görecek.
- [ ] İş alınmadan yolcu telefonunu maskeli görecek.
- [ ] Maskeli telefon örneği: `+90 5xx *** ** 42`.
- [ ] Provider kartta rota, tarih/saat, araç tipi, tahmini fiyat ve komisyonu görecek.
- [ ] Provider `İşi Al` butonuna basabilecek.

### 7.3 İlk onaylayan işi alır transaction sistemi

- [ ] `acceptTransferOffer()` Firebase servis fonksiyonu yazılacak.
- [ ] Normal update kullanılmayacak; Firestore transaction kullanılacak.
- [ ] Transaction içinde transfer request tekrar okunacak.
- [ ] `broadcastStatus === open` ve `acceptedProviderId` boş ise provider atanacak.
- [ ] İş kabul edilirse `assignedProviderId`, `acceptedProviderId`, `acceptedAt`, `commissionStatus` yazılacak.
- [ ] İş daha önce alınmışsa provider'a `Bu iş başka sağlayıcı tarafından alındı` mesajı dönecek.
- [ ] Diğer offer kayıtları `missed` veya `expired` yapılacak.

### 7.4 Telefon açılma kuralı

- [ ] İş açıkken yolcu telefonu providerlara maskeli gösterilecek.
- [ ] Sadece işi kazanan provider tam telefonu görecek.
- [ ] Yolcu tarafında provider seçimi/onayı tamamlanınca WhatsApp butonu açılacak.
- [ ] Telefon açıldığı an komisyon pending yazılmış olmalı.

### 7.5 Puan bazlı bildirim dalgaları

- [ ] Uygun providerlar `score` değerine göre sıralanacak.
- [ ] Dalga 1: en yüksek puanlı ilk 10 provider.
- [ ] Dalga 2: iş alınmadıysa 5 dakika sonra sonraki 40 provider.
- [ ] Dalga 3: iş hâlâ alınmadıysa 10. dakikada kalan providerlar.
- [ ] MVP'de gerçek push yerine provider panel Firestore canlı dinleme ile çalışacak.
- [ ] Sonraki aşamada WhatsApp/SMS/push bildirim değerlendirilecek.

### 7.6 Komisyon ve iptal yönetimi

- [ ] İş alındığı anda komisyon `pending` oluşacak.
- [ ] Komisyon provider fiyatı veya seçilen fiyat üzerinden hesaplanacak.
- [ ] İş tamamlanınca komisyon kesinleşecek.
- [ ] Provider ayda 1 ücretsiz iptal hakkı kullanabilecek.
- [ ] İptal hakkı yoksa iptal admin incelemesine düşecek.
- [ ] Tekrar eden iptallerde provider puanı düşecek.

---

## Faz 8 — White-label / Şablon Ürün

Amaç: Arrivio arayüzünü ve panel omurgasını başka şirketlere satılabilir bir şablon/SaaS ürün haline getirmek.

### 8.1 Config mimarisi

- [ ] `apps/web/src/tenantConfig.ts` oluşturulacak.
- [ ] Marka adı config'e taşınacak: `brandName`.
- [ ] Logo/renk config'e taşınacak: `primaryColor`, `secondaryColor`, `accentColor`.
- [ ] Varsayılan lokasyon/havalimanı config'e taşınacak: `defaultAirport`, `marketName`.
- [ ] Destek numarası config'e taşınacak: `supportWhatsapp`.
- [ ] Aktif servisler config'e taşınacak: `enabledServices`.
- [ ] Provider tipleri config'e taşınacak.
- [ ] Landing metinleri config veya CMS mantığına hazırlanacak.

### 8.2 Multi-tenant seçenekleri

- [ ] Basit model: her müşteri için ayrı Firebase project + ayrı Netlify site.
- [ ] Orta model: aynı kod tabanı, farklı env/config ile deploy.
- [ ] Gelişmiş model: tek Firebase içinde `tenantId` alanıyla çoklu müşteri.

İlk satış için önerilen model:

```text
Aynı kod tabanı
Ayrı müşteri config'i
Ayrı Firebase project
Ayrı Netlify site/domain
```

Bu model daha güvenli, daha hızlı satılır ve müşteri verileri birbirine karışmaz.

### 8.3 Satılabilir paketler

- [ ] Landing + talep formu paketi.
- [ ] Landing + admin panel paketi.
- [ ] Landing + admin + provider panel paketi.
- [ ] QR takip paketi.
- [ ] Komisyon takip paketi.
- [ ] Fiyat aralığı/pazar yeri paketi.

### 8.4 Teknik temizlik

- [ ] Arrivio adı hard-coded yerlerden çıkarılacak.
- [ ] BJV hard-coded alanları config'e taşınacak.
- [ ] Bodrum/Milas/Yalıkavak gibi destinasyonlar config'e taşınacak.
- [ ] Renkler CSS variables haline getirilecek.
- [ ] Form alanları servis bazlı config ile üretilecek.
- [ ] Admin/provider route isimleri generic hale getirilecek.
- [ ] README içine müşteri kurulum rehberi eklenecek.

### 8.5 Ticari satış modeli

- [ ] Kurulum ücreti belirlenecek.
- [ ] Aylık bakım/hosting/panel ücreti belirlenecek.
- [ ] Özelleştirme ücretleri belirlenecek.
- [ ] Sözleşme ve destek kapsamı yazılacak.
- [ ] İlk demo sektörü seçilecek: transfer/rent a car/otel/acente.

---

## Faz 9 — Mobil MVP

Mobil şu an başlamadı. Web/admin/provider canlı testten geçtikten sonra başlayacak.

- [x] Expo placeholder var.
- [ ] Mobil home ekranı.
- [ ] Mobil talep formları.
- [ ] Shared type/status kullanımı.
- [ ] Firebase servis bağlantısı.
- [ ] Yolcu login olmadan talep bırakma akışı.

---

## Sıradaki Net İş

```text
1. Canlı deploy logunu kontrol et.
2. Provider hesabıyla /prices ekranından transfer/rent a car/hotel fiyatı gir.
3. Yolcu ana sayfasında filtre seçince min-max fiyat değişiyor mu test et.
4. Firestore request payload içinde min/max fiyat ve matched count alanlarını doğrula.
5. Ardından açık iş havuzu + ilk onaylayan transaction fazına başla.
```
