import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  VisaAdviceResponseSchema,
  type VisaAdviceResponse,
  type VisaAdviceInput,
} from "@/lib/visa-advice/schema";
import { countryName } from "@/lib/countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EmailRequestSchema = z.object({
  email: z.string().email(),
  input: z.object({
    destination: z.string(),
    residence: z.string(),
    passports: z.array(z.string()),
    purpose: z.string(),
    days: z.number(),
    heldVisas: z.string(),
  }),
  data: VisaAdviceResponseSchema,
});

const VERDICT_LABEL: Record<string, string> = {
  not_required: "No visa required",
  voa: "Visa on arrival",
  eta: "Electronic travel authorization",
  evisa: "eVisa required",
  required: "Visa required",
};

function buildEmailHtml(input: VisaAdviceInput, data: VisaAdviceResponse): string {
  const dest = countryName(input.destination);
  const passport = input.passports.map(countryName).join(", ");
  const steps = data.steps
    .map((s, i) => `<li><strong>${s.title}</strong><br/>${s.detail}</li>`)
    .join("");
  const docs = data.documents
    .map(
      (d) =>
        `<li>${d.required ? "✅" : "◻️"} <strong>${d.name}</strong>${d.note ? ` — ${d.note}` : ""}</li>`,
    )
    .join("");
  const sources = data.citations
    .map((c) => `<li><a href="${c.url}">${c.title}</a></li>`)
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;line-height:1.6">
      <h1 style="color:#14b8a6">Visa Advisor — ${dest}</h1>
      <p><strong>Passport:</strong> ${passport} | <strong>Purpose:</strong> ${input.purpose} | <strong>Days:</strong> ${input.days}</p>
      <h2 style="color:#0d9488">${VERDICT_LABEL[data.verdict] ?? data.verdict}</h2>
      <p>${data.oneLineReason}</p>
      ${data.caveats.length > 0 ? `<h3>Caveats</h3><ul>${data.caveats.map((c) => `<li>${c}</li>`).join("")}</ul>` : ""}
      ${steps ? `<h3>Steps</h3><ol>${steps}</ol>` : ""}
      ${docs ? `<h3>Documents</h3><ul>${docs}</ul>` : ""}
      ${sources ? `<h3>Sources</h3><ul>${sources}</ul>` : ""}
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0"/>
      <p style="font-size:12px;color:#888">This is informational, not legal advice. Always verify with the official consulate. Your email was used only for this send and is not stored.</p>
    </div>
  `;
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email sending is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = EmailRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, input, data } = parsed.data;
  const dest = countryName(input.destination);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Visa Advisor <noreply@visa-advisor.app>",
    to: [email],
    subject: `Visa check: ${dest} — ${VERDICT_LABEL[data.verdict] ?? data.verdict}`,
    html: buildEmailHtml(input as VisaAdviceInput, data),
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send email.", detail: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent: true });
}
