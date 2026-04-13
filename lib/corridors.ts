/**
 * Top passport-to-destination corridors for SEO landing pages.
 * These represent the highest-volume visa-requirement searches.
 */
export interface Corridor {
  passport: string;
  passportCode: string;
  destination: string;
  destinationCode: string;
  slug: string;
}

/** Top ~70 corridors by search volume. */
export const CORRIDORS: Corridor[] = [
  // Indian passport
  { passport: "India", passportCode: "IN", destination: "United States", destinationCode: "US", slug: "india-to-usa" },
  { passport: "India", passportCode: "IN", destination: "United Kingdom", destinationCode: "GB", slug: "india-to-uk" },
  { passport: "India", passportCode: "IN", destination: "Canada", destinationCode: "CA", slug: "india-to-canada" },
  { passport: "India", passportCode: "IN", destination: "Australia", destinationCode: "AU", slug: "india-to-australia" },
  { passport: "India", passportCode: "IN", destination: "Germany", destinationCode: "DE", slug: "india-to-germany" },
  { passport: "India", passportCode: "IN", destination: "France", destinationCode: "FR", slug: "india-to-france" },
  { passport: "India", passportCode: "IN", destination: "Japan", destinationCode: "JP", slug: "india-to-japan" },
  { passport: "India", passportCode: "IN", destination: "Singapore", destinationCode: "SG", slug: "india-to-singapore" },
  { passport: "India", passportCode: "IN", destination: "Thailand", destinationCode: "TH", slug: "india-to-thailand" },
  { passport: "India", passportCode: "IN", destination: "UAE", destinationCode: "AE", slug: "india-to-uae" },
  { passport: "India", passportCode: "IN", destination: "Mexico", destinationCode: "MX", slug: "india-to-mexico" },
  { passport: "India", passportCode: "IN", destination: "New Zealand", destinationCode: "NZ", slug: "india-to-new-zealand" },
  // Nigerian passport
  { passport: "Nigeria", passportCode: "NG", destination: "United States", destinationCode: "US", slug: "nigeria-to-usa" },
  { passport: "Nigeria", passportCode: "NG", destination: "United Kingdom", destinationCode: "GB", slug: "nigeria-to-uk" },
  { passport: "Nigeria", passportCode: "NG", destination: "Canada", destinationCode: "CA", slug: "nigeria-to-canada" },
  { passport: "Nigeria", passportCode: "NG", destination: "Germany", destinationCode: "DE", slug: "nigeria-to-germany" },
  { passport: "Nigeria", passportCode: "NG", destination: "UAE", destinationCode: "AE", slug: "nigeria-to-uae" },
  // Pakistani passport
  { passport: "Pakistan", passportCode: "PK", destination: "United States", destinationCode: "US", slug: "pakistan-to-usa" },
  { passport: "Pakistan", passportCode: "PK", destination: "United Kingdom", destinationCode: "GB", slug: "pakistan-to-uk" },
  { passport: "Pakistan", passportCode: "PK", destination: "Canada", destinationCode: "CA", slug: "pakistan-to-canada" },
  { passport: "Pakistan", passportCode: "PK", destination: "Turkey", destinationCode: "TR", slug: "pakistan-to-turkey" },
  // Filipino passport
  { passport: "Philippines", passportCode: "PH", destination: "United States", destinationCode: "US", slug: "philippines-to-usa" },
  { passport: "Philippines", passportCode: "PH", destination: "Japan", destinationCode: "JP", slug: "philippines-to-japan" },
  { passport: "Philippines", passportCode: "PH", destination: "South Korea", destinationCode: "KR", slug: "philippines-to-south-korea" },
  { passport: "Philippines", passportCode: "PH", destination: "Canada", destinationCode: "CA", slug: "philippines-to-canada" },
  { passport: "Philippines", passportCode: "PH", destination: "Australia", destinationCode: "AU", slug: "philippines-to-australia" },
  // Chinese passport
  { passport: "China", passportCode: "CN", destination: "United States", destinationCode: "US", slug: "china-to-usa" },
  { passport: "China", passportCode: "CN", destination: "Japan", destinationCode: "JP", slug: "china-to-japan" },
  { passport: "China", passportCode: "CN", destination: "South Korea", destinationCode: "KR", slug: "china-to-south-korea" },
  { passport: "China", passportCode: "CN", destination: "United Kingdom", destinationCode: "GB", slug: "china-to-uk" },
  { passport: "China", passportCode: "CN", destination: "Australia", destinationCode: "AU", slug: "china-to-australia" },
  { passport: "China", passportCode: "CN", destination: "Canada", destinationCode: "CA", slug: "china-to-canada" },
  { passport: "China", passportCode: "CN", destination: "Thailand", destinationCode: "TH", slug: "china-to-thailand" },
  // Brazilian passport
  { passport: "Brazil", passportCode: "BR", destination: "United States", destinationCode: "US", slug: "brazil-to-usa" },
  { passport: "Brazil", passportCode: "BR", destination: "Canada", destinationCode: "CA", slug: "brazil-to-canada" },
  { passport: "Brazil", passportCode: "BR", destination: "United Kingdom", destinationCode: "GB", slug: "brazil-to-uk" },
  { passport: "Brazil", passportCode: "BR", destination: "Australia", destinationCode: "AU", slug: "brazil-to-australia" },
  { passport: "Brazil", passportCode: "BR", destination: "Japan", destinationCode: "JP", slug: "brazil-to-japan" },
  // US passport (outbound)
  { passport: "United States", passportCode: "US", destination: "China", destinationCode: "CN", slug: "usa-to-china" },
  { passport: "United States", passportCode: "US", destination: "India", destinationCode: "IN", slug: "usa-to-india" },
  { passport: "United States", passportCode: "US", destination: "Brazil", destinationCode: "BR", slug: "usa-to-brazil" },
  { passport: "United States", passportCode: "US", destination: "Russia", destinationCode: "RU", slug: "usa-to-russia" },
  { passport: "United States", passportCode: "US", destination: "Vietnam", destinationCode: "VN", slug: "usa-to-vietnam" },
  { passport: "United States", passportCode: "US", destination: "Australia", destinationCode: "AU", slug: "usa-to-australia" },
  { passport: "United States", passportCode: "US", destination: "Turkey", destinationCode: "TR", slug: "usa-to-turkey" },
  // UK passport (outbound)
  { passport: "United Kingdom", passportCode: "GB", destination: "United States", destinationCode: "US", slug: "uk-to-usa" },
  { passport: "United Kingdom", passportCode: "GB", destination: "Australia", destinationCode: "AU", slug: "uk-to-australia" },
  { passport: "United Kingdom", passportCode: "GB", destination: "India", destinationCode: "IN", slug: "uk-to-india" },
  { passport: "United Kingdom", passportCode: "GB", destination: "Canada", destinationCode: "CA", slug: "uk-to-canada" },
  { passport: "United Kingdom", passportCode: "GB", destination: "Turkey", destinationCode: "TR", slug: "uk-to-turkey" },
  // Mexican passport
  { passport: "Mexico", passportCode: "MX", destination: "United States", destinationCode: "US", slug: "mexico-to-usa" },
  { passport: "Mexico", passportCode: "MX", destination: "Canada", destinationCode: "CA", slug: "mexico-to-canada" },
  // Indonesian passport
  { passport: "Indonesia", passportCode: "ID", destination: "Japan", destinationCode: "JP", slug: "indonesia-to-japan" },
  { passport: "Indonesia", passportCode: "ID", destination: "South Korea", destinationCode: "KR", slug: "indonesia-to-south-korea" },
  { passport: "Indonesia", passportCode: "ID", destination: "Australia", destinationCode: "AU", slug: "indonesia-to-australia" },
  // Vietnamese passport
  { passport: "Vietnam", passportCode: "VN", destination: "Japan", destinationCode: "JP", slug: "vietnam-to-japan" },
  { passport: "Vietnam", passportCode: "VN", destination: "South Korea", destinationCode: "KR", slug: "vietnam-to-south-korea" },
  { passport: "Vietnam", passportCode: "VN", destination: "United States", destinationCode: "US", slug: "vietnam-to-usa" },
  // Bangladeshi passport
  { passport: "Bangladesh", passportCode: "BD", destination: "United States", destinationCode: "US", slug: "bangladesh-to-usa" },
  { passport: "Bangladesh", passportCode: "BD", destination: "United Kingdom", destinationCode: "GB", slug: "bangladesh-to-uk" },
  // South African passport
  { passport: "South Africa", passportCode: "ZA", destination: "United Kingdom", destinationCode: "GB", slug: "south-africa-to-uk" },
  { passport: "South Africa", passportCode: "ZA", destination: "United States", destinationCode: "US", slug: "south-africa-to-usa" },
  { passport: "South Africa", passportCode: "ZA", destination: "Australia", destinationCode: "AU", slug: "south-africa-to-australia" },
  // Egyptian passport
  { passport: "Egypt", passportCode: "EG", destination: "United States", destinationCode: "US", slug: "egypt-to-usa" },
  { passport: "Egypt", passportCode: "EG", destination: "United Kingdom", destinationCode: "GB", slug: "egypt-to-uk" },
  { passport: "Egypt", passportCode: "EG", destination: "Germany", destinationCode: "DE", slug: "egypt-to-germany" },
  // Colombian passport
  { passport: "Colombia", passportCode: "CO", destination: "United States", destinationCode: "US", slug: "colombia-to-usa" },
  { passport: "Colombia", passportCode: "CO", destination: "Canada", destinationCode: "CA", slug: "colombia-to-canada" },
  // Thai passport
  { passport: "Thailand", passportCode: "TH", destination: "Japan", destinationCode: "JP", slug: "thailand-to-japan" },
  { passport: "Thailand", passportCode: "TH", destination: "South Korea", destinationCode: "KR", slug: "thailand-to-south-korea" },
  { passport: "Thailand", passportCode: "TH", destination: "United Kingdom", destinationCode: "GB", slug: "thailand-to-uk" },
];

export function getCorridorBySlug(slug: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.slug === slug);
}
