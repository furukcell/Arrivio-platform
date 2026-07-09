import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { findQrSourceBySlug, recordQrEvent } from "@arrivio/firebase";
import type { QrSource } from "@arrivio/shared";
import { getLanguage } from "../../src/supportModel";
import { homeCopy, type TabKey } from "../../src/landingContent";

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

const primaryLinkStyle = {
  display: "block",
  padding: "16px 18px",
  borderRadius: "18px",
  background: "#0B63F6",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 800,
  marginTop: "14px"
};

const secondaryLinkStyle = {
  display: "block",
  padding: "15px 18px",
  borderRadius: "18px",
  background: "#F0F7FF",
  color: "#08183A",
  textDecoration: "none",
  fontWeight: 800,
  marginTop: "10px",
  border: "1px solid #D8E8FA"
};

function getValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function QrLandingPage() {
  const router = useRouter();
  const slug = getValue(router.query.slug);
  const language = getLanguage(router.query.lang);
  const home = homeCopy(language);
  const [source, setSource] = useState<QrSource | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadQrSource() {
      if (!router.isReady || !slug) return;

      try {
        const item = await findQrSourceBySlug(slug);
        if (!item?.id || item.isActive === false) {
          setStatus(language === "tr" ? "QR kaynağı bulunamadı veya pasif." : "QR source not found or inactive.");
          return;
        }

        setSource(item);
        setStatus("");
        await recordQrEvent({
          qrSourceId: item.id,
          slug,
          path: `/qr/${slug}`,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : ""
        });
      } catch (error) {
        setStatus(language === "tr" ? "QR kaynağı yüklenemedi." : "QR source could not be loaded.");
      }
    }

    loadQrSource();
  }, [router.isReady, slug, language]);

  const qrQuery = source?.id ? `qrSourceId=${encodeURIComponent(source.id)}&lang=${language}` : `lang=${language}`;
  const serviceLinks: Array<{ tab: TabKey; label: string; href: string; primary?: boolean }> = [
    { tab: "transfer", label: language === "tr" ? "Transfer seç" : "Choose transfer", href: `/transfer?${qrQuery}`, primary: true },
    { tab: "rental", label: home.tabs.rental, href: `/car-rental?${qrQuery}` },
    { tab: "hotel", label: home.tabs.hotel, href: `/hotel?${qrQuery}` },
    { tab: "ticket", label: home.tabs.ticket, href: `/ticket?${qrQuery}` }
  ];

  return createElement(
    "main",
    { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Arrivio QR"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, source?.title || (language === "tr" ? "Havalimanı hizmetini seç" : "Choose your airport service")),
      createElement("p", { style: { color: "#4B5563", marginBottom: "12px" } }, source?.locationLabel || home.hero.badge),
      createElement("p", { style: { color: "#4B5563", marginBottom: "18px" } }, language === "tr" ? "QR okutuldu. Devam etmek istediğin hizmeti seç; talebin bu QR kaynağıyla takip edilir." : "QR scanned. Choose the service you need; your request will be tracked with this QR source."),
      status ? createElement("p", { style: { fontWeight: 700, color: "#B91C1C" } }, status) : null,
      ...serviceLinks.map((link) => createElement("a", { key: link.tab, href: link.href, style: link.primary ? primaryLinkStyle : secondaryLinkStyle }, link.label)),
      source ? createElement("p", { style: { color: "#64748B", marginTop: "18px", fontSize: "13px" } }, `QR: ${source.slug}`) : null
    )
  );
}
