import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { VisaAdviceResponse } from "@/lib/visa-advice/schema";
import type { VisaAdviceInput } from "@/lib/visa-advice/schema";
import { countryName } from "@/lib/countries";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", lineHeight: 1.5 },
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  h2: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 6 },
  verdict: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 2 },
  label: { fontFamily: "Helvetica-Bold", width: 100 },
  val: { flex: 1 },
  li: { flexDirection: "row", marginBottom: 4, gap: 6 },
  num: { fontFamily: "Helvetica-Bold", width: 16 },
  caveat: { color: "#92400e", marginBottom: 2 },
  footer: { marginTop: 24, paddingTop: 8, borderTop: "1 solid #e5e5e5", fontSize: 8, color: "#888" },
  link: { color: "#0d9488" },
});

const VERDICT_LABEL: Record<string, string> = {
  not_required: "No visa required",
  voa: "Visa on arrival",
  eta: "Electronic travel authorization",
  evisa: "eVisa required",
  required: "Visa required",
};

export function VisaAdvicePdf({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Visa Advisor — Results</Text>

        {/* Trip summary */}
        <View style={styles.row}>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.val}>{countryName(input.destination)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Passport</Text>
          <Text style={styles.val}>
            {input.passports.map(countryName).join(", ")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Residence</Text>
          <Text style={styles.val}>{countryName(input.residence)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.val}>
            {input.purpose === "tourist" ? "Tourism" : "Transit"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Days</Text>
          <Text style={styles.val}>{input.days}</Text>
        </View>

        {/* Verdict */}
        <Text style={styles.h2}>Verdict</Text>
        <Text style={styles.verdict}>
          {VERDICT_LABEL[data.verdict] ?? data.verdict}
        </Text>
        <Text>{data.oneLineReason}</Text>
        <Text>Confidence: {data.confidence}</Text>

        {/* Caveats */}
        {data.caveats.length > 0 && (
          <>
            <Text style={styles.h2}>Caveats</Text>
            {data.caveats.map((c, i) => (
              <Text key={i} style={styles.caveat}>
                • {c}
              </Text>
            ))}
          </>
        )}

        {/* Steps */}
        {data.steps.length > 0 && (
          <>
            <Text style={styles.h2}>Steps</Text>
            {data.steps.map((s, i) => (
              <View key={i} style={styles.li}>
                <Text style={styles.num}>{i + 1}.</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    {s.title}
                  </Text>
                  <Text>{s.detail}</Text>
                  {s.url && (
                    <Link src={s.url} style={styles.link}>
                      <Text>{s.url}</Text>
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Documents */}
        {data.documents.length > 0 && (
          <>
            <Text style={styles.h2}>Documents</Text>
            {data.documents.map((d, i) => (
              <View key={i} style={styles.li}>
                <Text style={styles.num}>
                  {d.required ? "✓" : "○"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    {d.name}
                    {d.required ? "" : " (optional)"}
                  </Text>
                  {d.note && <Text>{d.note}</Text>}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Sources */}
        {data.citations.length > 0 && (
          <>
            <Text style={styles.h2}>Sources</Text>
            {data.citations.map((c, i) => (
              <Link key={i} src={c.url} style={styles.link}>
                <Text>
                  {c.title} ({c.url})
                </Text>
              </Link>
            ))}
          </>
        )}

        {/* Disclaimer footer */}
        <View style={styles.footer}>
          <Text>
            This is informational, not legal advice. Always verify with the
            official consulate before you book or apply. Your inputs and photos
            are not stored.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
