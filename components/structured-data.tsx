/**
 * JSON-LD structured data for SEO.
 * Renders a <script type="application/ld+json"> tag.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const HOME_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I know if I need a visa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visa requirements depend on your passport country, destination, trip purpose, and duration. Use the Visa Advisor tool to check requirements with citations from official government sources.",
      },
    },
    {
      "@type": "Question",
      name: "Does holding a US visa exempt me from other visas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some countries waive visa requirements for holders of valid US, Schengen, UK, or Canadian visas. Visa Advisor checks these exemptions automatically based on your held visas.",
      },
    },
    {
      "@type": "Question",
      name: "What are visa photo requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each country has specific photo requirements including dimensions, background color, head size, and file format. Visa Advisor includes a free photo compliance checker and auto-fix tool.",
      },
    },
  ],
};

export const WEB_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Visa Advisor",
  description:
    "Free visa requirements checker with official citations and photo compliance tool.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};
