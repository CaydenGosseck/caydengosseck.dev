// Shared HTML email template utilities
// Email clients don't support CSS variables — hardcoded tokens only

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export const C = {
    bg: "#0d0010",
    card: "#130018",
    border: "#f0e8d8",
    fg: "#f0e8d8",
    primary: "#859ddb",
    accent: "#8b1c30",
    muted: "#7a7070",
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caydengosseck.dev";

export function emailShell(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <a href="${BASE_URL}" style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.primary};text-decoration:none;">
                caydengosseck.dev
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">
                caydengosseck.dev
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
    return `<a href="${href}" style="display:inline-block;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:${C.fg};background:transparent;border:1px solid ${C.border};padding:10px 20px;text-decoration:none;border-radius:2px;">${label}</a>`;
}

export function emailDivider(): string {
    return `<tr><td style="padding:24px 0;"><div style="height:1px;background:${C.border};opacity:0.2;"></div></td></tr>`;
}
