import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template email réutilisable
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
              <h1 style="color:white;font-size:28px;margin:0;letter-spacing:2px;">SmartBay</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Gestion locative intelligente</p>
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
                © 2025 SmartBay — Gestion locative intelligente<br>
                Douala, Cameroun<br><br>
                <a href="https://getsmartbay.vercel.app" style="color:#667eea;text-decoration:none;">getsmartbay.vercel.app</a>
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
  // Accepte uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, displayName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  try {
    await resend.emails.send({
      from: 'SmartBay <onboarding@resend.dev>',
      to: email,
      subject: '🎉 Bienvenue sur SmartBay !',
      html: emailTemplate({
        title: `Bienvenue ${displayName || ''} !`,
        body: `
          <p>Nous sommes ravis de vous accueillir sur <strong>SmartBay</strong>, votre application de gestion locative intelligente.</p>
          <p>Avec SmartBay, vous pouvez :</p>
          <ul style="padding-left:20px;">
            <li style="margin-bottom:8px;">📋 Gérer tous vos locataires en un seul endroit</li>
            <li style="margin-bottom:8px;">📄 Générer des reçus PDF professionnels en un clic</li>
            <li style="margin-bottom:8px;">🔔 Recevoir des alertes avant l'expiration des baux</li>
            <li style="margin-bottom:8px;">📊 Suivre vos revenus locatifs</li>
          </ul>
          <p>Commencez dès maintenant en ajoutant votre premier locataire !</p>
        `,
        buttonText: 'Accéder à SmartBay',
        buttonUrl: 'https://getsmartbay.vercel.app',
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur email bienvenue:', err);
    return res.status(500).json({ error: 'Erreur envoi email' });
  }
}