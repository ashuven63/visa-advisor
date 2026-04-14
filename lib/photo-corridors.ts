/**
 * Photo requirement corridors for SEO landing pages.
 * These target high-volume queries like "US passport photo requirements",
 * "UK visa photo size", "Schengen visa photo specifications", etc.
 */
export interface PhotoCorridor {
  /** Country or document name, e.g. "US Passport" */
  name: string;
  /** ISO country code */
  countryCode: string;
  /** URL slug */
  slug: string;
  /** Dimensions as human-readable string */
  dimensions: string;
  /** Background requirement */
  background: string;
  /** Key specs for the landing page */
  specs: {
    widthMm: number;
    heightMm: number;
    widthInches?: number;
    heightInches?: number;
    widthPx: number;
    heightPx: number;
    dpi: number;
    maxFileSize?: string;
    fileFormats: string;
    glassesAllowed: boolean;
  };
  /** SEO-optimized title */
  title: string;
  /** SEO meta description */
  description: string;
  /** Official source URL */
  sourceUrl: string;
}

export const PHOTO_CORRIDORS: PhotoCorridor[] = [
  // US documents
  {
    name: "US Passport",
    countryCode: "US",
    slug: "us-passport-photo",
    dimensions: "2 × 2 inches (51 × 51 mm)",
    background: "Plain white or off-white",
    specs: {
      widthMm: 51, heightMm: 51,
      widthInches: 2, heightInches: 2,
      widthPx: 600, heightPx: 600,
      dpi: 300, maxFileSize: "10 MB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "US Passport Photo Requirements 2025 — Size, Rules & Free Check",
    description: "US passport photo must be 2×2 inches (51×51 mm), white background, no glasses. Upload your photo for a free instant compliance check and auto-fix.",
    sourceUrl: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
  },
  {
    name: "US Visa",
    countryCode: "US",
    slug: "us-visa-photo",
    dimensions: "2 × 2 inches (51 × 51 mm)",
    background: "Plain white or off-white",
    specs: {
      widthMm: 51, heightMm: 51,
      widthInches: 2, heightInches: 2,
      widthPx: 600, heightPx: 600,
      dpi: 300, maxFileSize: "240 KB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "US Visa Photo Requirements (DS-160) — Size, Rules & Free Check",
    description: "US visa (DS-160) photo must be 2×2 inches, 600×600 px minimum, white background, max 240 KB JPEG. Free instant check and auto-fix tool.",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html",
  },
  // UK
  {
    name: "UK Passport",
    countryCode: "GB",
    slug: "uk-passport-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light grey or cream",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300, maxFileSize: "10 MB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "UK Passport Photo Requirements 2025 — Size, Rules & Free Check",
    description: "UK passport photo must be 35×45 mm, light grey or cream background, no glasses. Free instant compliance check and AI auto-fix.",
    sourceUrl: "https://www.gov.uk/photos-for-passports",
  },
  {
    name: "UK Visa",
    countryCode: "GB",
    slug: "uk-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light grey or cream",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "UK Visa Photo Requirements 2025 — Size, Background & Free Tool",
    description: "UK visa photo must be 35×45 mm with light grey or cream background. Check your photo for free and get AI-powered fixes instantly.",
    sourceUrl: "https://www.gov.uk/photos-for-passports",
  },
  // Schengen / EU
  {
    name: "Schengen Visa",
    countryCode: "EU",
    slug: "schengen-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light (white, off-white, or light grey)",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Schengen Visa Photo Requirements 2025 — Size, Rules & Free Check",
    description: "Schengen visa photo must be 35×45 mm, light background, 70-80% face coverage. Free compliance check and AI auto-fix tool.",
    sourceUrl: "https://www.schengenvisainfo.com/photo-requirements/",
  },
  // Canada
  {
    name: "Canada Passport",
    countryCode: "CA",
    slug: "canada-passport-photo",
    dimensions: "50 × 70 mm",
    background: "Plain white or light-coloured",
    specs: {
      widthMm: 50, heightMm: 70,
      widthPx: 591, heightPx: 827,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "Canada Passport Photo Requirements 2025 — Size, Rules & Free Tool",
    description: "Canadian passport photo must be 50×70 mm, white background, no glasses. Free instant check and AI-powered auto-fix.",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
  },
  {
    name: "Canada Visa",
    countryCode: "CA",
    slug: "canada-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white or light-coloured",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300, maxFileSize: "4 MB",
      fileFormats: "JPEG or PNG", glassesAllowed: false,
    },
    title: "Canada Visa Photo Requirements 2025 — Size, Rules & Free Check",
    description: "Canadian visa photo must be 35×45 mm, white background, max 4 MB. Check your photo free and auto-fix issues with AI.",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/temporary-resident-visa-application-photograph-specifications.html",
  },
  // Australia
  {
    name: "Australia Passport",
    countryCode: "AU",
    slug: "australia-passport-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "Australia Passport Photo Requirements 2025 — Size & Free Check",
    description: "Australian passport photo must be 35×45 mm, white background, no glasses. Instant compliance check and AI auto-fix — free.",
    sourceUrl: "https://www.passports.gov.au/getting-passport-how-it-works/photo-guidelines",
  },
  {
    name: "Australia Visa",
    countryCode: "AU",
    slug: "australia-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light-coloured",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300, maxFileSize: "5 MB",
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Australia Visa Photo Requirements 2025 — Size, Rules & Free Tool",
    description: "Australian visa photo: 35×45 mm, light background, glasses allowed. Free instant check + AI auto-fix.",
    sourceUrl: "https://immi.homeaffairs.gov.au/help-support/applying-online-or-on-paper/biometrics-and-photographs",
  },
  // India
  {
    name: "India Passport",
    countryCode: "IN",
    slug: "india-passport-photo",
    dimensions: "51 × 51 mm (2 × 2 inches)",
    background: "Plain white",
    specs: {
      widthMm: 51, heightMm: 51,
      widthInches: 2, heightInches: 2,
      widthPx: 600, heightPx: 600,
      dpi: 300, maxFileSize: "1 MB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "India Passport Photo Requirements 2025 — Size, Rules & Free Check",
    description: "Indian passport photo must be 2×2 inches (51×51 mm), white background, no glasses. Free instant compliance check and AI auto-fix.",
    sourceUrl: "https://www.passportindia.gov.in/AppOnlineProject/online/photoguideline",
  },
  {
    name: "India Visa (e-Visa)",
    countryCode: "IN",
    slug: "india-visa-photo",
    dimensions: "51 × 51 mm (2 × 2 inches)",
    background: "Plain white",
    specs: {
      widthMm: 51, heightMm: 51,
      widthInches: 2, heightInches: 2,
      widthPx: 350, heightPx: 350,
      dpi: 300, maxFileSize: "1 MB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "India Visa Photo Requirements 2025 — e-Visa Size & Free Tool",
    description: "India e-Visa photo: 2×2 inches, white background, 350×350 px min, max 1 MB JPEG. Free check and AI auto-fix.",
    sourceUrl: "https://indianvisaonline.gov.in/evisa/tvoa.html",
  },
  // Japan
  {
    name: "Japan Visa",
    countryCode: "JP",
    slug: "japan-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white or light",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Japan Visa Photo Requirements 2025 — Size, Rules & Free Check",
    description: "Japan visa photo: 35×45 mm (4.5 cm tall), white or light background. Free instant compliance check and AI fix.",
    sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
  },
  // China
  {
    name: "China Visa",
    countryCode: "CN",
    slug: "china-visa-photo",
    dimensions: "33 × 48 mm",
    background: "Plain white",
    specs: {
      widthMm: 33, heightMm: 48,
      widthPx: 390, heightPx: 567,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "China Visa Photo Requirements 2025 — Size, Background & Free Tool",
    description: "China visa photo: 33×48 mm, white background, no glasses. Free instant compliance check and AI auto-fix tool.",
    sourceUrl: "https://www.visaforchina.cn/",
  },
  // South Korea
  {
    name: "South Korea Visa",
    countryCode: "KR",
    slug: "south-korea-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "South Korea Visa Photo Requirements 2025 — Size & Free Check",
    description: "South Korea visa photo: 35×45 mm, white background. Check your photo free and auto-fix with AI.",
    sourceUrl: "https://overseas.mofa.go.kr/",
  },
  // Germany
  {
    name: "Germany Visa",
    countryCode: "DE",
    slug: "germany-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light grey",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Germany Visa Photo Requirements 2025 — Schengen Photo Size & Free Tool",
    description: "Germany/Schengen visa photo: 35×45 mm, light grey background. Free compliance check and AI auto-fix.",
    sourceUrl: "https://www.auswaertiges-amt.de/en",
  },
  // France
  {
    name: "France Visa",
    countryCode: "FR",
    slug: "france-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain light grey or blue-grey",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "France Visa Photo Requirements 2025 — Schengen Photo Size & Tool",
    description: "France visa photo: 35×45 mm, light grey or blue-grey background (OFPRA standard). Free compliance check.",
    sourceUrl: "https://france-visas.gouv.fr/en/web/france-visas",
  },
  // UAE / Dubai
  {
    name: "UAE Visa",
    countryCode: "AE",
    slug: "uae-visa-photo",
    dimensions: "43 × 55 mm",
    background: "Plain white",
    specs: {
      widthMm: 43, heightMm: 55,
      widthPx: 508, heightPx: 650,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "UAE/Dubai Visa Photo Requirements 2025 — Size & Free Check",
    description: "UAE visa photo: 43×55 mm, white background. Instant free compliance check + AI auto-fix for your Dubai visa application.",
    sourceUrl: "https://www.government.ae/en/information-and-services/visa-and-emirates-id",
  },
  // Singapore
  {
    name: "Singapore Visa",
    countryCode: "SG",
    slug: "singapore-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 400, heightPx: 514,
      dpi: 300, maxFileSize: "2 MB",
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "Singapore Visa Photo Requirements 2025 — Size, Rules & Free Tool",
    description: "Singapore visa photo: 35×45 mm, white background, no glasses. Free compliance check + AI auto-fix.",
    sourceUrl: "https://www.ica.gov.sg/",
  },
  // Thailand
  {
    name: "Thailand Visa",
    countryCode: "TH",
    slug: "thailand-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Thailand Visa Photo Requirements 2025 — Size & Free Check Tool",
    description: "Thailand visa photo: 35×45 mm (4×6 cm), white background. Free instant check and AI auto-fix.",
    sourceUrl: "https://www.thaievisa.go.th/",
  },
  // New Zealand
  {
    name: "New Zealand Visa",
    countryCode: "NZ",
    slug: "new-zealand-visa-photo",
    dimensions: "35 × 45 mm",
    background: "Plain white or off-white",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "New Zealand Visa Photo Requirements 2025 — Size & Free Check",
    description: "New Zealand visa photo: 35×45 mm, white background. Instant free compliance check and AI auto-fix.",
    sourceUrl: "https://www.immigration.govt.nz/",
  },
  // Brazil
  {
    name: "Brazil Visa",
    countryCode: "BR",
    slug: "brazil-visa-photo",
    dimensions: "50 × 70 mm",
    background: "Plain white",
    specs: {
      widthMm: 50, heightMm: 70,
      widthPx: 591, heightPx: 827,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Brazil Visa Photo Requirements 2025 — Size, Rules & Free Tool",
    description: "Brazil visa photo: 5×7 cm, white background. Free compliance check and AI auto-fix.",
    sourceUrl: "https://www.gov.br/mre/en",
  },
  // Turkey
  {
    name: "Turkey Visa",
    countryCode: "TR",
    slug: "turkey-visa-photo",
    dimensions: "50 × 60 mm",
    background: "Plain white",
    specs: {
      widthMm: 50, heightMm: 60,
      widthPx: 591, heightPx: 709,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: true,
    },
    title: "Turkey Visa & e-Visa Photo Requirements 2025 — Free Check Tool",
    description: "Turkey visa photo: 50×60 mm, white background. Instant free compliance check + AI auto-fix.",
    sourceUrl: "https://www.evisa.gov.tr/",
  },
  // Generic passport photo
  {
    name: "Passport Photo",
    countryCode: "GENERIC",
    slug: "passport-photo-requirements",
    dimensions: "Varies by country (typically 35×45 mm or 2×2 inches)",
    background: "Plain white or light",
    specs: {
      widthMm: 35, heightMm: 45,
      widthPx: 413, heightPx: 531,
      dpi: 300,
      fileFormats: "JPEG", glassesAllowed: false,
    },
    title: "Passport Photo Requirements by Country 2025 — Free Check & Fix Tool",
    description: "Check your passport or visa photo against official requirements for any country. Free instant compliance check with AI-powered auto-fix.",
    sourceUrl: "https://www.icao.int/Security/FAL/TRIP/Pages/default.aspx",
  },
];

export function getPhotoCorridorBySlug(slug: string): PhotoCorridor | undefined {
  return PHOTO_CORRIDORS.find((c) => c.slug === slug);
}
