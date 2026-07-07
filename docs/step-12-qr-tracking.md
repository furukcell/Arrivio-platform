# Step 12 — QR Source Tracking

Bu adımda QR kaynak takibi eklendi.

## Eklenenler

- `packages/firebase/src/qr.ts`
- `apps/web/pages/qr/[slug].tsx`
- `apps/web/pages/transfer.tsx` içine `qrSourceId` taşıma
- `apps/admin/pages/qr.tsx`
- Admin dashboard'a `/qr` linki

## Akış

1. Admin `/qr` ekranında QR source oluşturur.
2. Her QR source için slug oluşur:

```text
bjv-domestic-arrivals
bjv-international-arrivals
bjv-parking
bjv-transfer-desk
```

3. Yolcu QR linkini açar:

```text
/qr/bjv-domestic-arrivals
```

4. Web sayfası slug ile `qrSources` koleksiyonundan kaynağı bulur.
5. `qrEvents` koleksiyonuna scan/event kaydı atar.
6. Yolcu `Request Transfer` butonuna basar.
7. Transfer formu şu linkle açılır:

```text
/transfer?qrSourceId=QR_SOURCE_DOC_ID
```

8. Transfer talebi gönderilince `transferRequests.qrSourceId` alanı yazılır.

## Admin Ekranı

`/qr` ekranında admin şunları yapabilir:

- QR source oluşturma
- QR source listesi görme
- `/qr/slug` linklerini görme
- son QR event kayıtlarını görme

## Firestore Koleksiyonları

```text
qrSources
qrEvents
transferRequests
```

## Operasyon Notu

İlk canlı test için en az 2 QR source oluşturmak yeterli:

```text
bjv-domestic-arrivals
bjv-international-arrivals
```

Bu sayede hangi terminalden daha çok talep geldiği ölçülebilir.
