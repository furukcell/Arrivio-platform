import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/router";
import { createCarRentalRequest, createHotelRequest, createTicketRequest, createTransferRequest } from "@arrivio/firebase";
import { createTransferRequestCode, initialTransferFormState, validateTransferForm, type TransferFormState } from "../src/transferFormModel";
import { createCarRentalRequestCode, initialCarRentalFormState, validateCarRentalForm, type CarRentalFormState } from "../src/carRentalFormModel";
import { createHotelRequestCode, initialHotelFormState, validateHotelForm, type HotelFormState } from "../src/hotelFormModel";
import { createTicketRequestCode, initialTicketFormState, validateTicketForm, type TicketFormState } from "../src/ticketFormModel";
import { mapTransferFormToRequest } from "../src/transferRequestMapper";
import { mapRentalFormToRequest } from "../src/rentalRequestMapper";
import { mapHotelFormToRequest } from "../src/hotelRequestMapper";
import { mapTicketFormToRequest } from "../src/ticketRequestMapper";
import { getLanguage, languageHref, translateFormMessage, whatsappSupportUrl } from "../src/supportModel";
import { hotelCopy, rentalCopy, ticketCopy, transferCopy } from "../src/webCopy";

type TabKey = "transfer" | "rental" | "hotel" | "ticket";

type HomeCopy = {
  nav: { transfer: string; rental: string; hotels: string; flights: string; support: string; search: string };
  hero: { eyebrow: string; title: string; description: string };
  tabs: Record<TabKey, string>;
  common: { passenger: string; phone: string; flight: string; support: string; requestCode: string };
  sections: { services: string; providers: string; hotels: string; coverage: string; trust: string };
  serviceCards: Array<{ icon: string; title: string; text: string; action: string }>;
  providers: Array<{ logo: string; name: string; rating: string; count: string }>;
  hotelCards: Array<{ image: string; name: string; distance: string; price: string }>;
  trust: Array<{ icon: string; title: string; text: string }>;
};

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

function homeCopy(language: "tr" | "en"): HomeCopy {
  if (language === "tr") {
    return {
      nav: { transfer: "Transfer", rental: "Araç Kiralama", hotels: "Oteller", flights: "Bilet", support: "Destek", search: "Hemen Ara" },
      hero: {
        eyebrow: "Milas-Bodrum Havalimanı",
        title: "İn. Seç. Git.",
        description: "Arrivio, inişten sonra doğrulanmış transfer, araç kiralama, yakın otel ve bilet taleplerinizi tek ekrandan yönetir."
      },
      tabs: { transfer: "Transfer", rental: "Araç", hotel: "Oteller", ticket: "Bilet" },
      common: { passenger: "Yolcu adı", phone: "Telefon", flight: "Uçuş kodu", support: "WhatsApp Destek", requestCode: "Talep kodu" },
      sections: { services: "Popüler Havalimanı Hizmetleri", providers: "Doğrulanmış Sağlayıcılar", hotels: "20 km İçindeki Oteller", coverage: "Hizmet Alanı", trust: "Neden Arrivio?" },
      serviceCards: [
        { icon: "🚘", title: "Havalimanı Transferi", text: "Belgeli yerel sağlayıcılarla transfer talebi bırakın.", action: "Transfer Bul" },
        { icon: "🚗", title: "Araç Kiralama", text: "Ekonomik, SUV veya lüks araç için talep oluşturun.", action: "Araç Bul" },
        { icon: "🏨", title: "Yakın Oteller", text: "BJV çevresindeki uygun oteller için dönüş alın.", action: "Otel Sor" },
        { icon: "✈️", title: "Bilet Talebi", text: "Uçuş ve rota talebinizi acenteye iletin.", action: "Bilet Sor" }
      ],
      providers: [
        { logo: "BCT", name: "Bodrum Comfort Transfer", rating: "4.9", count: "1.248" },
        { logo: "SUN", name: "Sunline Transfers", rating: "4.8", count: "932" },
        { logo: "ROY", name: "Royal Bodrum Transfer", rating: "4.7", count: "756" },
        { logo: "EGO", name: "EasyGo Bodrum", rating: "4.6", count: "512" }
      ],
      hotelCards: [
        { image: "🌴", name: "DoubleTree by Hilton Bodrum", distance: "8.6 km BJV", price: "₺3.450 / gece" },
        { image: "🌊", name: "La Blanche Island Bodrum", distance: "10.1 km BJV", price: "₺4.150 / gece" },
        { image: "🏖️", name: "Ramada Resort Bodrum", distance: "15.7 km BJV", price: "₺2.980 / gece" }
      ],
      trust: [
        { icon: "🛡️", title: "Doğrulanmış Sağlayıcılar", text: "İş ortakları kontrol edilir." },
        { icon: "🏷️", title: "Şeffaf Komisyon", text: "Yolcudan platform ücreti alınmaz." },
        { icon: "🎧", title: "WhatsApp Destek", text: "Talep öncesi ve sonrası destek." }
      ]
    };
  }

  return {
    nav: { transfer: "Transfer", rental: "Car Rental", hotels: "Hotels", flights: "Flights", support: "Support", search: "Search Now" },
    hero: { eyebrow: "Milas-Bodrum Airport", title: "Land. Choose. Go.", description: "Arrivio helps you find verified airport transfers, car rentals, nearby hotels and flight requests after landing." },
    tabs: { transfer: "Transfer", rental: "Car Rental", hotel: "Hotels", ticket: "Flights" },
    common: { passenger: "Passenger name", phone: "Phone", flight: "Flight code", support: "WhatsApp Support", requestCode: "Request code" },
    sections: { services: "Popular Airport Services", providers: "Verified Providers", hotels: "Nearby Hotels within 20 km", coverage: "Airport Area Coverage", trust: "Why Arrivio?" },
    serviceCards: [
      { icon: "🚘", title: "Airport Transfer", text: "Pre-book your ride with verified local providers.", action: "Find Transfer" },
      { icon: "🚗", title: "Car Rental", text: "Compare car rental requests from local companies.", action: "Find a Car" },
      { icon: "🏨", title: "Nearby Hotels", text: "Stay close to the airport with comfort.", action: "Find Hotels" },
      { icon: "✈️", title: "Flight Request", text: "Send route and ticket support requests.", action: "Ask Flight" }
    ],
    providers: [
      { logo: "BCT", name: "Bodrum Comfort Transfer", rating: "4.9", count: "1,248" },
      { logo: "SUN", name: "Sunline Transfers", rating: "4.8", count: "932" },
      { logo: "ROY", name: "Royal Bodrum Transfer", rating: "4.7", count: "756" },
      { logo: "EGO", name: "EasyGo Bodrum", rating: "4.6", count: "512" }
    ],
    hotelCards: [
      { image: "🌴", name: "DoubleTree by Hilton Bodrum", distance: "8.6 km from BJV", price: "€98 / night" },
      { image: "🌊", name: "La Blanche Island Bodrum", distance: "10.1 km from BJV", price: "€112 / night" },
      { image: "🏖️", name: "Ramada Resort Bodrum", distance: "15.7 km from BJV", price: "€86 / night" }
    ],
    trust: [
      { icon: "🛡️", title: "Verified Providers", text: "Partners are checked before service." },
      { icon: "🏷️", title: "No App Fee", text: "Passengers do not pay platform fees." },
      { icon: "🎧", title: "WhatsApp Support", text: "Help before and after the request." }
    ]
  };
}

export default function HomePage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const qrSourceId = queryValue(router.query.qrSourceId);
  const home = homeCopy(language);
  const transferText = transferCopy(language);
  const rentalText = rentalCopy(language);
  const hotelText = hotelCopy(language);
  const ticketText = ticketCopy(language);

  const [activeTab, setActiveTab] = useState<TabKey>("transfer");
  const [transferForm, setTransferForm] = useState<TransferFormState>(initialTransferFormState);
  const [rentalForm, setRentalForm] = useState<CarRentalFormState>(initialCarRentalFormState);
  const [hotelForm, setHotelForm] = useState<HotelFormState>(initialHotelFormState);
  const [ticketForm, setTicketForm] = useState<TicketFormState>(initialTicketFormState);
  const [status, setStatus] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function chooseTab(tab: TabKey) {
    setActiveTab(tab);
    setStatus("");
    setRequestCode("");
  }

  async function submitActiveForm() {
    setStatus("");
    setRequestCode("");
    const currentError = activeTab === "transfer" ? validateTransferForm(transferForm) : activeTab === "rental" ? validateCarRentalForm(rentalForm) : activeTab === "hotel" ? validateHotelForm(hotelForm) : validateTicketForm(ticketForm);
    if (currentError) {
      setStatus(translateFormMessage(language, currentError));
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === "transfer") {
        const code = createTransferRequestCode();
        await createTransferRequest(mapTransferFormToRequest(transferForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(transferText.success);
      }
      if (activeTab === "rental") {
        const code = createCarRentalRequestCode();
        await createCarRentalRequest(mapRentalFormToRequest(rentalForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(rentalText.success);
      }
      if (activeTab === "hotel") {
        const code = createHotelRequestCode();
        await createHotelRequest(mapHotelFormToRequest(hotelForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(hotelText.success);
      }
      if (activeTab === "ticket") {
        const code = createTicketRequestCode();
        await createTicketRequest(mapTicketFormToRequest(ticketForm, code, qrSourceId || undefined, language));
        setRequestCode(code);
        setStatus(ticketText.success);
      }
    } catch (error) {
      setStatus(activeTab === "transfer" ? transferText.failure : activeTab === "rental" ? rentalText.failure : activeTab === "hotel" ? hotelText.failure : ticketText.failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeTitle = activeTab === "transfer" ? transferText.title : activeTab === "rental" ? rentalText.title : activeTab === "hotel" ? hotelText.title : ticketText.title;
  const activeDescription = activeTab === "transfer" ? transferText.description : activeTab === "rental" ? rentalText.description : activeTab === "hotel" ? hotelText.description : ticketText.description;
  const activeSubmit = activeTab === "transfer" ? transferText.submit : activeTab === "rental" ? rentalText.submit : activeTab === "hotel" ? hotelText.submit : ticketText.submit;
  const activeSending = activeTab === "transfer" ? transferText.sending : activeTab === "rental" ? rentalText.sending : activeTab === "hotel" ? hotelText.sending : ticketText.sending;
  const tabItems: Array<[TabKey, string]> = [["transfer", home.tabs.transfer], ["rental", home.tabs.rental], ["hotel", home.tabs.hotel], ["ticket", home.tabs.ticket]];

  return (
    <main className="page">
      <header className="navbar">
        <div className="brand">Arrivio</div>
        <nav className="desktopNav">
          <button onClick={() => chooseTab("transfer")}>{home.nav.transfer}</button>
          <button onClick={() => chooseTab("rental")}>{home.nav.rental}</button>
          <button onClick={() => chooseTab("hotel")}>{home.nav.hotels}</button>
          <button onClick={() => chooseTab("ticket")}>{home.nav.flights}</button>
          <a href={whatsappSupportUrl(language)}>{home.nav.support}</a>
        </nav>
        <div className="rightNav"><a href={languageHref("/", "tr")}>TR</a><span>|</span><a href={languageHref("/", "en")}>EN</a><button onClick={() => chooseTab("transfer")}>⌕ {home.nav.search}</button></div>
      </header>

      <section className="hero">
        <div className="heroText"><p>{home.hero.eyebrow}</p><h1>{home.hero.title}</h1><h2>{home.hero.description}</h2></div>
        <div className="heroVisual"><div className="window"><span>✈</span><b>BJV</b></div><div className="traveler">🧳</div></div>
      </section>

      <section className="searchPanel">
        <div className="tabs">{tabItems.map(([key, label]) => <button key={key} className={activeTab === key ? "active" : ""} onClick={() => chooseTab(key)}>{label}</button>)}</div>
        <div className="formTitle"><h3>{activeTitle}</h3><p>{activeDescription}</p></div>
        <div className="formGrid">
          {activeTab === "transfer" && <>
            <Field label={home.common.passenger}><Input value={transferForm.passengerName} placeholder={transferText.passengerPlaceholder} onChange={(value) => setTransferForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={transferForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTransferForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={home.common.flight}><Input value={transferForm.flightCode} placeholder="TK2524" onChange={(value) => setTransferForm((current) => ({ ...current, flightCode: value }))} /></Field>
            <Field label={transferText.destination}><Input value={transferForm.destination} placeholder="Bodrum, Yalikavak" onChange={(value) => setTransferForm((current) => ({ ...current, destination: value }))} /></Field>
            <Field label={transferText.passengers}><Input type="number" value={String(transferForm.passengers)} onChange={(value) => setTransferForm((current) => ({ ...current, passengers: Number(value) }))} /></Field>
          </>}
          {activeTab === "rental" && <>
            <Field label={home.common.passenger}><Input value={rentalForm.passengerName} placeholder={rentalText.passengerPlaceholder} onChange={(value) => setRentalForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={rentalForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setRentalForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={rentalText.pickupLocation}><Input value={rentalForm.pickupLocation} onChange={(value) => setRentalForm((current) => ({ ...current, pickupLocation: value }))} /></Field>
            <Field label={rentalText.pickupDate}><Input type="date" value={rentalForm.pickupDate} onChange={(value) => setRentalForm((current) => ({ ...current, pickupDate: value }))} /></Field>
            <Field label={rentalText.dropoffDate}><Input type="date" value={rentalForm.dropoffDate} onChange={(value) => setRentalForm((current) => ({ ...current, dropoffDate: value }))} /></Field>
          </>}
          {activeTab === "hotel" && <>
            <Field label={home.common.passenger}><Input value={hotelForm.passengerName} placeholder={hotelText.passengerPlaceholder} onChange={(value) => setHotelForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={hotelForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setHotelForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={hotelText.checkIn}><Input type="date" value={hotelForm.checkInDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkInDate: value }))} /></Field>
            <Field label={hotelText.checkOut}><Input type="date" value={hotelForm.checkOutDate} onChange={(value) => setHotelForm((current) => ({ ...current, checkOutDate: value }))} /></Field>
            <Field label={hotelText.guests}><Input type="number" value={String(hotelForm.guests)} onChange={(value) => setHotelForm((current) => ({ ...current, guests: Number(value) }))} /></Field>
          </>}
          {activeTab === "ticket" && <>
            <Field label={home.common.passenger}><Input value={ticketForm.passengerName} placeholder={ticketText.passengerPlaceholder} onChange={(value) => setTicketForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={ticketForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTicketForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={ticketText.from}><Input value={ticketForm.fromAirportOrCity} onChange={(value) => setTicketForm((current) => ({ ...current, fromAirportOrCity: value }))} /></Field>
            <Field label={ticketText.to}><Input value={ticketForm.toAirportOrCity} placeholder="Istanbul, Ankara" onChange={(value) => setTicketForm((current) => ({ ...current, toAirportOrCity: value }))} /></Field>
            <Field label={ticketText.departureDate}><Input type="date" value={ticketForm.departureDate} onChange={(value) => setTicketForm((current) => ({ ...current, departureDate: value }))} /></Field>
          </>}
          <button className="searchBtn" onClick={submitActiveForm} disabled={isSubmitting}>{isSubmitting ? activeSending : activeSubmit}</button>
        </div>
        {status && <div className="status">{status}{requestCode ? <b>{home.common.requestCode}: {requestCode}</b> : null}</div>}
      </section>

      <section className="services"><h3>{home.sections.services}</h3><div className="serviceGrid">{home.serviceCards.map((card) => <div className="serviceCard" key={card.title}><div className="round">{card.icon}</div><h4>{card.title}</h4><p>{card.text}</p><button>{card.action}</button></div>)}</div></section>

      <section className="dashboard">
        <div className="providers"><Header title={home.sections.providers} />{home.providers.map((provider) => <div className="provider" key={provider.name}><div className="providerLogo">{provider.logo}</div><div><b>{provider.name}</b><p>{provider.rating} ★★★★★ ({provider.count})</p></div><span>✓</span></div>)}</div>
        <div className="hotels"><Header title={home.sections.hotels} /> <div className="hotelGrid">{home.hotelCards.map((hotel) => <div className="hotel" key={hotel.name}><div className="hotelImage">{hotel.image}</div><b>{hotel.name}</b><p>⌖ {hotel.distance}</p><strong>{hotel.price}</strong><button>{language === "tr" ? "Uygunluk Sor" : "Ask Availability"}</button></div>)}</div></div>
        <div className="coverage"><Header title={home.sections.coverage} /><div className="map"><div className="rings"><span>📍</span></div></div><div className="coverageNote">✓ {language === "tr" ? "20 km içinde hizmet aktif" : "Service available within 20 km"}</div></div>
      </section>

      <section className="trust">{home.trust.map((item) => <div key={item.title}><span>{item.icon}</span><b>{item.title}</b><p>{item.text}</p></div>)}</section>
      <footer><b>Arrivio</b><p>Land. Choose. Go.</p><a href={whatsappSupportUrl(language)}>{home.common.support}</a></footer>

      <style jsx>{`
        .page{min-height:100vh;background:#f6f9fd;color:#08183a;font-family:Inter,Arial,sans-serif}.navbar{height:76px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 70px;border-bottom:1px solid #edf1f6;position:sticky;top:0;z-index:10}.brand{font-size:34px;font-weight:900;color:#095ccf;letter-spacing:-1px}.desktopNav{display:flex;gap:42px;align-items:center}.desktopNav button,.desktopNav a{border:0;background:transparent;color:#071b3a;text-decoration:none;font-weight:800;font-size:14px;cursor:pointer}.rightNav{display:flex;align-items:center;gap:10px}.rightNav a{font-weight:900;color:#071b3a;text-decoration:none}.rightNav button{border:0;background:#075ee8;color:#fff;border-radius:8px;padding:14px 20px;font-weight:900}.hero{position:relative;min-height:330px;padding:44px 110px 130px;overflow:hidden;background:linear-gradient(90deg,#f4f9ff 0%,#eff7ff 45%,#d9ecff 100%)}.heroText{max-width:610px;position:relative;z-index:2}.heroText p{color:#0b63f6;font-weight:900}.heroText h1{font-size:64px;line-height:.95;margin:0;color:#07143a;letter-spacing:-3px}.heroText h2{font-size:19px;line-height:1.55;font-weight:500;color:#31405b;max-width:560px}.heroVisual{position:absolute;right:0;top:0;width:43%;height:100%;background:radial-gradient(circle at 70% 25%,#fff 0,#d5ebff 35%,#a7d4ff 100%)}.window{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;color:#0b63f6;opacity:.75}.window b{font-size:28px;margin-left:16px}.traveler{position:absolute;right:120px;bottom:35px;font-size:80px}.searchPanel{width:calc(100% - 180px);margin:-90px auto 22px;position:relative;z-index:4;background:#fff;border-radius:18px;box-shadow:0 22px 60px rgba(7,27,58,.18);border:1px solid #e2eaf5}.tabs{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #e4ebf4}.tabs button{height:58px;border:0;background:#fff;font-weight:900;color:#071b3a;cursor:pointer;border-right:1px solid #e4ebf4}.tabs button.active{color:#075ee8;box-shadow:inset 0 -3px #075ee8}.formTitle{padding:18px 22px 0}.formTitle h3{margin:0;font-size:22px}.formTitle p{margin:6px 0 0;color:#64748b}.formGrid{display:grid;grid-template-columns:repeat(5,1fr) 210px;gap:14px;padding:18px 22px 22px;align-items:end}.field label{font-size:13px;font-weight:900;display:block;margin-bottom:7px}.field input{width:100%;box-sizing:border-box;padding:14px;border:1px solid #d7e1ee;border-radius:9px;font-size:14px}.searchBtn{height:48px;border:0;border-radius:9px;background:#075ee8;color:#fff;font-weight:900;cursor:pointer}.status{margin:0 22px 22px;padding:12px 14px;border-radius:10px;background:#eef6ff;color:#075ee8;font-weight:800}.status b{display:block;color:#071b3a;margin-top:5px}.services,.dashboard,.trust,footer{width:calc(100% - 180px);margin:0 auto 18px}.services h3{font-size:22px}.serviceGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.serviceCard,.providers,.hotels,.coverage,.trust div{background:#fff;border:1px solid #e1e8f2;border-radius:15px;box-shadow:0 8px 26px rgba(7,27,58,.05)}.serviceCard{padding:20px}.round{width:58px;height:58px;border-radius:50%;background:#eaf3ff;display:flex;align-items:center;justify-content:center;font-size:28px}.serviceCard h4{font-size:19px;margin:14px 0 6px}.serviceCard p{color:#64748b;min-height:44px}.serviceCard button,.hotel button{border:1px solid #075ee8;background:#fff;color:#075ee8;border-radius:7px;padding:8px 22px;font-weight:900}.dashboard{display:grid;grid-template-columns:1fr 1.55fr 1.05fr;gap:14px}.providers,.hotels,.coverage{padding:16px}.boxHeader{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.boxHeader h3{margin:0}.boxHeader a{font-size:12px;color:#075ee8;font-weight:900}.provider{display:grid;grid-template-columns:58px 1fr 24px;gap:12px;align-items:center;border-bottom:1px solid #edf2f7;padding:10px 0}.providerLogo{height:42px;background:#0b2450;color:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900}.provider p{margin:3px 0 0;color:#64748b}.provider span{color:#10a66a}.hotelGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hotel{border:1px solid #e1e8f2;border-radius:12px;padding:10px}.hotelImage{height:88px;border-radius:9px;background:linear-gradient(135deg,#d9f0ff,#a7d9ff);display:flex;align-items:center;justify-content:center;font-size:42px;margin-bottom:10px}.hotel b{display:block}.hotel p{color:#64748b;margin:6px 0}.hotel strong{display:block;margin-bottom:8px}.map{height:240px;border-radius:12px;background:linear-gradient(135deg,#d8ecff,#fff3d8);position:relative;overflow:hidden}.rings{position:absolute;inset:30px;border:2px solid rgba(7,94,232,.35);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#075ee8;font-size:42px;box-shadow:0 0 0 38px rgba(7,94,232,.10),0 0 0 78px rgba(7,94,232,.06)}.coverageNote{margin-top:10px;background:#fff;border-radius:10px;padding:12px;font-weight:900}.trust{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.trust div{padding:18px;display:grid;grid-template-columns:42px 1fr;gap:6px 12px}.trust span{grid-row:1/3;font-size:30px}.trust p{margin:0;color:#64748b}.trust b{font-size:16px}footer{display:flex;align-items:center;justify-content:space-between;padding:28px 0 38px;color:#64748b}footer b{font-size:26px;color:#075ee8}footer a{color:#075ee8;font-weight:900;text-decoration:none}@media(max-width:900px){.navbar{padding:0 18px;height:68px}.brand{font-size:27px}.desktopNav{display:none}.rightNav button{display:none}.hero{padding:28px 20px 120px;min-height:auto}.heroText h1{font-size:42px}.heroText h2{font-size:16px}.heroVisual{display:none}.searchPanel,.services,.dashboard,.trust,footer{width:calc(100% - 28px)}.searchPanel{margin:-80px auto 18px}.tabs button{font-size:12px}.formGrid{grid-template-columns:1fr;padding:16px}.serviceGrid,.dashboard,.hotelGrid,.trust{grid-template-columns:1fr}.traveler{display:none}footer{display:block}.services h3{font-size:20px}}
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function Input({ value, onChange, placeholder = "", type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />;
}

function Header({ title }: { title: string }) {
  return <div className="boxHeader"><h3>{title}</h3><a>View All</a></div>;
}
