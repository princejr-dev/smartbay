import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function emailTemplate({ title, body, buttonText, buttonUrl }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">
              <img src="https://getsmartbay.vercel.app/favicon.png" alt="SmartBay" width="50" style="display:block;margin:0 auto 16px;border-radius:12px;">
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px;">${title}</h2>
              <div style="color:#555;font-size:15px;line-height:1.8;">${body}</div>
              ${buttonText && buttonUrl ? `
              <div style="text-align:center;margin:32px 0 0;">
                <a href="${buttonUrl}" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                  ${buttonText}
                </a>
              </div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="background:#f8f8f8;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                © 2026 SmartBay — Gestion locative intelligente<br>
                Douala, Cameroun<br><br>
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifie la clé secrète admin pour sécuriser l'endpoint
  const { subject, title, body, version, emails, adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  if (!subject || !title || !body || !emails?.length) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    // Envoie par batch de 50
    const chunks = [];
    for (let i = 0; i < emails.length; i += 50) {
      chunks.push(emails.slice(i, i + 50));
    }

    let sent = 0;
    for (const chunk of chunks) {
      await Promise.all(chunk.map(email =>
        resend.emails.send({
          from: 'SmartBay <onboarding@resend.dev>',
          to: email,
          subject,
          html: emailTemplate({
            title,
            body: `${body}${version ? `<p style="margin-top:16px;padding:12px;background:#f0f4ff;border-radius:8px;font-size:13px;color:#667eea;"><strong>Version :</strong> ${version}</p>` : ''}`,
            buttonText: 'Voir les nouveautés',
            buttonUrl: 'https://getsmartbay.vercel.app',
          }),
        })
      ));
      sent += chunk.length;
    }

    return res.status(200).json({ success: true, sent });
  } catch (err) {
    console.error('Erreur envoi mise à jour:', err);
    return res.status(500).json({ error: 'Erreur envoi emails' });
  }
}