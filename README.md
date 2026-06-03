# SmartBay 🏠

**SmartBay** est une application web de gestion locative intelligente, conçue pour les propriétaires immobiliers souhaitant gérer leurs locataires simplement et efficacement.

---

## ✨ Fonctionnalités clés

- **Gestion des locataires** — Ajout, modification et suppression de locataires avec toutes leurs informations (civilité, nom, téléphone, loyer, durée, date d'entrée et une avance optionnelle)
- **Reçus PDF automatiques** — Génération de reçus professionnels en un clic, et partageables
- **Alertes d'expiration** — Notifications visuelles pour les baux expirés ou bientôt à renouveler
- **Mode sombre** — Thème clair/sombre persistant selon les préférences de l'utilisateur
- **Dashboard PC** — Interface complète avec graphique, tableau des locataires et alertes
- **Responsive** — Version mobile optimisée avec navbar, et version PC avec sidebar

---

## 🛠 Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18    | Framework UI |
| Vite        | Bundler et dev server |
| Tailwind CSS v3 | Styling utilitaire |
| Lucide React | Icônes |
| Recharts | Graphique des revenus |
| Firebase | Gérer les données |

---

## 📁 Structure du projet

src/
├── components/
|   ├── FolderCard.jsx      # Carte locataire (version PC)
│   ├── Navbar.jsx          # Barre de navigation mobile (bas de page)
│   ├── PCHeader.jsx        # Header version PC (recherche, thème, alertes, Profil)
│   ├── Sidebar.jsx         # Sidebar fixe version PC
│   ├── TenantCard.jsx      # Carte locataire (version mobile)
│   └── TenantModal.jsx     # Modal ajout/modification locataire
├── pages/
│   ├── Dashboard.jsx       # Dashboard version mobile
│   ├── Landing.jsx         # Page d'accueil publique
│   ├── Login.jsx           # Page d'inscription
│   ├── Notifications.jsx   # Page alertes
│   ├── PCDashboard.jsx     # Dashboard version PC
│   ├── PCReceipts.jsx      # Page reçus version PC
│   ├── Register.jsx        # Page de connexion
│   ├── Settings.jsx        # Page paramètres
│   ├── TenantFolder.jsx            # Dossier locataire (version PC)
│   ├── TenantFolderDetail.jsx      # Détails des locataires (version PC)
│   └── Tenants.jsx         # Liste locataires (version mobile)
├── utils/
│   ├── auth.js             # Fonctions d'authentifications (email/password + nom)
│   ├── firestore.js        # Fonctions de données utilisateurs
│   ├── helpers.js          # Fonctions utilitaires (dates, nombres, etc.)
│   └── receipt.js          # Génération reçu HTML/PDF        
├── App.jsx                 # Composant racine + routing
├── firebase.js             # Gestion d'API
├── index.css               # Styles
└── main.jsx                # Point d'entrée React

---

## 🚀 Installation et lancement

### Prérequis
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Cloner le projet
git clone https://github.com/princejr-dev/smartbay.git
cd smartbay

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📱 Utilisation

### Version mobile
1. Ouvrir l'application sur smartphone
2. Cliquer sur **Commencer gratuitement** depuis la landing page
3. Créer votre compte via **S'inscrire**
4. Utiliser le bouton **+** central pour ajouter un locataire
5. Remplir les informations : civilité, nom, téléphone, loyer, durée, date de début
6. Générer un reçu PDF depuis la carte du locataire
7. Consulter les alertes via l'onglet **Alertes**

### Version PC
1. Naviguer via la **sidebar gauche**
2. Le **Dashboard** affiche les statistiques globales et le graphique des revenus
3. La page **Locataires** permet d'ajouter, modifier, supprimer et générer des reçus
4. La page **Dossier** affiche des cartes qui possèdent les informations des locataires
4. La page **Reçus** centralise tous les reçus générés en version cartes
5. Le **mode sombre** se toggle depuis le header PC

---

## 📄 Structure d'un reçu PDF

Chaque reçu généré contient :

- Numéro de reçu (ex: N°001)
- Civilité + Nom du locataire
- Téléphone (si renseigné)
- Durée de location
- Date d'entrée et date d'expiration
- Montant total en chiffres et en lettres
- Avance versée et reste à payer (si applicable)
- Fait à Douala, le [date du jour]
- Espace signature du propriétaire

---

## 🗺 Roadmap

- [x] Gestion CRUD des locataires
- [x] Génération reçus PDF
- [x] Alertes d'expiration
- [x] Mode sombre
- [x] Version PC avec sidebar et graphiques
- [x] Landing page
- [x] SEO (Open Graph, Twitter Card, Favicons)
- [x] Authentification Firebase (login/signup)
- [x] Synchronisation cloud des données
- [x] Dossier locataire (historique, reçus, statut)
- [ ] Étiquette chambre/boutique
- [ ] Numéro CNI locataire
- [ ] Outil d'enregistrement de signature
- [ ] Assistant IA intégré
- [ ] Application mobile native (Flutter)

---

## 🌍 Déploiement

L'application est déployée sur **Vercel** :

```bash
# Déploiement automatique via GitHub
# Chaque push sur master déclenche un nouveau déploiement
```

---

## 👨‍💻 Développement

### Conventions de code
- Composants React en **PascalCase** (ex: `TenantCard.jsx`)
- Utilitaires en **camelCase** (ex: `formatNumber`)
- Commentaires en **français**
- Classes Tailwind organisées : layout → spacing → colors → effects

### Ajouter une nouvelle page
1. Créer le fichier dans `src/pages/`
2. Ajouter la route dans `App.jsx` (mobile et PC)
3. Ajouter le lien dans `Navbar.jsx` (mobile) et `Sidebar.jsx` (PC)

---

## 📝 Licence MIT

Projet privé — © 2026 SmartBay. Tous droits réservés.

---

## 🙏 Remerciements

Développé par Prince Jr, Cameroun.
