import type { WebLanguage } from "./supportModel";

export type FormCopy = {
  home: string;
  airport: string;
  title: string;
  description: string;
  qrDetected: string;
  passengerName: string;
  passengerPlaceholder: string;
  phone: string;
  flightCode: string;
  submit: string;
  sending: string;
  support: string;
  requestCode: string;
  success: string;
  failure: string;
};

const commonTr = {
  home: "Ana sayfa",
  airport: "Milas-Bodrum Havalimanı",
  qrDetected: "QR kaynağı algılandı.",
  passengerName: "Yolcu adı",
  passengerPlaceholder: "Ad soyad",
  phone: "Telefon / WhatsApp",
  flightCode: "Uçuş kodu",
  sending: "Gönderiliyor...",
  support: "WhatsApp Destek",
  requestCode: "Talep kodu"
};

const commonEn = {
  home: "Home",
  airport: "Milas-Bodrum Airport",
  qrDetected: "QR source detected.",
  passengerName: "Passenger name",
  passengerPlaceholder: "Full name",
  phone: "Phone / WhatsApp",
  flightCode: "Flight code",
  sending: "Sending...",
  support: "WhatsApp Support",
  requestCode: "Request code"
};

export function transferCopy(language: WebLanguage) {
  if (language === "tr") return {
    ...commonTr,
    title: "Transfer Talebi",
    description: "Uygulama indirmeden, yolcudan hizmet bedeli alınmadan transfer talebi bırakın.",
    destination: "Varış noktası",
    passengers: "Yolcu sayısı",
    bags: "Bagaj",
    submit: "Transfer Talebi Gönder",
    success: "Transfer talebiniz alındı. Arrivio size ulaşacak.",
    failure: "Transfer talebi oluşturulamadı. Lütfen tekrar deneyin."
  };
  return {
    ...commonEn,
    title: "Request Airport Transfer",
    description: "No app download. No passenger service fee. Verified providers only.",
    destination: "Destination",
    passengers: "Passengers",
    bags: "Bags",
    submit: "Request Transfer",
    success: "Transfer request created. Arrivio will contact you soon.",
    failure: "Transfer request could not be created. Please try again."
  };
}

export function rentalCopy(language: WebLanguage) {
  if (language === "tr") return {
    ...commonTr,
    title: "Araç Kiralama Talebi",
    description: "İhtiyacınız olan aracı yazın. Arrivio talebinizi uygun firmalara iletsin.",
    pickupLocation: "Teslim alma yeri",
    pickupDate: "Teslim alma tarihi",
    dropoffDate: "Bırakma tarihi",
    carClass: "Araç sınıfı",
    economic: "Ekonomik",
    middle: "Orta",
    luxury: "Lüks",
    submit: "Araç Talebi Gönder",
    success: "Araç kiralama talebiniz alındı. Arrivio size ulaşacak.",
    failure: "Araç kiralama talebi oluşturulamadı. Lütfen tekrar deneyin."
  };
  return {
    ...commonEn,
    title: "Request Car Rental",
    description: "Tell us what car you need. Arrivio routes your request to verified rental providers.",
    pickupLocation: "Pickup location",
    pickupDate: "Pickup date",
    dropoffDate: "Dropoff date",
    carClass: "Car class",
    economic: "Economic",
    middle: "Middle",
    luxury: "Luxury",
    submit: "Request Car Rental",
    success: "Car rental request created. Arrivio will contact you soon.",
    failure: "Car rental request could not be created. Please try again."
  };
}

export function hotelCopy(language: WebLanguage) {
  if (language === "tr") return {
    ...commonTr,
    title: "Otel Uygunluk Talebi",
    description: "Konaklama bilgilerinizi gönderin. Arrivio uygun otel ve apartları kontrol etsin.",
    checkIn: "Giriş tarihi",
    checkOut: "Çıkış tarihi",
    guests: "Kişi sayısı",
    rooms: "Oda sayısı",
    radius: "Arama yarıçapı km",
    wantsTransfer: "Havalimanı transferi de isteyebilirim",
    submit: "Otel Talebi Gönder",
    success: "Otel talebiniz alındı. Arrivio size ulaşacak.",
    failure: "Otel talebi oluşturulamadı. Lütfen tekrar deneyin."
  };
  return {
    ...commonEn,
    title: "Request Hotel Availability",
    description: "Tell us your stay details. Arrivio will check suitable nearby hotels and apartments.",
    checkIn: "Check-in date",
    checkOut: "Check-out date",
    guests: "Guests",
    rooms: "Rooms",
    radius: "Search radius km",
    wantsTransfer: "I may need airport transfer too",
    submit: "Request Hotel",
    success: "Hotel availability request created. Arrivio will contact you soon.",
    failure: "Hotel request could not be created. Please try again."
  };
}

export function ticketCopy(language: WebLanguage) {
  if (language === "tr") return {
    ...commonTr,
    airport: "Arrivio",
    title: "Bilet Talebi",
    description: "Rota ve tarih bilgilerinizi gönderin.",
    from: "Nereden",
    to: "Nereye",
    departureDate: "Gidiş tarihi",
    returnDate: "Dönüş tarihi",
    passengers: "Yolcu sayısı",
    submit: "Bilet Talebi Gönder",
    success: "Talebiniz alındı. Arrivio size ulaşacak.",
    failure: "Talep oluşturulamadı. Lütfen tekrar deneyin."
  };
  return {
    ...commonEn,
    airport: "Arrivio",
    title: "Request Ticket",
    description: "Send your route and date.",
    from: "From",
    to: "To",
    departureDate: "Departure date",
    returnDate: "Return date",
    passengers: "Passengers",
    submit: "Request Ticket",
    success: "Ticket request created. Arrivio will contact you soon.",
    failure: "Ticket request could not be created. Please try again."
  };
}
