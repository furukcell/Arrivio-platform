export const USER_ROLES = ["admin", "provider"] as const;

export const PROVIDER_TYPES = ["transfer", "carRental", "hotel", "agency"] as const;

export const AIRPORTS = [
  {
    code: "BJV",
    name: "Milas-Bodrum Airport",
    trName: "Milas-Bodrum Havalimanı",
    city: "Muğla",
    country: "TR",
    latitude: 37.2506,
    longitude: 27.6643
  }
] as const;

export const REQUEST_TYPES = ["transfer", "carRental", "hotel", "ticket"] as const;

export const TRANSFER_STATUSES = [
  "new",
  "provider_pending",
  "confirmed",
  "passenger_waiting",
  "passenger_picked_up",
  "completed",
  "cancelled",
  "no_show"
] as const;

export const CAR_RENTAL_STATUSES = [
  "new",
  "availability_checking",
  "provider_pending",
  "confirmed",
  "vehicle_delivered",
  "vehicle_returned",
  "completed",
  "cancelled"
] as const;

export const HOTEL_STATUSES = [
  "new",
  "hotel_pending",
  "price_sent",
  "passenger_accepted",
  "completed",
  "cancelled"
] as const;

export const TICKET_STATUSES = [
  "new",
  "sent_to_agency",
  "price_sent",
  "sold",
  "lost",
  "cancelled"
] as const;

export const COMMISSION_STATUSES = [
  "pending",
  "invoiced",
  "paid",
  "cancelled"
] as const;

export const QR_SOURCE_TYPES = [
  "airport_domestic",
  "airport_international",
  "airport_parking",
  "hotel_desk",
  "ad_campaign",
  "manual"
] as const;
