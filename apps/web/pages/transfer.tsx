import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createTransferRequest } from "@arrivio/firebase";
import {
  createTransferRequestCode,
  initialTransferFormState,
  validateTransferForm,
  type TransferFormState
} from "../src/transferFormModel";
import { mapTransferFormToRequest } from "../src/transferRequestMapper";
import { copy, getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  maxWidth: "720px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "24px",
  background: "#FFFFFF",
  boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "6px",
  marginBottom: "14px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px",
  fontSize: "16px"
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: 0,
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer"
};

const supportStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  textAlign: "center" as const,
  padding: "15px",
  borderRadius: "999px",
  background: "#1FB6A6",
  color: "#FFFFFF",
  fontWeight: 700,
  textDecoration: "none",
  marginTop: "12px"
};

function getQueryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function TransferPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = getQueryValue(router.query.qrSourceId);
  const [form, setForm] = useState<TransferFormState>(initialTransferFormState);
  const [status, setStatus] = useState<string>("");
  const [requestCode, setRequestCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitTransferRequest() {
    const error = validateTransferForm(form);
    if (error) {
      setStatus(translateFormMessage(language, error));
      return;
    }

    setIsSubmitting(true);
    try {
      const code = createTransferRequestCode();
      const payload = mapTransferFormToRequest(form, code, qrSourceId || undefined);
      await createTransferRequest(payload);
      setRequestCode(code);
      setStatus(copy(language, "Transfer talebiniz alindi. Arrivio size ulasacak.", "Transfer request created. Arrivio will contact you soon."));
    } catch (error) {
      setStatus(copy(language, "Transfer talebi olusturulamadi. Lutfen tekrar deneyin.", "Transfer request could not be created. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof TransferFormState>(key: K, value: TransferFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return createElement(
    "main",
    { style: pageStyle },
    createElement(
      "section",
      { style: cardStyle },
      createElement("a", { href: `/?lang=${language}`, style: { color: "#0B63F6", fontWeight: 700 } }, copy(language, "Ana sayfa", "Home")),
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, copy(language, "Transfer Talebi", "Request Airport Transfer")),
      createElement("p", { style: { color: "#4B5563", marginBottom: "12px" } }, copy(language, "Uygulama indirmeden, yolcudan hizmet bedeli alinmadan transfer talebi birakin.", "No app download. No passenger service fee. Verified providers only.")),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700, marginBottom: "24px" } }, copy(language, "QR kaynagi algilandi.", "QR source detected.")) : null,
      createElement("label", null, copy(language, "Yolcu adi", "Passenger name")),
      createElement("input", {
        style: inputStyle,
        value: form.passengerName,
        onChange: (event) => updateField("passengerName", event.currentTarget.value),
        placeholder: copy(language, "Ad soyad", "Full name")
      }),
      createElement("label", null, copy(language, "Telefon / WhatsApp", "Phone / WhatsApp")),
      createElement("input", {
        style: inputStyle,
        value: form.passengerPhone,
        onChange: (event) => updateField("passengerPhone", event.currentTarget.value),
        placeholder: "+90 5xx xxx xx xx"
      }),
      createElement("label", null, copy(language, "Ucus kodu", "Flight code")),
      createElement("input", {
        style: inputStyle,
        value: form.flightCode,
        onChange: (event) => updateField("flightCode", event.currentTarget.value),
        placeholder: "TK2524"
      }),
      createElement("label", null, copy(language, "Varis noktasi", "Destination")),
      createElement("input", {
        style: inputStyle,
        value: form.destination,
        onChange: (event) => updateField("destination", event.currentTarget.value),
        placeholder: "Bodrum Center, Yalikavak, Turgutreis..."
      }),
      createElement("label", null, copy(language, "Yolcu sayisi", "Passengers")),
      createElement("input", {
        style: inputStyle,
        type: "number",
        min: 1,
        value: form.passengers,
        onChange: (event) => updateField("passengers", Number(event.currentTarget.value))
      }),
      createElement("label", null, copy(language, "Bagaj", "Bags")),
      createElement("input", {
        style: inputStyle,
        type: "number",
        min: 0,
        value: form.bags,
        onChange: (event) => updateField("bags", Number(event.currentTarget.value))
      }),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitTransferRequest, disabled: isSubmitting }, isSubmitting ? copy(language, "Gonderiliyor...", "Sending...") : copy(language, "Transfer Talebi Gonder", "Request Transfer")),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, copy(language, "WhatsApp Destek", "WhatsApp Support")),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${copy(language, "Talep kodu", "Request code")}: ${requestCode}`) : null
    )
  );
}
