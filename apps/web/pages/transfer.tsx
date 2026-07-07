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
import { getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { transferCopy } from "../src/webCopy";

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
  const text = transferCopy(language);
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
      const payload = mapTransferFormToRequest(form, code, qrSourceId || undefined, language);
      await createTransferRequest(payload);
      setRequestCode(code);
      setStatus(text.success);
    } catch (error) {
      setStatus(text.failure);
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
      createElement("a", { href: `/?lang=${language}`, style: { color: "#0B63F6", fontWeight: 700 } }, text.home),
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, text.airport),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, text.title),
      createElement("p", { style: { color: "#4B5563", marginBottom: "12px" } }, text.description),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700, marginBottom: "24px" } }, text.qrDetected) : null,
      createElement("label", null, text.passengerName),
      createElement("input", {
        style: inputStyle,
        value: form.passengerName,
        onChange: (event) => updateField("passengerName", event.currentTarget.value),
        placeholder: text.passengerPlaceholder
      }),
      createElement("label", null, text.phone),
      createElement("input", {
        style: inputStyle,
        value: form.passengerPhone,
        onChange: (event) => updateField("passengerPhone", event.currentTarget.value),
        placeholder: "+90 5xx xxx xx xx"
      }),
      createElement("label", null, text.flightCode),
      createElement("input", {
        style: inputStyle,
        value: form.flightCode,
        onChange: (event) => updateField("flightCode", event.currentTarget.value),
        placeholder: "TK2524"
      }),
      createElement("label", null, text.destination),
      createElement("input", {
        style: inputStyle,
        value: form.destination,
        onChange: (event) => updateField("destination", event.currentTarget.value),
        placeholder: "Bodrum Center, Yalikavak, Turgutreis..."
      }),
      createElement("label", null, text.passengers),
      createElement("input", {
        style: inputStyle,
        type: "number",
        min: 1,
        value: form.passengers,
        onChange: (event) => updateField("passengers", Number(event.currentTarget.value))
      }),
      createElement("label", null, text.bags),
      createElement("input", {
        style: inputStyle,
        type: "number",
        min: 0,
        value: form.bags,
        onChange: (event) => updateField("bags", Number(event.currentTarget.value))
      }),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitTransferRequest, disabled: isSubmitting }, isSubmitting ? text.sending : text.submit),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, text.support),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${text.requestCode}: ${requestCode}`) : null
    )
  );
}
