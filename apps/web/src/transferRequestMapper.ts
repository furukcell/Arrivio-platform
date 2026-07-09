import type { TransferRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import { buildTransferRoute, estimateTransferPrice, getTransferPriceSummary, type TransferFormState } from "./transferFormModel";

export function mapTransferFormToRequest(
  state: TransferFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<TransferRequest, "id" | "createdAt" | "updatedAt"> {
  const route = buildTransferRoute(state);
  const priceSummary = getTransferPriceSummary(state);
  const estimatedPrice = priceSummary?.minPrice ?? estimateTransferPrice(state);

  return {
    type: "transfer",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    transferDirection: state.transferDirection,
    routeFrom: route.routeFrom,
    routeTo: route.routeTo,
    pickupLocation: route.pickupLocation,
    destination: state.destination.trim(),
    passengers: state.passengers,
    bags: state.bags,
    vehicleClass: state.vehicleClass,
    pickupDate: state.pickupDate || undefined,
    pickupTime: state.pickupTime || undefined,
    status: "new",
    qrSourceId,
    estimatedTotalPrice: estimatedPrice,
    estimatedPriceMin: priceSummary?.minPrice ?? estimatedPrice,
    estimatedPriceMax: priceSummary?.maxPrice ?? estimatedPrice,
    matchedProviderCount: priceSummary?.providerCount ?? 0,
    currency: "TRY",
    commissionStatus: "pending"
  };
}
