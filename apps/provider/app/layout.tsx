import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Arrivio Provider",
  description: "Arrivio provider operations panel."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
