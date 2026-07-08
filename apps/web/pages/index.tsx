import { createElement, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest, createHotelRequest, createTicketRequest, createTransferRequest } from "@arrivio/firebase";
import {
  createTransferRequestCode,
  initialTransferFormState,
  validateTransferForm,
  type TransferFormState
} from "../src/transferFormModel";
import {
  createCarRentalRequestCode,
  initialCarRentalFormState,
  validateCarRentalForm,
  type CarRentalFormState
} from "../src/carRentalFormModel";
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

const shellStyle: CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto"
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#FFFFFF",
  padding: "12px 2px 16px"
};

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

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

const langWrapStyle: CSSProperties = {
  display: "flex",
  gap: "4px",
  padding: "4px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)"
};

const langLinkStyle: CSSProperties = {
  textDecoration: "none",
  fontWeight: 900,
  fontSize: "13px",
  padding: "8px 10px",
  borderRadius: "999px"
};

const introStyle: CSSProperties = {
  color: "#FFFFFF",
  padding: "2px 2px 18px"
};

const panelStyle: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "28px",
  boxShadow: "0 24px 70px rgba(7, 27, 58, 0.20)",
  border: "1px solid rgba(213, 226, 242, 0.95)",
  overflow: "hidden"
};

const tabRailStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  padding: "8px",
  gap: "6px",
  background: "#F3F7FC",
  borderBottom: "1px solid #DDE8F5"
};

const formWrapStyle: CSSProperties = {
  padding: "18px"
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 900,
  color: "#24344D",
  marginBottom: "7px"
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid #D4E0EE",
  borderRadius: "14px",
  fontSize: "15px",
  color: "#071B3A",
  outline: "none",
  background: "#FBFDFF"
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px"
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  border: 0,
  borderRadius: "16px",
  padding: "15px 16px",
  background: "linear-gradient(135deg, #0B63F6, #0644B8)",
  color: "#FFFFFF",
  fontSize: "15px",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(11, 99, 246, 0.22)",
  marginTop: "4px"
};

const supportStyle: CSSProperties = {
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  borderRadius: "16px",
  padding: "14px 16px",
  background: "#E9FBF6",
  color: "#087F68",
  fontWeight: 900,
  marginTop: "10px",
  border: "1px solid #C7F2E7"
};

const statusStyle: CSSProperties = {
  marginTop: "14px",
  padding: "12px 13px",
  borderRadius: "14px",
  background: "#F1F7FF",
  color: "#0B4DB3",
  fontWeight: 800,
  fontSize: "14px",
  lineHeight: 1.4
};

const howStyle: CSSProperties = {
  marginTop: "14px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px"
};

const stepStyle: CSSProperties = {
  padding: "10px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "rgba(255,255,255,0.84)",
  fontSize: "11px",
  lineHeight: 1.35
};

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return createElement("div", { style: { marginBottom: "12px" } }, createElement("label", { style: labelStyle }, label), children);
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return createElement("input", {
    style: inputStyle,
    type,
    value,
    placeholder,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)
  });
}

function NumberInput({ value, onChange, min = 0 }: { value: number; onChange: (value: number) => void; min?: number }) {
  return createElement("input", {
    style: inputStyle,
    type: "number",
    min,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.currentTarget.value))
  });
}

function HomeText(language: "tr" | "en") {
  if (language === "tr") {
    return {
      eyebrow: "Milas-Bodrum Havalimanı",
      title: "Havalimanı hizmetlerini tek ekrandan yönetin.",
      description: "Transfer, araç kiralama, otel ve bilet talebi bırakın. Uygulama indirmeden, hızlıca dönüş alın.",
      steps: ["Talebini bırak", "Ekip dönüş yapsın", "Hizmeti al"],
      tabs: {
        transfer: "Transfer",
        rental: "Araç",
        hotel: "Otel",
        ticket: "Bilet"
      },
      common: {
        passenger: "Yolcu adı",
        phone: "Telefon",
        flight: "Uçuş kodu",
        support: "WhatsApp destek",
        requestCode: "Talep kodu"
      }
    };
  }

  return {
    eyebrow: "Milas-Bodrum Airport",
    title: "Airport services from one screen.",
    description: "Request transfer, car rental, hotel and ticket support without downloading an app.",
    steps: ["Send request", "Get contacted", "Use service"],
    tabs: {
      transfer: "Transfer",
      rental: "Car",
      hotel: "Hotel",
      ticket: "Ticket"
    },
    common: {
      passenger: "Passenger name",
      phone: "Phone",
      flight: "Flight code",
      support: "WhatsApp support",
      requestCode: "Request code"
    }
  };
}

export default function HomePage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const home = HomeText(language);
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
      setStatus(
        activeTab === "transfer" ? transferText.failure :
        activeTab === "rental" ? rentalText.failure :
        activeTab === "hotel" ? hotelText.failure :
        ticketText.failure
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeTitle = activeTab === "transfer" ? transferText.title : activeTab === "rental" ? rentalText.title : activeTab === "hotel" ? hotelText.title : ticketText.title;
  const activeDescription = activeTab === "transfer" ? transferText.description : activeTab === "rental" ? rentalText.description : activeTab === "hotel" ? hotelText.description : ticketText.description;
  const activeSubmit = activeTab === "transfer" ? transferText.submit : activeTab === "rental" ? rentalText.submit : activeTab === "hotel" ? hotelText.submit : ticketText.submit;
  const activeSending = activeTab === "transfer" ? transferText.sending : activeTab === "rental" ? rentalText.sending : activeTab === "hotel" ? hotelText.sending : ticketText.sending;

  const tabItems: Array<[TabKey, string]> = [
    ["transfer", home.tabs.transfer],
    ["rental", home.tabs.rental],
    ["hotel", home.tabs.hotel],
    ["ticket", home.tabs.ticket]
  ];

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
        createElement("div", { style: howStyle },
          home.steps.map((step, index) => createElement("div", { key: step, style: stepStyle }, createElement("strong", null, `${index + 1}. `), step))
        )
      ),
      createElement("section", { style: panelStyle },
        createElement("div", { style: tabRailStyle },
          tabItems.map(([key, label]) => createElement("button", {
            key,
            type: "button",
            onClick: () => chooseTab(key),
            style: {
              border: 0,
              borderRadius: "14px",
              padding: "11px 7px",
              fontWeight: 900,
              fontSize: "13px",
              cursor: "pointer",
              color: activeTab === key ? "#FFFFFF" : "#41607F",
              background: activeTab === key ? "linear-gradient(135deg, #0B63F6, #0644B8)" : "transparent",
              boxShadow: activeTab === key ? "0 10px 24px rgba(11, 99, 246, 0.22)" : "none"
            }
          }, label))
        ),
        createElement("div", { style: formWrapStyle },
          createElement("h2", { style: { margin: "0 0 6px", fontSize: "22px", letterSpacing: "-0.3px" } }, activeTitle),
          createElement("p", { style: { margin: "0 0 16px", color: "#66758A", fontSize: "14px", lineHeight: 1.4 } }, activeDescription),
          activeTab === "transfer" ? createElement("div", null,
            createElement(Field, { label: home.common.passenger }, createElement(TextInput, { value: transferForm.passengerName, onChange: (value) => setTransferForm((current) => ({ ...current, passengerName: value })), placeholder: transferText.passengerPlaceholder })),
            createElement(Field, { label: home.common.phone }, createElement(TextInput, { value: transferForm.passengerPhone, onChange: (value) => setTransferForm((current) => ({ ...current, passengerPhone: value })), placeholder: "+90 5xx xxx xx xx" })),
            createElement(Field, { label: home.common.flight }, createElement(TextInput, { value: transferForm.flightCode, onChange: (value) => setTransferForm((current) => ({ ...current, flightCode: value })), placeholder: "TK2524" })),
            createElement(Field, { label: transferText.destination }, createElement(TextInput, { value: transferForm.destination, onChange: (value) => setTransferForm((current) => ({ ...current, destination: value })), placeholder: "Bodrum, Yalikavak, Turgutreis" })),
            createElement("div", { style: twoColumnStyle },
              createElement(Field, { label: transferText.passengers }, createElement(NumberInput, { value: transferForm.passengers, min: 1, onChange: (value) => setTransferForm((current) => ({ ...current, passengers: value })) })),
              createElement(Field, { label: transferText.bags }, createElement(NumberInput, { value: transferForm.bags, min: 0, onChange: (value) => setTransferForm((current) => ({ ...current, bags: value })) }))
            )
          ) : null,
          activeTab === "rental" ? createElement("div", null,
            createElement(Field, { label: home.common.passenger }, createElement(TextInput, { value: rentalForm.passengerName, onChange: (value) => setRentalForm((current) => ({ ...current, passengerName: value })), placeholder: rentalText.passengerPlaceholder })),
            createElement(Field, { label: home.common.phone }, createElement(TextInput, { value: rentalForm.passengerPhone, onChange: (value) => setRentalForm((current) => ({ ...current, passengerPhone: value })), placeholder: "+90 5xx xxx xx xx" })),
            createElement(Field, { label: rentalText.pickupLocation }, createElement(TextInput, { value: rentalForm.pickupLocation, onChange: (value) => setRentalForm((current) => ({ ...current, pickupLocation: value })), placeholder: "Milas-Bodrum Airport" })),
            createElement("div", { style: twoColumnStyle },
              createElement(Field, { label: rentalText.pickupDate }, createElement(TextInput, { type: "date", value: rentalForm.pickupDate, onChange: (value) => setRentalForm((current) => ({ ...current, pickupDate: value })) })),
              createElement(Field, { label: rentalText.dropoffDate }, createElement(TextInput, { type: "date", value: rentalForm.dropoffDate, onChange: (value) => setRentalForm((current) => ({ ...current, dropoffDate: value })) }))
            ),
            createElement(Field, { label: rentalText.carClass }, createElement("select", { style: inputStyle, value: rentalForm.carClass, onChange: (event: ChangeEvent<HTMLSelectElement>) => setRentalForm((current) => ({ ...current, carClass: event.currentTarget.value as CarRentalFormState["carClass"] })) },
              createElement("option", { value: "economic" }, rentalText.economic),
              createElement("option", { value: "middle" }, rentalText.middle),
              createElement("option", { value: "suv" }, "SUV"),
              createElement("option", { value: "luxury" }, rentalText.luxury)
            ))
          ) : null,
          activeTab === "hotel" ? createElement("div", null,
            createElement(Field, { label: home.common.passenger }, createElement(TextInput, { value: hotelForm.passengerName, onChange: (value) => setHotelForm((current) => ({ ...current, passengerName: value })), placeholder: hotelText.passengerPlaceholder })),
            createElement(Field, { label: home.common.phone }, createElement(TextInput, { value: hotelForm.passengerPhone, onChange: (value) => setHotelForm((current) => ({ ...current, passengerPhone: value })), placeholder: "+90 5xx xxx xx xx" })),
            createElement("div", { style: twoColumnStyle },
              createElement(Field, { label: hotelText.checkIn }, createElement(TextInput, { type: "date", value: hotelForm.checkInDate, onChange: (value) => setHotelForm((current) => ({ ...current, checkInDate: value })) })),
              createElement(Field, { label: hotelText.checkOut }, createElement(TextInput, { type: "date", value: hotelForm.checkOutDate, onChange: (value) => setHotelForm((current) => ({ ...current, checkOutDate: value })) }))
            ),
            createElement("div", { style: twoColumnStyle },
              createElement(Field, { label: hotelText.guests }, createElement(NumberInput, { value: hotelForm.guests, min: 1, onChange: (value) => setHotelForm((current) => ({ ...current, guests: value })) })),
              createElement(Field, { label: hotelText.rooms }, createElement(NumberInput, { value: hotelForm.rooms, min: 1, onChange: (value) => setHotelForm((current) => ({ ...current, rooms: value })) }))
            ),
            createElement(Field, { label: hotelText.radius }, createElement(NumberInput, { value: hotelForm.radiusKm, min: 1, onChange: (value) => setHotelForm((current) => ({ ...current, radiusKm: value })) }))
          ) : null,
          activeTab === "ticket" ? createElement("div", null,
            createElement(Field, { label: home.common.passenger }, createElement(TextInput, { value: ticketForm.passengerName, onChange: (value) => setTicketForm((current) => ({ ...current, passengerName: value })), placeholder: ticketText.passengerPlaceholder })),
            createElement(Field, { label: home.common.phone }, createElement(TextInput, { value: ticketForm.passengerPhone, onChange: (value) => setTicketForm((current) => ({ ...current, passengerPhone: value })), placeholder: "+90 5xx xxx xx xx" })),
            createElement(Field, { label: ticketText.from }, createElement(TextInput, { value: ticketForm.fromAirportOrCity, onChange: (value) => setTicketForm((current) => ({ ...current, fromAirportOrCity: value })), placeholder: "Bodrum / BJV" })),
            createElement(Field, { label: ticketText.to }, createElement(TextInput, { value: ticketForm.toAirportOrCity, onChange: (value) => setTicketForm((current) => ({ ...current, toAirportOrCity: value })), placeholder: "Istanbul, Ankara" })),
            createElement("div", { style: twoColumnStyle },
              createElement(Field, { label: ticketText.departureDate }, createElement(TextInput, { type: "date", value: ticketForm.departureDate, onChange: (value) => setTicketForm((current) => ({ ...current, departureDate: value })) })),
              createElement(Field, { label: ticketText.returnDate }, createElement(TextInput, { type: "date", value: ticketForm.returnDate, onChange: (value) => setTicketForm((current) => ({ ...current, returnDate: value })) }))
            ),
            createElement(Field, { label: ticketText.passengers }, createElement(NumberInput, { value: ticketForm.passengers, min: 1, onChange: (value) => setTicketForm((current) => ({ ...current, passengers: value })) }))
          ) : null,
          createElement("button", { type: "button", style: primaryButtonStyle, onClick: submitActiveForm, disabled: isSubmitting }, isSubmitting ? activeSending : activeSubmit),
          createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, home.common.support),
          status ? createElement("div", { style: statusStyle }, status, requestCode ? createElement("div", { style: { marginTop: "6px", color: "#071B3A" } }, `${home.common.requestCode}: ${requestCode}`) : null) : null
        )
      )
    )
  );
}
