# Arrivio Yol Haritası

Bu dosya geliştirme ve operasyon sırasını belirler. Öncelik sırası değişmedi: önce web, admin ve provider canlıya çıkacak; mobil uygulama paralelde ama ikinci öncelik olarak ilerleyecek.

---

## Güncel Durum

| Step | Durum | Açıklama |
|---|---|---|
| Step 1 | Done / Partial | Monorepo iskeleti oluşturuldu. `apps/web`, `apps/admin`, `apps/provider`, `apps/mobile`, `packages/shared`, `packages/firebase`, `packages/ui-kit` var. |
| Step 2 | Done | Web transfer formu eklendi: `/transfer`. |
| Step 3 | Done | Transfer formu Firestore `transferRequests` koleksiyonuna gerçek kayıt atacak hale getirildi. |
| Step 4 | Done / MVP | Admin panelde transfer talepleri listeleniyor: `/transfers`. |
| Step 5 | Done / MVP | Admin panelde sağlayıcı oluşturma ve transfer talebini sağlayıcıya atama eklendi. |
| Step 6 | Done / MVP | Provider panelde kendisine atanmış transfer taleplerini görme ve status güncelleme eklendi. |
| Step 7 | Done / Partial | Provider login, Auth listener, `users/{uid}.providerId` okuma ve provider panel bağlantısı eklendi. |
| Step 8 | Done / Draft | `firestore.rules` ve rules kullanım dokümanı repoya eklendi. Firebase Console'a en son uygulanacak. |
| Step 9 | Done / Partial | Admin login, admin role guard, `/transfers` ve `/providers` koruması eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı ve admin panelden provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi: fiyat, komisyon tutarı, komisyon durumu, admin notu. |
| Step 12 | Done / MVP | QR kaynak takibi eklendi: QR source, QR event, transfer qrSourceId ve admin QR ekranı. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listeleme ekranı eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listeleme ekranı eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listeleme ekranı eklendi. |
| Step 16 | Done / MVP | Admin lead status update eklendi: rent a car, otel ve bilet talepleri listeden status güncelleyebiliyor. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi; ticket detay ekranı bekliyor. |
| Step 18 | Done / Partial | Web ana sayfada TR/EN başlangıcı ve tüm web formlarında WhatsApp destek eklendi. Tam form çevirisi pending. |
| Step 19 | Next | Provider WhatsApp, fiyat/not, aktif/tamamlanan işler. |
| Step 20 | Pending | Mobil MVP. |

Not: `packages/ui` yolu araç filtresine takıldığı için workspace paketi `packages/ui-kit` klasöründe tutuldu. Paket adı yine `@arrivio/ui` olduğu için workspace dependency çözülür.

---

## Faz 0 — Repo ve Ürün Kurulumu

- [x] `pnpm-workspace.yaml` ve kök `package.json` oluştur.
- [x] `apps/web`, `apps/admin`, `apps/provider`, `apps/mobile` klasörlerini oluştur.
- [x] `packages/shared`, `packages/firebase`, `packages/ui-kit` klasörlerini oluştur.
- [x] `docs/` altındaki strateji dosyalarını oluştur.
- [ ] Firebase projesini aç: `Arrivio MVP` veya `Arrivio Production`.
- [ ] Firestore, Auth ve Storage servislerini aktif et.
- [x] `.env.example` dosyasını oluştur.
- [x] Provider Auth kararını uygula: MVP'de sağlayıcı login olacak.
- [ ] Domain adaylarını kontrol et: `arrivio.com.tr`, `arrivio.app`, `arrivio.travel`.
- [ ] Sosyal medya kullanıcı adı kontrolü yap.
- [ ] Acenteci arkadaşla komisyon ve operasyon konuşmasına başla.

---

## Faz 1 — Web MVP

Amaç: QR okutan yolcunun uygulama indirmeden talep bırakabilmesi.

- [x] `apps/web` Next.js projesi ayağa kalkacak.
- [x] TR/EN başlangıç dil yapısı kurulacak. Ana sayfada `?lang=tr` ve `?lang=en` çalışır.
- [ ] Tüm formlar tam TR/EN metinlerine çevrilecek.
- [x] Ana sayfada temel aksiyonlar görünecek:
  - Transfer
  - Car Rental
  - Hotels
  - Ticket Request
- [x] Transfer formu Firestore `transferRequests` koleksiyonuna kayıt atacak.
- [x] Rent a car formu Firestore `carRentalRequests` koleksiyonuna kayıt atacak.
- [x] Otel formu Firestore `hotelRequests` koleksiyonuna kayıt atacak.
- [x] Bilet formu Firestore `ticketRequests` koleksiyonuna kayıt atacak.
- [x] Transfer talebi için kod üretilecek.
- [x] Rent a car talebi için kod üretilecek.
- [x] Otel talebi için kod üretilecek.
- [x] Bilet talebi için kod üretilecek.
- [x] Yolcuya transfer formu sonrası talep kodu gösterilecek.
- [x] Yolcuya rent a car formu sonrası talep kodu gösterilecek.
- [x] Yolcuya otel formu sonrası talep kodu gösterilecek.
- [x] Yolcuya bilet formu sonrası talep kodu gösterilecek.
- [x] WhatsApp destek butonu eklenecek.
- [x] “Arrivio yolcudan ücret almaz” metni transfer sayfasında görünecek.
- [x] QR source id transfer talebine yazılacak.
- [x] QR source id rent a car talebine yazılabilecek.
- [x] QR source id otel talebine yazılabilecek.
- [x] QR source id bilet talebine yazılabilecek.

---

## Faz 2 — Admin Panel

Amaç: Operasyon ekibi tüm talepleri, sağlayıcıları ve komisyonları yönetebilsin.

- [x] `apps/admin` Next.js projesi ayağa kalkacak.
- [x] Admin Firebase Auth login oluşturulacak.
- [x] Admin role kontrolü yapılacak.
- [x] Transfer talepleri listelenecek.
- [x] Rent a car talepleri listelenecek.
- [x] Otel talepleri listelenecek.
- [x] Bilet talepleri listelenecek.
- [x] Talep detay ekranı başlayacak. Transfer, rent a car ve otel detayları var; ticket detay bekliyor.
- [x] Talep status güncellenebilecek. Transfer provider akışında; rent a car, otel ve bilet admin listelerinden güncellenir.
- [x] Sağlayıcı oluşturma ekranı olacak.
- [x] Sağlayıcıya kullanıcı bağlama mantığı olacak.
- [x] Transfer talebi sağlayıcıya atanabilecek.
- [x] Transfer komisyon tutarı girilebilecek.
- [x] Transfer komisyon status güncellenecek:
  - `pending`
  - `invoiced`
  - `paid`
  - `cancelled`
- [x] Transfer admin notu eklenebilecek.
- [x] QR kaynak yönetim ekranı olacak.
- [x] Son QR event kayıtları görülecek.
- [x] Admin log mantığı veri modelinde hazır.

---

## Faz 3 — Provider Panel

Amaç: Sağlayıcı kendi hesabıyla giriş yapıp kendisine atanmış talepleri yönetebilsin.

- [x] `apps/provider` Next.js projesi repo iskeletinde var.
- [x] Provider Firebase Auth login oluşturulacak.
- [x] `users/{uid}.role = provider` kontrolü yapılacak.
- [x] `users/{uid}.providerId` ile provider eşleşmesi yapılacak.
- [x] Provider sadece kendisine atanmış transfer taleplerini görebilecek. Query fallback kaldırıldı.
- [x] Dashboard ekranı olacak.
- [x] Yeni Talepler ekranı olacak. MVP'de `/transfers`.
- [ ] Aktif İşler ekranı olacak.
- [ ] Tamamlanan İşler ekranı olacak.
- [x] Transfer komisyon bilgilerini görebilecek.
- [ ] Provider talebi kabul/reddedebilecek. MVP'de status update vardır, reject/cancel vardır.
- [x] Provider status güncelleyebilecek.
- [ ] Provider fiyat/not girebilecek.
- [ ] Provider yolcuya WhatsApp linkiyle geçebilecek.

---

## Faz 4 — QR Kaynak Takibi

Amaç: Havalimanı reklam/QR kaynaklarının hangisinin çalıştığını ölçmek.

- [x] `qrSources` koleksiyonu veri modelinde hazır.
- [x] `qrEvents` koleksiyonu veri modelinde hazır.
- [x] QR linkleri çalışacak:
  - `/qr/bjv-domestic-arrivals`
  - `/qr/bjv-international-arrivals`
  - `/qr/bjv-parking`
  - `/qr/bjv-transfer-desk`
- [x] QR link açıldığında kaynak kaydedilecek.
- [x] Yolcu form gönderdiğinde `qrSourceId` talebe yazılacak.
- [x] Admin panelde QR performans ekranı olacak.
- [x] QR kaynak raporunda source ve son event kayıtları görünecek.

---

## Faz 5 — İlk Canlı Operasyon

Amaç: Sezon bitmeden ilk gerçek talep ve ilk komisyon.

- [ ] En az 3 belgeli transfer sağlayıcıyla görüş.
- [ ] En az 3 rent a car firmasıyla görüş.
- [ ] En az 3 otel/apart ile görüş.
- [ ] 1 acente ile bilet/transfer/rent a car komisyon şartını netleştir.
- [ ] Sağlayıcı sözleşme taslağı paylaş.
- [ ] Provider hesaplarını oluştur.
- [ ] İlk rota fiyat tablosunu oluştur.
- [ ] Test QR kodları bas.
- [ ] İlk 10 talebi canlı yönet.
- [ ] İlk komisyon mutabakatını çıkar.

---

## Faz 6 — Mobil Uygulama

Mobil uygulama web/admin/provider canlıyken paralel ilerler. Para kazanma için web bekletilmez.

- [x] `apps/mobile` Expo placeholder oluşturuldu.
- [ ] Home ekranı taslağı:
  - Transfer
  - Car Rental
  - Hotels
  - Flight Tracker
  - Ticket Request
- [ ] Web ile aynı `packages/shared` type/status yapısını kullan.
- [ ] Firebase servislerini `packages/firebase` üzerinden kullan.
- [ ] Yolcu login zorunlu olmayacak.
- [ ] İlk sürümde mobil uygulama sadece talep ve takip odaklı olacak.

---

## Kabul Kriterleri

### Web

- [x] Mobil ekranda tek elle kullanılabilir başlangıç düzeni var.
- [x] TR/EN dil seçimi ana sayfada görünür.
- [x] Ana sayfada Transfer / Car Rental / Hotels / Ticket aksiyonları net.
- [x] Transfer formu gönderince Firestore kaydı oluşur.
- [x] Rent a car formu gönderince Firestore kaydı oluşur.
- [x] Otel formu gönderince Firestore kaydı oluşur.
- [x] Bilet formu gönderince Firestore kaydı oluşur.
- [x] Transfer formu sonrası talep kodu görünür.
- [x] Rent a car formu sonrası talep kodu görünür.
- [x] Otel formu sonrası talep kodu görünür.
- [x] Bilet formu sonrası talep kodu görünür.
- [x] QR kaynağı talebe yazılır.
- [x] WhatsApp destek butonu görünür.
- [x] Yolcudan ücret alınmayacağı transfer ekranında yazılıdır.

### Admin

- [x] Admin login çalışır.
- [x] Admin role guard çalışır.
- [x] Admin transfer taleplerini görebilir.
- [x] Admin rent a car taleplerini görebilir.
- [x] Admin otel taleplerini görebilir.
- [x] Admin bilet taleplerini görebilir.
- [x] Admin tüm talep türlerini görebilir.
- [x] Admin talep status güncelleyebilir.
- [x] Sağlayıcı oluşturabilir.
- [x] Sağlayıcı Auth UID bağlayabilir.
- [x] Transfer sağlayıcı atayabilir.
- [x] Transfer komisyon tutarı ve komisyon durumu girebilir.
- [x] QR kaynak performansını görebilir.
- [x] Transfer talep notu ekleyebilir.

### Provider

- [x] Provider login çalışır.
- [x] Provider `users/{uid}.providerId` ile kendi transfer taleplerini görür.
- [x] Provider transfer status günceller.
- [x] Provider transfer komisyonlarını görür.
- [x] Firestore rules draft repoya eklendi; provider başka provider'ın müşterisini rules ile göremez hale getirilecek.

---

## Yapılmayacaklar

- [x] ~~Uygulama bitmeden web'i bekletmek~~
- [x] ~~İlk günden online ödeme kurmak~~
- [x] ~~Canlı otel stoğu varmış gibi göstermek~~
- [x] ~~Belgesiz transfer sağlayıcısı listelemek~~
- [x] ~~QR takibi olmadan reklam basmak~~
- [x] ~~Web, admin, provider ve mobile için ayrı backend kurmak~~
- [x] ~~Yolcuyu hesap açmaya zorlamak~~

---

## Başarı Ölçütleri

| Dönem | Ölçüt | Hedef |
|---|---|---|
| İlk 7 gün | Web MVP | Canlı test edilebilir |
| İlk 7 gün | Admin panel | Admin login olup gelen transfer, rent a car, otel ve bilet taleplerini görebilir ve status güncelleyebilir |
| İlk 10 gün | Provider panel | Sağlayıcı login olup kendi talebini görebilir ve status güncelleyebilir |
| İlk 15 gün | Sağlayıcı | 3 transfer + 3 rent a car + 3 otel |
| İlk 15 gün | Talep | İlk gerçek talepler |
| İlk 30 gün | Komisyon | İlk tahsil edilen komisyon |
| İlk 30 gün | QR | En az 2 kaynak test edildi |
