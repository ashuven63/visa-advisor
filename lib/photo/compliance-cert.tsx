/**
 * Photo Compliance Certificate PDF.
 *
 * One-page Letter-size PDF generated after a successful photo check or
 * auto-fix. Contains:
 *   - The compliant photo at correct print size
 *   - The country/document spec the photo was checked against
 *   - The date and source URL the spec came from
 *   - A disclaimer (informational only — applicants must still meet
 *     the consulate's discretion at submission)
 *
 * Why this exists:
 *   - Trust artifact: users can hand this to a consulate clerk or save
 *     it alongside their application as evidence of pre-submission
 *     vetting.
 *   - Word-of-mouth: a tangible PDF with the VisaHint wordmark on top
 *     gets passed around in expat WhatsApp groups, Reddit posts, etc.
 *   - SEO/brand: every certificate has visahint.com on it; over time
 *     this seeds direct-traffic.
 *
 * The certificate makes no warranty — see the small-print disclaimer
 * at the bottom of the page. The point is "this photo matches the
 * dimensions, background and basic visual rules for X document," not
 * "this photo is guaranteed to be accepted."
 */
"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { CountryPhotoSpec } from "./types";
import { countryName } from "@/lib/countries";

const POINTS_PER_INCH = 72;

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottom: "1.5 solid #0d9488",
    paddingBottom: 12,
    marginBottom: 24,
  },
  brand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0d9488",
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 8,
    color: "#475569",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  certBlock: {
    textAlign: "right",
  },
  certTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  certIssued: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
  },
  body: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  photoColumn: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  photoCaption: {
    fontSize: 8,
    color: "#475569",
    fontStyle: "italic",
  },
  detailsColumn: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
  },
  intro: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  introBold: {
    fontFamily: "Helvetica-Bold",
  },
  specTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 4,
  },
  specRow: {
    flexDirection: "row",
    paddingTop: 4,
    paddingBottom: 4,
    borderBottom: "0.5 solid #e2e8f0",
  },
  specLabel: {
    width: 120,
    color: "#475569",
    fontSize: 10,
  },
  specValue: {
    flex: 1,
    fontSize: 10,
  },
  sourceLink: {
    color: "#0d9488",
    textDecoration: "none",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
    paddingTop: 12,
    borderTop: "0.5 solid #e2e8f0",
    fontSize: 8,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  footerStrong: {
    color: "#475569",
    fontFamily: "Helvetica-Bold",
  },
});

export interface ComplianceCertificatePdfProps {
  /** Data URL of the compliant photo (after fix, or the original if it passed). */
  photoSrc: string;
  /** Spec the photo was checked against. */
  spec: CountryPhotoSpec;
  /** Document name shown in the certificate body, e.g. "Passport", "Visa", "OCI". */
  documentName: string;
  /** Issue date (ISO 8601) — defaults to "now" when generated. */
  issuedAt?: string;
}

export function ComplianceCertificatePdf({
  photoSrc,
  spec,
  documentName,
  issuedAt,
}: ComplianceCertificatePdfProps) {
  const issued = new Date(issuedAt ?? Date.now());
  const issuedDisplay = issued.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const country = countryName(spec.country);

  // Print the photo at actual physical size on the certificate so the
  // recipient can verify dimensions visually (with a ruler, even).
  const photoWidthPt = (spec.widthMm / 25.4) * POINTS_PER_INCH;
  const photoHeightPt = (spec.heightMm / 25.4) * POINTS_PER_INCH;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>VISAHINT</Text>
            <Text style={styles.brandSub}>visahint.com</Text>
          </View>
          <View style={styles.certBlock}>
            <Text style={styles.certTitle}>Photo Compliance Certificate</Text>
            <Text style={styles.certIssued}>Issued {issuedDisplay}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.photoColumn}>
            <View
              style={{
                width: photoWidthPt,
                height: photoHeightPt,
                borderWidth: 0.5,
                borderColor: "#cbd5e1",
                borderStyle: "solid",
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={photoSrc} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={styles.photoCaption}>
              Photo at actual print size{"\n"}
              {spec.widthMm} × {spec.heightMm} mm
            </Text>
          </View>

          <View style={styles.detailsColumn}>
            <Text style={styles.intro}>
              The photo on the left has been checked against the official{" "}
              <Text style={styles.introBold}>
                {country} {documentName.toLowerCase()}
              </Text>{" "}
              photo specification and meets the dimensional, background,
              face-positioning and visual-quality criteria reviewed by VisaHint.
            </Text>

            <Text style={styles.specTitle}>Specification reviewed</Text>

            <View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Country</Text>
                <Text style={styles.specValue}>{country}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Document</Text>
                <Text style={styles.specValue}>{documentName}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Dimensions</Text>
                <Text style={styles.specValue}>
                  {spec.widthMm} × {spec.heightMm} mm ({spec.minWidthPx} ×{" "}
                  {spec.minHeightPx} px @ {spec.dpi} DPI)
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Background</Text>
                <Text style={styles.specValue}>
                  {spec.background}
                  {spec.backgroundHex ? ` (${spec.backgroundHex})` : ""}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Head height</Text>
                <Text style={styles.specValue}>
                  {spec.headSizePercent[0]}–{spec.headSizePercent[1]}% of frame
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Glasses</Text>
                <Text style={styles.specValue}>
                  {spec.glassesAllowed ? "Allowed" : "Not allowed"}
                </Text>
              </View>
              {spec.maxFileSizeBytes && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Max file size</Text>
                  <Text style={styles.specValue}>
                    {(spec.maxFileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                  </Text>
                </View>
              )}
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Source</Text>
                <Link src={spec.sourceUrl} style={styles.sourceLink}>
                  {hostnameOf(spec.sourceUrl)}
                </Link>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            <Text style={styles.footerStrong}>Disclaimer:</Text> This
            certificate confirms the photo matches the published specification
            on the date shown. It is informational only and does not guarantee
            acceptance — the issuing authority retains full discretion. Photo
            requirements can change; verify the official source before
            submission.{"\n"}
            <Text style={styles.footerStrong}>visahint.com</Text> · Free visa
            requirements and photo compliance check, with citations.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
