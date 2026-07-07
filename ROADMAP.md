# Arrivio Yol Haritası

Bu dosya geliştirme ve operasyon sırasını belirler. Sıralama önemlidir: önce web/admin/provider canlıya çıkacak, mobil uygulama paralelde ama ikinci öncelik olarak ilerleyecek.

---

## Faz 0 — Repo ve Ürün Kurulumu

- [ ] `pnpm-workspace.yaml` ve kök `package.json` oluştur.
- [ ] `apps/web`, `apps/admin`, `apps/provider`, `apps/mobile` klasörlerini oluştur.
- [ ] `packages/shared`, `packages/firebase`, `packages/ui` klasörlerini oluştur.
- [ ] `docs/` altındaki strateji dosyalarını oluştur.
- [ ] Firebase projesini aç: `Arrivio MVP` veya `Arrivio Production`.
- [ ] Firestore, Auth ve Storage servislerini aktif et.
- [ ] `.env.example` dosyasını oluştur.
- [ ] Provider Auth kararını uygula: MVP'de sağlayıcı login olacak.
- [ ] Domain adaylarını kontrol et: `arrivio.com.tr`, `arrivio.app`, `arrivio.travel`.
- [ ] Sosyal medya kullanıcı adı kontrolü yap.
- [ ] Acenteci arkadaşla komisyon ve operasyon konuşmasına başla.

---

## Faz 1 — Web MVP

Amaç: QR okutan yolcunun uygulama indirmeden talep bırakabilmesi.

- [ ] `apps/web` Next.js projesi ayağa kalkacak.
- [ ] TR/EN dil yapısı kurulacak.
- [ ] Ana sayfada 4 aksiyon net görünecek:
  - Transfer
  - Car Rental
  - Hotels
  - Ticket Request
- [ ] Transfer formu Firestore `transferRequests` koleksiyonuna kayıt atacak.
- [ ] Rent a car formu Firestore `carRentalRequests` koleksiyonuna kayıt atacak.
- [ ] Otel formu Firestore `hotelRequests` koleksiyonuna kayıt atacak.
- [ ] Bilet formu Firestore `ticketRequests` koleksiyonuna kayıt atacak.
- [ ] Her talep için kod üretilecek.
- [ ] Yolcuya form sonrası talep kodu gösterilecek.
- [ ] WhatsApp destek butonu eklenecek.
- [ ] “Arrivio yolcudan ücret almaz” metni net görünecek.

---

## Faz 2 — Admin Panel

Amaç: Operasyon ekibi tüm talepleri, sağlayıcıları ve komisyonları yönetebilsin.

- [ ] `apps/admin` Next.js projesi ayağa kalkacak.
- [ ] Admin Firebase Auth login oluşturulacak.
- [ ] Admin role kontrolü yapılacak.
- [ ] Transfer talepleri listelenecek.
- [ ] Rent a car talepleri listelenecek.
- [ ] Otel talepleri listelenecek.
- [ ] Bilet talepleri listelenecek.
- [ ] Talep detay ekranı olacak.
- [ ] Talep status güncellenebilecek.
- [ ] Sağlayıcı oluşturma ekranı olacak.
- [ ] Sağlayıcıya kullanıcı atama/davet mantığı olacak.
- [ ] Talep sağlayıcıya atanabilecek.
- [ ] Komisyon tutarı girilebilecek.
- [ ] Komisyon status güncellenecek:
  - `pending`
  - `invoiced`
  - `paid`
  - `cancelled`
- [ ] Admin işlem notu ekleyebilecek.
- [ ] Admin log mantığı veri modelinde hazır olacak.

---

## Faz 3 — Provider Panel

Amaç: Sağlayıcı kendi hesabıyla giriş yapıp kendisine atanmış talepleri yönetebilsin.

- [ ] `apps/provider` Next.js projesi ayağa kalkacak.
- [ ] Provider Firebase Auth login oluşturulacak.
- [ ] `users/{uid}.role = provider` kontrolü yapılacak.
- [ ] `users/{uid}.providerId` ile provider eşleşmesi yapılacak.
- [ ] Provider sadece kendisine atanmış talepleri görebilecek.
- [ ] Dashboard ekranı olacak.
- [ ] Yeni Talepler ekranı olacak.
- [ ] Aktif İşler ekranı olacak.
- [ ] Tamamlanan İşler ekranı olacak.
- [ ] Komisyonlar ekranı olacak.
- [ ] Provider talebi kabul/reddedebilecek.
- [ ] Provider status güncelleyebilecek.
- [ ] Provider fiyat/not girebilecek.
- [ ] Provider yolcuya WhatsApp linkiyle geçebilecek.

---

## Faz 4 — QR Kaynak Takibi

Amaç: Havalimanı reklam/QR kaynaklarının hangisinin çalıştığını ölçmek.

- [ ] `qrSources` koleksiyonu kurulacak.
- [ ] `qrEvents` koleksiyonu kurulacak.
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

- [ ] `apps/mobile` Expo projesi oluştur.
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
- [ ] Form gönderince Firestore kaydı oluşur.
- [ ] Form sonrası talep kodu görünür.
- [ ] QR kaynağı talebe yazılır.
- [ ] WhatsApp destek butonu görünür.
- [ ] Yolcudan ücret alınmayacağı net yazılıdır.

### Admin

- [ ] Admin tüm talepleri görebilir.
- [ ] Status güncelleyebilir.
- [ ] Sağlayıcı oluşturabilir.
- [ ] Sağlayıcı atayabilir.
- [ ] Komisyon tutarı ve komisyon durumu girebilir.
- [ ] QR kaynak performansını görebilir.
- [ ] Talep notu ekleyebilir.

### Provider

- [ ] Provider login çalışır.
- [ ] Provider sadece kendi taleplerini görür.
- [ ] Provider talebi kabul/reddeder.
- [ ] Provider status günceller.
- [ ] Provider komisyonlarını görür.
- [ ] Provider başka provider'ın müşterisini göremez.

---

## Yapılmayacaklar

- [ ] ~~Uygulama bitmeden web'i bekletmek~~
- [ ] ~~İlk günden online ödeme kurmak~~
- [ ] ~~Canlı otel stoğu varmış gibi göstermek~~
- [ ] ~~Belgesiz transfer sağlayıcısı listelemek~~
- [ ] ~~QR takibi olmadan reklam basmak~~
- [ ] ~~Web, admin, provider ve mobile için ayrı backend kurmak~~
- [ ] ~~Yolcuyu hesap açmaya zorlamak~~

---

## Başarı Ölçütleri

| Dönem | Ölçüt | Hedef |
|---|---|---|
| İlk 7 gün | Web MVP | Canlı test edilebilir |
| İlk 7 gün | Admin panel | Gelen talebi görebilir |
| İlk 10 gün | Provider panel | Sağlayıcı kendi talebini görebilir |
| İlk 15 gün | Sağlayıcı | 3 transfer + 3 rent a car + 3 otel |
| İlk 15 gün | Talep | İlk gerçek talepler |
| İlk 30 gün | Komisyon | İlk tahsil edilen komisyon |
| İlk 30 gün | QR | En az 2 kaynak test edildi |
