import { createElement, useEffect, useState } from "react";
import {
  createCarRentalDailyPrice,
  createHotelNightlyPrice,
  createTransferRoutePrice,
  getAppUserByUid,
  listenToCurrentUser,
  listProviderCarRentalDailyPrices,
  listProviderHotelNightlyPrices,
  listProviderTransferRoutePrices,
  logoutCurrentUser
} from "@arrivio/firebase";
import type {
  AppUser,
  CarRentalClass,
  CarRentalDailyPrice,
  CarRentalTransmission,
  HotelAccommodationType,
  HotelNightlyPrice,
  TransferDirection,
  TransferRoutePrice,
  TransferVehicleClass
} from "@arrivio/shared";
import { buildProviderSessionStatus, resolveProviderId } from "../src/providerSessionModel";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "start" };
const cardStyle = { padding: "22px", borderRadius: "22px", background: "#FFFFFF", border: "1px solid #DCEBFA", marginBottom: "14px", boxShadow: "0 16px 42px rgba(7, 27, 88, 0.08)" };
const inputStyle = { width: "100%", padding: "12px", marginTop: "6px", marginBottom: "12px", border: "1px solid #D1D5DB", borderRadius: "12px", background: "#FFFFFF" };
const linkStyle = { display: "inline-block", padding: "12px 16px", borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", textDecoration: "none", fontWeight: 800, marginRight: "8px" };
const greenButtonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 800, cursor: "pointer" };
const mutedButtonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#4B5563", color: "#FFFFFF", fontWeight: 800, cursor: "pointer" };

const transferDirections: Array<{ value: TransferDirection; label: string }> = [
  { value: "from_airport", label: "Havalimanından bölgeye" },
  { value: "to_airport", label: "Bölgeden havalimanına" }
];
const destinations = ["Bodrum Merkez", "Gümbet", "Yalıkavak", "Turgutreis", "Türkbükü", "Milas"];
const transferVehicles: Array<{ value: TransferVehicleClass; label: string }> = [
  { value: "economic", label: "Ekonomik" },
  { value: "vip", label: "VIP / Vito" },
  { value: "minibus", label: "Minibüs" },
  { value: "luxury", label: "Lüks" }
];
const pickupLocations = ["Milas-Bodrum Airport", "Bodrum Merkez", "Gümbet", "Yalıkavak", "Turgutreis", "Otele teslim"];
const rentalClasses: Array<{ value: CarRentalClass; label: string }> = [
  { value: "economic", label: "Ekonomik" },
  { value: "middle", label: "Orta sınıf" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Lüks" }
];
const transmissions: Array<{ value: CarRentalTransmission; label: string }> = [
  { value: "automatic", label: "Otomatik" },
  { value: "manual", label: "Manuel" }
];
const accommodationTypes: Array<{ value: HotelAccommodationType; label: string }> = [
  { value: "airport_hotel", label: "Havalimanına yakın otel" },
  { value: "bodrum_center", label: "Bodrum merkez otel" },
  { value: "apart_pension", label: "Apart / pansiyon" },
  { value: "family_room", label: "Aile odası" },
  { value: "luxury_hotel", label: "Lüks otel" }
];

export default function ProviderPricesPage() {
  const [authEmail, setAuthEmail] = useState("");
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [providerId, setProviderId] = useState("");
  const [status, setStatus] = useState("Checking provider session...");
  const [isSaving, setIsSaving] = useState(false);
  const [transferPrices, setTransferPrices] = useState<TransferRoutePrice[]>([]);
  const [rentalPrices, setRentalPrices] = useState<CarRentalDailyPrice[]>([]);
  const [hotelPrices, setHotelPrices] = useState<HotelNightlyPrice[]>([]);

  const [transferDirection, setTransferDirection] = useState<TransferDirection>("from_airport");
  const [destination, setDestination] = useState("Bodrum Merkez");
  const [vehicleClass, setVehicleClass] = useState<TransferVehicleClass>("economic");
  const [transferPrice, setTransferPrice] = useState("");

  const [pickupLocation, setPickupLocation] = useState("Milas-Bodrum Airport");
  const [carClass, setCarClass] = useState<CarRentalClass>("economic");
  const [transmission, setTransmission] = useState<CarRentalTransmission>("automatic");
  const [dailyPrice, setDailyPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [accommodationType, setAccommodationType] = useState<HotelAccommodationType>("airport_hotel");
  const [nightlyPrice, setNightlyPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("2");
  const [hasTransfer, setHasTransfer] = useState(true);

  async function loadPrices(activeProviderId = providerId) {
    if (!activeProviderId) return;
    const [transferItems, rentalItems, hotelItems] = await Promise.all([
      listProviderTransferRoutePrices(activeProviderId),
      listProviderCarRentalDailyPrices(activeProviderId),
      listProviderHotelNightlyPrices(activeProviderId)
    ]);
    setTransferPrices(transferItems);
    setRentalPrices(rentalItems);
    setHotelPrices(hotelItems);
  }

  async function logoutProvider() {
    await logoutCurrentUser();
    setAuthEmail("");
    setAppUser(null);
    setProviderId("");
    setTransferPrices([]);
    setRentalPrices([]);
    setHotelPrices([]);
    setStatus("Logged out.");
  }

  async function saveTransferPrice() {
    if (!providerId) return setStatus("Provider login required.");
    const price = Number(transferPrice);
    if (!transferPrice || Number.isNaN(price) || price <= 0) return setStatus("Transfer price must be valid.");
    setIsSaving(true);
    try {
      await createTransferRoutePrice({
        providerId,
        airportCode: "BJV",
        transferDirection,
        destination,
        vehicleClass,
        price,
        currency: "TRY",
        isActive: true,
        isVerified: true
      });
      setTransferPrice("");
      await loadPrices(providerId);
      setStatus("Transfer route price saved.");
    } catch (error) {
      setStatus("Transfer route price could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveRentalPrice() {
    if (!providerId) return setStatus("Provider login required.");
    const price = Number(dailyPrice);
    const deposit = depositAmount ? Number(depositAmount) : undefined;
    if (!dailyPrice || Number.isNaN(price) || price <= 0) return setStatus("Daily price must be valid.");
    if (depositAmount && (Number.isNaN(Number(depositAmount)) || Number(depositAmount) < 0)) return setStatus("Deposit must be valid.");
    setIsSaving(true);
    try {
      await createCarRentalDailyPrice({
        providerId,
        airportCode: "BJV",
        pickupLocation,
        carClass,
        transmission,
        dailyPrice: price,
        currency: "TRY",
        airportDelivery: pickupLocation === "Milas-Bodrum Airport" || pickupLocation === "Otele teslim",
        depositAmount: deposit,
        isActive: true,
        isVerified: true
      });
      setDailyPrice("");
      setDepositAmount("");
      await loadPrices(providerId);
      setStatus("Car rental daily price saved.");
    } catch (error) {
      setStatus("Car rental daily price could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveHotelPrice() {
    if (!providerId) return setStatus("Provider login required.");
    const price = Number(nightlyPrice);
    const guestCount = Number(maxGuests);
    if (!nightlyPrice || Number.isNaN(price) || price <= 0) return setStatus("Nightly price must be valid.");
    if (!maxGuests || Number.isNaN(guestCount) || guestCount < 1) return setStatus("Max guests must be valid.");
    setIsSaving(true);
    try {
      await createHotelNightlyPrice({
        providerId,
        airportCode: "BJV",
        accommodationType,
        nightlyPrice: price,
        currency: "TRY",
        maxGuests: guestCount,
        hasTransfer,
        isActive: true,
        isVerified: true
      });
      setNightlyPrice("");
      await loadPrices(providerId);
      setStatus("Hotel nightly price saved.");
    } catch (error) {
      setStatus("Hotel nightly price could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setStatus("Please login as provider at /login.");
        return;
      }
      setAuthEmail(authUser.email || "");
      const profile = await getAppUserByUid(authUser.uid);
      setAppUser(profile);
      const resolvedProviderId = resolveProviderId(profile);
      setProviderId(resolvedProviderId);
      setStatus(buildProviderSessionStatus(profile));
      if (resolvedProviderId) await loadPrices(resolvedProviderId);
    });
    return () => unsubscribe();
  }, []);

  return createElement("main", { style: pageStyle },
    createElement("a", { href: "/", style: { color: "#0B63F6", fontWeight: 800 } }, "← Provider Dashboard"),
    createElement("h1", { style: { fontSize: "40px", margin: "18px 0 8px" } }, "Provider Prices"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, `Email: ${authEmail || "not logged in"} / Provider ID: ${providerId || "not set"}`),
    createElement("p", { style: { color: "#4B5563", marginBottom: "22px", fontWeight: 700 } }, `${status} / Role: ${appUser?.role || "not set"} / Type: ${appUser?.providerType || "all"}`),
    !providerId ? createElement("a", { href: "/login", style: linkStyle }, "Login") : null,
    authEmail ? createElement("button", { type: "button", onClick: logoutProvider, style: mutedButtonStyle }, "Logout") : null,
    createElement("div", { style: gridStyle },
      createElement("section", { style: cardStyle },
        createElement("h2", null, "Transfer Route Price"),
        createElement("label", null, "Direction", createElement("select", { style: inputStyle, value: transferDirection, onChange: (event) => setTransferDirection(event.currentTarget.value as TransferDirection) }, ...transferDirections.map((item) => createElement("option", { key: item.value, value: item.value }, item.label)))) ,
        createElement("label", null, "Destination", createElement("select", { style: inputStyle, value: destination, onChange: (event) => setDestination(event.currentTarget.value) }, ...destinations.map((item) => createElement("option", { key: item, value: item }, item)))) ,
        createElement("label", null, "Vehicle", createElement("select", { style: inputStyle, value: vehicleClass, onChange: (event) => setVehicleClass(event.currentTarget.value as TransferVehicleClass) }, ...transferVehicles.map((item) => createElement("option", { key: item.value, value: item.value }, item.label)))) ,
        createElement("label", null, "Price TRY", createElement("input", { style: inputStyle, value: transferPrice, onChange: (event) => setTransferPrice(event.currentTarget.value), placeholder: "2500" })),
        createElement("button", { type: "button", onClick: saveTransferPrice, disabled: isSaving || !providerId, style: greenButtonStyle }, isSaving ? "Saving..." : "Save Transfer Price"),
        createElement("p", { style: { color: "#64748B", fontWeight: 700 } }, `${transferPrices.length} transfer prices saved.`)
      ),
      createElement("section", { style: cardStyle },
        createElement("h2", null, "Rent a Car Daily Price"),
        createElement("label", null, "Pickup location", createElement("select", { style: inputStyle, value: pickupLocation, onChange: (event) => setPickupLocation(event.currentTarget.value) }, ...pickupLocations.map((item) => createElement("option", { key: item, value: item }, item)))) ,
        createElement("label", null, "Car class", createElement("select", { style: inputStyle, value: carClass, onChange: (event) => setCarClass(event.currentTarget.value as CarRentalClass) }, ...rentalClasses.map((item) => createElement("option", { key: item.value, value: item.value }, item.label)))) ,
        createElement("label", null, "Transmission", createElement("select", { style: inputStyle, value: transmission, onChange: (event) => setTransmission(event.currentTarget.value as CarRentalTransmission) }, ...transmissions.map((item) => createElement("option", { key: item.value, value: item.value }, item.label)))) ,
        createElement("label", null, "Daily price TRY", createElement("input", { style: inputStyle, value: dailyPrice, onChange: (event) => setDailyPrice(event.currentTarget.value), placeholder: "1200" })),
        createElement("label", null, "Deposit TRY", createElement("input", { style: inputStyle, value: depositAmount, onChange: (event) => setDepositAmount(event.currentTarget.value), placeholder: "5000" })),
        createElement("button", { type: "button", onClick: saveRentalPrice, disabled: isSaving || !providerId, style: greenButtonStyle }, isSaving ? "Saving..." : "Save Rental Price"),
        createElement("p", { style: { color: "#64748B", fontWeight: 700 } }, `${rentalPrices.length} rental prices saved.`)
      ),
      createElement("section", { style: cardStyle },
        createElement("h2", null, "Hotel Nightly Price"),
        createElement("label", null, "Accommodation type", createElement("select", { style: inputStyle, value: accommodationType, onChange: (event) => setAccommodationType(event.currentTarget.value as HotelAccommodationType) }, ...accommodationTypes.map((item) => createElement("option", { key: item.value, value: item.value }, item.label)))) ,
        createElement("label", null, "Nightly price TRY", createElement("input", { style: inputStyle, value: nightlyPrice, onChange: (event) => setNightlyPrice(event.currentTarget.value), placeholder: "2500" })),
        createElement("label", null, "Max guests", createElement("input", { style: inputStyle, value: maxGuests, onChange: (event) => setMaxGuests(event.currentTarget.value), placeholder: "2" })),
        createElement("label", { style: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" } }, createElement("input", { type: "checkbox", checked: hasTransfer, onChange: (event) => setHasTransfer(event.currentTarget.checked) }), "Airport transfer available"),
        createElement("button", { type: "button", onClick: saveHotelPrice, disabled: isSaving || !providerId, style: greenButtonStyle }, isSaving ? "Saving..." : "Save Hotel Price"),
        createElement("p", { style: { color: "#64748B", fontWeight: 700 } }, `${hotelPrices.length} hotel prices saved.`)
      )
    ),
    createElement("section", { style: cardStyle },
      createElement("h2", null, "Saved Prices"),
      createElement("p", { style: { color: "#64748B" } }, "These active and verified prices are used by the passenger website to calculate min-max estimated price ranges."),
      createElement("pre", { style: { whiteSpace: "pre-wrap", background: "#F8FAFC", padding: "14px", borderRadius: "14px" } }, JSON.stringify({ transferPrices, rentalPrices, hotelPrices }, null, 2))
    )
  );
}
