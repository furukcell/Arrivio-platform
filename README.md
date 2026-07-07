# Arrivio

**Airport Transfer • Car Rental • Nearby Hotels • Flight Requests**

TR/EN destekli havalimanı yolcu hizmet pazarı. Yolcu uygulamaya/web'e ödeme yapmaz; komisyon hizmet sağlayıcıdan (transfer, rent a car, otel, acente) alınır.

İlk pazar: **Milas-Bodrum Havalimanı (BJV)**

---

## Net Konumlandırma

- Yolcu transfer, rent a car, otel veya bilet hizmetini **sağlayıcı/acente üzerinden** alır, Arrivio'ya ödeme yapmaz.
- Arrivio komisyonu **hizmet sağlayıcıdan** alır, iş gerçekleştiğinde.
- Sadece **belge kontrolünden geçmiş** sağlayıcılar sisteme alınır.
- İlk canlı ürün **mobil web/PWA**'dır. Play Store / App Store süreci beklenmez.
- Mobil uygulama web canlıyken **paralel** geliştirilir, aynı backend'i kullanır.

---

## Repo Yapısı

```
arrivio-platform/
  apps/
    web/        → Next.js mobil web / PWA / landing / QR sayfaları
    admin/      → Next.js admin panel
    mobile/     → Expo React Native mobil uygulama (2. faz)
  packages/
    shared/     → type'lar, status listeleri, sabitler, yardımcı fonksiyonlar
    firebase/   → firebase config, firestore servisleri, auth servisleri
    ui/         → ortak renkler, butonlar, kartlar, input stilleri
  docs/
    product-roadmap.md
    provider-agreements.md
    commission-rules.md
  README.md
  ROADMAP.md
```

**Neden tek repo?** Transfer, rent a car, otel ve bilet talepleri hem webde hem admin'de hem ileride mobilde aynı veriyle çalışacak. Status değerleri, komisyon hesaplama, telefon formatlama gibi ortak mantık `packages/shared` üzerinden tek yerden yönetilir.

---

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Web | Next.js |
| Admin | Next.js |
| Mobil | Expo React Native |
| Backend | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Auth |
| Hosting | Vercel veya Firebase Hosting |

---

## Ana Modüller

1. **Transfer Bul** — ana gelir kaynağı
2. **Kiralık Araç Bul** — ikinci ana gelir kaynağı
3. **Yakındaki Oteller** — güçlü tamamlayıcı
4. **Bilet Sor** — yan gelir, acente lead'i
5. **Uçuş Takip** — güven/fark yaratıcı özellik (2. faz API)

---

## Roller ve Kimlik Doğrulama

**Yolcu → hesap YOK.** Login/şifre yok. Form doldurur, telefon girer, sistem talep kodu üretir (`TRF-1024` gibi). Durumunu **telefon + kod** ile `arrivio.com/durum` sayfasından sorgular (kargo takibi mantığı). Havalimanında "hesap oluştur" turistı kaçırır, o yüzden bilinçli olarak yok.

**Sağlayıcı (transfer / rent a car / otel / acente) → hesap VAR, Firebase Auth zorunlu.** Kendi talebini görür, başkasının müşterisini göremez (Firestore security rule ile `assignedProviderId` filtreli). `users` koleksiyonunda `role` alanı hangi paneli göreceğini belirler.

**MVP kararı:** Sağlayıcı paneli/login'i ilk sürümde zorunlu değil — admin sağlayıcı adına telefon/WhatsApp üzerinden yönetebilir. Ama veri modeli (`providers` koleksiyonu, `providerId` alanı) en baştan sağlayıcı login'ine hazır kurulur, sadece login ekranı 2. faza bırakılabilir.

```
Yolcu form doldurur (hesapsız)
     ↓
Firestore'a kayıt, requestCode üretilir
     ↓
Admin sağlayıcı atar (veya otomatik atanır)
     ↓
Sağlayıcı kendi hesabıyla girer (veya admin WhatsApp'la yönlendirir)
     ↓
Sadece kendi talebini görür, kabul eder, status günceller
     ↓
Yolcu kod+telefon ile durumu sorgular
```

---

## Talep Kodları

- `TRF-1001` → Transfer
- `RAC-2001` → Rent a Car
- `HTL-3001` → Otel
- `TKT-4001` → Bilet

---

## MVP'de Olmayacaklar

- Online ödeme
- Canlı otel/araç stok entegrasyonu
- WhatsApp API
- Flight API (zorunlu değil, veri modeli hazır olacak)
- Sağlayıcı paneli (admin sağlayıcı adına yönetebilir)
- Yolcu hesabı

---

## Detaylı Plan

Adım adım yapılacaklar listesi için [ROADMAP.md](./ROADMAP.md) dosyasına bakın.
