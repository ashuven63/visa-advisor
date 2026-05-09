/**
 * Printable 4×6 inch photo-sheet generator.
 *
 * Tiles the user's compliant photo into a standard 4×6 photo print
 * (the universal drugstore / kiosk print size — Walgreens, CVS, Walmart,
 * Costco, FedEx Office all accept 4×6 uploads). Users download the PDF,
 * upload it to a photo-print service, pay ~$0.20–$0.50, and bring the
 * physical prints to their consulate.
 *
 * Why this matters: the savings vs. a passport-photo store ($15-20)
 * are dramatic, and "free spec check + low-cost printing path" is a
 * shareable value prop. Also a foundation for a paid print-and-ship
 * integration later (Lob / Cloudprinter / Printful).
 *
 * The component uses @react-pdf/renderer running in the browser (the
 * dependency is already used for the visa-advice PDF export, so no
 * bundle-size delta beyond this small file).
 */
"use client";

import {
  Document,
  Page,
  Image,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const PAGE_INCHES = { width: 4, height: 6 };
const MARGIN_INCHES = 0.1;
const POINTS_PER_INCH = 72; // PDF unit
const MM_PER_INCH = 25.4;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  meta: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    fontSize: 5,
    color: "#bbbbbb",
    fontFamily: "Helvetica",
  },
});

export interface PrintSheetPdfProps {
  /** Data URL or http(s) URL of the photo to tile. */
  photoSrc: string;
  /** Photo dimensions in mm (used to size each tile). */
  widthMm: number;
  heightMm: number;
  /** Country / document name shown in the small footer label. */
  documentLabel: string;
}

/**
 * React-PDF document tiling the photo into a 4×6" sheet.
 *
 * The grid sizing is computed from the spec dimensions, so a 35×45 mm
 * Schengen photo will tile differently from a 51×51 mm US passport
 * photo. A small footer label identifies the document type so users
 * can match prints to applications when handling several at once.
 */
export function PrintSheetPdf({
  photoSrc,
  widthMm,
  heightMm,
  documentLabel,
}: PrintSheetPdfProps) {
  const photoWidthIn = widthMm / MM_PER_INCH;
  const photoHeightIn = heightMm / MM_PER_INCH;

  const usableWidthIn = PAGE_INCHES.width - MARGIN_INCHES * 2;
  const usableHeightIn = PAGE_INCHES.height - MARGIN_INCHES * 2;

  // (n photos × photoSize) + ((n - 1) × gap) ≤ usable
  // → n ≤ (usable + gap) / (photoSize + gap)
  const cols = Math.max(
    1,
    Math.floor(
      (usableWidthIn + MARGIN_INCHES) / (photoWidthIn + MARGIN_INCHES),
    ),
  );
  const rows = Math.max(
    1,
    Math.floor(
      (usableHeightIn + MARGIN_INCHES) / (photoHeightIn + MARGIN_INCHES),
    ),
  );

  // Center the grid on the page.
  const gridWidthIn =
    cols * photoWidthIn + (cols - 1) * MARGIN_INCHES;
  const gridHeightIn =
    rows * photoHeightIn + (rows - 1) * MARGIN_INCHES;
  const offsetXIn = (PAGE_INCHES.width - gridWidthIn) / 2;
  const offsetYIn = (PAGE_INCHES.height - gridHeightIn) / 2;

  const totalPhotos = cols * rows;

  return (
    <Document>
      <Page
        size={{
          width: PAGE_INCHES.width * POINTS_PER_INCH,
          height: PAGE_INCHES.height * POINTS_PER_INCH,
        }}
        style={styles.page}
      >
        {Array.from({ length: totalPhotos }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const xIn =
            offsetXIn + col * (photoWidthIn + MARGIN_INCHES);
          const yIn =
            offsetYIn + row * (photoHeightIn + MARGIN_INCHES);
          return (
            <View
              key={i}
              style={{
                position: "absolute",
                left: xIn * POINTS_PER_INCH,
                top: yIn * POINTS_PER_INCH,
                width: photoWidthIn * POINTS_PER_INCH,
                height: photoHeightIn * POINTS_PER_INCH,
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={photoSrc} style={{ width: "100%", height: "100%" }} />
            </View>
          );
        })}

        <Text style={styles.meta} fixed>
          {documentLabel} · {widthMm}×{heightMm} mm · {cols}×{rows} grid ·
          visahint.com
        </Text>
      </Page>
    </Document>
  );
}
