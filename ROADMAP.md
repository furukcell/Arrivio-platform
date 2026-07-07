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
| Step 7 | Next | Firebase Auth, role kontrolü ve providerId eşleşmesiyle güvenli canlı akış. |
| Step 8 | Pending | Komisyon takibi. |
| Step 9 | Pending | QR kaynak takibi. |
| Step 10 | Pending | Rent a car formu. |
| Step 11 | Pending | Otel uygunluk talep formu. |
| Step 12 | Pending | Bilet talep formu. |
| Step 13 | Pending | Mobil MVP. |

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
- [ ] TR/EN dil yapısı kurulacak.
- [ ] Ana sayfada 4 aksiyon net görünecek:
  - Transfer
  - Car Rental
  - Hotels
  - Ticket Request
- [x] Transfer formu Firestore `transferRequests` koleksiyonuna kayıt atacak.
- [ ] Rent a car formu Firestore `carRentalRequests` koleksiyonuna kayıt atacak.
- [ ] Otel formu Firestore `hotelRequests` koleksiyonuna kayıt atacak.
- [ ] Bilet formu Firestore `ticketRequests` koleksiyonuna kayıt atacak.
- [x] Transfer talebi için kod üretilecek.
- [x] Yolcuya transfer formu sonrası talep kodu gösterilecek.
- [ ] WhatsApp destek butonu eklenecek.
- [x] “Arrivio yolcudan ücret almaz” metni transfer sayfasında görünecek.

---

## Faz 2 — Admin Panel

Amaç: Operasyon ekibi tüm talepleri, sağlayıcıları ve komisyonları yönetebilsin.

- [x] `apps/admin` Next.js projesi ayağa kalkacak.
- [ ] Admin Firebase Auth login oluşturulacak.
- [ ] Admin role kontrolü yapılacak.
- [x] Transfer talepleri listelenecek.
- [ ] Rent a car talepleri listelenecek.
- [ ] Otel talepleri listelenecek.
- [ ] Bilet talepleri listelenecek.
- [ ] Talep detay ekranı olacak.
- [ ] Talep status güncellenebilecek.
- [x] Sağlayıcı oluşturma ekranı olacak.
- [ ] Sağlayıcıya kullanıcı atama/davet mantığı olacak.
- [x] Transfer talebi sağlayıcıya atanabilecek.
- [ ] Komisyon tutarı girilebilecek.
- [ ] Komisyon status güncellenecek:
  - `pending`
  - `invoiced`
  - `paid`
  - `cancelled`
- [ ] Admin işlem notu ekleyebilecek.
- [x] Admin log mantığı veri modelinde hazır.

---

## Faz 3 — Provider Panel

Amaç: Sağlayıcı kendi hesabıyla giriş yapıp kendisine atanmış talepleri yönetebilsin.

- [x] `apps/provider` Next.js projesi repo iskeletinde var.
- [ ] Provider Firebase Auth login oluşturulacak.
- [ ] `users/{uid}.role = provider` kontrolü yapılacak.
- [ ] `users/{uid}.providerId` ile provider eşleşmesi yapılacak.
- [x] Provider sadece kendisine atanmış transfer taleplerini görebilecek. MVP'de query `providerId` ile test edilir.
- [x] Dashboard ekranı olacak.
- [x] Yeni Talepler ekranı olacak. MVP'de `/transfers`.
- [ ] Aktif İşler ekranı olacak.
- [ ] Tamamlanan İşler ekranı olacak.
- [ ] Komisyonlar ekranı olacak.
- [ ] Provider talebi kabul/reddedebilecek. MVP'de status update vardır, reject/cancel vardır.
- [x] Provider status güncelleyebilecek.
- [ ] Provider fiyat/not girebilecek.
- [ ] Provider yolcuya WhatsApp linkiyle geçebilecek.

---

## Faz 4 — QR Kaynak Takibi

Amaç: Havalimanı reklam/QR kaynaklarının hangisinin çalıştığını ölçmek.

- [x] `qrSources` koleksiyonu veri modelinde hazır.
- [x] `qrEvents` koleksiyonu veri modelinde hazır.
- [ ] QR linkleri çalışacak:
  - `/qr/bjv-domestic-arrivals`
  - `/qr/bjv-international-arrivals`
  - `/qr/bjv-parking`
  - `/qr/bjv-transfer-desk`
- [ ] QR link açıldığında kaynak kaydedilecek.
- [ ] Yolcu form gönderdiğinde `qrSourceId` talebe yazılacak.
- [ ] Admin panelde QR performans ekranı olacak.
- [ ] QR kaynak raporunda ziyaret ve talep sayısı görünecek.

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

- [ ] Mobil ekranda tek elle kullanılabilir.
- [ ] TR/EN dil seçimi görünür.
- [ ] Ana sayfada Transfer / Car Rental / Hotels / Ticket aksiyonları net.
- [x] Transfer formu gönderince Firestore kaydı oluşur.
- [x] Transfer formu sonrası talep kodu görünür.
- [ ] QR kaynağı talebe yazılır.
- [ ] WhatsApp destek butonu görünür.
- [x] Yolcudan ücret alınmayacağı transfer ekranında yazılıdır.

### Admin

- [x] Admin transfer taleplerini görebilir.
- [ ] Admin tüm talep türlerini görebilir.
- [ ] Status güncelleyebilir.
- [x] Sağlayıcı oluşturabilir.
- [x] Transfer sağlayıcı atayabilir.
- [ ] Komisyon tutarı ve komisyon durumu girebilir.
- [ ] QR kaynak performansını görebilir.
- [ ] Talep notu ekleyebilir.

### Provider

- [ ] Provider login çalışır.
- [x] Provider kendi providerId'sine atanmış transfer taleplerini görür.
- [x] Provider transfer status günceller.
- [ ] Provider komisyonlarını görür.
- [ ] Provider başka provider'ın müşterisini göremez. MVP query akışıyla test edilir; canlı için Auth + rules gerekir.

---

## Yapılmayacaklar

- [x] ~~Uygulama bitmeden web'i bekletmek~~
- [x] ~~İlk günden online ödeme kurmak~~
- [x] ~~Canlı otel stoğu varmış gibi göstermek~~
- [x] ~~Belgesiz transfer sağlayıcısı listelemek~~
- [ ] ~~QR takibi olmadan reklam basmak~~
- [x] ~~Web, admin, provider ve mobile için ayrı backend kurmak~~
- [x] ~~Yolcuyu hesap açmaya zorlamak~~

---

## Başarı Ölçütleri

| Dönem | Ölçüt | Hedef |
|---|---|---|
| İlk 7 gün | Web MVP | Canlı test edilebilir |
| İlk 7 gün | Admin panel | Gelen transfer talebini görebilir ve sağlayıcıya atayabilir |
| İlk 10 gün | Provider panel | Sağlayıcı kendi talebini görebilir ve status güncelleyebilir |
| İlk 15 gün | Sağlayıcı | 3 transfer + 3 rent a car + 3 otel |
| İlk 15 gün | Talep | İlk gerçek talepler |
| İlk 30 gün | Komisyon | İlk tahsil edilen komisyon |
| İlk 30 gün | QR | En az 2 kaynak test edildi |
