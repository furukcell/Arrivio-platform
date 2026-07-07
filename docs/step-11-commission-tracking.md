# Step 11 — Commission Tracking

Bu adımda transfer talepleri için komisyon takibi eklendi.

## Eklenenler

- `packages/firebase/src/requests.ts` içine `updateTransferCommission()` eklendi.
- `apps/admin/pages/transfers.tsx` içine komisyon formu eklendi.
- `apps/provider/pages/transfers.tsx` içine fiyat ve komisyon bilgisi gösterimi eklendi.

## Admin Akışı

Admin `/transfers` ekranında her transfer kartında şu bilgileri girer:

```text
Total price
Commission amount
Commission status
Admin note
```

Kaydedilen alanlar:

```text
estimatedTotalPrice
commissionAmount
commissionStatus
adminNote
updatedAt
```

## Commission Status Değerleri

```text
pending
invoiced
paid
cancelled
```

## Provider Görünümü

Provider kendi `/transfers` ekranında kendisine atanmış transfer için şu bilgileri görür:

```text
Price
Commission
Commission status
Admin note
```

Provider bu alanları düzenleyemez. Komisyon takibi admin kontrolündedir.

## Operasyon Notu

İlk canlı operasyonda komisyon status akışı şöyle kullanılabilir:

1. Talep gelir: `pending`
2. İş tamamlanır: komisyon tutarı girilir
3. Mutabakat/fiş beklenir: `invoiced`
4. Tahsilat alınır: `paid`
5. İptal/gerçekleşmeyen iş: `cancelled`
