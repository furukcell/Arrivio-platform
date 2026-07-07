# Step 15 — Ticket Request Form

Bu adımda bilet talep formu ve admin listeleme ekranı eklendi.

## Eklenenler

- `apps/web/src/ticketFormModel.ts`
- `apps/web/src/ticketRequestMapper.ts`
- `apps/web/pages/ticket.tsx`
- `packages/firebase/src/requests.ts` içine `listTicketRequests()`
- `apps/admin/pages/ticket.tsx`
- Web ana sayfasına `/ticket` linki
- Admin ana sayfasına `/ticket` linki

## Yolcu Akışı

1. Yolcu `/ticket` sayfasını açar.
2. İsim, telefon, kalkış yeri, varış yeri, gidiş tarihi, dönüş tarihi ve yolcu sayısı girer.
3. Form Firestore `ticketRequests` koleksiyonuna kayıt atar.
4. Yolcuya talep kodu gösterilir.

## Admin Akışı

1. Admin `/login` ile giriş yapar.
2. Admin `/ticket` ekranına girer.
3. Son bilet taleplerini görür.
4. Talebin telefon, rota, tarih, yolcu sayısı ve status bilgisini inceler.

## Kaydedilen Koleksiyon

```text
ticketRequests
```

## Not

Bu doğrudan bilet satışı veya ödeme sistemi değildir. İlk MVP'de yetkili acenteye yönlendirilecek bilet lead toplama akışıdır.
