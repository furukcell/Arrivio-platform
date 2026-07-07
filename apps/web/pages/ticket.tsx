import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createTicketRequest } from "@arrivio/firebase";
import { createTicketRequestCode, initialTicketFormState, validateTicketForm, type TicketFormState } from "../src/ticketFormModel";
import { mapTicketFormToRequest } from "../src/ticketRequestMapper";
import { copy, getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";

const pageStyle = { minHeight: "100vh", padding: "24px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const cardStyle = { maxWidth: "720px", margin: "0 auto", padding: "24px", borderRadius: "24px", background: "#FFFFFF", boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)" };
const inputStyle = { width: "100%", padding: "14px", marginTop: "6px", marginBottom: "14px", border: "1px solid #D1D5DB", borderRadius: "12px", fontSize: "16px" };
const buttonStyle = { width: "100%", padding: "15px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, fontSize: "16px", cursor: "pointer" };
const supportStyle = { display: "block", width: "100%", boxSizing: "border-box" as const, textAlign: "center" as const, padding: "15px", borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, textDecoration: "none", marginTop: "12px" };

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function TicketPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const [form, setForm] = useState<TicketFormState>(initialTicketFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitRequest() {
    const error = validateTicketForm(form);
    if (error) {
      setStatus(translateFormMessage(language, error));
      return;
    }
    setIsSubmitting(true);
    try {
      const code = createTicketRequestCode();
      await createTicketRequest(mapTicketFormToRequest(form, code, qrSourceId || undefined));
      setRequestCode(code);
      setStatus(copy(language, "Talebiniz alindi. Arrivio size ulasacak.", "Ticket request created. Arrivio will contact you soon."));
    } catch (error) {
      setStatus(copy(language, "Talep olusturulamadi. Lutfen tekrar deneyin.", "Ticket request could not be created. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement("main", { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("a", { href: `/?lang=${language}`, style: { color: "#0B63F6", fontWeight: 700 } }, copy(language, "Ana sayfa", "Home")),
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Arrivio"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, copy(language, "Bilet Talebi", "Request Ticket")),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, copy(language, "Rota ve tarih bilgilerinizi gonderin.", "Send your route and date.")),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700 } }, copy(language, "QR kaynagi algilandi.", "QR source detected.")) : null,
      createElement("label", null, copy(language, "Yolcu adi", "Passenger name")),
      createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: copy(language, "Ad soyad", "Full name") }),
      createElement("label", null, copy(language, "Telefon / WhatsApp", "Phone / WhatsApp")),
      createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, copy(language, "Nereden", "From")),
      createElement("input", { style: inputStyle, value: form.fromAirportOrCity, onChange: (event) => updateField("fromAirportOrCity", event.currentTarget.value), placeholder: "Bodrum / BJV" }),
      createElement("label", null, copy(language, "Nereye", "To")),
      createElement("input", { style: inputStyle, value: form.toAirportOrCity, onChange: (event) => updateField("toAirportOrCity", event.currentTarget.value), placeholder: "Istanbul, Ankara..." }),
      createElement("label", null, copy(language, "Gidis tarihi", "Departure date")),
      createElement("input", { style: inputStyle, type: "date", value: form.departureDate, onChange: (event) => updateField("departureDate", event.currentTarget.value) }),
      createElement("label", null, copy(language, "Donus tarihi", "Return date")),
      createElement("input", { style: inputStyle, type: "date", value: form.returnDate, onChange: (event) => updateField("returnDate", event.currentTarget.value) }),
      createElement("label", null, copy(language, "Yolcu sayisi", "Passengers")),
      createElement("input", { style: inputStyle, type: "number", min: 1, value: form.passengers, onChange: (event) => updateField("passengers", Number(event.currentTarget.value)) }),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? copy(language, "Gonderiliyor...", "Sending...") : copy(language, "Bilet Talebi Gonder", "Request Ticket")),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, copy(language, "WhatsApp Destek", "WhatsApp Support")),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${copy(language, "Talep kodu", "Request code")}: ${requestCode}`) : null
    )
  );
}
