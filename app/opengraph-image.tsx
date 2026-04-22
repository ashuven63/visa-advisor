import { ImageResponse } from "next/og";

export const alt =
  "VisaHint — instant visa requirements with official citations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#5eead4",
          }}
        >
          VisaHint
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            <div style={{ display: "flex" }}>Do you need</div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span>a</span>
              <span style={{ color: "#5eead4" }}>visa</span>
              <span>for your</span>
            </div>
            <div style={{ display: "flex" }}>next trip?</div>
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.85,
              maxWidth: "900px",
              lineHeight: 1.3,
            }}
          >
            Instant answers with citations from official government sources.
            Plus a free photo compliance checker.
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
          <span>Free · No sign-up</span>
        </div>
      </div>
    ),
    size,
  );
}
