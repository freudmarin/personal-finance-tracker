// supabase/functions/send-confirmation-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// We only need RESEND_API_KEY and APP_BASE_URL for this hook.
// Supabase already generates the token/hash and metadata in the hook payload.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const APP_BASE_URL = Deno.env.get("APP_BASE_URL") ?? "http://localhost:5173";

type Language = "en" | "sq";

// Payload shape for Supabase "Send Email" hooks (user.signup, etc.)
// See: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
interface SendEmailHookPayload {
  // Primary payload shape used by the Send Email hook
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      language?: Language;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  email_data?: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type?: string; // e.g. "signup"
    site_url?: string;
    token_new?: string;
    token_hash_new?: string;
    old_email?: string;
    old_phone?: string;
    provider?: string;
    factor_type?: string;
    [key: string]: any;
  } | null;

  // Legacy / alternative shapes (kept for forward compatibility, but
  // not required for the current Send Email hook payload).
  type?: string;
  record?: {
    id: string;
    email: string;
    user_metadata?: {
      language?: Language;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  properties?: {
    action_link?: string | null;
    token?: string | null;
    [key: string]: any;
  } | null;
}

function jsonError(status: number, message: string): Response {
  return new Response(
    JSON.stringify({
      error: {
        http_code: status,
        message,
      },
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  let payload: SendEmailHookPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON payload");
  }

  // Prefer explicit `user` from Send Email hook; fall back to `record` if present
  const user = payload.user ?? payload.record;
  if (!user || !user.email) {
    console.error("Missing user or email in send-email hook payload", payload);
    return jsonError(400, "Missing user/email in hook payload");
  }

  // Read language from user metadata (default to English)
  const language: Language = (user.user_metadata?.language as Language) || "en";
  const email = user.email;

  const emailData = payload.email_data;
  if (!emailData) {
    console.error("Missing email_data in send-email hook payload", payload);
    return jsonError(400, "Missing email_data in hook payload");
  }

  // Build a confirmation URL that points to the frontend, which will
  // complete verification using supabase.auth.verifyOtp with the
  // token_hash and type from the query string.
  let confirmationUrl: string | undefined;

  if (emailData.token_hash && emailData.email_action_type) {
    try {
      const url = new URL(APP_BASE_URL);
      // This route is handled by the SPA and will call verifyOtp.
      url.pathname = "/auth/confirmed";
      url.searchParams.set("token_hash", emailData.token_hash);
      url.searchParams.set("type", emailData.email_action_type);
      confirmationUrl = url.toString();
    } catch (e) {
      console.error("Error building confirmation URL", e);
      return jsonError(500, "Failed to build confirmation URL");
    }
  }

  // As a last resort, fall back to redirect_to if present so the
  // email at least contains a clickable link.
  if (!confirmationUrl && emailData.redirect_to) {
    confirmationUrl = emailData.redirect_to;
  }

  if (!confirmationUrl) {
    console.error("No confirmation URL could be built from hook payload", payload);
    return jsonError(500, "Failed to generate confirmation link");
  }

  console.log(`Processing signup for ${email} with language: ${language}`);

  try {
    // Build localized email using the confirmation URL from the hook payload
    const { subject, html } = buildEmail(language, confirmationUrl, email);

    // 4) Send email via Resend HTTP API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Personal Finance Tracker <noreply@personal-finances.app>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const body = await resendResponse.text();
      console.error("Resend error:", resendResponse.status, body);
      return jsonError(502, "Failed to send email via Resend");
    }

    const resendData = await resendResponse.json();
    console.log("Email sent successfully:", resendData);
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error", err);
    return jsonError(500, "Internal error in send-email hook");
  }
});

function buildEmail(
  language: Language,
  confirmationUrl: string,
  email: string
): { subject: string; html: string } {
  if (language === "sq") {
    // Albanian template
    const subject = "Konfirmoni adresën tuaj të emailit";
    const html = `
<!doctype html>
<html lang="sq">
  <head>
    <meta charset="utf-8" />
    <title>Konfirmoni emailin</title>
  </head>
  <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#0f172a; color:#e5e7eb; padding:24px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#020617;border-radius:12px;border:1px solid #1f2937;">
      <tr>
        <td style="padding:24px 24px 8px 24px;">
          <h1 style="font-size:24px;margin:0 0 12px 0;color:#e5e7eb;">Mirë se erdhët në Personal Finance Tracker 👋</h1>
          <p style="margin:0 0 12px 0;color:#9ca3af;">
            Për të përfunduar krijimin e llogarisë për <strong>${email}</strong>, ju lutem konfirmoni adresën tuaj të emailit duke klikuar butonin më poshtë.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 16px 24px; text-align:center;">
          <a href="${confirmationUrl}"
             style="display:inline-block;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;margin-top:8px;">
            Konfirmo emailin
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;color:#6b7280;font-size:14px;">
          <p style="margin:16px 0 8px 0;">
            Nëse butoni nuk funksionon, kopjoni dhe ngjisni këtë link në shfletuesin tuaj:
          </p>
          <p style="word-break:break-all;margin:0 0 16px 0;">
            <a href="${confirmationUrl}" style="color:#60a5fa;">${confirmationUrl}</a>
          </p>
          <p style="margin:0;">
            Nëse nuk e keni kërkuar ju këtë email, mund ta injoroni.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    return { subject, html };
  }

  // English template (default)
  const subject = "Confirm your email address";
  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Confirm your email</title>
  </head>
  <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#0f172a; color:#e5e7eb; padding:24px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#020617;border-radius:12px;border:1px solid #1f2937;">
      <tr>
        <td style="padding:24px 24px 8px 24px;">
          <h1 style="font-size:24px;margin:0 0 12px 0;color:#e5e7eb;">Welcome to Personal Finance Tracker 👋</h1>
          <p style="margin:0 0 12px 0;color:#9ca3af;">
            To finish creating your account for <strong>${email}</strong>, please confirm your email address by clicking the button below.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 16px 24px; text-align:center;">
          <a href="${confirmationUrl}"
             style="display:inline-block;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;margin-top:8px;">
            Confirm email
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;color:#6b7280;font-size:14px;">
          <p style="margin:16px 0 8px 0;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="word-break:break-all;margin:0 0 16px 0;">
            <a href="${confirmationUrl}" style="color:#60a5fa;">${confirmationUrl}</a>
          </p>
          <p style="margin:0;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return { subject, html };
}
