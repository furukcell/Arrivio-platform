import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createTicketRequest } from "@arrivio/firebase";
import { createTicketRequestCode, initialTicketFormState, validateTicketForm, type TicketFormState } from "../src/ticketFormModel";
import { mapTicketFormToRequest } from "../src/ticketRequestMapper";
import { getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { ticketCopy } from "../src/webCopy";

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
  const text = ticketCopy(language);
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
      await createTicketRequest(mapTicketFormToRequest(form, code, qrSourceId || undefined, language));
      setRequestCode(code);
      setStatus(text.success);
    } catch (error) {
      setStatus(text.failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement("main", { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("a", { href: `/?lang=${language}`, style: { color: "#0B63F6", fontWeight: 700 } }, text.home),
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, text.airport),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, text.title),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, text.description),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700 } }, text.qrDetected) : null,
      createElement("label", null, text.passengerName),
      createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: text.passengerPlaceholder }),
      createElement("label", null, text.phone),
      createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, text.from),
      createElement("input", { style: inputStyle, value: form.fromAirportOrCity, onChange: (event) => updateField("fromAirportOrCity", event.currentTarget.value), placeholder: "Bodrum / BJV" }),
      createElement("label", null, text.to),
      createElement("input", { style: inputStyle, value: form.toAirportOrCity, onChange: (event) => updateField("toAirportOrCity", event.currentTarget.value), placeholder: "Istanbul, Ankara..." }),
      createElement("label", null, text.departureDate),
      createElement("input", { style: inputStyle, type: "date", value: form.departureDate, onChange: (event) => updateField("departureDate", event.currentTarget.value) }),
      createElement("label", null, text.returnDate),
      createElement("input", { style: inputStyle, type: "date", value: form.returnDate, onChange: (event) => updateField("returnDate", event.currentTarget.value) }),
      createElement("label", null, text.passengers),
      createElement("input", { style: inputStyle, type: "number", min: 1, value: form.passengers, onChange: (event) => updateField("passengers", Number(event.currentTarget.value)) }),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? text.sending : text.submit),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, text.support),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${text.requestCode}: ${requestCode}`) : null
    )
  );
}
