import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest } from "@arrivio/firebase";
import { createCarRentalRequestCode, initialCarRentalFormState, validateCarRentalForm, type CarRentalFormState } from "../src/carRentalFormModel";
import { mapRentalFormToRequest } from "../src/rentalRequestMapper";
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

export default function CarRentalPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const [form, setForm] = useState<CarRentalFormState>(initialCarRentalFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof CarRentalFormState>(key: K, value: CarRentalFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitRequest() {
    const error = validateCarRentalForm(form);
    if (error) {
      setStatus(translateFormMessage(language, error));
      return;
    }
    setIsSubmitting(true);
    try {
      const code = createCarRentalRequestCode();
      await createCarRentalRequest(mapRentalFormToRequest(form, code, qrSourceId || undefined));
      setRequestCode(code);
      setStatus(copy(language, "Arac kiralama talebiniz alindi. Arrivio size ulasacak.", "Car rental request created. Arrivio will contact you soon."));
    } catch (error) {
      setStatus(copy(language, "Arac kiralama talebi olusturulamadi. Lutfen tekrar deneyin.", "Car rental request could not be created. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement("main", { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("a", { href: `/?lang=${language}`, style: { color: "#0B63F6", fontWeight: 700 } }, copy(language, "Ana sayfa", "Home")),
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, copy(language, "Arac Kiralama Talebi", "Request Car Rental")),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, copy(language, "Ihtiyaciniz olan araci yazin. Arrivio talebinizi uygun firmalara iletsin.", "Tell us what car you need. Arrivio routes your request to verified rental providers.")),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700 } }, copy(language, "QR kaynagi algilandi.", "QR source detected.")) : null,
      createElement("label", null, copy(language, "Yolcu adi", "Passenger name")),
      createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: copy(language, "Ad soyad", "Full name") }),
      createElement("label", null, copy(language, "Telefon / WhatsApp", "Phone / WhatsApp")),
      createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, copy(language, "Ucus kodu", "Flight code")),
      createElement("input", { style: inputStyle, value: form.flightCode, onChange: (event) => updateField("flightCode", event.currentTarget.value), placeholder: "TK2524" }),
      createElement("label", null, copy(language, "Teslim alma yeri", "Pickup location")),
      createElement("input", { style: inputStyle, value: form.pickupLocation, onChange: (event) => updateField("pickupLocation", event.currentTarget.value), placeholder: "Milas-Bodrum Airport" }),
      createElement("label", null, copy(language, "Teslim alma tarihi", "Pickup date")),
      createElement("input", { style: inputStyle, type: "date", value: form.pickupDate, onChange: (event) => updateField("pickupDate", event.currentTarget.value) }),
      createElement("label", null, copy(language, "Birakma tarihi", "Dropoff date")),
      createElement("input", { style: inputStyle, type: "date", value: form.dropoffDate, onChange: (event) => updateField("dropoffDate", event.currentTarget.value) }),
      createElement("label", null, copy(language, "Arac sinifi", "Car class")),
      createElement("select", { style: inputStyle, value: form.carClass, onChange: (event) => updateField("carClass", event.currentTarget.value as CarRentalFormState["carClass"]) },
        createElement("option", { value: "economic" }, copy(language, "Ekonomik", "Economic")),
        createElement("option", { value: "middle" }, copy(language, "Orta", "Middle")),
        createElement("option", { value: "suv" }, "SUV"),
        createElement("option", { value: "luxury" }, copy(language, "Luks", "Luxury"))
      ),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? copy(language, "Gonderiliyor...", "Sending...") : copy(language, "Arac Talebi Gonder", "Request Car Rental")),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, copy(language, "WhatsApp Destek", "WhatsApp Support")),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${copy(language, "Talep kodu", "Request code")}: ${requestCode}`) : null
    )
  );
}
