# Step 18 — Web Language and WhatsApp Support

Bu adımda web tarafında TR/EN başlangıç desteği, WhatsApp destek linki ve mobil kullanılabilirlik için padding iyileştirmeleri başlatıldı.

## Eklenenler

- `apps/web/src/supportModel.ts`
- Web ana sayfada TR/EN geçiş linkleri
- Web ana sayfada WhatsApp destek linki
- Transfer formunda WhatsApp destek linki
- Car rental formunda WhatsApp destek linki
- Hotel formunda WhatsApp destek linki
- Ticket formunda WhatsApp destek linki

## Env

WhatsApp destek numarası şu env değişkeninden okunur:

```text
NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER=
```

Boş kalırsa geliştirme için geçici fallback numara kullanılır.

## Dil Desteği

Ana sayfa şu query ile dil seçebilir:

```text
/?lang=en
/?lang=tr
```

Ana sayfadaki servis linkleri seçilen dili formlara taşır:

```text
/transfer?lang=tr
/car-rental?lang=tr
/hotel?lang=tr
/ticket?lang=tr
```

Bu adımda formlara tam çeviri yapılmadı; formlarda WhatsApp destek ve dil query okuma altyapısı eklendi. Tam form çevirisi sonraki UI temizlik adımında genişletilebilir.

## Operasyon Notu

İlk canlı testte WhatsApp numarası gerçek operasyon hattı olmalıdır. Öneri:

```text
+90 5xx xxx xx xx
```

Bu hat, transfer/rent a car/hotel/ticket tüm taleplerde ortak destek hattı olarak çalışır.
