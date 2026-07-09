import type { CarRentalDailyPrice, HotelNightlyPrice, TransferRoutePrice } from "@arrivio/shared";
import type { CSSProperties, ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";
import type { WebLanguage } from "../supportModel";
import { whatsappSupportUrl } from "../supportModel";
import { hotelCopy, rentalCopy, ticketCopy, transferCopy } from "../webCopy";
import type { HomeCopy, TabKey } from "../landingContent";
import {
  buildTransferRoute,
  formatTransferPriceRange,
  getTransferPriceSummary,
  TRANSFER_DESTINATION_OPTIONS,
  TRANSFER_DIRECTION_OPTIONS,
  TRANSFER_VEHICLE_OPTIONS,
  type TransferDirection,
  type TransferFormState,
  type TransferVehicleClass
} from "../transferFormModel";
import {
  CAR_RENTAL_CLASS_OPTIONS,
  CAR_RENTAL_PICKUP_OPTIONS,
  CAR_RENTAL_TRANSMISSION_OPTIONS,
  formatCarRentalDailyPriceRange,
  getCarRentalPriceSummary,
  type CarRentalClass,
  type CarRentalFormState,
  type CarRentalTransmission
} from "../carRentalFormModel";
import {
  formatHotelNightlyPriceRange,
  getHotelPriceSummary,
  HOTEL_ACCOMMODATION_OPTIONS,
  type HotelAccommodationType,
  type HotelFormState
} from "../hotelFormModel";
import type { TicketFormState } from "../ticketFormModel";

type RequestPanelProps = {
  home: HomeCopy;
  language: WebLanguage;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  transferForm: TransferFormState;
  setTransferForm: Dispatch<SetStateAction<TransferFormState>>;
  rentalForm: CarRentalFormState;
  setRentalForm: Dispatch<SetStateAction<CarRentalFormState>>;
  hotelForm: HotelFormState;
  setHotelForm: Dispatch<SetStateAction<HotelFormState>>;
  ticketForm: TicketFormState;
  setTicketForm: Dispatch<SetStateAction<TicketFormState>>;
  transferRoutePrices: TransferRoutePrice[];
  carRentalDailyPrices: CarRentalDailyPrice[];
  hotelNightlyPrices: HotelNightlyPrice[];
  isSubmitting: boolean;
  status: string;
  requestCode: string;
  submitActiveForm: () => void;
};

const transferStepStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  padding: "20px 28px 0"
};

const transferStepBadgeStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "999px",
  background: "#075ee8",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 950
};

const priceSummaryStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "center",
  margin: "0 28px 20px",
  padding: "18px",
  borderRadius: "20px",
  background: "#e9fbf6",
  border: "1px solid #c7f2e7"
};

const embeddedPriceSummaryStyle: CSSProperties = {
  ...priceSummaryStyle,
  gridColumn: "1 / -1",
  margin: 0
};

const transferSelectionGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
};

const transferContactGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
};

export function RequestPanel({
  home,
  language,
  activeTab,
  setActiveTab,
  transferForm,
  setTransferForm,
  rentalForm,
  setRentalForm,
  hotelForm,
  setHotelForm,
  ticketForm,
  setTicketForm,
  transferRoutePrices,
  carRentalDailyPrices,
  hotelNightlyPrices,
  isSubmitting,
  status,
  requestCode,
  submitActiveForm
}: RequestPanelProps) {
  const transferText = transferCopy(language);
  const rentalText = rentalCopy(language);
  const hotelText = hotelCopy(language);
  const ticketText = ticketCopy(language);
  const activeTitle = activeTab === "transfer" ? transferText.title : activeTab === "rental" ? rentalText.title : activeTab === "hotel" ? hotelText.title : ticketText.title;
  const activeDescription = activeTab === "transfer" ? transferText.description : activeTab === "rental" ? rentalText.description : activeTab === "hotel" ? hotelText.description : ticketText.description;
  const activeSubmit = activeTab === "transfer" ? transferText.submit : activeTab === "rental" ? rentalText.submit : activeTab === "hotel" ? hotelText.submit : ticketText.submit;
  const activeSending = activeTab === "transfer" ? transferText.sending : activeTab === "rental" ? rentalText.sending : activeTab === "hotel" ? hotelText.sending : ticketText.sending;
  const tabItems: Array<[TabKey, string]> = [["transfer", home.tabs.transfer], ["rental", home.tabs.rental], ["hotel", home.tabs.hotel], ["ticket", home.tabs.ticket]];
  const liveTransferPrices = transferRoutePrices.length ? transferRoutePrices : undefined;
  const liveRentalPrices = carRentalDailyPrices.length ? carRentalDailyPrices : undefined;
  const liveHotelPrices = hotelNightlyPrices.length ? hotelNightlyPrices : undefined;

  const transferRoute = buildTransferRoute(transferForm);
  const priceSummary = getTransferPriceSummary(transferForm, liveTransferPrices);
  const priceRangeText = formatTransferPriceRange(priceSummary);
  const priceLabel = language === "tr" ? "Tahmini fiyat aralığı" : "Estimated price range";
  const providerCountLabel = priceSummary ? (language === "tr" ? `${priceSummary.providerCount} uygun araç` : `${priceSummary.providerCount} available vehicles`) : (language === "tr" ? "Uygun araç kontrol edilecek" : "Availability will be checked");
  const routeStepTitle = language === "tr" ? "Transfer yönünü ve rotanı seç" : "Choose direction and route";
  const contactStepTitle = language === "tr" ? "Son bilgileri bırak" : "Add final details";
  const routeHelper = language === "tr" ? "Havalimanından çıkış mı, yoksa bölgeden havalimanına geliş mi olduğunu seç. Sonra bölge, tarih, saat ve araç tipini belirle." : "Choose whether the trip starts from the airport or goes to the airport. Then select area, date, time and vehicle type.";
  const priceHelper = language === "tr" ? `Rota: ${transferRoute.routeFrom} → ${transferRoute.routeTo}. Net fiyat işi alan sağlayıcı onayıyla kesinleşir.` : `Route: ${transferRoute.routeFrom} → ${transferRoute.routeTo}. Final price is confirmed by the provider who accepts the job.`;
  const directionLabel = language === "tr" ? "Transfer yönü" : "Transfer direction";
  const destinationLabel = transferForm.transferDirection === "to_airport" ? (language === "tr" ? "Nereden alınacak?" : "Pickup area") : transferText.destination;
  const pickupDateLabel = language === "tr" ? "Alış tarihi" : "Pickup date";
  const pickupTimeLabel = language === "tr" ? "Alış saati" : "Pickup time";
  const vehicleLabel = language === "tr" ? "Araç tipi" : "Vehicle type";
  const bagsLabel = language === "tr" ? "Bagaj" : "Bags";

  const rentalSummary = getCarRentalPriceSummary(rentalForm, liveRentalPrices);
  const rentalPriceText = formatCarRentalDailyPriceRange(rentalSummary);
  const rentalVehicleCount = rentalSummary ? (language === "tr" ? `${rentalSummary.vehicleCount} uygun araç` : `${rentalSummary.vehicleCount} available cars`) : (language === "tr" ? "Uygun araç kontrol edilecek" : "Availability will be checked");
  const rentalHelper = language === "tr" ? `Tahmini ${rentalSummary?.rentalDays || 1} gün. Net fiyat rent a car firması onayıyla kesinleşir.` : `Estimated ${rentalSummary?.rentalDays || 1} days. Final price is confirmed by the rental provider.`;

  const hotelSummary = getHotelPriceSummary(hotelForm, liveHotelPrices);
  const hotelPriceText = formatHotelNightlyPriceRange(hotelSummary);
  const hotelCount = hotelSummary ? (language === "tr" ? `${hotelSummary.hotelCount} uygun tesis` : `${hotelSummary.hotelCount} available properties`) : (language === "tr" ? "Uygun tesis kontrol edilecek" : "Availability will be checked");
  const hotelHelper = language === "tr" ? `Tahmini ${hotelSummary?.nightCount || 1} gece. Net fiyat tesis müsaitlik onayıyla kesinleşir.` : `Estimated ${hotelSummary?.nightCount || 1} nights. Final price is confirmed after property availability.`;

  return (
    <section id="request-panel" className="requestPanel">
      <div className="panelHead"><div><span>01</span><h2>{activeTitle}</h2><p>{activeDescription}</p></div><a href={whatsappSupportUrl(language)}>{home.common.support}</a></div>
      <div className="tabs">{tabItems.map(([key, label]) => <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)}>{label}</button>)}</div>
      {activeTab === "transfer" ? (
        <div className="transferFlow">
          <div className="transferStep" style={transferStepStyle}><span style={transferStepBadgeStyle}>1</span><div><b>{routeStepTitle}</b><p>{routeHelper}</p></div></div>
          <div className="formGrid transferSelectionGrid" style={transferSelectionGridStyle}>
            <Field label={directionLabel}>
              <Select value={transferForm.transferDirection} onChange={(value) => setTransferForm((current) => ({ ...current, transferDirection: value as TransferDirection }))}>
                {TRANSFER_DIRECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={destinationLabel}>
              <Select value={transferForm.destination} onChange={(value) => setTransferForm((current) => ({ ...current, destination: value }))}>
                {TRANSFER_DESTINATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={pickupDateLabel}><Input type="date" value={transferForm.pickupDate} onChange={(value) => setTransferForm((current) => ({ ...current, pickupDate: value }))} /></Field>
            <Field label={pickupTimeLabel}><Input type="time" value={transferForm.pickupTime} onChange={(value) => setTransferForm((current) => ({ ...current, pickupTime: value }))} /></Field>
            <Field label={transferText.passengers}><Input type="number" value={String(transferForm.passengers)} onChange={(value) => setTransferForm((current) => ({ ...current, passengers: Number(value) }))} /></Field>
            <Field label={vehicleLabel}>
              <Select value={transferForm.vehicleClass} onChange={(value) => setTransferForm((current) => ({ ...current, vehicleClass: value as TransferVehicleClass }))}>
                {TRANSFER_VEHICLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={bagsLabel}><Input type="number" value={String(transferForm.bags)} onChange={(value) => setTransferForm((current) => ({ ...current, bags: Number(value) }))} /></Field>
          </div>
          <div className="priceSummary" style={priceSummaryStyle}>
            <div><span>{priceLabel}</span><strong>{priceRangeText}</strong><small style={{ display: "block", marginTop: "4px", color: "#087f68", fontWeight: 900 }}>{providerCountLabel}</small></div>
            <p>{priceHelper}</p>
          </div>
          <div className="transferStep" style={{ ...transferStepStyle, paddingTop: 0 }}><span style={transferStepBadgeStyle}>2</span><div><b>{contactStepTitle}</b><p>{language === "tr" ? "Talebi göndermek için ad, telefon ve varsa uçuş kodunu yaz." : "Enter name, phone and flight code if available to send the request."}</p></div></div>
          <div className="formGrid transferContactGrid" style={transferContactGridStyle}>
            <Field label={home.common.passenger}><Input value={transferForm.passengerName} placeholder={transferText.passengerPlaceholder} onChange={(value) => setTransferForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={transferForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTransferForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={home.common.flight}><Input value={transferForm.flightCode} placeholder="TK2524" onChange={(value) => setTransferForm((current) => ({ ...current, flightCode: value }))} /></Field>
            <button className="submitBtn" onClick={submitActiveForm} disabled={isSubmitting}>{isSubmitting ? activeSending : activeSubmit}</button>
          </div>
        </div>
      ) : (
        <div className="formGrid">
          {activeTab === "rental" && <>
            <Field label={home.common.passenger}><Input value={rentalForm.passengerName} placeholder={rentalText.passengerPlaceholder} onChange={(value) => setRentalForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={rentalForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setRentalForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={home.common.flight}><Input value={rentalForm.flightCode} placeholder="TK2524" onChange={(value) => setRentalForm((current) => ({ ...current, flightCode: value }))} /></Field>
            <Field label={rentalText.pickupLocation}>
              <Select value={rentalForm.pickupLocation} onChange={(value) => setRentalForm((current) => ({ ...current, pickupLocation: value }))}>
                {CAR_RENTAL_PICKUP_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={language === "tr" ? "Bırakış yeri" : "Dropoff location"}><Input value={rentalForm.dropoffLocation} placeholder={language === "tr" ? "Aynı yer veya otel" : "Same place or hotel"} onChange={(value) => setRentalForm((current) => ({ ...current, dropoffLocation: value }))} /></Field>
            <Field label={rentalText.pickupDate}><Input type="date" value={rentalForm.pickupDate} onChange={(value) => setRentalForm((current) => ({ ...current, pickupDate: value }))} /></Field>
            <Field label={language === "tr" ? "Alış saati" : "Pickup time"}><Input type="time" value={rentalForm.pickupTime} onChange={(value) => setRentalForm((current) => ({ ...current, pickupTime: value }))} /></Field>
            <Field label={rentalText.dropoffDate}><Input type="date" value={rentalForm.dropoffDate} onChange={(value) => setRentalForm((current) => ({ ...current, dropoffDate: value }))} /></Field>
            <Field label={language === "tr" ? "Bırakış saati" : "Dropoff time"}><Input type="time" value={rentalForm.dropoffTime} onChange={(value) => setRentalForm((current) => ({ ...current, dropoffTime: value }))} /></Field>
            <Field label={rentalText.carClass}>
              <Select value={rentalForm.carClass} onChange={(value) => setRentalForm((current) => ({ ...current, carClass: value as CarRentalClass }))}>
                {CAR_RENTAL_CLASS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={language === "tr" ? "Vites" : "Transmission"}>
              <Select value={rentalForm.transmission} onChange={(value) => setRentalForm((current) => ({ ...current, transmission: value as CarRentalTransmission }))}>
                {CAR_RENTAL_TRANSMISSION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={language === "tr" ? "Yolcu" : "Passengers"}><Input type="number" value={String(rentalForm.passengers)} onChange={(value) => setRentalForm((current) => ({ ...current, passengers: Number(value) }))} /></Field>
            <div className="priceSummary" style={embeddedPriceSummaryStyle}>
              <div><span>{language === "tr" ? "Tahmini günlük fiyat" : "Estimated daily price"}</span><strong>{rentalPriceText}</strong><small style={{ display: "block", marginTop: "4px", color: "#087f68", fontWeight: 900 }}>{rentalVehicleCount}</small></div>
              <p>{rentalHelper}</p>
            </div>
          </>}
          {activeTab === "hotel" && <>
            <Field label={home.common.passenger}><Input value={hotelForm.passengerName} placeholder={hotelText.passengerPlaceholder} onChange={(value) => setHotelForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={hotelForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setHotelForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={home.common.flight}><Input value={hotelForm.flightCode} placeholder="TK2524" onChange={(value) => setHotelForm((current) => ({ ...current, flightCode: value }))} /></Field>
            <Field label={language === "tr" ? "Konaklama tipi" : "Accommodation type"}>
              <Select value={hotelForm.accommodationType} onChange={(value) => setHotelForm((current) => ({ ...current, accommodationType: value as HotelAccommodationType }))}>
                {HOTEL_ACCOMMODATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
              </Select>
            </Field>
            <Field label={hotelText.checkIn}><Input type="date" value={hotelForm.checkInDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkInDate: value }))} /></Field>
            <Field label={hotelText.checkOut}><Input type="date" value={hotelForm.checkOutDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkOutDate: value }))} /></Field>
            <Field label={hotelText.guests}><Input type="number" value={String(hotelForm.guests)} onChange={(value) => setHotelForm((current) => ({ ...current, guests: Number(value) }))} /></Field>
            <Field label={hotelText.rooms}><Input type="number" value={String(hotelForm.rooms)} onChange={(value) => setHotelForm((current) => ({ ...current, rooms: Number(value) }))} /></Field>
            <Field label={hotelText.radius}><Input type="number" value={String(hotelForm.radiusKm)} onChange={(value) => setHotelForm((current) => ({ ...current, radiusKm: Number(value) }))} /></Field>
            <label className="field" style={{ justifyContent: "center" }}><span>{hotelText.wantsTransfer}</span><input type="checkbox" checked={hotelForm.wantsTransfer} onChange={(event) => setHotelForm((current) => ({ ...current, wantsTransfer: event.currentTarget.checked }))} /></label>
            <div className="priceSummary" style={embeddedPriceSummaryStyle}>
              <div><span>{language === "tr" ? "Tahmini gece fiyatı" : "Estimated nightly price"}</span><strong>{hotelPriceText}</strong><small style={{ display: "block", marginTop: "4px", color: "#087f68", fontWeight: 900 }}>{hotelCount}</small></div>
              <p>{hotelHelper}</p>
            </div>
          </>}
          {activeTab === "ticket" && <>
            <Field label={home.common.passenger}><Input value={ticketForm.passengerName} placeholder={ticketText.passengerPlaceholder} onChange={(value) => setTicketForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={ticketForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTicketForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={ticketText.from}><Input value={ticketForm.fromAirportOrCity} placeholder="Bodrum / BJV" onChange={(value) => setTicketForm((current) => ({ ...current, fromAirportOrCity: value }))} /></Field>
            <Field label={ticketText.to}><Input value={ticketForm.toAirportOrCity} placeholder="İstanbul, Ankara" onChange={(value) => setTicketForm((current) => ({ ...current, toAirportOrCity: value }))} /></Field>
            <Field label={ticketText.departureDate}><Input type="date" value={ticketForm.departureDate} onChange={(value) => setTicketForm((current) => ({ ...current, departureDate: value }))} /></Field>
          </>}
          <button className="submitBtn" onClick={submitActiveForm} disabled={isSubmitting}>{isSubmitting ? activeSending : activeSubmit}</button>
        </div>
      )}
      {status && <div className="status">{status}{requestCode ? <b>{home.common.requestCode}: {requestCode}</b> : null}</div>}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function Input({ value, onChange, placeholder = "", type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />;
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <select style={{ width: "100%", height: "50px", border: "1px solid #c8d9ed", borderRadius: "14px", padding: "0 14px", fontSize: "14px", background: "white", color: "#071631" }} value={value} onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.currentTarget.value)}>{children}</select>;
}
