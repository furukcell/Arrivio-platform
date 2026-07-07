export type WebLanguage = "tr" | "en";

export function getLanguage(rawValue: string | string[] | undefined): WebLanguage {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  return value === "tr" ? "tr" : "en";
}

export function copy(language: WebLanguage, tr: string, en: string): string {
  return language === "tr" ? tr : en;
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

export function translateFormMessage(language: WebLanguage, message: string): string {
  if (language === "en") return message;

  const messages: Record<string, string> = {
    "Passenger name is required.": "Yolcu adı zorunludur.",
    "Passenger phone is required.": "Telefon numarası zorunludur.",
    "Destination is required.": "Varış noktası zorunludur.",
    "Passenger count must be at least 1.": "Yolcu sayısı en az 1 olmalıdır.",
    "Pickup location is required.": "Teslim alma yeri zorunludur.",
    "Pickup date is required.": "Teslim alma tarihi zorunludur.",
    "Dropoff date is required.": "Bırakma tarihi zorunludur.",
    "Check-in date is required.": "Giriş tarihi zorunludur.",
    "Check-out date is required.": "Çıkış tarihi zorunludur.",
    "Guest count must be at least 1.": "Misafir sayısı en az 1 olmalıdır.",
    "Room count must be at least 1.": "Oda sayısı en az 1 olmalıdır.",
    "From city or airport is required.": "Kalkış şehri veya havalimanı zorunludur.",
    "To city or airport is required.": "Varış şehri veya havalimanı zorunludur.",
    "Departure date is required.": "Gidiş tarihi zorunludur."
  };

  return messages[message] || message;
}
