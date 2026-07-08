# Arrivio Yol Haritası

Öncelik: **web canlı test + admin/provider operasyonu + transfer pazaryeri modeline geçiş.** Mobil uygulama daha sonra gelecek.

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
| Step 7 | Done / Partial | Provider login ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Done | Firestore rules canlı public/admin/provider akışına göre güncellendi ve Console'a yayınlandı. |
| Step 9 | Done / Partial | Admin login ve admin guard eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı, provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi. |
| Step 12 | Done / MVP | QR source ve QR event takibi eklendi. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listesi eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listesi eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listesi eklendi. |
| Step 16 | Done / MVP | Admin rent a car, otel ve bilet status güncelleyebilir. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi. Ticket detay bekliyor. |
| Step 18 | Done / Partial | Ana sayfada TR/EN başlangıcı ve formlarda WhatsApp destek eklendi. |
| Step 19 | Done / MVP | Provider WhatsApp, fiyat/not ve aktif/tamamlanan iş ayrımı eklendi. |
| Step 20 | Done / MVP | Web formları merkezi `webCopy.ts` üzerinden Türkçe karakterli TR/EN metinlerle çalışır. QR landing `lang` bilgisini forma taşır. Formlar seçili dili Firestore `language` alanına yazar. |
| Step 21 | Done / Partial | Firebase Production, Auth, Firestore, rules, admin user, Netlify web deploy ve build fixleri tamamlandı. |
| Step 22 | Current | Canlı web UI iyileştirme, landing component mimarisi, turkuaz kart teması ve gerçek talep smoke test. |
| Step 23 | Next | Transfer pazaryeri veri modeli: rota, araç tipi, fiyat, provider puanı ve broadcast alanları. |
| Step 24 | Next | Yolcu transfer ekranını formdan seçim/fiyat/sağlayıcı kartı akışına çevirmek. |
| Step 25 | Next | Provider açık iş havuzu ve ilk onaylayan işi alır transaction sistemi. |
| Step 26 | Next | 5 dakikalık puan bazlı bildirim dalgaları: ilk 10, sonraki 40, kalan 50. |
| Step 27 | Pending | Admin/provider ayrı deploy veya subdomain. |
| Step 28 | Pending | Mobil MVP. |

---

## Faz 1 — Web MVP

- [x] Ana sayfa servis aksiyonları var.
- [x] Ana sayfa ilk canlı görünüm sonrası modern landing olarak yeniden tasarlandı.
- [x] Ana sayfa componentlere bölündü.
- [x] Landing CSS ayrı dosyalara taşındı.
- [x] Turkuaz kart/section teması eklendi.
- [x] Transfer formu var.
- [x] Rent a car formu var.
- [x] Otel uygunluk formu var.
- [x] Bilet talep formu var.
- [x] Tüm formlar Firestore'a kayıt atar.
- [x] Tüm formlar talep kodu üretir.
- [x] Tüm formlar WhatsApp destek gösterir.
- [x] `?lang=tr` ve `?lang=en` çalışır.
- [x] Türkçe/İngilizce metinler `apps/web/src/webCopy.ts` içinde merkezi yönetilir.
- [x] Türkçe metinler Türkçe karakterle tutulur.
- [x] Validasyon mesajları TR/EN desteklidir.
- [x] Başarı ve hata mesajları TR/EN desteklidir.
- [x] Formlar seçili dili Firestore `language` alanına yazar.
- [x] QR landing seçili dili transfer formuna taşır.
- [ ] Canlı sitede transfer formundan gerçek test talebi gönderilecek.
- [ ] Canlı sitede rent a car / hotel / ticket formları smoke test edilecek.

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
- [ ] Admin panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.
- [ ] Ticket detay ekranı daha sonra tamamlanacak.
- [ ] Admin listelerinden detay sayfasına link akışı temizlenecek.

---

## Faz 3 — Provider Panel

- [x] Provider login var.
- [x] Provider sadece kendisine atanmış transferleri görür.
- [x] Provider status güncelleyebilir.
- [x] Provider fiyat/not girebilir.
- [x] Provider yolcuya WhatsApp linkiyle geçebilir.
- [x] Aktif işler ve tamamlanan işler ayrı görünür.
- [x] Provider komisyon bilgisini görür.
- [ ] İlk gerçek provider Auth user oluşturulacak.
- [ ] Provider user, admin panelde provider doc ile bağlanacak.
- [ ] Provider panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.

---

## Faz 4 — QR Takibi

- [x] QR source modeli var.
- [x] QR event modeli var.
- [x] `/qr/[slug]` açılınca QR event yazılır.
- [x] QR source id forma taşınır.
- [x] QR linkindeki `lang` bilgisi forma taşınır.
- [x] Admin QR ekranı son eventleri gösterir.
- [ ] QR landing sadece transfer değil, servis seçimi veren daha güçlü sayfaya çevrilecek.
- [ ] Test QR kodları basılacak.

---

## Faz 5 — Canlıya Hazırlık

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
- [ ] Canlı transfer talebi Firestore'a düşüyor mu test edilecek.
- [ ] Canlı rent a car / hotel / ticket formları Firestore'a düşüyor mu test edilecek.
- [ ] Admin panel canlı Firebase ile login/list test edilecek.
- [ ] Provider panel canlı Firebase ile login/list test edilecek.
- [ ] En az 3 belgeli transfer sağlayıcıyla görüşülecek.
- [ ] En az 3 rent a car firmasıyla görüşülecek.
- [ ] En az 3 otel/apart ile görüşülecek.
- [ ] 1 acente ile bilet/transfer/rent a car komisyon şartı netleşecek.
- [ ] İlk rota fiyat tablosu çıkarılacak.
- [ ] İlk 10 talep canlı yönetilecek.
- [ ] İlk komisyon mutabakatı çıkarılacak.

---

## Faz 6 — Transfer Pazaryeri Modeli

Amaç: Arrivio'yu basit talep formundan çıkarıp **puan bazlı açık iş havuzu + ilk onaylayan işi alır + otomatik komisyon** modeline taşımak.

### 6.1 Veri modeli hazırlığı

- [ ] Provider dokümanına `score` alanı eklenecek. Başlangıç: `100`.
- [ ] Provider dokümanına `serviceAreas` eklenecek. Örnek: `Bodrum`, `Yalıkavak`, `Turgutreis`, `Milas`.
- [ ] Provider dokümanına `vehicleTypes` eklenecek. Örnek: `economic`, `vip`, `vito`, `minivan`.
- [ ] Provider dokümanına `whatsappPhone` eklenecek.
- [ ] Provider dokümanına `commissionRate` eklenecek.
- [ ] Provider dokümanına `monthlyCancelAllowance` eklenecek. Varsayılan: `1`.
- [ ] Provider dokümanına `lastCancelAllowanceMonth` eklenecek.
- [ ] Transfer request dokümanına `routeFrom`, `routeTo`, `vehicleType`, `pickupDate`, `pickupTime`, `estimatedPrice` eklenecek.
- [ ] Transfer request dokümanına `broadcastStatus`, `broadcastWave`, `broadcastOpenedAt`, `nextWaveAt`, `acceptedProviderId`, `acceptedAt` eklenecek.
- [ ] `transferOffers` veya `broadcastEvents` koleksiyonu eklenecek.

### 6.2 Rota / fiyat sistemi

- [ ] Admin panelde rota tanımlama ekranı yapılacak.
- [ ] Başlangıç rotaları girilecek:
  - BJV → Bodrum Merkez
  - BJV → Yalıkavak
  - BJV → Turgutreis
  - BJV → Gümbet
  - BJV → Milas
  - BJV → Türkbükü
- [ ] Her rota için araç tipi bazlı fiyat girilecek.
- [ ] Fiyatlar provider bazlı girilebilecek. Örnek: bir provider Yalıkavak için 1000 TL, diğeri 1500 TL diyebilir.
- [ ] Admin panelde provider fiyat tablosu görüntülenecek.
- [ ] Provider aktif/pasif yapılabilecek.

### 6.3 Yolcu tarafı seçim akışı

- [ ] Transfer ekranı uzun formdan çıkarılacak.
- [ ] İlk adımda yolcu şunları seçecek:
  - Nereye gidiyorsun?
  - Ne zaman?
  - Kaç kişi?
  - Araç tipi ne?
- [ ] Sistem seçilen rota ve araç tipine göre provider/fiyat kartlarını listeleyecek.
- [ ] Kartlarda şunlar görünecek:
  - Provider/firma adı
  - Araç tipi
  - Tahmini fiyat
  - Puan / güven seviyesi
  - Telefon gizli
- [ ] Yolcu provider/fiyat kartı seçince son adımda sadece ad, telefon ve uçuş kodu alınacak.
- [ ] Yolcuya şu bilgi gösterilecek: seçilen sağlayıcı uygun olmazsa talep uygun diğer sağlayıcılara açılabilir.

### 6.4 İlk seçilen provider önceliği

- [ ] Yolcu listeden bir provider seçerse iş önce sadece o provider'a açılacak.
- [ ] Seçilen provider için `wave = 0` özel teklif oluşturulacak.
- [ ] Bu provider'a 5 dakika öncelik verilecek.
- [ ] 5 dakika içinde işi kabul ederse iş ona kilitlenecek.
- [ ] 5 dakika içinde kabul etmezse iş otomatik puan bazlı dalga sistemine geçecek.

### 6.5 Puan bazlı bildirim dalgaları

- [ ] Uygun providerlar `score` değerine göre sıralanacak.
- [ ] Uygunluk filtreleri:
  - `isActive === true`
  - `isVerified === true`
  - rota `serviceAreas` içinde olmalı
  - araç tipi `vehicleTypes` içinde olmalı
- [ ] Dalga 1: en yüksek puanlı ilk 10 provider.
- [ ] Dalga 2: iş alınmadıysa 5 dakika sonra sonraki 40 provider.
- [ ] Dalga 3: iş hâlâ alınmadıysa 10. dakikada kalan 50 provider.
- [ ] Her provider için `transferOffers` kaydı oluşturulacak.
- [ ] Offer statüleri: `sent`, `seen`, `accepted`, `missed`, `expired`.
- [ ] MVP'de gerçek push yerine provider panel Firestore canlı dinleme ile çalışacak.
- [ ] Sonraki aşamada WhatsApp/SMS/push bildirim değerlendirilecek.

### 6.6 Provider açık iş havuzu

- [ ] Provider paneline `Açık İşler` ekranı eklenecek.
- [ ] Provider sadece kendisine açılmış teklifleri görecek.
- [ ] İş alınmadan yolcu telefonunu maskeli görecek.
- [ ] Maskeli telefon örneği: `+90 5xx *** ** 42`.
- [ ] Provider kartta rota, tarih/saat, araç tipi, tahmini fiyat ve komisyonu görecek.
- [ ] Provider `İşi Al` butonuna basabilecek.

### 6.7 İlk onaylayan işi alır transaction sistemi

- [ ] `acceptTransferOffer()` Firebase servis fonksiyonu yazılacak.
- [ ] Normal update kullanılmayacak; Firestore transaction kullanılacak.
- [ ] Transaction içinde transfer request tekrar okunacak.
- [ ] `broadcastStatus === open` ve `acceptedProviderId` boş ise provider atanacak.
- [ ] İş kabul edilirse:
  - `broadcastStatus = accepted`
  - `acceptedProviderId = providerId`
  - `assignedProviderId = providerId`
  - `acceptedAt = serverTimestamp()`
  - `commissionStatus = pending`
  - `commissionAmount` hesaplanacak
- [ ] İş daha önce alınmışsa provider'a `Bu iş başka sağlayıcı tarafından alındı` mesajı dönecek.
- [ ] Diğer offer kayıtları `missed` veya `expired` yapılacak.

### 6.8 Telefon açılma kuralı

- [ ] İş açıkken yolcu telefonu providerlara maskeli gösterilecek.
- [ ] Sadece işi kazanan provider tam telefonu görecek.
- [ ] Yolcu tarafında provider seçimi/onayı tamamlanınca WhatsApp butonu açılacak.
- [ ] Telefon açıldığı an komisyon pending zaten yazılmış olmalı.
- [ ] Bu kural sistemi bypass etmeyi azaltmak için zorunlu olacak.

### 6.9 Komisyon ve iptal yönetimi

- [ ] İş alındığı anda komisyon `pending` oluşacak.
- [ ] Komisyon provider fiyatı veya seçilen fiyat üzerinden hesaplanacak.
- [ ] İş tamamlanınca komisyon kesinleşecek.
- [ ] Provider ayda 1 ücretsiz iptal hakkı kullanabilecek.
- [ ] İptal hakkı yoksa iptal admin incelemesine düşecek.
- [ ] Tekrar eden iptallerde provider puanı düşecek.
- [ ] Gerekirse komisyon borcu kalacak veya ceza uygulanacak.

### 6.10 Provider puanlama sistemi

- [ ] Her provider 100 puanla başlayacak.
- [ ] İşi tamamladı: `+2`.
- [ ] Hızlı dönüş yaptı: `+1`.
- [ ] Yolcu memnuniyeti yüksek: `+3`.
- [ ] İşi alıp iptal etti: `-10`.
- [ ] Yolcu şikâyeti: `-20`.
- [ ] Admin manuel puan düzeltebilecek.
- [ ] Bu puan sadece görsel yıldız değil, bildirim sıralamasını belirleyen operasyon puanı olacak.

### 6.11 Admin takip ekranları

- [ ] Admin açık işleri görecek.
- [ ] Hangi dalgada kaç provider'a açıldığını görecek.
- [ ] Hangi providerların gördüğünü / kaçırdığını / kabul ettiğini görecek.
- [ ] İptal hakkı kullanımını görecek.
- [ ] Provider puan geçmişini görecek.
- [ ] Komisyon pending / invoiced / paid durumlarını yönetecek.

### 6.12 MVP uygulama sırası

```text
1. Provider veri modelini genişlet.
2. Transfer request veri modelini genişlet.
3. Rota/fiyat tiplerini shared package içine ekle.
4. Admin provider ekranına score, bölgeler, araç tipleri, WhatsApp ve komisyon alanları ekle.
5. Admin rota/fiyat yönetimi ekranını oluştur.
6. Yolcu transfer sekmesini seçim + provider/fiyat kartı akışına çevir.
7. Transfer talebi oluşunca ilk seçilen provider için wave 0 offer oluştur.
8. Provider paneline Açık İşler ekranını ekle.
9. Telefon maskeleme helperını ekle.
10. acceptTransferOffer transaction fonksiyonunu yaz.
11. İş alınınca telefonları aç ve komisyon pending yaz.
12. 5 dakika sonra wave 1, 10 dakika sonra wave 2, 15 dakika sonra wave 3 mantığını ekle.
13. Provider puanlama fonksiyonlarını ekle.
14. Aylık 1 iptal hakkı ve admin inceleme ekranını ekle.
15. Canlıda 3 provider ile test et.
```

---

## Faz 7 — Mobil MVP

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
Canlı web son tasarımını deploy et → transfer test talebi gönder → Firestore'da transferRequests kaydını doğrula → ardından Transfer Pazaryeri Faz 6.1 veri modeli hazırlığına başla.
```
