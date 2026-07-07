import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { findQrSourceBySlug, recordQrEvent } from "@arrivio/firebase";
import type { QrSource } from "@arrivio/shared";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  maxWidth: "720px",
  margin: "0 auto",
  padding: "28px",
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
  marginTop: "18px"
};

function getSlug(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function QrLandingPage() {
  const router = useRouter();
  const slug = getSlug(router.query.slug);
  const [source, setSource] = useState<QrSource | null>(null);
  const [status, setStatus] = useState("Loading QR source...");

  useEffect(() => {
    async function loadQrSource() {
      if (!router.isReady || !slug) return;

      try {
        const item = await findQrSourceBySlug(slug);
        if (!item?.id) {
          setStatus("QR source not found.");
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
        setStatus("QR source could not be loaded.");
      }
    }

    loadQrSource();
  }, [router.isReady, slug]);

  const transferHref = source?.id ? `/transfer?qrSourceId=${encodeURIComponent(source.id)}` : "/transfer";

  return createElement(
    "main",
    { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Arrivio QR"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 10px" } }, source?.title || "Airport Services"),
      createElement("p", { style: { color: "#4B5563", marginBottom: "12px" } }, source?.locationLabel || "Milas-Bodrum Airport"),
      source ? createElement("p", { style: { color: "#4B5563" } }, `Source: ${source.slug}`) : null,
      status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
      createElement("a", { href: transferHref, style: linkStyle }, "Request Transfer")
    )
  );
}
