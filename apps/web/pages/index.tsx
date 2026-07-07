import { createElement } from "react";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  maxWidth: "760px",
  margin: "0 auto",
  padding: "30px",
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

export default function HomePage() {
  return createElement(
    "main",
    { style: pageStyle },
    createElement("section", { style: cardStyle },
      createElement("p", { style: { color: "#0B63F6", fontWeight: 700 } }, "Milas-Bodrum Airport"),
      createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Arrivio"),
      createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, "Airport transfer and car rental requests without app download."),
      createElement("a", { href: "/transfer", style: linkStyle }, "Request Transfer"),
      createElement("a", { href: "/car-rental", style: linkStyle }, "Request Car Rental")
    )
  );
}
