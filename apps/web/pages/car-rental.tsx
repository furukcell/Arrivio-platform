import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest } from "@arrivio/firebase";
import {
  CAR_RENTAL_CLASS_OPTIONS,
  CAR_RENTAL_PICKUP_OPTIONS,
  CAR_RENTAL_TRANSMISSION_OPTIONS,
  createCarRentalRequestCode,
  formatCarRentalDailyPriceRange,
  getCarRentalPriceSummary,
  initialCarRentalFormState,
  validateCarRentalForm,
  type CarRentalClass,
  type CarRentalFormState,
  type CarRentalTransmission
} from "../src/carRentalFormModel";
import { mapRentalFormToRequest } from "../src/rentalRequestMapper";
import { getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { rentalCopy } from "../src/webCopy";

const pageStyle = { minHeight: "100vh", padding: "24px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const cardStyle = { maxWidth: "860px", margin: "0 auto", padding: "24px", borderRadius: "24px", background: "#FFFFFF", boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginTop: "18px" };
const inputStyle = { width: "100%", padding: "14px", marginTop: "6px", marginBottom: "4px", border: "1px solid #D1D5DB", borderRadius: "12px", fontSize: "16px", background: "#FFFFFF" };
const buttonStyle = { width: "100%", padding: "15px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, fontSize: "16px", cursor: "pointer", marginTop: "18px" };
const supportStyle = { display: "block", width: "100%", boxSizing: "border-box" as const, textAlign: "center" as const, padding: "15px", borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, textDecoration: "none", marginTop: "12px" };
const summaryStyle = { display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "center", padding: "16px", borderRadius: "18px", background: "#E9FBF6", marginTop: "18px" };

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function CarRentalPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const text = rentalCopy(language);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const [form, setForm] = useState<CarRentalFormState>(initialCarRentalFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const priceSummary = getCarRentalPriceSummary(form);
  const priceRangeText = formatCarRentalDailyPriceRange(priceSummary);
  const vehicleCount = priceSummary ? (language === "tr" ? `${priceSummary.vehicleCount} uygun araç` : `${priceSummary.vehicleCount} available cars`) : (language === "tr" ? "Uygun araç kontrol edilecek" : "Availability will be checked");

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
      await createCarRentalRequest(mapRentalFormToRequest(form, code, qrSourceId || undefined, language));
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
      createElement("div", { style: gridStyle },
        createElement("label", null, text.passengerName,
          createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: text.passengerPlaceholder })
        ),
        createElement("label", null, text.phone,
          createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" })
        ),
        createElement("label", null, text.flightCode,
          createElement("input", { style: inputStyle, value: form.flightCode, onChange: (event) => updateField("flightCode", event.currentTarget.value), placeholder: "TK2524" })
        ),
        createElement("label", null, text.pickupLocation,
          createElement("select", { style: inputStyle, value: form.pickupLocation, onChange: (event) => updateField("pickupLocation", event.currentTarget.value) },
            ...CAR_RENTAL_PICKUP_OPTIONS.map((option) => createElement("option", { key: option.value, value: option.value }, language === "tr" ? option.trLabel : option.enLabel))
          )
        ),
        createElement("label", null, language === "tr" ? "Bırakış yeri" : "Dropoff location",
          createElement("input", { style: inputStyle, value: form.dropoffLocation, onChange: (event) => updateField("dropoffLocation", event.currentTarget.value), placeholder: language === "tr" ? "Aynı yer veya otel" : "Same place or hotel" })
        ),
        createElement("label", null, text.pickupDate,
          createElement("input", { style: inputStyle, type: "date", value: form.pickupDate, onChange: (event) => updateField("pickupDate", event.currentTarget.value) })
        ),
        createElement("label", null, language === "tr" ? "Alış saati" : "Pickup time",
          createElement("input", { style: inputStyle, type: "time", value: form.pickupTime, onChange: (event) => updateField("pickupTime", event.currentTarget.value) })
        ),
        createElement("label", null, text.dropoffDate,
          createElement("input", { style: inputStyle, type: "date", value: form.dropoffDate, onChange: (event) => updateField("dropoffDate", event.currentTarget.value) })
        ),
        createElement("label", null, language === "tr" ? "Bırakış saati" : "Dropoff time",
          createElement("input", { style: inputStyle, type: "time", value: form.dropoffTime, onChange: (event) => updateField("dropoffTime", event.currentTarget.value) })
        ),
        createElement("label", null, text.carClass,
          createElement("select", { style: inputStyle, value: form.carClass, onChange: (event) => updateField("carClass", event.currentTarget.value as CarRentalClass) },
            ...CAR_RENTAL_CLASS_OPTIONS.map((option) => createElement("option", { key: option.value, value: option.value }, language === "tr" ? option.trLabel : option.enLabel))
          )
        ),
        createElement("label", null, language === "tr" ? "Vites" : "Transmission",
          createElement("select", { style: inputStyle, value: form.transmission, onChange: (event) => updateField("transmission", event.currentTarget.value as CarRentalTransmission) },
            ...CAR_RENTAL_TRANSMISSION_OPTIONS.map((option) => createElement("option", { key: option.value, value: option.value }, language === "tr" ? option.trLabel : option.enLabel))
          )
        ),
        createElement("label", null, language === "tr" ? "Yolcu" : "Passengers",
          createElement("input", { style: inputStyle, type: "number", min: 1, value: form.passengers, onChange: (event) => updateField("passengers", Number(event.currentTarget.value)) })
        )
      ),
      createElement("div", { style: summaryStyle },
        createElement("div", null,
          createElement("span", { style: { color: "#087F68", fontWeight: 700 } }, language === "tr" ? "Tahmini günlük fiyat" : "Estimated daily price"),
          createElement("strong", { style: { display: "block", fontSize: "30px", marginTop: "4px" } }, priceRangeText),
          createElement("small", { style: { display: "block", marginTop: "4px", color: "#087F68", fontWeight: 700 } }, vehicleCount)
        ),
        createElement("p", { style: { margin: 0, color: "#4B5563", maxWidth: "420px" } }, language === "tr" ? `Tahmini ${priceSummary?.rentalDays || 1} gün. Net fiyat firma onayıyla kesinleşir.` : `Estimated ${priceSummary?.rentalDays || 1} days. Final price is confirmed by the rental provider.`)
      ),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? text.sending : text.submit),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, text.support),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${text.requestCode}: ${requestCode}`) : null
    )
  );
}
