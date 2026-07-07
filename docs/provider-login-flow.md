# Provider Login Flow

## Amaç

Sağlayıcıların kendi hesaplarıyla giriş yapıp yalnızca kendilerine atanan talepleri yönetmesi gerekir.

## Sağlayıcı Tipleri

- Transfer firması
- Rent a car firması
- Otel / apart
- Acente

## Kullanıcı Yapısı

Firestore:

```text
users/{uid}
  role: "admin" | "provider"
  providerId?: string
  email
  displayName
  createdAt
```

Provider:

```text
providers/{providerId}
  type: "transfer" | "carRental" | "hotel" | "agency"
  name
  phone
  whatsapp
  email
  isVerified
  isActive
  documents
  createdAt
```

## Admin Sağlayıcı Oluşturma Akışı

1. Admin provider kaydı oluşturur.
2. Admin provider için yetkili kullanıcı e-postasını girer.
3. Firebase Auth üzerinde kullanıcı oluşturulur veya davet linki gönderilir.
4. `users/{uid}` kaydına `role = provider` ve `providerId` yazılır.
5. Provider login olur.
6. Provider sadece kendi `providerId` değerine atanmış işleri görür.

## Talep Atama

Talep ilk oluştuğunda:

```text
assignedProviderId = null
status = "new"
```

Admin talebi sağlayıcıya atadığında:

```text
assignedProviderId = "provider_abc"
status = "provider_pending"
```

Provider panelde görür.

Provider kabul ederse:

```text
status = "confirmed"
```

Provider reddederse:

```text
assignedProviderId = null
status = "new"
adminNote = "Provider rejected"
```

Admin başka sağlayıcıya atar.

## Provider Ekranları

- Dashboard
- Yeni Talepler
- Aktif İşler
- Tamamlanan İşler
- Komisyonlar
- Profil / Belgeler

## Güvenlik Kuralı Mantığı

Provider şunu görebilir:

```text
request.assignedProviderId == users/{uid}.providerId
```

Admin her şeyi görebilir.

Yolcu koleksiyonları doğrudan okuyamaz. Yolcu durum sorgusu özel endpoint veya sınırlı sorgu ile yapılır.

## Admin Müdahalesi

Admin sağlayıcı adına işlem yapabilir ama bu ana akış değildir.

Kullanım amacı:

- Sağlayıcı telefonla bilgi verdiğinde status düzeltmek
- Gecikmiş/eksik komisyonu işlemek
- Yanlış atamayı düzeltmek
- Operasyon krizini çözmek
