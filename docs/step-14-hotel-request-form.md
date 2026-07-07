# Step 14 — Hotel Availability Request Form

Bu adımda otel uygunluk talep formu ve admin listeleme ekranı eklendi.

## Eklenenler

- `apps/web/src/hotelFormModel.ts`
- `apps/web/src/hotelRequestMapper.ts`
- `apps/web/pages/hotel.tsx`
- `packages/firebase/src/requests.ts` içine `listHotelRequests()`
- `apps/admin/pages/hotel.tsx`
- Web ana sayfasına `/hotel` linki
- Admin ana sayfasına `/hotel` linki

## Yolcu Akışı

1. Yolcu `/hotel` sayfasını açar.
2. İsim, telefon, uçuş kodu, giriş/çıkış tarihi, kişi sayısı, oda sayısı ve transfer isteğini girer.
3. Form Firestore `hotelRequests` koleksiyonuna kayıt atar.
4. Yolcuya talep kodu gösterilir.

## Admin Akışı

1. Admin `/login` ile giriş yapar.
2. Admin `/hotel` ekranına girer.
3. Son otel uygunluk taleplerini görür.
4. Talebin telefon, tarih, kişi, oda, arama yarıçapı, transfer isteği ve status bilgisini inceler.

## Kaydedilen Koleksiyon

```text
hotelRequests
```

## Not

Bu canlı otel stoğu veya rezervasyon motoru değildir. İlk MVP'de otel/apart lead toplama ve admin panelde görme akışıdır.
