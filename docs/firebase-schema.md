# Firebase Schema

## users

```text
users/{uid}
  uid
  role: "admin" | "provider"
  providerId?: string
  email
  displayName
  createdAt
  updatedAt
```

## providers

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
  notes
  createdAt
  updatedAt
```

## transferRequests

- requestCode
- passengerName
- passengerPhone
- passengerEmail
- language
- airportCode
- flightCode
- destination
- passengers
- bags
- vehicleClass
- pickupDate
- pickupTime
- status
- qrSourceId
- assignedProviderId
- estimatedTotalPrice
- currency
- commissionAmount
- commissionStatus
- adminNote
- providerNote
- createdAt
- updatedAt

## carRentalRequests

- requestCode
- passengerName
- passengerPhone
- language
- airportCode
- pickupLocation
- dropoffLocation
- pickupDate
- dropoffDate
- carClass
- transmission
- status
- qrSourceId
- assignedProviderId
- estimatedTotalPrice
- currency
- commissionAmount
- commissionStatus
- adminNote
- providerNote
- createdAt
- updatedAt

## hotelRequests

- requestCode
- passengerName
- passengerPhone
- language
- airportCode
- checkInDate
- checkOutDate
- guests
- rooms
- radiusKm
- wantsTransfer
- status
- qrSourceId
- assignedProviderId
- estimatedTotalPrice
- currency
- commissionAmount
- commissionStatus
- adminNote
- providerNote
- createdAt
- updatedAt

## ticketRequests

- requestCode
- passengerName
- passengerPhone
- language
- fromAirportOrCity
- toAirportOrCity
- departureDate
- returnDate
- passengers
- status
- assignedProviderId
- commissionAmount
- commissionStatus
- adminNote
- providerNote
- createdAt
- updatedAt

## qrSources

- slug
- title
- type
- airportCode
- locationLabel
- isActive
- createdAt
- updatedAt

## qrEvents

- qrSourceId
- path
- userAgent
- language
- createdAt

## adminLogs

- adminUserId
- action
- requestType
- requestId
- note
- createdAt

## Security Rule Mantığı

- Admin tüm request/provider/user kayıtlarını görebilir.
- Provider sadece `assignedProviderId == users/{uid}.providerId` olan talepleri görebilir.
- Provider başka provider'ın talebini okuyamaz.
- Yolcu koleksiyonları doğrudan okuyamaz.
- Yolcu durum sorgulama ayrı endpoint/fonksiyon ile sınırlı bilgi döndürür.
