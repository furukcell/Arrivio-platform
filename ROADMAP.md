# Arrivio Yol Haritası

İlerledikçe kutucukları `[x]` yaparak tikleyin. Sıralama önemli — üstteki adımlar alttakilerin önkoşulu.

---

## Faz 0 — Kurulum (Gün 1)

- [ ] GitHub'da `arrivio-platform` reposu oluştur
- [ ] `apps/web`, `apps/admin`, `apps/mobile` klasörlerini oluştur
- [ ] `packages/shared`, `packages/firebase`, `packages/ui` klasörlerini oluştur
- [ ] Firebase projesini aç (Arrivio Production veya Arrivio MVP)
- [ ] Firestore, Auth, Storage servislerini aktif et
- [ ] `packages/shared` içine ana koleksiyon isimlerini ve status sabitlerini ekle
- [ ] Sağlayıcı login kararı netleştir: MVP'de sağlayıcı Firebase Auth ile mi girecek, yoksa admin sağlayıcı adına mı yönetecek (bkz. README → Roller ve Kimlik Doğrulama)
- [ ] Domain adayı kontrolü (arrivio.com.tr / arrivio.app / arrivio.travel)
- [ ] Sosyal medya kullanıcı adı kontrolü
- [ ] Acenteci arkadaşla komisyon konuşmasına başla

---

## Faz 1 — Web MVP Temeli (Gün 2-3)

- [ ] Web ana sayfa taslağını kur (Next.js)
- [ ] TR/EN dil yapısını ekle (`/locales/tr.json`, `/locales/en.json`)
- [ ] Transfer talep formunu çalışır hale getir
- [ ] Form submit → Firestore `transferRequests` koleksiyonuna kayıt
- [ ] Rezervasyon kodu üretimi (`TRF-1001` formatı)
- [ ] Admin panelde transfer taleplerinin listelenmesi
- [ ] Rent a car formunu ekle → `carRentalRequests`
- [ ] Bilet talep formunu ekle → `ticketRequests`
- [ ] Otel uygunluk formunu ekle → `hotelRequests`
- [ ] Her formda `qrSourceId` alanının kaydedilmesi

**Operasyon (paralel):**
- [ ] 3 transferci ile görüşme listesi çıkar
- [ ] 3 rent a car firmasıyla görüşme listesi çıkar
- [ ] 5 otel/apart ile görüşme listesi çıkar
- [ ] İlk sağlayıcı sözleşme taslağı hazırla

---

## Faz 2 — QR ve Admin Genişletme (Gün 4-7)

- [ ] `qrSources` ve `qrEvents` koleksiyon yapısını kur
- [ ] QR link mantığını kur (`arrivio.com/qr/bjv-domestic-arrivals` vb.)
- [ ] Admin panelde QR kaynak raporu ekranı
- [ ] Admin panelde status güncelleme (transfer/rentacar/otel/bilet)
- [ ] Admin panelde komisyon tutarı girme
- [ ] Komisyon status akışı: `pending → invoiced → paid → cancelled`
- [ ] TR/EN metin temizliği ve kontrolü
- [ ] Rota bazlı sabit fiyat listesi oluştur (BJV → Bodrum Merkez, Yalıkavak, vb.)
- [ ] Web canlı test

---

## Faz 3 — İlk 30 Gün / Canlı Test

### Hafta 1 — Yayına Hazırlık
- [ ] Mobil web MVP tam çalışır durumda
- [ ] Admin panelden tüm talepler görülebiliyor
- [ ] QR kaynak sistemi aktif
- [ ] En az 3 transferci, 3 rent a car, 3 otel/apart, 1 acente sisteme dahil

### Hafta 2 — İlk Canlı Test
- [ ] Site sınırlı kullanıcıyla test edildi
- [ ] Gerçek talep simülasyonu yapıldı (acenteci + sağlayıcılarla)
- [ ] Test QR kodları basıldı
- [ ] Instagram/WhatsApp üzerinden küçük duyuru yapıldı
- [ ] İlk gerçek talepler elle yönetildi

### Hafta 3 — Operasyon Sıkılaştırma
- [ ] Komisyon raporu temizlendi
- [ ] Sağlayıcı cevap verme süresi ölçüldü
- [ ] Kötü dönüş yapan sağlayıcılar pasife alındı
- [ ] Yolcu mesaj şablonları (TR/EN) hazırlandı
- [ ] Havalimanı reklam/QR yerleşimi için resmi imkan araştırıldı

### Hafta 4 — Mobil Uygulama ve Büyüme
- [ ] Expo mobil app ana ekranı tamamlandı
- [ ] Web'deki veri modeli mobilde kullanılmaya başlandı
- [ ] Flight API araştırması yapıldı (entegrasyon zorunlu değil)
- [ ] Küçük bütçeli Google Ads/Instagram testi
- [ ] Dalaman (DLM) senaryosu dokümante edildi

---

## Kabul Kriterleri (Referans)

**Web:**
- [ ] Mobil ekranda tek elle kullanılabilir
- [ ] Ana sayfada 4 aksiyon net: Transfer / Car Rental / Hotels / Ticket
- [ ] Form gönderilince talep kodu gösteriliyor
- [ ] WhatsApp destek butonu görünür
- [ ] "Yolcudan ücret alınmaz" metni net yazılı

**Admin:**
- [ ] Login çalışıyor
- [ ] Talep türleri ayrı sekmelerde
- [ ] Status ve sağlayıcı atama yapılabiliyor
- [ ] Komisyon durumu güncellenebiliyor
- [ ] Admin log tutuluyor

**Mobil (2. faz):**
- [ ] Web ile aynı marka/modülleri kullanıyor
- [ ] Ortak Firestore servislerini `packages/firebase` üzerinden çağırıyor

---

## Yapılmayacaklar (Hatırlatma)

- [ ] ~~Uygulama bitmeden web'i bekletmek~~
- [ ] ~~İlk günden ödeme sistemi kurmaya çalışmak~~
- [ ] ~~Canlı otel stoğu varmış gibi göstermek~~
- [ ] ~~Belgesiz sağlayıcı listelemek~~
- [ ] ~~QR takibi olmadan reklam basmak~~
- [ ] ~~Web/mobil/admin için ayrı veri modeli kurmak~~

---

## Başarı Ölçütleri

| Dönem | Ölçüt | Hedef |
|---|---|---|
| İlk 7 gün | Web MVP | Canlı test edilebilir |
| İlk 15 gün | Sağlayıcı | 3 transfer + 3 rent a car + 3 otel |
| İlk 15 gün | Talep | İlk gerçek talepler |
| İlk 30 gün | Komisyon | İlk tahsil edilen komisyon |
| İlk 30 gün | QR | En az 2 kaynak test edildi |
