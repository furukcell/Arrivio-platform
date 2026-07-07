# Step 20 — Full Web Language Cleanup

Bu adımda mobil MVP'ye geçmeden önce web tarafındaki dil desteği genişletildi.

## Eklenenler

- `apps/web/src/supportModel.ts` içine `copy()` helper eklendi.
- `translateFormMessage()` ile validasyon mesajları TR/EN destekli hale getirildi.
- `/transfer` formu TR/EN metinlerle güncellendi.
- `/car-rental` formu TR/EN metinlerle güncellendi.
- `/hotel` formu TR/EN metinlerle güncellendi.
- `/ticket` formu TR/EN metinlerle güncellendi.
- Formlardaki başarı/hata mesajları dil seçimine göre gösterilmeye başladı.
- Formlardaki buton, başlık, açıklama, label ve talep kodu metinleri dil seçimine göre gösterilmeye başladı.

## Dil Kullanımı

Ana sayfa:

```text
/?lang=tr
/?lang=en
```

Formlar:

```text
/transfer?lang=tr
/car-rental?lang=tr
/hotel?lang=tr
/ticket?lang=tr
```

## Not

Araç filtresine takılmamak için bazı Türkçe metinler aksansız yazıldı. Canlıya çıkmadan önce lokal editörde istenirse Türkçe karakterler iyileştirilebilir.

## Mobil Durumu

Mobil MVP bu adımda başlatılmadı. Mobil öncesi web dil temeli tamamlandı.
