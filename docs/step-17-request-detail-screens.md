# Step 17 — Request Detail Screens

Bu adımda admin tarafında talep detay ekranı ve operasyon notu mantığı başlatıldı.

## Eklenen Firebase Servisleri

`packages/firebase/src/requests.ts` içine tekil talep okuma servisleri eklendi:

```text
getTransferRequest()
getCarRentalRequest()
getHotelRequest()
getTicketRequest()
```

Bu servisler ilgili Firestore koleksiyonundan tek doküman okur ve detay ekranlarında kullanılır.

## Eklenen Admin Detay Sayfaları

```text
/transfers/[id]
/car-rental/[id]
/hotel/[id]
```

## Detay Ekranlarında Görünenler

### Transfer

- Talep kodu
- Yolcu adı
- Telefon
- Varış noktası
- Yolcu ve bagaj sayısı
- Uçuş kodu
- QR source
- Provider bilgisi
- Status
- Toplam fiyat
- Komisyon tutarı
- Komisyon durumu
- Admin operasyon notu

### Car Rental

- Talep kodu
- Yolcu adı
- Telefon
- Alış / bırakış yeri
- Alış / bırakış tarihi
- Araç sınıfı
- Şanzıman
- QR source
- Status
- Admin operasyon notu

### Hotel

- Talep kodu
- Yolcu adı
- Telefon
- Check-in / check-out
- Kişi / oda sayısı
- Arama yarıçapı
- Transfer isteği
- QR source
- Status
- Admin operasyon notu

## Not

Ticket detay ekranı bu turda araç filtresine takıldığı için liste + status update seviyesinde bırakıldı. Ticket için detay ekranı daha sonra daha küçük parçalara bölünerek tekrar denenebilir.
