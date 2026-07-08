import { createElement } from "react";
import { useRouter } from "next/router";
import { getLanguage, languageHref, whatsappSupportUrl } from "../src/supportModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "18px",
  fontFamily: "Inter, Arial, sans-serif",
  background: "linear-gradient(180deg, #071B3A 0%, #0B2E63 46%, #F3F7FC 46%, #F3F7FC 100%)",
  color: "#071B3A"
};

const shellStyle = {
  maxWidth: "520px",
  margin: "0 auto"
};

const topBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#FFFFFF",
  marginBottom: "18px"
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const markStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #38BDF8, #0B63F6 60%, #072B62)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  fontWeight: 900,
  fontSize: "24px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.24)"
};

const langPillStyle = {
  display: "flex",
  gap: "6px",
  padding: "5px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)"
};

const langLinkStyle = {
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: "13px",
  padding: "8px 10px",
  borderRadius: "999px"
};

const heroCardStyle = {
  borderRadius: "32px",
  overflow: "hidden",
  background: "#FFFFFF",
  boxShadow: "0 28px 70px rgba(4, 20, 46, 0.30)",
  border: "1px solid rgba(255,255,255,0.55)"
};

const heroTopStyle = {
  padding: "26px 24px 22px",
  background: "radial-gradient(circle at 80% 10%, rgba(56,189,248,0.28), transparent 32%), linear-gradient(135deg, #FFFFFF, #F4F9FF)"
};

const eyebrowStyle = {
  margin: "0 0 10px",
  color: "#0B63F6",
  fontWeight: 900,
  fontSize: "14px",
  letterSpacing: "0.2px"
};

const titleStyle = {
  margin: "0",
  color: "#061836",
  fontSize: "44px",
  lineHeight: 1,
  letterSpacing: "-1.8px",
  fontWeight: 900
};

const subtitleStyle = {
  margin: "14px 0 0",
  color: "#536174",
  fontSize: "17px",
  lineHeight: 1.45
};

const badgeRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "18px"
};

const badgeStyle = {
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#EEF6FF",
  color: "#0B4DB3",
  fontSize: "12px",
  fontWeight: 800
};

const heroBodyStyle = {
  padding: "18px",
  background: "#FFFFFF"
};

const serviceGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};

const serviceCardStyle = {
  minHeight: "118px",
  padding: "16px",
  borderRadius: "24px",
  background: "linear-gradient(180deg, #F8FBFF, #EEF5FF)",
  border: "1px solid #DCEBFF",
  textDecoration: "none",
  color: "#071B3A",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const iconStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0B63F6",
  color: "#FFFFFF",
  fontSize: "19px",
  fontWeight: 900
};

const serviceTitleStyle = {
  margin: "14px 0 4px",
  fontSize: "16px",
  fontWeight: 900
};

const serviceTextStyle = {
  margin: 0,
  color: "#65748A",
  fontSize: "12px",
  lineHeight: 1.35
};

const supportStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginTop: "14px",
  padding: "16px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #20C997, #11A37F)",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 900,
  boxShadow: "0 14px 34px rgba(17, 163, 127, 0.24)"
};

const footerNoteStyle = {
  margin: "18px 4px 0",
  color: "rgba(255,255,255,0.78)",
  fontSize: "13px",
  lineHeight: 1.45,
  textAlign: "center"
};

function copy(language: "tr" | "en") {
  if (language === "tr") {
    return {
      airport: "Milas-Bodrum Havalimanı",
      title: "Arrivio",
      subtitle: "Havalimanına inen yolcular için transfer, araç kiralama, otel ve bilet talebi. Uygulama indirmeden, hızlıca talep bırakın.",
      badges: ["Uygulama yok", "Hızlı talep", "WhatsApp destek"],
      services: [
        ["✈", "Transfer", "BJV çıkışlı özel transfer talebi", "/transfer"],
        ["🚗", "Araç Kiralama", "Teslim alma ve bırakma bilgileri", "/car-rental"],
        ["🏨", "Otel", "Konaklama uygunluk talebi", "/hotel"],
        ["🎫", "Bilet", "Uçuş ve rota talebi", "/ticket"]
      ],
      support: "WhatsApp destek al",
      note: "Arrivio talebinizi ilgili sağlayıcıya iletir. Yolcudan platform ücreti alınmaz."
    };
  }

  return {
    airport: "Milas-Bodrum Airport",
    title: "Arrivio",
    subtitle: "Airport transfer, car rental, hotel and ticket requests for arriving passengers. No app download needed.",
    badges: ["No app", "Fast request", "WhatsApp support"],
    services: [
      ["✈", "Transfer", "Private airport transfer request", "/transfer"],
      ["🚗", "Car Rental", "Pickup and drop-off details", "/car-rental"],
      ["🏨", "Hotel", "Accommodation availability request", "/hotel"],
      ["🎫", "Ticket", "Flight and route request", "/ticket"]
    ],
    support: "Get WhatsApp support",
    note: "Arrivio forwards your request to relevant providers. No platform fee is charged to passengers."
  };
}

export default function HomePage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const text = copy(language);
  const suffix = `?lang=${language}`;

  return createElement(
    "main",
    { style: pageStyle },
    createElement("div", { style: shellStyle },
      createElement("header", { style: topBarStyle },
        createElement("div", { style: brandStyle },
          createElement("div", { style: markStyle }, "A"),
          createElement("div", null,
            createElement("div", { style: { fontWeight: 900, fontSize: "18px" } }, "Arrivio"),
            createElement("div", { style: { opacity: 0.72, fontSize: "12px", marginTop: "2px" } }, "Airport Services")
          )
        ),
        createElement("nav", { style: langPillStyle },
          createElement("a", { href: languageHref("/", "en"), style: { ...langLinkStyle, background: language === "en" ? "#FFFFFF" : "transparent", color: language === "en" ? "#0B2E63" : "#FFFFFF" } }, "EN"),
          createElement("a", { href: languageHref("/", "tr"), style: { ...langLinkStyle, background: language === "tr" ? "#FFFFFF" : "transparent", color: language === "tr" ? "#0B2E63" : "#FFFFFF" } }, "TR")
        )
      ),
      createElement("section", { style: heroCardStyle },
        createElement("div", { style: heroTopStyle },
          createElement("p", { style: eyebrowStyle }, text.airport),
          createElement("h1", { style: titleStyle }, text.title),
          createElement("p", { style: subtitleStyle }, text.subtitle),
          createElement("div", { style: badgeRowStyle },
            text.badges.map((badge) => createElement("span", { key: badge, style: badgeStyle }, badge))
          )
        ),
        createElement("div", { style: heroBodyStyle },
          createElement("div", { style: serviceGridStyle },
            text.services.map(([icon, title, description, href]) => createElement("a", { key: href, href: `${href}${suffix}`, style: serviceCardStyle },
              createElement("div", { style: iconStyle }, icon),
              createElement("div", null,
                createElement("h2", { style: serviceTitleStyle }, title),
                createElement("p", { style: serviceTextStyle }, description)
              )
            ))
          ),
          createElement("a", { href: whatsappSupportUrl(language), style: supportStyle }, "☎", text.support)
        )
      ),
      createElement("p", { style: footerNoteStyle }, text.note)
    )
  );
}
