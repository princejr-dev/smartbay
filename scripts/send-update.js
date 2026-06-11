// Script à lancer manuellement depuis le terminal :
// node scripts/send-update.js

// ⚠️ Mets à jour ces infos avant chaque envoi
const VERSION = 'v1.0.1';
const SUBJECT = '🚀 SmartBay — Mise à jour disponible !';
const TITLE = 'Mise à jour disponible';
const BODY = `
  <p>Bonjour,</p>
  <p>Une nouvelle mise à jour de SmartBay est désormais disponible.</p>
  <p>Cette version apporte des améliorations importantes pour rendre votre 
  expérience plus fluide, plus rapide et plus fiable au quotidien.</p>
  <p>Voici un aperçu des nouveautés :</p>
  <ul style="padding-left:20px;">
    <li style="margin-bottom:8px;">Optimisation des performances générales de la plateforme</li>
    <li style="margin-bottom:8px;">Amélioration de l'interface utilisateur</li>
    <li style="margin-bottom:8px;">Corrections de bugs</li>
    <li style="margin-bottom:8px;">Mise à jour des dépendances pour plus de sécurité</li>
  </ul>
    <p>Nous vous invitons à vous connecter dès maintenant pour découvrir ces améliorations et 
    continuer à gérer vos locataires en toute simplicité.</p>
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
    const res = await fetch('https://getsmartbay.vercel.app/api/send-update', {
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