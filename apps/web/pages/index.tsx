import { createElement } from "react";
import { useRouter } from "next/router";
import { getLanguage, languageHref, whatsappSupportUrl } from "../src/supportModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  maxWidth: "760px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "24px",
  background: "#FFFFFF",
  boxShadow: "0 18px 60px rgba(8, 24, 58, 0.10)"
};

const linkStyle = {
  display: "inline-block",
  padding: "14px 18px",
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 700,
  marginRight: "12px",
  marginBottom: "12px"
};

const supportStyle = {
  ...linkStyle,
  background: "#1FB6A6"
};

export default function HomePage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const isTr = language === "tr";
  const suffix = `?lang=${language}`;

  return createElement(
    "main",
    { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Arrivio"),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, isTr ? "Uygulama indirmeden transfer, araç kiralama, otel ve bilet talebi bırakın." : "Airport transfer, car rental, hotel and ticket requests without app download."),
      createElement("div", { style: { marginBottom: "18px" } },
        createElement("a", { href: languageHref("/", "en"), style: { marginRight: "12px", color: "#0B63F6", fontWeight: 700 } }, "EN"),
        createElement("a", { href: languageHref("/", "tr"), style: { color: "#0B63F6", fontWeight: 700 } }, "TR")
      ),
      createElement("a", { href: `/transfer${suffix}`, style: linkStyle }, isTr ? "Transfer Talebi" : "Request Transfer"),
      createElement("a", { href: `/car-rental${suffix}`, style: linkStyle }, isTr ? "Araç Kiralama" : "Request Car Rental"),
      createElement("a", { href: `/hotel${suffix}`, style: linkStyle }, isTr ? "Otel Talebi" : "Request Hotel"),
      createElement("a", { href: `/ticket${suffix}`, style: linkStyle }, isTr ? "Bilet Talebi" : "Request Ticket"),
      createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, isTr ? "WhatsApp Destek" : "WhatsApp Support")
    )
  );
}
