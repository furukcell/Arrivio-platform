export type WebLanguage = "tr" | "en";

export function getLanguage(rawValue: string | string[] | undefined): WebLanguage {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  return value === "tr" ? "tr" : "en";
}

export function supportNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || "905000000000";
}

export function supportMessage(language: WebLanguage): string {
  if (language === "tr") return "Merhaba, Arrivio üzerinden destek almak istiyorum.";
  return "Hello, I need support from Arrivio.";
}

export function whatsappSupportUrl(language: WebLanguage): string {
  const text = encodeURIComponent(supportMessage(language));
  return `https://wa.me/${supportNumber()}?text=${text}`;
}

export function languageHref(path: string, language: WebLanguage): string {
  return `${path}?lang=${language}`;
}
