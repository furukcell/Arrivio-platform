import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createHotelRequest } from "@arrivio/firebase";
import { createHotelRequestCode, initialHotelFormState, validateHotelForm, type HotelFormState } from "../src/hotelFormModel";
import { mapHotelFormToRequest } from "../src/hotelRequestMapper";
import { getLanguage, whatsappSupportUrl } from "../src/supportModel";

const pageStyle = { minHeight: "100vh", padding: "24px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const cardStyle = { maxWidth: "720px", margin: "0 auto", padding: "24px", borderRadius: "24px", background: "#FFFFFF", boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)" };
const inputStyle = { width: "100%", padding: "14px", marginTop: "6px", marginBottom: "14px", border: "1px solid #D1D5DB", borderRadius: "12px", fontSize: "16px" };
const buttonStyle = { width: "100%", padding: "15px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, fontSize: "16px", cursor: "pointer" };
const supportStyle = { display: "block", width: "100%", boxSizing: "border-box" as const, textAlign: "center" as const, padding: "15px", borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, textDecoration: "none", marginTop: "12px" };

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function HotelPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const [form, setForm] = useState<HotelFormState>(initialHotelFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof HotelFormState>(key: K, value: HotelFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitRequest() {
    const error = validateHotelForm(form);
    if (error) {
      setStatus(error);
      return;
    }
    setIsSubmitting(true);
    try {
      const code = createHotelRequestCode();
      await createHotelRequest(mapHotelFormToRequest(form, code, qrSourceId || undefined));
      setRequestCode(code);
      setStatus("Hotel availability request created. Arrivio will contact you soon.");
    } catch (error) {
      setStatus("Hotel request could not be created. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement("main", { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, "Request Hotel Availability"),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, "Tell us your stay details. Arrivio will check suitable nearby hotels and apartments."),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700 } }, "QR source detected.") : null,
      createElement("label", null, "Passenger name"),
      createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: "Full name" }),
      createElement("label", null, "Phone / WhatsApp"),
      createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, "Flight code"),
      createElement("input", { style: inputStyle, value: form.flightCode, onChange: (event) => updateField("flightCode", event.currentTarget.value), placeholder: "TK2524" }),
      createElement("label", null, "Check-in date"),
      createElement("input", { style: inputStyle, type: "date", value: form.checkInDate, onChange: (event) => updateField("checkInDate", event.currentTarget.value) }),
      createElement("label", null, "Check-out date"),
      createElement("input", { style: inputStyle, type: "date", value: form.checkOutDate, onChange: (event) => updateField("checkOutDate", event.currentTarget.value) }),
      createElement("label", null, "Guests"),
      createElement("input", { style: inputStyle, type: "number", min: 1, value: form.guests, onChange: (event) => updateField("guests", Number(event.currentTarget.value)) }),
      createElement("label", null, "Rooms"),
      createElement("input", { style: inputStyle, type: "number", min: 1, value: form.rooms, onChange: (event) => updateField("rooms", Number(event.currentTarget.value)) }),
      createElement("label", null, "Search radius km"),
      createElement("input", { style: inputStyle, type: "number", min: 1, value: form.radiusKm, onChange: (event) => updateField("radiusKm", Number(event.currentTarget.value)) }),
      createElement("label", null,
        createElement("input", { type: "checkbox", checked: form.wantsTransfer, onChange: (event) => updateField("wantsTransfer", event.currentTarget.checked), style: { marginRight: "8px" } }),
        "I may need airport transfer too"
      ),
      createElement("button", { style: { ...buttonStyle, marginTop: "18px" }, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? "Sending..." : "Request Hotel"),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, "WhatsApp Support"),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `Request code: ${requestCode}`) : null
    )
  );
}
