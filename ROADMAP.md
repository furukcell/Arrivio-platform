# Arrivio Yol Haritası

Öncelik: **web canlı test + admin/provider operasyonu + gerçek talep akışı.** Mobil uygulama daha sonra gelecek.

---

## Güncel Step Durumu

| Step | Durum | Açıklama |
|---|---|---|
| Step 1 | Done / Partial | Monorepo iskeleti oluşturuldu. |
| Step 2 | Done | Web transfer formu eklendi. |
| Step 3 | Done | Transfer formu Firestore kaydı eklendi. |
| Step 4 | Done / MVP | Admin transfer listesi eklendi. |
| Step 5 | Done / MVP | Admin provider oluşturma ve transfer atama eklendi. |
| Step 6 | Done / MVP | Provider kendi transferlerini görür ve status günceller. |
| Step 7 | Done / Partial | Provider login ve `users/{uid}.providerId` okuma eklendi. |
| Step 8 | Done | Firestore rules canlı public/admin/provider akışına göre güncellendi ve Console'a yayınlandı. |
| Step 9 | Done / Partial | Admin login ve admin guard eklendi. |
| Step 10 | Done / MVP | Provider query fallback kaldırıldı, provider Auth UID bağlama eklendi. |
| Step 11 | Done / MVP | Transfer komisyon takibi eklendi. |
| Step 12 | Done / MVP | QR source ve QR event takibi eklendi. |
| Step 13 | Done / MVP | Rent a car talep formu ve admin listesi eklendi. |
| Step 14 | Done / MVP | Otel uygunluk talep formu ve admin listesi eklendi. |
| Step 15 | Done / MVP | Bilet talep formu ve admin listesi eklendi. |
| Step 16 | Done / MVP | Admin rent a car, otel ve bilet status güncelleyebilir. |
| Step 17 | Done / Partial | Transfer, rent a car ve otel detay ekranları eklendi. Ticket detay bekliyor. |
| Step 18 | Done / Partial | Ana sayfada TR/EN başlangıcı ve formlarda WhatsApp destek eklendi. |
| Step 19 | Done / MVP | Provider WhatsApp, fiyat/not ve aktif/tamamlanan iş ayrımı eklendi. |
| Step 20 | Done / MVP | Web formları merkezi `webCopy.ts` üzerinden Türkçe karakterli TR/EN metinlerle çalışır. QR landing `lang` bilgisini forma taşır. Formlar seçili dili Firestore `language` alanına yazar. |
| Step 21 | Done / Partial | Firebase Production, Auth, Firestore, rules, admin user, Netlify web deploy ve build fixleri tamamlandı. |
| Step 22 | Current | Canlı web UI iyileştirme, test talebi, Firestore smoke test ve ilk provider/admin canlı kullanım kontrolü. |
| Step 23 | Pending | Admin/provider ayrı deploy veya subdomain. |
| Step 24 | Pending | Mobil MVP. |

---

## Faz 1 — Web MVP

- [x] Ana sayfa servis aksiyonları var.
- [x] Ana sayfa ilk canlı görünüm sonrası mobil landing olarak yeniden tasarlandı.
- [x] Transfer formu var.
- [x] Rent a car formu var.
- [x] Otel uygunluk formu var.
- [x] Bilet talep formu var.
- [x] Tüm formlar Firestore'a kayıt atar.
- [x] Tüm formlar talep kodu üretir.
- [x] Tüm formlar WhatsApp destek gösterir.
- [x] `?lang=tr` ve `?lang=en` çalışır.
- [x] Türkçe/İngilizce metinler `apps/web/src/webCopy.ts` içinde merkezi yönetilir.
- [x] Türkçe metinler Türkçe karakterle tutulur.
- [x] Validasyon mesajları TR/EN desteklidir.
- [x] Başarı ve hata mesajları TR/EN desteklidir.
- [x] Formlar seçili dili Firestore `language` alanına yazar.
- [x] QR landing seçili dili transfer formuna taşır.
- [ ] Canlı sitede transfer formundan gerçek test talebi gönderilecek.
- [ ] Canlı sitede rent a car / hotel / ticket formları smoke test edilecek.

---

## Faz 2 — Admin Panel

- [x] Admin login var.
- [x] Admin role guard var.
- [x] Firebase Auth içinde ilk admin user oluşturuldu.
- [x] Firestore `users/{uid}` admin dokümanı oluşturuldu.
- [x] Transfer talepleri listelenir.
- [x] Rent a car talepleri listelenir.
- [x] Otel talepleri listelenir.
- [x] Bilet talepleri listelenir.
- [x] Transfer provider'a atanabilir.
- [x] Transfer komisyonu girilebilir.
- [x] Rent a car, otel ve bilet status güncellenebilir.
- [x] Transfer, rent a car ve otel detay ekranları başladı.
- [x] Provider oluşturma ve provider Auth UID bağlama var.
- [x] QR source ve QR event ekranı var.
- [ ] Admin panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.
- [ ] Ticket detay ekranı daha sonra tamamlanacak.
- [ ] Admin listelerinden detay sayfasına link akışı temizlenecek.

---

## Faz 3 — Provider Panel

- [x] Provider login var.
- [x] Provider sadece kendisine atanmış transferleri görür.
- [x] Provider status güncelleyebilir.
- [x] Provider fiyat/not girebilir.
- [x] Provider yolcuya WhatsApp linkiyle geçebilir.
- [x] Aktif işler ve tamamlanan işler ayrı görünür.
- [x] Provider komisyon bilgisini görür.
- [ ] İlk gerçek provider Auth user oluşturulacak.
- [ ] Provider user, admin panelde provider doc ile bağlanacak.
- [ ] Provider panel ayrı Netlify deploy veya subdomain olarak canlıya alınacak.

---

## Faz 4 — QR Takibi

- [x] QR source modeli var.
- [x] QR event modeli var.
- [x] `/qr/[slug]` açılınca QR event yazılır.
- [x] QR source id forma taşınır.
- [x] QR linkindeki `lang` bilgisi forma taşınır.
- [x] Admin QR ekranı son eventleri gösterir.
- [ ] QR landing sadece transfer değil, servis seçimi veren daha güçlü sayfaya çevrilecek.
- [ ] Test QR kodları basılacak.

---

## Faz 5 — Canlıya Hazırlık

- [x] Firebase projesi açıldı: Arrivio Production.
- [x] Firestore aktif edildi.
- [x] Authentication Email/Password aktif edildi.
- [x] Web app config alındı ve Netlify env içine girildi.
- [x] İlk admin kullanıcısı oluşturuldu.
- [x] Firestore `users/{uid}` admin profili oluşturuldu.
- [x] Firestore rules uygulanıp yayınlandı.
- [x] `firebase.json` eklendi.
- [x] `netlify.toml` eklendi.
- [x] Netlify web deploy alındı.
- [x] Next monorepo build hataları düzeltildi.
- [x] Firebase client lazy initialize edildi.
- [x] Netlify public Firebase key secrets scan istisnası eklendi.
- [ ] Canlı web arayüz son hali telefonda tekrar kontrol edilecek.
- [ ] Canlı transfer talebi Firestore'a düşüyor mu test edilecek.
- [ ] Canlı rent a car / hotel / ticket formları Firestore'a düşüyor mu test edilecek.
- [ ] Admin panel canlı Firebase ile login/list test edilecek.
- [ ] Provider panel canlı Firebase ile login/list test edilecek.
- [ ] En az 3 belgeli transfer sağlayıcıyla görüşülecek.
- [ ] En az 3 rent a car firmasıyla görüşülecek.
- [ ] En az 3 otel/apart ile görüşülecek.
- [ ] 1 acente ile bilet/transfer/rent a car komisyon şartı netleşecek.
- [ ] İlk rota fiyat tablosu çıkarılacak.
- [ ] İlk 10 talep canlı yönetilecek.
- [ ] İlk komisyon mutabakatı çıkarılacak.

---

## Faz 6 — Mobil MVP

Mobil şu an başlamadı. Web/admin/provider canlı testten geçtikten sonra başlayacak.

- [x] Expo placeholder var.
- [ ] Mobil home ekranı.
- [ ] Mobil talep formları.
- [ ] Shared type/status kullanımı.
- [ ] Firebase servis bağlantısı.
- [ ] Yolcu login olmadan talep bırakma akışı.

---

## Sıradaki Net İş

```text
Canlı web ana sayfa son tasarımını deploy et → transfer test talebi gönder → Firestore'da transferRequests kaydını doğrula → admin login/list test et → provider user oluşturup assigned transfer akışını test et.
```
