import { useState } from "react";
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
import { getLanguage, translateFormMessage } from "../src/supportModel";
import { hotelCopy, rentalCopy, ticketCopy, transferCopy } from "../src/webCopy";
import { LandingFooter } from "../src/components/LandingFooter";
import { LandingHero } from "../src/components/LandingHero";
import { LandingNav } from "../src/components/LandingNav";
import { MarketingSections } from "../src/components/MarketingSections";
import { RequestPanel } from "../src/components/RequestPanel";
import { homeCopy, queryValue, type TabKey } from "../src/landingContent";

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

  return (
    <main className="page">
      <LandingNav home={home} language={language} chooseTab={chooseTab} />
      <LandingHero home={home} chooseTab={chooseTab} />
      <RequestPanel
        home={home}
        language={language}
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        transferForm={transferForm}
        setTransferForm={setTransferForm}
        rentalForm={rentalForm}
        setRentalForm={setRentalForm}
        hotelForm={hotelForm}
        setHotelForm={setHotelForm}
        ticketForm={ticketForm}
        setTicketForm={setTicketForm}
        isSubmitting={isSubmitting}
        status={status}
        requestCode={requestCode}
        submitActiveForm={submitActiveForm}
      />
      <MarketingSections home={home} language={language} chooseTab={chooseTab} />
      <LandingFooter home={home} language={language} />
    </main>
  );
}
