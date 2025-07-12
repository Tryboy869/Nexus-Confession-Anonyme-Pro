# Confession Anonyme Pro – Version Légère 💌

## 📌 Présentation

**Confession Anonyme Pro** est une plateforme légère permettant d’envoyer des messages anonymes à n’importe qui, même sans que la personne ait un compte. Le message est transmis via un **email personnalisé**, et le destinataire peut y répondre anonymement via le site web.

Cette version a été pensée pour être **simple, rapide à déployer**, sans base de données complexe, avec une logique freemium intégrée dès le départ.

---

## ⚙️ Fonctionnalités actuelles (Version MVP)

- ✉️ **Envoi de messages anonymes par email** (via adresse unique)
- 💬 **Réception et réponse anonyme** via lien sécurisé (`/respond/[messageId]`)
- 📦 **Base de données simplifiée** via fichier JSON (pas de Supabase ou MongoDB)
- 🧠 **Templates de message** pour aider à formuler des textes bienveillants
- 💳 **Freemium** : 3 messages gratuits par semaine
- 💰 **Paiement via PayPal** : 5 messages pour 3$ avec code de recharge
- 🔐 **Aucune authentification requise** pour commencer

---

## 🔮 Vision à long terme

### 🧩 Phase 1 – Version légère (déjà en cours ✅)

> Objectif : fournir une version simple, utilisable dès maintenant, sans friction technique

- Email comme seul canal
- Base de données fichier (`db.json`)
- Envoi manuel ou automatique (Resend ou nodemailer)
- Paiement simple via PayPal + système de recharge via code unique
- Interface responsive (Next.js + Tailwind)

### 🚀 Phase 2 – Version intermédiaire (Freemium avancé + multi-canal)

> Objectif : ajouter plus de moyens d’envoi et structurer l’expérience utilisateur

- Ajout du canal WhatsApp et SMS (manuels ou via Twilio)
- Mise en place d’un vrai système de tokens/messagesLeft pour les utilisateurs
- Possibilité de créer un compte facultatif pour mieux gérer les messages envoyés/reçus
- Dashboard personnel pour journal intime (privé, non partagé)
- Système de parrainage intégré

### 🧠 Phase 3 – Plateforme complète avec IA & analytics

> Objectif : transformer la plateforme en assistant anonyme intelligent

- Analyse IA du ton (positif / constructif / toxique) avec HuggingFace
- Suggestions automatiques de réponse (IA générative)
- Analytics sur les messages (types, humeur, taux de réponse)
- Intégration d’un espace communautaire anonyme optionnel
- API publique pour intégration dans des apps tierces

---

## 🛠️ Stack technique

### Frontend
- **Next.js** – pour le rendu SSR rapide
- **React.js** – interface dynamique et modulaire
- **Tailwind CSS** – design rapide et responsive
- **TypeScript** – robustesse et sécurité

### Backend
- **Node.js (API Routes)** – logique serveur simple avec fichiers JSON
- **Nodemailer ou Resend** – envoi d’emails anonymes
- **PayPal SDK REST** – paiement sécurisé avec clé publique/privée
- **(Optionnel futur)** : Twilio, MongoDB, NextAuth, Zod...

---

## 🚀 Lancer le projet localement

```bash
git clone https://github.com/Tryboy869/Nexus-Confession-Anonyme-Pro
npm install
cp .env.local # puis configure les clés nécessaires

npm run dev


🌐 Liens importants

Live App (à venir) :

Email support : confession.anonyme.pro@gmail.com
