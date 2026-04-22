import { ImageResponse } from "next/og";
import { getCorridorBySlug } from "@/lib/corridors";

export const alt = "Visa requirements";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const corridor = getCorridorBySlug(slug);

  const passport = corridor?.passport ?? "Passport";
  const destination = corridor?.destination ?? "Destination";
  const passportCode = corridor?.passportCode ?? "??";
  const destinationCode = corridor?.destinationCode ?? "??";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0f1c 0%, #0f1f3d 50%, #102a4c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#5eead4",
            }}
          >
            VisaHint
          </div>
          <div style={{ fontSize: 20, opacity: 0.5 }}>·</div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>
            Do you need a visa?
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <CountryBadge code={passportCode} label={passport} />
            <div style={{ fontSize: 88, color: "#5eead4", lineHeight: 1 }}>
              →
            </div>
            <CountryBadge code={destinationCode} label={destination} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <div style={{ display: "flex" }}>
              Visa requirements, live wait times,
            </div>
            <div style={{ display: "flex" }}>
              and photo specs — with citations.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.7,
          }}
        >
          <span>visahint.com</span>
          <span>Official sources · Free</span>
        </div>
      </div>
    ),
    size,
  );
}

function CountryBadge({ code, label }: { code: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "140px",
          height: "100px",
          borderRadius: "20px",
          background: "rgba(94, 234, 212, 0.15)",
          border: "2px solid rgba(94, 234, 212, 0.4)",
          fontSize: 56,
          fontWeight: 700,
          color: "#5eead4",
          letterSpacing: "0.05em",
        }}
      >
        {code}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          maxWidth: "260px",
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
    </div>
  );
}
