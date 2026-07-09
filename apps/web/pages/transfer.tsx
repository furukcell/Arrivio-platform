import { useState } from "react";
import { useRouter } from "next/router";
import { createTransferRequest } from "@arrivio/firebase";
import {
  buildTransferRoute,
  createTransferRequestCode,
  formatTransferPriceRange,
  getTransferPriceSummary,
  initialTransferFormState,
  TRANSFER_DESTINATION_OPTIONS,
  TRANSFER_DIRECTION_OPTIONS,
  TRANSFER_VEHICLE_OPTIONS,
  validateTransferForm,
  type TransferDirection,
  type TransferFormState,
  type TransferVehicleClass
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
  maxWidth: "860px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "24px",
  background: "#FFFFFF",
  boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginTop: "18px"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "6px",
  marginBottom: "4px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px",
  fontSize: "16px",
  background: "#FFFFFF"
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
  cursor: "pointer",
  marginTop: "18px"
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
  const route = buildTransferRoute(form);
  const priceSummary = getTransferPriceSummary(form);
  const priceRangeText = formatTransferPriceRange(priceSummary);
  const providerCountLabel = priceSummary ? (language === "tr" ? `${priceSummary.providerCount} uygun araç` : `${priceSummary.providerCount} available vehicles`) : (language === "tr" ? "Uygun araç kontrol edilecek" : "Availability will be checked");

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

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <a href={`/?lang=${language}`} style={{ color: "#0B63F6", fontWeight: 700 }}>{text.home}</a>
        <p style={{ color: "#0B63F6", fontWeight: 700 }}>{text.airport}</p>
        <h1 style={{ fontSize: "42px", margin: "0 0 10px" }}>{text.title}</h1>
        <p style={{ color: "#4B5563", marginBottom: "12px" }}>{text.description}</p>
        {qrSourceId ? <p style={{ color: "#1FB6A6", fontWeight: 700, marginBottom: "24px" }}>{text.qrDetected}</p> : null}

        <div style={{ padding: "16px", borderRadius: "18px", background: "#F0F7FF", marginTop: "18px" }}>
          <strong>{language === "tr" ? "1. Transfer yönünü ve rotanı seç" : "1. Choose direction and route"}</strong>
          <p style={{ margin: "6px 0 0", color: "#4B5563" }}>{language === "tr" ? "Havalimanından çıkış mı, yoksa bölgeden havalimanına geliş mi olduğunu seç." : "Choose whether the trip starts from the airport or goes to the airport."}</p>
        </div>

        <div style={gridStyle}>
          <label>{language === "tr" ? "Transfer yönü" : "Transfer direction"}
            <select style={inputStyle} value={form.transferDirection} onChange={(event) => updateField("transferDirection", event.currentTarget.value as TransferDirection)}>
              {TRANSFER_DIRECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
            </select>
          </label>
          <label>{form.transferDirection === "to_airport" ? (language === "tr" ? "Nereden alınacak?" : "Pickup area") : text.destination}
            <select style={inputStyle} value={form.destination} onChange={(event) => updateField("destination", event.currentTarget.value)}>
              {TRANSFER_DESTINATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
            </select>
          </label>
          <label>{language === "tr" ? "Alış tarihi" : "Pickup date"}
            <input style={inputStyle} type="date" value={form.pickupDate} onChange={(event) => updateField("pickupDate", event.currentTarget.value)} />
          </label>
          <label>{language === "tr" ? "Alış saati" : "Pickup time"}
            <input style={inputStyle} type="time" value={form.pickupTime} onChange={(event) => updateField("pickupTime", event.currentTarget.value)} />
          </label>
          <label>{text.passengers}
            <input style={inputStyle} type="number" min={1} value={form.passengers} onChange={(event) => updateField("passengers", Number(event.currentTarget.value))} />
          </label>
          <label>{language === "tr" ? "Araç tipi" : "Vehicle type"}
            <select style={inputStyle} value={form.vehicleClass} onChange={(event) => updateField("vehicleClass", event.currentTarget.value as TransferVehicleClass)}>
              {TRANSFER_VEHICLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{language === "tr" ? option.trLabel : option.enLabel}</option>)}
            </select>
          </label>
          <label>{language === "tr" ? "Bagaj" : "Bags"}
            <input style={inputStyle} type="number" min={0} value={form.bags} onChange={(event) => updateField("bags", Number(event.currentTarget.value))} />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "center", padding: "16px", borderRadius: "18px", background: "#E9FBF6", marginTop: "18px" }}>
          <div>
            <span style={{ color: "#087F68", fontWeight: 700 }}>{language === "tr" ? "Tahmini fiyat aralığı" : "Estimated price range"}</span>
            <strong style={{ display: "block", fontSize: "30px", marginTop: "4px" }}>{priceRangeText}</strong>
            <small style={{ display: "block", marginTop: "4px", color: "#087F68", fontWeight: 700 }}>{providerCountLabel}</small>
          </div>
          <p style={{ margin: 0, color: "#4B5563", maxWidth: "420px" }}>{language === "tr" ? `Rota: ${route.routeFrom} → ${route.routeTo}. Net fiyat işi alan sağlayıcı onayıyla kesinleşir.` : `Route: ${route.routeFrom} → ${route.routeTo}. Final price is confirmed by the provider who accepts the job.`}</p>
        </div>

        <div style={{ padding: "16px", borderRadius: "18px", background: "#F8FAFC", marginTop: "18px" }}>
          <strong>{language === "tr" ? "2. Son bilgileri bırak" : "2. Add final details"}</strong>
          <p style={{ margin: "6px 0 0", color: "#4B5563" }}>{language === "tr" ? "Talebi göndermek için ad, telefon ve varsa uçuş kodunu yaz." : "Enter name, phone and flight code if available to send the request."}</p>
        </div>

        <div style={gridStyle}>
          <label>{text.passengerName}
            <input style={inputStyle} value={form.passengerName} onChange={(event) => updateField("passengerName", event.currentTarget.value)} placeholder={text.passengerPlaceholder} />
          </label>
          <label>{text.phone}
            <input style={inputStyle} value={form.passengerPhone} onChange={(event) => updateField("passengerPhone", event.currentTarget.value)} placeholder="+90 5xx xxx xx xx" />
          </label>
          <label>{text.flightCode}
            <input style={inputStyle} value={form.flightCode} onChange={(event) => updateField("flightCode", event.currentTarget.value)} placeholder="TK2524" />
          </label>
        </div>

        <button style={buttonStyle} type="button" onClick={submitTransferRequest} disabled={isSubmitting}>{isSubmitting ? text.sending : text.submit}</button>
        <a href={whatsappSupportUrl(language)} style={supportStyle}>{text.support}</a>
        {status ? <p style={{ marginTop: "18px", fontWeight: 700 }}>{status}</p> : null}
        {requestCode ? <p style={{ marginTop: "8px" }}>{text.requestCode}: {requestCode}</p> : null}
      </section>
    </main>
  );
}
