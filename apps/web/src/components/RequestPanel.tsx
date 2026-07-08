import type { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";
import type { WebLanguage } from "../supportModel";
import { whatsappSupportUrl } from "../supportModel";
import { hotelCopy, rentalCopy, ticketCopy, transferCopy } from "../webCopy";
import type { HomeCopy, TabKey } from "../landingContent";
import type { TransferFormState } from "../transferFormModel";
import type { CarRentalFormState } from "../carRentalFormModel";
import type { HotelFormState } from "../hotelFormModel";
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
  isSubmitting: boolean;
  status: string;
  requestCode: string;
  submitActiveForm: () => void;
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

  return (
    <section id="request-panel" className="requestPanel">
      <div className="panelHead"><div><span>01</span><h2>{activeTitle}</h2><p>{activeDescription}</p></div><a href={whatsappSupportUrl(language)}>{home.common.support}</a></div>
      <div className="tabs">{tabItems.map(([key, label]) => <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)}>{label}</button>)}</div>
      <div className="formGrid">
        {activeTab === "transfer" && <>
          <Field label={home.common.passenger}><Input value={transferForm.passengerName} placeholder={transferText.passengerPlaceholder} onChange={(value) => setTransferForm((current) => ({ ...current, passengerName: value }))} /></Field>
          <Field label={home.common.phone}><Input value={transferForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTransferForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
          <Field label={home.common.flight}><Input value={transferForm.flightCode} placeholder="TK2524" onChange={(value) => setTransferForm((current) => ({ ...current, flightCode: value }))} /></Field>
          <Field label={transferText.destination}><Input value={transferForm.destination} placeholder="Bodrum, Yalıkavak" onChange={(value) => setTransferForm((current) => ({ ...current, destination: value }))} /></Field>
          <Field label={transferText.passengers}><Input type="number" value={String(transferForm.passengers)} onChange={(value) => setTransferForm((current) => ({ ...current, passengers: Number(value) }))} /></Field>
        </>}
        {activeTab === "rental" && <>
          <Field label={home.common.passenger}><Input value={rentalForm.passengerName} placeholder={rentalText.passengerPlaceholder} onChange={(value) => setRentalForm((current) => ({ ...current, passengerName: value }))} /></Field>
          <Field label={home.common.phone}><Input value={rentalForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setRentalForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
          <Field label={rentalText.pickupLocation}><Input value={rentalForm.pickupLocation} placeholder="Milas-Bodrum Airport" onChange={(value) => setRentalForm((current) => ({ ...current, pickupLocation: value }))} /></Field>
          <Field label={rentalText.pickupDate}><Input type="date" value={rentalForm.pickupDate} onChange={(value) => setRentalForm((current) => ({ ...current, pickupDate: value }))} /></Field>
          <Field label={rentalText.dropoffDate}><Input type="date" value={rentalForm.dropoffDate} onChange={(value) => setRentalForm((current) => ({ ...current, dropoffDate: value }))} /></Field>
        </>}
        {activeTab === "hotel" && <>
          <Field label={home.common.passenger}><Input value={hotelForm.passengerName} placeholder={hotelText.passengerPlaceholder} onChange={(value) => setHotelForm((current) => ({ ...current, passengerName: value }))} /></Field>
          <Field label={home.common.phone}><Input value={hotelForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setHotelForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
          <Field label={hotelText.checkIn}><Input type="date" value={hotelForm.checkInDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkInDate: value }))} /></Field>
          <Field label={hotelText.checkOut}><Input type="date" value={hotelForm.checkOutDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkOutDate: value }))} /></Field>
          <Field label={hotelText.guests}><Input type="number" value={String(hotelForm.guests)} onChange={(value) => setHotelForm((current) => ({ ...current, guests: Number(value) }))} /></Field>
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
