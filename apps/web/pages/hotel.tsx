import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createHotelRequest, listPublicHotelNightlyPrices } from "@arrivio/firebase";
import type { HotelNightlyPrice } from "@arrivio/shared";
import {
  createHotelRequestCode,
  formatHotelNightlyPriceRange,
  getHotelPriceSummary,
  HOTEL_ACCOMMODATION_OPTIONS,
  initialHotelFormState,
  validateHotelForm,
  type HotelAccommodationType,
  type HotelFormState
} from "../src/hotelFormModel";
import { mapHotelFormToRequest } from "../src/hotelRequestMapper";
import { getLanguage, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { hotelCopy } from "../src/webCopy";

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

export default function HotelPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const text = hotelCopy(language);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const [form, setForm] = useState<HotelFormState>(initialHotelFormState);
  const [nightlyPrices, setNightlyPrices] = useState<HotelNightlyPrice[]>([]);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const livePrices = nightlyPrices.length ? nightlyPrices : undefined;
  const priceSummary = getHotelPriceSummary(form, livePrices);
  const priceRangeText = formatHotelNightlyPriceRange(priceSummary);
  const hotelCount = priceSummary ? (language === "tr" ? `${priceSummary.hotelCount} uygun tesis` : `${priceSummary.hotelCount} available properties`) : (language === "tr" ? "Uygun tesis kontrol edilecek" : "Availability will be checked");

  useEffect(() => {
    let isMounted = true;
    async function loadPrices() {
      try {
        const prices = await listPublicHotelNightlyPrices();
        if (isMounted) setNightlyPrices(prices);
      } catch (error) {
        if (isMounted) setNightlyPrices([]);
      }
    }
    loadPrices();
    return () => { isMounted = false; };
  }, []);

  function updateField<K extends keyof HotelFormState>(key: K, value: HotelFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitRequest() {
    const error = validateHotelForm(form);
    if (error) {
      setStatus(translateFormMessage(language, error));
      return;
    }
    setIsSubmitting(true);
    try {
      const code = createHotelRequestCode();
      await createHotelRequest(mapHotelFormToRequest(form, code, qrSourceId || undefined, language, nightlyPrices));
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
        createElement("label", null, text.passengerName, createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: text.passengerPlaceholder })),
        createElement("label", null, text.phone, createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" })),
        createElement("label", null, text.flightCode, createElement("input", { style: inputStyle, value: form.flightCode, onChange: (event) => updateField("flightCode", event.currentTarget.value), placeholder: "TK2524" })),
        createElement("label", null, language === "tr" ? "Konaklama tipi" : "Accommodation type", createElement("select", { style: inputStyle, value: form.accommodationType, onChange: (event) => updateField("accommodationType", event.currentTarget.value as HotelAccommodationType) }, ...HOTEL_ACCOMMODATION_OPTIONS.map((option) => createElement("option", { key: option.value, value: option.value }, language === "tr" ? option.trLabel : option.enLabel)))),
        createElement("label", null, text.checkIn, createElement("input", { style: inputStyle, type: "date", value: form.checkInDate, onChange: (event) => updateField("checkInDate", event.currentTarget.value) })),
        createElement("label", null, text.checkOut, createElement("input", { style: inputStyle, type: "date", value: form.checkOutDate, onChange: (event) => updateField("checkOutDate", event.currentTarget.value) })),
        createElement("label", null, text.guests, createElement("input", { style: inputStyle, type: "number", min: 1, value: form.guests, onChange: (event) => updateField("guests", Number(event.currentTarget.value)) })),
        createElement("label", null, text.rooms, createElement("input", { style: inputStyle, type: "number", min: 1, value: form.rooms, onChange: (event) => updateField("rooms", Number(event.currentTarget.value)) })),
        createElement("label", null, text.radius, createElement("input", { style: inputStyle, type: "number", min: 1, value: form.radiusKm, onChange: (event) => updateField("radiusKm", Number(event.currentTarget.value)) })),
        createElement("label", { style: { display: "flex", alignItems: "center", gap: "8px", paddingTop: "28px" } }, createElement("input", { type: "checkbox", checked: form.wantsTransfer, onChange: (event) => updateField("wantsTransfer", event.currentTarget.checked) }), text.wantsTransfer)
      ),
      createElement("div", { style: summaryStyle },
        createElement("div", null,
          createElement("span", { style: { color: "#087F68", fontWeight: 700 } }, language === "tr" ? "Tahmini gece fiyatı" : "Estimated nightly price"),
          createElement("strong", { style: { display: "block", fontSize: "30px", marginTop: "4px" } }, priceRangeText),
          createElement("small", { style: { display: "block", marginTop: "4px", color: "#087F68", fontWeight: 700 } }, hotelCount)
        ),
        createElement("p", { style: { margin: 0, color: "#4B5563", maxWidth: "420px" } }, language === "tr" ? `Tahmini ${priceSummary?.nightCount || 1} gece. Net fiyat tesis müsaitlik onayıyla kesinleşir.` : `Estimated ${priceSummary?.nightCount || 1} nights. Final price is confirmed after property availability.`)
      ),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? text.sending : text.submit),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, text.support),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `${text.requestCode}: ${requestCode}`) : null
    )
  );
}
