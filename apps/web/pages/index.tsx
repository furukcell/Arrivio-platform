import { useState, type ChangeEvent, type ReactNode } from "react";
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
  top: string;
  nav: { transfer: string; rental: string; hotels: string; flights: string; support: string; cta: string };
  hero: { badge: string; title: string; description: string; primary: string; secondary: string };
  tabs: Record<TabKey, string>;
  common: { passenger: string; phone: string; flight: string; requestCode: string; support: string };
  stats: Array<{ value: string; label: string }>;
  modules: Array<{ tab: TabKey; icon: string; title: string; text: string }>;
  benefits: Array<{ title: string; text: string }>;
  steps: Array<{ title: string; text: string }>;
  revenue: { title: string; text: string; items: string[] };
  social: { title: string; text: string };
};

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

function homeCopy(language: "tr" | "en"): HomeCopy {
  if (language === "tr") {
    return {
      top: "BJV lansmanı • Yolcudan platform ücreti yok • WhatsApp destekli hızlı talep",
      nav: { transfer: "Transfer", rental: "Araç", hotels: "Otel", flights: "Bilet", support: "Destek", cta: "Talep Bırak" },
      hero: {
        badge: "Milas-Bodrum Havalimanı için yeni nesil yolcu hizmetleri",
        title: "İnişten sonra ihtiyacın olan her şey tek ekranda.",
        description: "Transfer, araç kiralama, otel ve bilet taleplerini uygulama indirmeden bırak. Arrivio talebini doğru sağlayıcıya ulaştırır.",
        primary: "Hemen Talep Oluştur",
        secondary: "Nasıl Çalışır?"
      },
      tabs: { transfer: "Transfer", rental: "Araç", hotel: "Otel", ticket: "Bilet" },
      common: { passenger: "Yolcu adı", phone: "Telefon", flight: "Uçuş kodu", requestCode: "Talep kodu", support: "WhatsApp Destek" },
      stats: [
        { value: "4", label: "ana hizmet" },
        { value: "0 TL", label: "yolcu platform ücreti" },
        { value: "BJV", label: "ilk odak havalimanı" },
        { value: "7/24", label: "WhatsApp destek" }
      ],
      modules: [
        { tab: "transfer", icon: "T", title: "Transfer Talebi", text: "BJV çıkışlı transfer ihtiyacını dakikalar içinde ilet." },
        { tab: "rental", icon: "A", title: "Araç Kiralama", text: "Ekonomik, SUV veya lüks araç için talep bırak." },
        { tab: "hotel", icon: "O", title: "Yakın Oteller", text: "Havalimanı çevresi konaklama uygunluğunu sor." },
        { tab: "ticket", icon: "B", title: "Bilet Talebi", text: "Rota ve tarih bilgisini acenteye aktar." }
      ],
      benefits: [
        { title: "Yolcuya kolay", text: "Uygulama indirme ve üyelik zorunluluğu yok." },
        { title: "İşletmeye takip", text: "Tüm talepler Firestore'da kayıtlı kalır ve admin panelden yönetilir." },
        { title: "Sağlayıcıya iş", text: "Transfer işi atanır, sağlayıcı kendi panelinden fiyat ve not girer." },
        { title: "Yerel odak", text: "İlk hedef BJV, Bodrum, Milas, Yalıkavak ve çevre rotalar." }
      ],
      steps: [
        { title: "Talep bırak", text: "Yolcu sekmeden hizmeti seçer ve bilgileri girer." },
        { title: "Ekip yönetsin", text: "Admin talebi görür, sağlayıcı veya acente ile eşleştirir." },
        { title: "Hizmet tamamlansın", text: "İş gerçekleşince komisyon takibi admin panelde tutulur." }
      ],
      revenue: { title: "Gelir modeli sade", text: "Yolcudan ücret almadan, hizmeti yapan sağlayıcıdan komisyon mantığıyla çalışır.", items: ["Transfer gerçekleşirse komisyon", "Araç/otel/bilet için acente anlaşması", "QR kaynaklarına göre talep takibi"] },
      social: { title: "Havalimanı odaklı yerel operasyon", text: "Arrivio önce Milas-Bodrum'da gerçek talepleri yönetmek, sonra Dalaman ve diğer havalimanlarına açılmak için tasarlandı." }
    };
  }

  return {
    top: "BJV launch • No passenger platform fee • WhatsApp supported requests",
    nav: { transfer: "Transfer", rental: "Car", hotels: "Hotel", flights: "Ticket", support: "Support", cta: "Send Request" },
    hero: { badge: "Next-generation passenger services for Milas-Bodrum Airport", title: "Everything after landing, from one screen.", description: "Request transfers, car rental, hotels and tickets without downloading an app. Arrivio routes your request to the right provider.", primary: "Create Request", secondary: "How It Works" },
    tabs: { transfer: "Transfer", rental: "Car", hotel: "Hotel", ticket: "Ticket" },
    common: { passenger: "Passenger name", phone: "Phone", flight: "Flight code", requestCode: "Request code", support: "WhatsApp Support" },
    stats: [{ value: "4", label: "core services" }, { value: "0", label: "passenger platform fee" }, { value: "BJV", label: "first airport focus" }, { value: "24/7", label: "WhatsApp support" }],
    modules: [{ tab: "transfer", icon: "T", title: "Transfer Request", text: "Send a BJV transfer request in minutes." }, { tab: "rental", icon: "C", title: "Car Rental", text: "Request economy, SUV or luxury vehicles." }, { tab: "hotel", icon: "H", title: "Nearby Hotels", text: "Ask accommodation availability near the airport." }, { tab: "ticket", icon: "F", title: "Ticket Request", text: "Share route and date details with an agency." }],
    benefits: [{ title: "Easy for passengers", text: "No app download or account required." }, { title: "Trackable for operators", text: "All requests stay recorded and manageable from admin." }, { title: "Work for providers", text: "Assigned providers respond with price and notes." }, { title: "Local focus", text: "Built first for BJV, Bodrum, Milas and nearby routes." }],
    steps: [{ title: "Send request", text: "Passenger selects a service and enters details." }, { title: "Team manages", text: "Admin sees the request and assigns a provider." }, { title: "Service completes", text: "Commission tracking stays in admin panel." }],
    revenue: { title: "Simple revenue model", text: "No passenger platform fee. Arrivio earns from provider or agency commission.", items: ["Commission after completed transfer", "Agency agreements for car, hotel and ticket", "QR source tracking for demand"] },
    social: { title: "Airport-focused local operation", text: "Arrivio is designed to prove demand at Milas-Bodrum first, then expand to Dalaman and other airports." }
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
    const panel = typeof document !== "undefined" ? document.getElementById("request-panel") : null;
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div className="topStrip">{home.top}</div>
      <header className="navbar">
        <div className="brand"><div className="logoMark">A</div><span>Arrivio</span></div>
        <nav className="desktopNav">
          <button onClick={() => chooseTab("transfer")}>{home.nav.transfer}</button>
          <button onClick={() => chooseTab("rental")}>{home.nav.rental}</button>
          <button onClick={() => chooseTab("hotel")}>{home.nav.hotels}</button>
          <button onClick={() => chooseTab("ticket")}>{home.nav.flights}</button>
          <a href={whatsappSupportUrl(language)}>{home.nav.support}</a>
        </nav>
        <div className="rightNav"><a href={languageHref("/", "tr")}>TR</a><span>|</span><a href={languageHref("/", "en")}>EN</a><button onClick={() => chooseTab("transfer")}>{home.nav.cta}</button></div>
      </header>

      <section className="hero">
        <div className="heroText">
          <div className="heroBadge">{home.hero.badge}</div>
          <h1>{home.hero.title}</h1>
          <p>{home.hero.description}</p>
          <div className="heroActions"><button onClick={() => chooseTab("transfer")}>{home.hero.primary}</button><a href="#how">{home.hero.secondary}</a></div>
          <div className="stats">{home.stats.map((item) => <div key={item.label}><b>{item.value}</b><span>{item.label}</span></div>)}</div>
        </div>
        <div className="heroMockup">
          <div className="mockTop"><span>BJV</span><b>Airport Desk</b></div>
          <div className="mockCard main"><strong>Transfer request</strong><p>BJV → Bodrum Marina</p><em>Provider matching</em></div>
          <div className="mockGrid"><div>Car</div><div>Hotel</div><div>Ticket</div></div>
          <div className="mockBubble">WhatsApp support active</div>
        </div>
      </section>

      <section id="request-panel" className="requestPanel">
        <div className="panelHead"><div><span>01</span><h2>{activeTitle}</h2><p>{activeDescription}</p></div><a href={whatsappSupportUrl(language)}>{home.common.support}</a></div>
        <div className="tabs">{tabItems.map(([key, label]) => <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)}>{label}</button>)}</div>
        <div className="formGrid">
          {activeTab === "transfer" && <>
            <Field label={home.common.passenger}><Input value={transferForm.passengerName} placeholder={transferText.passengerPlaceholder} onChange={(value) => setTransferForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={transferForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setTransferForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={home.common.flight}><Input value={transferForm.flightCode} placeholder="TK2524" onChange={(value) => setTransferForm((current) => ({ ...current, flightCode: value }))} /></Field>
            <Field label={transferText.destination}><Input value={transferForm.destination} placeholder="Bodrum, Yalıkavak" onChange={(value) => setTransferForm((current) => ({ ...current, destination: value }))} /></Field>
            <Field label={transferText.passengers}><Input type="number" value={String(transferForm.passengers)} onChange={(value) => setTransferForm((current) => ({ ...current, passengers: Number(value) }))} /></Field>
          </>}
          {activeTab === "rental" && <>
            <Field label={home.common.passenger}><Input value={rentalForm.passengerName} placeholder={rentalText.passengerPlaceholder} onChange={(value) => setRentalForm((current) => ({ ...current, passengerName: value }))} /></Field>
            <Field label={home.common.phone}><Input value={rentalForm.passengerPhone} placeholder="+90 5xx xxx xx xx" onChange={(value) => setRentalForm((current) => ({ ...current, passengerPhone: value }))} /></Field>
            <Field label={rentalText.pickupLocation}><Input value={rentalForm.pickupLocation} placeholder="Milas-Bodrum Airport" onChange={(value) => setRentalForm((current) => ({ ...current, pickupLocation: value }))} /></Field>
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
            <Field label={ticketText.from}><Input value={ticketForm.fromAirportOrCity} placeholder="Bodrum / BJV" onChange={(value) => setTicketForm((current) => ({ ...current, fromAirportOrCity: value }))} /></Field>
            <Field label={ticketText.to}><Input value={ticketForm.toAirportOrCity} placeholder="İstanbul, Ankara" onChange={(value) => setTicketForm((current) => ({ ...current, toAirportOrCity: value }))} /></Field>
            <Field label={ticketText.departureDate}><Input type="date" value={ticketForm.departureDate} onChange={(value) => setTicketForm((current) => ({ ...current, departureDate: value }))} /></Field>
          </>}
          <button className="submitBtn" onClick={submitActiveForm} disabled={isSubmitting}>{isSubmitting ? activeSending : activeSubmit}</button>
        </div>
        {status && <div className="status">{status}{requestCode ? <b>{home.common.requestCode}: {requestCode}</b> : null}</div>}
      </section>

      <section className="section modules"><div className="sectionTitle"><span>02</span><h2>{language === "tr" ? "Tüm işler tek akışta" : "All services in one flow"}</h2><p>{language === "tr" ? "Arrivio ana ekranı, yolcuyu farklı sayfalara dağıtmadan hizmet talebini alır." : "Arrivio collects passenger requests without forcing them across separate pages."}</p></div><div className="moduleGrid">{home.modules.map((item) => <button key={item.title} onClick={() => chooseTab(item.tab)}><i>{item.icon}</i><b>{item.title}</b><p>{item.text}</p></button>)}</div></section>

      <section className="section benefits"><div className="sectionTitle"><span>03</span><h2>{language === "tr" ? "Neden daha profesyonel durur?" : "Why it feels professional"}</h2></div><div className="benefitGrid">{home.benefits.map((item) => <div key={item.title}><b>{item.title}</b><p>{item.text}</p></div>)}</div></section>

      <section id="how" className="section process"><div className="processText"><span>04</span><h2>{language === "tr" ? "3 adımda operasyon" : "Operation in 3 steps"}</h2><p>{home.social.text}</p></div><div className="stepGrid">{home.steps.map((step, index) => <div key={step.title}><em>{index + 1}</em><b>{step.title}</b><p>{step.text}</p></div>)}</div></section>

      <section className="section revenue"><div><span>05</span><h2>{home.revenue.title}</h2><p>{home.revenue.text}</p></div><ul>{home.revenue.items.map((item) => <li key={item}>✓ {item}</li>)}</ul></section>

      <footer className="footer"><div><b>Arrivio</b><p>Land. Choose. Go.</p></div><a href={whatsappSupportUrl(language)}>{home.common.support}</a></footer>

      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f6f8ff}.page{min-height:100vh;color:#071631;font-family:Inter,Arial,sans-serif;background:radial-gradient(circle at top right,#dff1ff 0,#f6f8ff 360px,#f6f8ff 100%)}.topStrip{background:linear-gradient(90deg,#075ee8,#18b6ff);color:white;text-align:center;padding:10px 14px;font-weight:900;font-size:13px}.navbar{height:78px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:space-between;padding:0 70px;border-bottom:1px solid #eaf0f7;position:sticky;top:0;z-index:10}.brand{display:flex;align-items:center;gap:11px;color:#075ee8;font-size:30px;font-weight:950}.logoMark{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#0b75ff,#071b58);color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(7,94,232,.22)}.desktopNav{display:flex;align-items:center;gap:34px}.desktopNav button,.desktopNav a{border:0;background:transparent;color:#14213d;text-decoration:none;font-size:14px;font-weight:900;cursor:pointer}.rightNav{display:flex;align-items:center;gap:10px;font-weight:900}.rightNav a{color:#071631;text-decoration:none}.rightNav button{border:0;background:#075ee8;color:white;border-radius:12px;padding:13px 18px;font-weight:950;box-shadow:0 14px 28px rgba(7,94,232,.22)}.hero{max-width:1240px;margin:0 auto;padding:54px 24px 34px;display:grid;grid-template-columns:1.05fr .95fr;gap:34px;align-items:center}.heroBadge{display:inline-flex;background:#e9f4ff;color:#075ee8;border:1px solid #cfe6ff;border-radius:999px;padding:10px 14px;font-weight:950;font-size:13px}.hero h1{font-size:64px;line-height:.98;letter-spacing:-3px;margin:18px 0 18px;color:#061334}.heroText>p{font-size:20px;line-height:1.55;color:#4b5d78;max-width:660px}.heroActions{display:flex;gap:12px;margin-top:24px}.heroActions button,.heroActions a{border-radius:16px;padding:15px 20px;font-weight:950;text-decoration:none}.heroActions button{border:0;background:#075ee8;color:white;box-shadow:0 18px 38px rgba(7,94,232,.22)}.heroActions a{border:1px solid #cfe0f4;color:#075ee8;background:white}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px}.stats div{background:white;border:1px solid #e0e9f6;border-radius:18px;padding:14px;box-shadow:0 12px 32px rgba(13,34,74,.06)}.stats b{display:block;font-size:24px;color:#075ee8}.stats span{display:block;font-size:12px;color:#64748b;font-weight:800;margin-top:4px}.heroMockup{min-height:430px;border-radius:38px;background:linear-gradient(150deg,#071b58,#0b75ff 55%,#c9ecff);padding:26px;position:relative;box-shadow:0 34px 90px rgba(7,27,88,.28);overflow:hidden}.heroMockup:before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;background:rgba(255,255,255,.16);right:-110px;top:-90px}.mockTop,.mockCard,.mockGrid div,.mockBubble{position:relative;background:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.7);box-shadow:0 18px 50px rgba(0,0,0,.10)}.mockTop{border-radius:24px;padding:18px;display:flex;align-items:center;justify-content:space-between}.mockTop span{background:#075ee8;color:white;border-radius:999px;padding:8px 12px;font-weight:950}.mockTop b{color:#071631}.mockCard.main{margin-top:22px;border-radius:28px;padding:24px}.mockCard strong{font-size:28px;color:#071631}.mockCard p{color:#64748b}.mockCard em{display:inline-block;background:#e8fff7;color:#098766;border-radius:999px;padding:8px 10px;font-style:normal;font-weight:950}.mockGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.mockGrid div{border-radius:20px;padding:18px;text-align:center;font-weight:950;color:#075ee8}.mockBubble{position:absolute;right:26px;bottom:26px;border-radius:999px;padding:14px 18px;color:#071631;font-weight:950}.requestPanel{max-width:1180px;margin:10px auto 28px;background:white;border:1px solid #e0e9f6;border-radius:30px;box-shadow:0 24px 70px rgba(13,34,74,.10);overflow:hidden}.panelHead{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:24px 28px;background:linear-gradient(90deg,#fff,#f3f8ff)}.panelHead span,.sectionTitle span,.processText span,.revenue span{display:inline-flex;color:#075ee8;background:#eaf4ff;border-radius:999px;padding:7px 10px;font-weight:950;font-size:12px}.panelHead h2{margin:10px 0 4px;font-size:30px}.panelHead p{margin:0;color:#64748b}.panelHead a{white-space:nowrap;text-decoration:none;color:#087f68;background:#e9fbf6;border:1px solid #c7f2e7;border-radius:999px;padding:12px 16px;font-weight:950}.tabs{display:grid;grid-template-columns:repeat(4,1fr);padding:10px;background:#f4f8fd;gap:8px;border-top:1px solid #e7eef8;border-bottom:1px solid #e7eef8}.tabs button{height:52px;border:0;border-radius:16px;background:transparent;color:#455873;font-weight:950;cursor:pointer}.tabs button.active{background:#075ee8;color:white;box-shadow:0 14px 30px rgba(7,94,232,.22)}.formGrid{display:grid;grid-template-columns:repeat(5,1fr) 200px;gap:14px;padding:22px 28px 26px;align-items:end}.field label{font-size:12px;font-weight:950;display:block;margin-bottom:8px;color:#071631}.field input{width:100%;height:50px;border:1px solid #d6e2f1;border-radius:14px;padding:0 14px;font-size:14px;background:#fbfdff;color:#071631;outline:none}.field input:focus{border-color:#075ee8;box-shadow:0 0 0 4px rgba(7,94,232,.10)}.submitBtn{height:50px;border:0;border-radius:14px;background:#075ee8;color:white;font-weight:950;box-shadow:0 16px 34px rgba(7,94,232,.20);cursor:pointer}.status{margin:0 28px 26px;padding:14px 16px;border-radius:16px;background:#f0f7ff;color:#075ee8;font-weight:900}.status b{display:block;margin-top:6px;color:#071631}.section{max-width:1180px;margin:0 auto 28px;padding:0 0}.sectionTitle{text-align:center;max-width:700px;margin:0 auto 20px}.sectionTitle h2,.processText h2,.revenue h2{font-size:38px;line-height:1.05;letter-spacing:-1.4px;margin:12px 0;color:#061334}.sectionTitle p,.processText p,.revenue p{color:#64748b;font-size:17px;line-height:1.5}.moduleGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.moduleGrid button,.benefitGrid div,.stepGrid div,.revenue,.footer{background:white;border:1px solid #e0e9f6;border-radius:26px;box-shadow:0 14px 44px rgba(13,34,74,.06)}.moduleGrid button{text-align:left;padding:22px;cursor:pointer}.moduleGrid i{width:48px;height:48px;border-radius:18px;background:#eaf4ff;color:#075ee8;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:950;font-size:22px}.moduleGrid b{display:block;font-size:20px;margin:18px 0 8px}.moduleGrid p,.benefitGrid p,.stepGrid p{color:#64748b;line-height:1.45}.benefitGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.benefitGrid div{padding:24px}.benefitGrid b{font-size:19px}.process{display:grid;grid-template-columns:.85fr 1.15fr;gap:24px;align-items:center}.stepGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.stepGrid div{padding:24px}.stepGrid em{width:42px;height:42px;border-radius:50%;background:#075ee8;color:white;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:950}.stepGrid b{display:block;margin-top:16px;font-size:20px}.revenue{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:34px;background:linear-gradient(135deg,#071b58,#0b75ff);color:white}.revenue h2,.revenue p{color:white}.revenue ul{margin:0;padding:0;list-style:none;display:grid;gap:12px}.revenue li{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:14px;font-weight:900}.footer{max-width:1180px;margin:0 auto 36px;padding:28px;display:flex;align-items:center;justify-content:space-between}.footer b{font-size:30px;color:#075ee8}.footer p{margin:6px 0 0;color:#64748b}.footer a{color:#075ee8;font-weight:950;text-decoration:none}@media(max-width:900px){.topStrip{font-size:12px;line-height:1.35}.navbar{height:66px;padding:0 16px}.brand{font-size:25px}.logoMark{width:36px;height:36px;border-radius:12px}.desktopNav{display:none}.rightNav button{display:none}.hero{padding:28px 16px 18px;display:block}.heroBadge{font-size:12px;line-height:1.35}.hero h1{font-size:42px;letter-spacing:-1.8px;margin:16px 0 12px}.heroText>p{font-size:16px;line-height:1.45}.heroActions{display:grid;grid-template-columns:1fr 1fr}.heroActions button,.heroActions a{text-align:center;padding:14px 10px}.stats{grid-template-columns:repeat(2,1fr);gap:10px}.heroMockup{margin-top:18px;min-height:270px;border-radius:28px;padding:18px}.mockTop{padding:14px}.mockCard.main{padding:18px;border-radius:22px}.mockCard strong{font-size:21px}.mockGrid{gap:8px}.mockGrid div{padding:12px 6px}.mockBubble{position:relative;right:auto;bottom:auto;margin-top:12px;text-align:center}.requestPanel{margin:12px 14px 24px;border-radius:26px}.panelHead{display:block;padding:20px}.panelHead h2{font-size:26px}.panelHead a{display:inline-block;margin-top:14px}.tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px}.tabs button{font-size:12px;height:48px;border-radius:13px}.formGrid{grid-template-columns:1fr;padding:18px;gap:12px}.field input{height:52px;border-radius:14px;font-size:15px}.submitBtn{height:54px;border-radius:14px}.status{margin:0 18px 20px}.section{margin:0 14px 26px}.sectionTitle{text-align:left}.sectionTitle h2,.processText h2,.revenue h2{font-size:30px}.moduleGrid,.benefitGrid,.stepGrid{grid-template-columns:1fr}.moduleGrid button,.benefitGrid div,.stepGrid div{padding:20px;border-radius:22px}.process{display:block}.revenue{grid-template-columns:1fr;margin:0 14px 26px;border-radius:26px;padding:24px}.footer{margin:0 14px 28px;display:block;border-radius:24px}.footer a{display:inline-block;margin-top:14px}}
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function Input({ value, onChange, placeholder = "", type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)} />;
}
