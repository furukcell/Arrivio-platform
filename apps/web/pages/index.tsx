import { createElement, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest, createHotelRequest, createTicketRequest, createTransferRequest } from "@arrivio/firebase";
import { createTransferRequestCode, initialTransferFormState, validateTransferForm, type TransferFormState } from "../src/transferFormModel";
import { createCarRentalRequestCode, initialCarRentalFormState, validateCarRentalForm, type CarRentalFormState } from "../src/carRentalFormModel";
import { createHotelRequestCode, initialHotelFormState, validateHotelForm, type HotelFormState } from "../src/hotelFormModel";
import { createTicketRequestCode, initialTicketFormState, validateTicketForm, type TicketFormState } from "../src/ticketFormModel";
import { mapTransferFormToRequest } from "../src/transferRequestMapper";
import { mapRentalFormToRequest } from "../src/rentalRequestMapper";
import { mapHotelFormToRequest } from "../src/hotelRequestMapper";
import { mapTicketFormToRequest } from "../src/ticketRequestMapper";
import { getLanguage, languageHref, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { hotelCopy, rentalCopy, ticketCopy, transferCopy } from "../src/webCopy";

type TabKey = "transfer" | "rental" | "hotel" | "ticket";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "14px",
  fontFamily: "Inter, Arial, sans-serif",
  background: "linear-gradient(180deg, #061A36 0%, #0A2B58 285px, #EEF4FB 285px, #EEF4FB 100%)",
  color: "#071B3A"
};

const shellStyle: CSSProperties = { maxWidth: "560px", margin: "0 auto" };
const headerStyle: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFFFFF", padding: "12px 2px 16px" };
const brandStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "10px" };
const markStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #38BDF8, #0B63F6 58%, #062B62)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  fontWeight: 900,
  fontSize: "23px",
  boxShadow: "0 14px 34px rgba(0,0,0,0.22)"
};
const langWrapStyle: CSSProperties = { display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" };
const langLinkStyle: CSSProperties = { textDecoration: "none", fontWeight: 900, fontSize: "13px", padding: "8px 10px", borderRadius: "999px" };
const introStyle: CSSProperties = { color: "#FFFFFF", padding: "2px 2px 18px" };
const panelStyle: CSSProperties = { background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 24px 70px rgba(7, 27, 58, 0.20)", border: "1px solid rgba(213, 226, 242, 0.95)", overflow: "hidden" };
const tabRailStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "8px", gap: "6px", background: "#F3F7FC", borderBottom: "1px solid #DDE8F5" };
const formWrapStyle: CSSProperties = { padding: "18px" };
const labelStyle: CSSProperties = { display: "block", fontSize: "13px", fontWeight: 900, color: "#24344D", marginBottom: "7px" };
const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", padding: "13px 14px", border: "1px solid #D4E0EE", borderRadius: "14px", fontSize: "15px", color: "#071B3A", outline: "none", background: "#FBFDFF" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" };
const primaryButtonStyle: CSSProperties = { width: "100%", border: 0, borderRadius: "16px", padding: "15px 16px", background: "linear-gradient(135deg, #0B63F6, #0644B8)", color: "#FFFFFF", fontSize: "15px", fontWeight: 900, cursor: "pointer", boxShadow: "0 14px 34px rgba(11, 99, 246, 0.22)", marginTop: "4px" };
const supportStyle: CSSProperties = { display: "block", textAlign: "center", textDecoration: "none", borderRadius: "16px", padding: "14px 16px", background: "#E9FBF6", color: "#087F68", fontWeight: 900, marginTop: "10px", border: "1px solid #C7F2E7" };
const statusStyle: CSSProperties = { marginTop: "14px", padding: "12px 13px", borderRadius: "14px", background: "#F1F7FF", color: "#0B4DB3", fontWeight: 800, fontSize: "14px", lineHeight: 1.4 };
const howStyle: CSSProperties = { marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" };
const stepStyle: CSSProperties = { padding: "10px", borderRadius: "16px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.84)", fontSize: "11px", lineHeight: 1.35 };

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

function field(label: string, child: ReactNode) {
  return createElement("div", { style: { marginBottom: "12px" } }, createElement("label", { style: labelStyle }, label), child);
}

function textInput(value: string, onChange: (value: string) => void, placeholder = "", type = "text") {
  return createElement("input", {
    style: inputStyle,
    type,
    value,
    placeholder,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)
  });
}

function numberInput(value: number, onChange: (value: number) => void, min = 0) {
  return createElement("input", {
    style: inputStyle,
    type: "number",
    min,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.currentTarget.value))
  });
}

function homeText(language: "tr" | "en") {
  if (language === "tr") {
    return {
      eyebrow: "Milas-Bodrum Havalimanı",
      title: "Havalimanı hizmetlerini tek ekrandan yönetin.",
      description: "Transfer, araç kiralama, otel ve bilet talebi bırakın. Uygulama indirmeden, hızlıca dönüş alın.",
      steps: ["Talebini bırak", "Ekip dönüş yapsın", "Hizmeti al"],
      tabs: { transfer: "Transfer", rental: "Araç", hotel: "Otel", ticket: "Bilet" },
      common: { passenger: "Yolcu adı", phone: "Telefon", flight: "Uçuş kodu", support: "WhatsApp destek", requestCode: "Talep kodu" }
    };
  }

  return {
    eyebrow: "Milas-Bodrum Airport",
    title: "Airport services from one screen.",
    description: "Request transfer, car rental, hotel and ticket support without downloading an app.",
    steps: ["Send request", "Get contacted", "Use service"],
    tabs: { transfer: "Transfer", rental: "Car", hotel: "Hotel", ticket: "Ticket" },
    common: { passenger: "Passenger name", phone: "Phone", flight: "Flight code", support: "WhatsApp support", requestCode: "Request code" }
  };
}

export default function HomePage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const home = homeText(language);
  const transferText = transferCopy(language);
  const rentalText = rentalCopy(language);
  const hotelText = hotelCopy(language);
  const ticketText = ticketCopy(language);

  const [activeTab, setActiveTab] = useState<TabKey>("transfer");
  const [transferForm, setTransferForm] = useState<TransferFormState>(initialTransferFormState);
  const [rentalForm, setRentalForm] = useState<CarRentalFormState>(initialCarRentalFormState);
  const [hotelForm, setHotelForm] = useState<HotelFormState>(initialHotelFormState);
  const [ticketForm, setTicketForm] = useState<TicketFormState>(initialTicketFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function chooseTab(tab: TabKey) {
    setActiveTab(tab);
    setStatus("");
    setRequestCode("");
  }

  async function submitActiveForm() {
    setStatus("");
    setRequestCode("");

    const currentError =
      activeTab === "transfer" ? validateTransferForm(transferForm) :
      activeTab === "rental" ? validateCarRentalForm(rentalForm) :
      activeTab === "hotel" ? validateHotelForm(hotelForm) :
      validateTicketForm(ticketForm);

    if (currentError) {
      setStatus(translateFormMessage(language, currentError));
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === "transfer") {
        const code = createTransferRequestCode();
        await createTransferRequest(mapTransferFormToRequest(transferForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(transferText.success);
      }
      if (activeTab === "rental") {
        const code = createCarRentalRequestCode();
        await createCarRentalRequest(mapRentalFormToRequest(rentalForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(rentalText.success);
      }
      if (activeTab === "hotel") {
        const code = createHotelRequestCode();
        await createHotelRequest(mapHotelFormToRequest(hotelForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(hotelText.success);
      }
      if (activeTab === "ticket") {
        const code = createTicketRequestCode();
        await createTicketRequest(mapTicketFormToRequest(ticketForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(ticketText.success);
      }
    } catch (error) {
      setStatus(activeTab === "transfer" ? transferText.failure : activeTab === "rental" ? rentalText.failure : activeTab === "hotel" ? hotelText.failure : ticketText.failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeTitle = activeTab === "transfer" ? transferText.title : activeTab === "rental" ? rentalText.title : activeTab === "hotel" ? hotelText.title : ticketText.title;
  const activeDescription = activeTab === "transfer" ? transferText.description : activeTab === "rental" ? rentalText.description : activeTab === "hotel" ? hotelText.description : ticketText.description;
  const activeSubmit = activeTab === "transfer" ? transferText.submit : activeTab === "rental" ? rentalText.submit : activeTab === "hotel" ? hotelText.submit : ticketText.submit;
  const activeSending = activeTab === "transfer" ? transferText.sending : activeTab === "rental" ? rentalText.sending : activeTab === "hotel" ? hotelText.sending : ticketText.sending;
  const tabItems: Array<[TabKey, string]> = [["transfer", home.tabs.transfer], ["rental", home.tabs.rental], ["hotel", home.tabs.hotel], ["ticket", home.tabs.ticket]];

  return createElement("main", { style: pageStyle },
    createElement("div", { style: shellStyle },
      createElement("header", { style: headerStyle },
        createElement("div", { style: brandStyle },
          createElement("div", { style: markStyle }, "A"),
          createElement("div", null,
            createElement("div", { style: { fontWeight: 900, fontSize: "18px" } }, "Arrivio"),
            createElement("div", { style: { opacity: 0.72, fontSize: "12px", marginTop: "2px" } }, "Airport Services")
          )
        ),
        createElement("nav", { style: langWrapStyle },
          createElement("a", { href: languageHref("/", "en"), style: { ...langLinkStyle, background: language === "en" ? "#FFFFFF" : "transparent", color: language === "en" ? "#0B2E63" : "#FFFFFF" } }, "EN"),
          createElement("a", { href: languageHref("/", "tr"), style: { ...langLinkStyle, background: language === "tr" ? "#FFFFFF" : "transparent", color: language === "tr" ? "#0B2E63" : "#FFFFFF" } }, "TR")
        )
      ),
      createElement("section", { style: introStyle },
        createElement("p", { style: { margin: "0 0 8px", color: "#62B7FF", fontWeight: 900, fontSize: "14px" } }, home.eyebrow),
        createElement("h1", { style: { margin: 0, fontSize: "28px", lineHeight: 1.1, letterSpacing: "-0.7px" } }, home.title),
        createElement("p", { style: { margin: "10px 0 0", color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: 1.45 } }, home.description),
        createElement("div", { style: howStyle }, home.steps.map((step, index) => createElement("div", { key: step, style: stepStyle }, createElement("strong", null, `${index + 1}. `), step)))
      ),
      createElement("section", { style: panelStyle },
        createElement("div", { style: tabRailStyle },
          tabItems.map(([key, label]) => createElement("button", {
            key,
            type: "button",
            onClick: () => chooseTab(key),
            style: { border: 0, borderRadius: "14px", padding: "11px 7px", fontWeight: 900, fontSize: "13px", cursor: "pointer", color: activeTab === key ? "#FFFFFF" : "#41607F", background: activeTab === key ? "linear-gradient(135deg, #0B63F6, #0644B8)" : "transparent", boxShadow: activeTab === key ? "0 10px 24px rgba(11, 99, 246, 0.22)" : "none" }
          }, label))
        ),
        createElement("div", { style: formWrapStyle },
          createElement("h2", { style: { margin: "0 0 6px", fontSize: "22px", letterSpacing: "-0.3px" } }, activeTitle),
          createElement("p", { style: { margin: "0 0 16px", color: "#66758A", fontSize: "14px", lineHeight: 1.4 } }, activeDescription),
          activeTab === "transfer" ? createElement("div", null,
            field(home.common.passenger, textInput(transferForm.passengerName, (value) => setTransferForm((current) => ({ ...current, passengerName: value })), transferText.passengerPlaceholder)),
            field(home.common.phone, textInput(transferForm.passengerPhone, (value) => setTransferForm((current) => ({ ...current, passengerPhone: value })), "+90 5xx xxx xx xx")),
            field(home.common.flight, textInput(transferForm.flightCode, (value) => setTransferForm((current) => ({ ...current, flightCode: value })), "TK2524")),
            field(transferText.destination, textInput(transferForm.destination, (value) => setTransferForm((current) => ({ ...current, destination: value })), "Bodrum, Yalikavak, Turgutreis")),
            createElement("div", { style: twoColumnStyle },
              field(transferText.passengers, numberInput(transferForm.passengers, (value) => setTransferForm((current) => ({ ...current, passengers: value })), 1)),
              field(transferText.bags, numberInput(transferForm.bags, (value) => setTransferForm((current) => ({ ...current, bags: value })), 0))
            )
          ) : null,
          activeTab === "rental" ? createElement("div", null,
            field(home.common.passenger, textInput(rentalForm.passengerName, (value) => setRentalForm((current) => ({ ...current, passengerName: value })), rentalText.passengerPlaceholder)),
            field(home.common.phone, textInput(rentalForm.passengerPhone, (value) => setRentalForm((current) => ({ ...current, passengerPhone: value })), "+90 5xx xxx xx xx")),
            field(rentalText.pickupLocation, textInput(rentalForm.pickupLocation, (value) => setRentalForm((current) => ({ ...current, pickupLocation: value })), "Milas-Bodrum Airport")),
            createElement("div", { style: twoColumnStyle },
              field(rentalText.pickupDate, textInput(rentalForm.pickupDate, (value) => setRentalForm((current) => ({ ...current, pickupDate: value })), "", "date")),
              field(rentalText.dropoffDate, textInput(rentalForm.dropoffDate, (value) => setRentalForm((current) => ({ ...current, dropoffDate: value })), "", "date"))
            ),
            field(rentalText.carClass, createElement("select", { style: inputStyle, value: rentalForm.carClass, onChange: (event: ChangeEvent<HTMLSelectElement>) => setRentalForm((current) => ({ ...current, carClass: event.currentTarget.value as CarRentalFormState["carClass"] })) },
              createElement("option", { value: "economic" }, rentalText.economic),
              createElement("option", { value: "middle" }, rentalText.middle),
              createElement("option", { value: "suv" }, "SUV"),
              createElement("option", { value: "luxury" }, rentalText.luxury)
            ))
          ) : null,
          activeTab === "hotel" ? createElement("div", null,
            field(home.common.passenger, textInput(hotelForm.passengerName, (value) => setHotelForm((current) => ({ ...current, passengerName: value })), hotelText.passengerPlaceholder)),
            field(home.common.phone, textInput(hotelForm.passengerPhone, (value) => setHotelForm((current) => ({ ...current, passengerPhone: value })), "+90 5xx xxx xx xx")),
            createElement("div", { style: twoColumnStyle },
              field(hotelText.checkIn, textInput(hotelForm.checkInDate, (value) => setHotelForm((current) => ({ ...current, checkInDate: value })), "", "date")),
              field(hotelText.checkOut, textInput(hotelForm.checkOutDate, (value) => setHotelForm((current) => ({ ...current, checkOutDate: value })), "", "date"))
            ),
            createElement("div", { style: twoColumnStyle },
              field(hotelText.guests, numberInput(hotelForm.guests, (value) => setHotelForm((current) => ({ ...current, guests: value })), 1)),
              field(hotelText.rooms, numberInput(hotelForm.rooms, (value) => setHotelForm((current) => ({ ...current, rooms: value })), 1))
            ),
            field(hotelText.radius, numberInput(hotelForm.radiusKm, (value) => setHotelForm((current) => ({ ...current, radiusKm: value })), 1))
          ) : null,
          activeTab === "ticket" ? createElement("div", null,
            field(home.common.passenger, textInput(ticketForm.passengerName, (value) => setTicketForm((current) => ({ ...current, passengerName: value })), ticketText.passengerPlaceholder)),
            field(home.common.phone, textInput(ticketForm.passengerPhone, (value) => setTicketForm((current) => ({ ...current, passengerPhone: value })), "+90 5xx xxx xx xx")),
            field(ticketText.from, textInput(ticketForm.fromAirportOrCity, (value) => setTicketForm((current) => ({ ...current, fromAirportOrCity: value })), "Bodrum / BJV")),
            field(ticketText.to, textInput(ticketForm.toAirportOrCity, (value) => setTicketForm((current) => ({ ...current, toAirportOrCity: value })), "Istanbul, Ankara")),
            createElement("div", { style: twoColumnStyle },
              field(ticketText.departureDate, textInput(ticketForm.departureDate, (value) => setTicketForm((current) => ({ ...current, departureDate: value })), "", "date")),
              field(ticketText.returnDate, textInput(ticketForm.returnDate, (value) => setTicketForm((current) => ({ ...current, returnDate: value })), "", "date"))
            ),
            field(ticketText.passengers, numberInput(ticketForm.passengers, (value) => setTicketForm((current) => ({ ...current, passengers: value })), 1))
          ) : null,
          createElement("button", { type: "button", style: primaryButtonStyle, onClick: submitActiveForm, disabled: isSubmitting }, isSubmitting ? activeSending : activeSubmit),
          createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, home.common.support),
          status ? createElement("div", { style: statusStyle }, status, requestCode ? createElement("div", { style: { marginTop: "6px", color: "#071B3A" } }, `${home.common.requestCode}: ${requestCode}`) : null) : null
        )
      )
    )
  );
}
