# Step 13 — Car Rental Request Form

Bu adımda rent a car talep formu ve admin listeleme ekranı eklendi.

## Eklenenler

- `apps/web/src/carRentalFormModel.ts`
- `apps/web/src/rentalRequestMapper.ts`
- `apps/web/pages/car-rental.tsx`
- `packages/firebase/src/requests.ts` içine `listCarRentalRequests()`
- `apps/admin/pages/car-rental.tsx`
- Web ana sayfasına `/car-rental` linki
- Admin ana sayfasına `/car-rental` linki

## Yolcu Akışı

1. Yolcu `/car-rental` sayfasını açar.
2. İsim, telefon, uçuş kodu, teslim alma yeri, tarih ve araç sınıfını girer.
3. Form Firestore `carRentalRequests` koleksiyonuna kayıt atar.
4. Yolcuya talep kodu gösterilir.

## Admin Akışı

1. Admin `/login` ile giriş yapar.
2. Admin `/car-rental` ekranına girer.
3. Son araç kiralama taleplerini görür.
4. Talebin telefon, tarih, araç sınıfı, şanzıman ve status bilgisini inceler.

## Kaydedilen Koleksiyon

```text
carRentalRequests
```

## Not

Bu adımda sağlayıcı atama ve komisyon takibi sadece transfer için olduğu kadar detaylı yapılmadı. Rent a car için ilk MVP hedefi lead toplamak ve admin panelde görmek.
