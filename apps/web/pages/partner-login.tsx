import { useRouter } from "next/router";
import { getLanguage } from "../src/supportModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Inter, Arial, sans-serif",
  background: "linear-gradient(180deg, #f8fbff 0%, #eaf4ff 48%, #f7fbff 100%)",
  color: "#071631"
};

const cardStyle = {
  maxWidth: "980px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "30px",
  background: "rgba(255, 255, 255, 0.92)",
  border: "1px solid #dbeafe",
  boxShadow: "0 28px 80px rgba(7, 27, 88, 0.13)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginTop: "24px"
};

const optionStyle = {
  padding: "22px",
  borderRadius: "22px",
  background: "#FFFFFF",
  border: "1px solid #dbeafe",
  textDecoration: "none",
  color: "#071631",
  boxShadow: "0 16px 38px rgba(7, 27, 88, 0.08)"
};

const primaryButtonStyle = {
  display: "inline-block",
  marginTop: "16px",
  padding: "13px 18px",
  borderRadius: "999px",
  background: "#075ee8",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 900
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: "#1fb6a6"
};

function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

function withLang(url: string, language: "tr" | "en") {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}lang=${language}`;
}

export default function PartnerLoginPage() {
  const router = useRouter();
  const language = getLanguage(router.query.lang);
  const providerUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || "/provider/login";
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "/admin/login";
  const isTr = language === "tr";

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <a href={`/?lang=${language}`} style={{ color: "#075ee8", fontWeight: 900, textDecoration: "none" }}>← {isTr ? "Ana sayfa" : "Home"}</a>
        <p style={{ color: "#075ee8", fontWeight: 900, marginTop: "24px" }}>{isTr ? "Arrivio iş ortağı paneli" : "Arrivio partner access"}</p>
        <h1 style={{ fontSize: "46px", lineHeight: 1.02, letterSpacing: "-1.8px", margin: "0 0 12px" }}>
          {isTr ? "Hizmet veren girişi" : "Partner login"}
        </h1>
        <p style={{ color: "#4b5d78", fontSize: "18px", lineHeight: 1.55, maxWidth: "720px" }}>
          {isTr
            ? "Transfer, rent a car, otel ve acenta hesapları buradan kendi paneline geçer. Yolcu tarafı ayrı kalır; iş ortakları giriş yaptıktan sonra kendi dashboard ekranını görür."
            : "Transfer, car rental, hotel and agency partners enter their own dashboard from here. Passenger requests stay separate from partner operations."}
        </p>

        <div style={gridStyle}>
          <a href={withLang(providerUrl, language)} style={optionStyle}>
            <strong style={{ display: "block", fontSize: "22px" }}>{isTr ? "Hizmet Veren Paneli" : "Provider Panel"}</strong>
            <p style={{ color: "#64748b", lineHeight: 1.45 }}>
              {isTr
                ? "Transferci, rent a carcı, otelci ve acenta hesapları için giriş. İşler, fiyatlar, müsaitlik ve komisyon takibi burada yönetilir."
                : "Login for transfer, car rental, hotel and agency partners. Jobs, prices, availability and commissions are managed here."}
            </p>
            <span style={primaryButtonStyle}>{isTr ? "Provider girişine git" : "Go to provider login"}</span>
          </a>

          <a href={withLang(adminUrl, language)} style={optionStyle}>
            <strong style={{ display: "block", fontSize: "22px" }}>{isTr ? "Admin Paneli" : "Admin Panel"}</strong>
            <p style={{ color: "#64748b", lineHeight: 1.45 }}>
              {isTr
                ? "Arrivio yönetimi için talep, provider, QR ve komisyon operasyon ekranları. Sadece admin hesapları kullanır."
                : "Operational screens for Arrivio requests, providers, QR tracking and commissions. Admin accounts only."}
            </p>
            <span style={secondaryButtonStyle}>{isTr ? "Admin girişine git" : "Go to admin login"}</span>
          </a>
        </div>

        <p style={{ marginTop: "24px", color: "#64748b", fontWeight: 800 }}>
          {isTr
            ? "Not: Tek domain kullanıldığında /provider ve /admin yolları aynı site altında çalışır. Ayrı deploy kullanılırsa NEXT_PUBLIC_PROVIDER_URL ve NEXT_PUBLIC_ADMIN_URL ile yönlendirme yapılır."
            : "Note: With one-domain routing, /provider and /admin can live under the same site. If deployed separately, NEXT_PUBLIC_PROVIDER_URL and NEXT_PUBLIC_ADMIN_URL control the links."}
        </p>
      </section>
    </main>
  );
}
