// Script à lancer manuellement depuis le terminal :
// node scripts/send-welcome.js

// ⚠️ Mets à jour ces infos avant chaque envoi
const VERSION = 'v1.0.1';
const SUBJECT = 'Bienvenue sur SmartBay !';
const TITLE = 'Bienvenue sur SmartBay !';
const BODY = `
    <p>Nous sommes ravis de vous accueillir sur <strong>SmartBay</strong>, votre application de gestion locative intelligente.</p>
    <p>Avec SmartBay, vous pouvez :</p>
    <ul style="padding-left:20px;">
      <li style="margin-bottom:8px;">📋 Gérer tous vos locataires en un seul endroit</li>
      <li style="margin-bottom:8px;">📄 Générer des reçus PDF professionnels en un clic</li>
      <li style="margin-bottom:8px;">🔔 Recevoir des alertes avant l'expiration des baux</li>
      <li style="margin-bottom:8px;">📊 Suivre vos revenus locatifs</li>
    </ul>
    <p>Commencez dès maintenant en ajoutant votre premier locataire !</p>
    <p>Merci de votre confiance,</p>
    <p style="margin-top:16px;">L'équipe SmartBay</p>
  </p>
`;

// 📧 Liste des emails de tes utilisateurs
// Tu devras les récupérer manuellement depuis Firebase Console
// Authentication → Users → exporter la liste
const EMAILS = [
  'mprincegame@gmail.com',
];

// 🔐 Ta clé admin (même valeur que ADMIN_SECRET_KEY sur Vercel)
const ADMIN_SECRET_KEY = '$martbay_owner_2026';

async function sendUpdate() {
  console.log(`📧 Envoi à ${EMAILS.length} utilisateurs...`);

  try {
    const res = await fetch('https://getsmartbay.vercel.app/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      subject: SUBJECT,
      title: TITLE,
      body: BODY,
      version: VERSION,
      emails: EMAILS,
      adminKey: ADMIN_SECRET_KEY,
      }),
    });

    const data = await res.json();

    if (data.success) {
      console.log(`✅ ${data.sent} emails envoyés avec succès !`);
    } else {
      console.error('❌ Erreur:', data.error);
    }
  } catch (err) {
    console.error('❌ Erreur réseau:', err.message);
  }
}

sendUpdate();