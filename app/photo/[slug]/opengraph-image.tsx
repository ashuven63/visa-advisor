import { ImageResponse } from "next/og";
import { getPhotoCorridorBySlug } from "@/lib/photo-corridors";

export const alt = "Passport/visa photo requirements";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const corridor = getPhotoCorridorBySlug(slug);

  const name = corridor?.name ?? "Photo";
  const dimensions = corridor?.dimensions ?? "";
  const background = corridor?.background ?? "";
  const countryCode = corridor?.countryCode ?? "??";

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
            Free photo compliance check
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
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
              {countryCode}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              <div style={{ display: "flex" }}>{name}</div>
              <div style={{ display: "flex" }}>photo requirements</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: 32,
              opacity: 0.85,
            }}
          >
            {dimensions && <div>Size: {dimensions}</div>}
            {background && <div>Background: {background}</div>}
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
          <span>Instant AI auto-fix · Free</span>
        </div>
      </div>
    ),
    size,
  );
}
