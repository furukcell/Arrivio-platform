import { createElement, useState } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest } from "@arrivio/firebase";
import { createCarRentalRequestCode, initialCarRentalFormState, validateCarRentalForm, type CarRentalFormState } from "../src/carRentalFormModel";
import { mapRentalFormToRequest } from "../src/rentalRequestMapper";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const cardStyle = { maxWidth: "720px", margin: "0 auto", padding: "28px", borderRadius: "24px", background: "#FFFFFF", boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)" };
const inputStyle = { width: "100%", padding: "14px", marginTop: "6px", marginBottom: "14px", border: "1px solid #D1D5DB", borderRadius: "12px", fontSize: "16px" };
const buttonStyle = { width: "100%", padding: "15px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, fontSize: "16px", cursor: "pointer" };

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function CarRentalPage() {
  const router = useRouter();
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
      setStatus(error);
      return;
    }
    setIsSubmitting(true);
    try {
      const code = createCarRentalRequestCode();
      await createCarRentalRequest(mapRentalFormToRequest(form, code, qrSourceId || undefined));
      setRequestCode(code);
      setStatus("Car rental request created. Arrivio will contact you soon.");
    } catch (error) {
      setStatus("Car rental request could not be created. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement("main", { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, "Request Car Rental"),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, "Tell us what car you need. Arrivio routes your request to verified rental providers."),
      qrSourceId ? createElement("p", { style: { color: "#1FB6A6", fontWeight: 700 } }, "QR source detected.") : null,
      createElement("label", null, "Passenger name"),
      createElement("input", { style: inputStyle, value: form.passengerName, onChange: (event) => updateField("passengerName", event.currentTarget.value), placeholder: "Full name" }),
      createElement("label", null, "Phone / WhatsApp"),
      createElement("input", { style: inputStyle, value: form.passengerPhone, onChange: (event) => updateField("passengerPhone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, "Flight code"),
      createElement("input", { style: inputStyle, value: form.flightCode, onChange: (event) => updateField("flightCode", event.currentTarget.value), placeholder: "TK2524" }),
      createElement("label", null, "Pickup location"),
      createElement("input", { style: inputStyle, value: form.pickupLocation, onChange: (event) => updateField("pickupLocation", event.currentTarget.value), placeholder: "Milas-Bodrum Airport" }),
      createElement("label", null, "Pickup date"),
      createElement("input", { style: inputStyle, type: "date", value: form.pickupDate, onChange: (event) => updateField("pickupDate", event.currentTarget.value) }),
      createElement("label", null, "Dropoff date"),
      createElement("input", { style: inputStyle, type: "date", value: form.dropoffDate, onChange: (event) => updateField("dropoffDate", event.currentTarget.value) }),
      createElement("label", null, "Car class"),
      createElement("select", { style: inputStyle, value: form.carClass, onChange: (event) => updateField("carClass", event.currentTarget.value as CarRentalFormState["carClass"]) },
        createElement("option", { value: "economic" }, "Economic"),
        createElement("option", { value: "middle" }, "Middle"),
        createElement("option", { value: "suv" }, "SUV"),
        createElement("option", { value: "luxury" }, "Luxury")
      ),
      createElement("button", { style: buttonStyle, type: "button", onClick: submitRequest, disabled: isSubmitting }, isSubmitting ? "Sending..." : "Request Car Rental"),
      status ? createElement("p", { style: { marginTop: "18px", fontWeight: 700 } }, status) : null,
      requestCode ? createElement("p", { style: { marginTop: "8px" } }, `Request code: ${requestCode}`) : null
    )
  );
}
