import type {
  REQUEST_TYPES,
  TRANSFER_STATUSES,
  CAR_RENTAL_STATUSES,
  HOTEL_STATUSES,
  TICKET_STATUSES,
  COMMISSION_STATUSES,
  QR_SOURCE_TYPES,
  PROVIDER_TYPES,
  USER_ROLES
} from "./constants";

export type UserRole = (typeof USER_ROLES)[number];
export type ProviderType = (typeof PROVIDER_TYPES)[number];
export type RequestType = (typeof REQUEST_TYPES)[number];
export type TransferStatus = (typeof TRANSFER_STATUSES)[number];
export type CarRentalStatus = (typeof CAR_RENTAL_STATUSES)[number];
export type HotelStatus = (typeof HOTEL_STATUSES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];
export type QrSourceType = (typeof QR_SOURCE_TYPES)[number];
export type TransferDirection = "from_airport" | "to_airport";
export type TransferVehicleClass = "economic" | "vip" | "minibus" | "luxury";

export interface AppUser {
  id?: string;
  uid: string;
  role: UserRole;
  providerId?: string;
  email?: string;
  displayName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BaseRequest {
  id?: string;
  requestCode: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  language: "tr" | "en";
  airportCode: "BJV" | string;
  flightCode?: string;
  qrSourceId?: string;
  assignedProviderId?: string;
  providerName?: string;
  estimatedTotalPrice?: number;
  currency: "TRY" | "EUR" | "USD" | "GBP";
  commissionAmount?: number;
  commissionStatus: CommissionStatus;
  adminNote?: string;
  providerNote?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TransferRequest extends BaseRequest {
  type: "transfer";
  status: TransferStatus;
  transferDirection?: TransferDirection;
  routeFrom?: string;
  routeTo?: string;
  pickupLocation?: string;
  destination: string;
  passengers: number;
  bags?: number;
  vehicleClass?: TransferVehicleClass;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  matchedProviderCount?: number;
  pickupDate?: string;
  pickupTime?: string;
}

export interface TransferRoutePrice {
  id?: string;
  providerId: string;
  airportCode: "BJV" | string;
  transferDirection: TransferDirection;
  destination: string;
  vehicleClass: TransferVehicleClass;
  price: number;
  currency: "TRY" | "EUR" | "USD" | "GBP";
  isActive: boolean;
  isVerified?: boolean;
  updatedAt?: unknown;
  createdAt?: unknown;
}

export interface CarRentalRequest extends BaseRequest {
  type: "carRental";
  status: CarRentalStatus;
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: string;
  dropoffDate: string;
  carClass?: "economic" | "middle" | "suv" | "luxury";
  transmission?: "manual" | "automatic";
}

export interface HotelRequest extends BaseRequest {
  type: "hotel";
  status: HotelStatus;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms?: number;
  radiusKm?: number;
  wantsTransfer?: boolean;
}

export interface TicketRequest extends BaseRequest {
  type: "ticket";
  status: TicketStatus;
  fromAirportOrCity: string;
  toAirportOrCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface Provider {
  id?: string;
  type: ProviderType;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  isVerified: boolean;
  isActive: boolean;
  documents?: ProviderDocument[];
  notes?: string;
}

export interface ProviderDocument {
  name: string;
  fileUrl?: string;
  status: "missing" | "uploaded" | "approved" | "rejected";
  expiresAt?: string;
}

export interface QrSource {
  id?: string;
  slug: string;
  title: string;
  type: QrSourceType;
  airportCode?: string;
  locationLabel?: string;
  isActive: boolean;
}
