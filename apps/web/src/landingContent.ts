export type TabKey = "transfer" | "rental" | "hotel" | "ticket";

export type HomeCopy = {
  top: string;
  nav: { transfer: string; rental: string; hotels: string; flights: string; support: string; cta: string };
  hero: { badge: string; title: string; description: string; primary: string; secondary: string };
  tabs: Record<TabKey, string>;
  common: { passenger: string; phone: string; flight: string; requestCode: string; support: string };
  stats: Array<{ value: string; label: string }>;
  modules: Array<{ tab: TabKey; icon: string; title: string; text: string }>;
  benefits: Array<{ title: string; text: string }>;
  steps: Array<{ title: string; text: string }>;
  revenue: { title: string; text: string; items: string[] };
  social: { title: string; text: string };
};

export function queryValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export function homeCopy(language: "tr" | "en"): HomeCopy {
  if (language === "tr") {
    return {
      top: "BJV lansmanı • Yolcudan platform ücreti yok • WhatsApp destekli hızlı talep",
      nav: { transfer: "Transfer", rental: "Araç", hotels: "Otel", flights: "Bilet", support: "Destek", cta: "Talep Bırak" },
      hero: {
        badge: "Milas-Bodrum Havalimanı için yeni nesil yolcu hizmetleri",
        title: "İnişten sonra ihtiyacın olan her şey tek ekranda.",
        description: "Transfer, araç kiralama, otel ve bilet taleplerini uygulama indirmeden bırak. Arrivio talebini doğru sağlayıcıya ulaştırır.",
        primary: "Hemen Talep Oluştur",
        secondary: "Nasıl Çalışır?"
      },
      tabs: { transfer: "Transfer", rental: "Araç", hotel: "Otel", ticket: "Bilet" },
      common: { passenger: "Yolcu adı", phone: "Telefon", flight: "Uçuş kodu", requestCode: "Talep kodu", support: "WhatsApp Destek" },
      stats: [
        { value: "4", label: "ana hizmet" },
        { value: "0 TL", label: "yolcu platform ücreti" },
        { value: "BJV", label: "ilk odak havalimanı" },
        { value: "7/24", label: "WhatsApp destek" }
      ],
      modules: [
        { tab: "transfer", icon: "T", title: "Transfer Talebi", text: "BJV çıkışlı transfer ihtiyacını dakikalar içinde ilet." },
        { tab: "rental", icon: "A", title: "Araç Kiralama", text: "Ekonomik, SUV veya lüks araç için talep bırak." },
        { tab: "hotel", icon: "O", title: "Yakın Oteller", text: "Havalimanı çevresi konaklama uygunluğunu sor." },
        { tab: "ticket", icon: "B", title: "Bilet Talebi", text: "Rota ve tarih bilgisini acenteye aktar." }
      ],
      benefits: [
        { title: "Yolcuya kolay", text: "Uygulama indirme ve üyelik zorunluluğu yok." },
        { title: "İşletmeye takip", text: "Tüm talepler Firestore'da kayıtlı kalır ve admin panelden yönetilir." },
        { title: "Sağlayıcıya iş", text: "Transfer işi atanır, sağlayıcı kendi panelinden fiyat ve not girer." },
        { title: "Yerel odak", text: "İlk hedef BJV, Bodrum, Milas, Yalıkavak ve çevre rotalar." }
      ],
      steps: [
        { title: "Talep bırak", text: "Yolcu sekmeden hizmeti seçer ve bilgileri girer." },
        { title: "Ekip yönetsin", text: "Admin talebi görür, sağlayıcı veya acente ile eşleştirir." },
        { title: "Hizmet tamamlansın", text: "İş gerçekleşince komisyon takibi admin panelde tutulur." }
      ],
      revenue: {
        title: "Gelir modeli sade",
        text: "Yolcudan ücret almadan, hizmeti yapan sağlayıcıdan komisyon mantığıyla çalışır.",
        items: ["Transfer gerçekleşirse komisyon", "Araç/otel/bilet için acente anlaşması", "QR kaynaklarına göre talep takibi"]
      },
      social: { title: "Havalimanı odaklı yerel operasyon", text: "Arrivio önce Milas-Bodrum'da gerçek talepleri yönetmek, sonra Dalaman ve diğer havalimanlarına açılmak için tasarlandı." }
    };
  }

  return {
    top: "BJV launch • No passenger platform fee • WhatsApp supported requests",
    nav: { transfer: "Transfer", rental: "Car", hotels: "Hotel", flights: "Ticket", support: "Support", cta: "Send Request" },
    hero: {
      badge: "Next-generation passenger services for Milas-Bodrum Airport",
      title: "Everything after landing, from one screen.",
      description: "Request transfers, car rental, hotels and tickets without downloading an app. Arrivio routes your request to the right provider.",
      primary: "Create Request",
      secondary: "How It Works"
    },
    tabs: { transfer: "Transfer", rental: "Car", hotel: "Hotel", ticket: "Ticket" },
    common: { passenger: "Passenger name", phone: "Phone", flight: "Flight code", requestCode: "Request code", support: "WhatsApp Support" },
    stats: [
      { value: "4", label: "core services" },
      { value: "0", label: "passenger platform fee" },
      { value: "BJV", label: "first airport focus" },
      { value: "24/7", label: "WhatsApp support" }
    ],
    modules: [
      { tab: "transfer", icon: "T", title: "Transfer Request", text: "Send a BJV transfer request in minutes." },
      { tab: "rental", icon: "C", title: "Car Rental", text: "Request economy, SUV or luxury vehicles." },
      { tab: "hotel", icon: "H", title: "Nearby Hotels", text: "Ask accommodation availability near the airport." },
      { tab: "ticket", icon: "F", title: "Ticket Request", text: "Share route and date details with an agency." }
    ],
    benefits: [
      { title: "Easy for passengers", text: "No app download or account required." },
      { title: "Trackable for operators", text: "All requests stay recorded and manageable from admin." },
      { title: "Work for providers", text: "Assigned providers respond with price and notes." },
      { title: "Local focus", text: "Built first for BJV, Bodrum, Milas and nearby routes." }
    ],
    steps: [
      { title: "Send request", text: "Passenger selects a service and enters details." },
      { title: "Team manages", text: "Admin sees the request and assigns a provider." },
      { title: "Service completes", text: "Commission tracking stays in admin panel." }
    ],
    revenue: {
      title: "Simple revenue model",
      text: "No passenger platform fee. Arrivio earns from provider or agency commission.",
      items: ["Commission after completed transfer", "Agency agreements for car, hotel and ticket", "QR source tracking for demand"]
    },
    social: { title: "Airport-focused local operation", text: "Arrivio is designed to prove demand at Milas-Bodrum first, then expand to Dalaman and other airports." }
  };
}
