# Claude Implementation Brief

Bu dosya Claude'a verilecek ana teknik talimattır.

## Görev

Arrivio reposunu çalışan monorepo iskeletine çevir.

## Ana Kararlar

- Tek repo.
- Tek Firebase backend.
- Web/admin/provider/mobil ayrı uygulamalar.
- Web + admin + provider ilk öncelik.
- Mobil uygulama 2. faz.
- Yolcu login yok.
- Sağlayıcı login MVP'de var.
- Sağlayıcı sadece kendisine atanmış talepleri görür.
- Admin tüm talepleri ve sağlayıcıları yönetir.
- Admin gerektiğinde sağlayıcı adına düzeltme yapabilir.
- Online ödeme yok.
- WhatsApp API yok.
- Flight API zorunlu değil.

## İlk Yapılacaklar

1. Kök workspace yapısını kur.
2. `apps/web` Next.js uygulamasını oluştur.
3. `apps/admin` Next.js uygulamasını oluştur.
4. `apps/provider` Next.js uygulamasını oluştur.
5. `apps/mobile` Expo placeholder oluştur.
6. `packages/shared` içine type/status/helper dosyaları koy.
7. `packages/firebase` içine config/collections/request servisleri koy.
8. `packages/ui` içine tasarım tokenları koy.
9. Docs dosyalarını koru.
10. README ve ROADMAP ile uyumlu ilerle.

## MVP Feature List

### Web

- Ana sayfa
- Transfer formu
- Rent a car formu
- Otel uygunluk formu
- Bilet talep formu
- TR/EN dil
- QR kaynak takibi
- WhatsApp destek
- Form sonrası talep kodu gösterimi

### Admin

- Login
- Talep listeleri
- Talep detay
- Status güncelleme
- Sağlayıcı oluşturma
- Sağlayıcı atama
- Komisyon durumu
- QR raporu

### Provider

- Login
- Dashboard
- Kendisine atanmış talepler
- Talebi kabul/reddet
- Status güncelle
- Fiyat/not gir
- Komisyonları gör
- Profil/belge bilgilerini gör

### Shared

- Talep tipleri
- Status sabitleri
- Komisyon status
- Provider type
- User role
- Telefon normalize helper
- WhatsApp link helper
- Talep kodu üretme helper
- Komisyon hesaplama helper

## Kabul Kriteri

Claude işi bitirdiğinde repo en az şu seviyede olmalı:

- `pnpm install` çalışabilir yapı.
- `apps/web`, `apps/admin`, `apps/provider` route iskeleti var.
- `packages/shared` merkezi tip/status kaynağıdır.
- `packages/firebase` Firestore yazma/okuma servisleri placeholder olarak hazırdır.
- Provider Auth + providerId güvenlik mantığı dokümante edilmiştir.
- Docs dosyaları README ile tutarlıdır.
