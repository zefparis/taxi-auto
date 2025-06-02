# Taxi-Express RDC

Une plateforme de taxi automatisée moderne pour la République Démocratique du Congo (RDC), avec un design premium (dark mode, Tailwind), matching IA, paiement local, support client IA, scalable et multilingue.

## Architecture Monorepo

```
taxi-express/
├── frontend/             # Next.js + Tailwind (React 18+)
├── backend/              # Node.js + Express + Prisma + Swagger
├── shared/               # Typescript types, utilitaires, helpers partagés
├── docs/                 # Documentation technique, business, API, schémas
└── infrastructure/       # Scripts, configs Docker, CI/CD, déploiement
```

## Spécifications Fonctionnelles

### Clients
- Inscription/login (JWT + refresh token)
- Réservation course (adresse, géoloc live)
- Visualisation du chauffeur sur carte, ETA temps réel (Mapbox/Leaflet + Socket.IO)
- Chat direct chauffeur-client (Socket.IO)
- Paiement : mobile money (UniPesa, Orange, Airtel, Africell), CB, wallet interne
- Historique courses, favoris, notes
- Interface responsive et dark mode par défaut

### Chauffeurs
- Inscription/validation docs (upload), gestion de profil
- Dashboard : demandes, stats, revenus, notifications
- Acceptation/refus courses, navigation optimisée
- Retrait gains mobile money, système de réputation

### Admin
- Dashboard analytique (stats en temps réel, heatmaps courses)
- Gestion utilisateurs/chauffeurs (vérif, blocage, activation)
- Gestion litiges, support, résolution incidents
- Rapports financiers, commissions, exports
- Console support OpenAI/IA

## Modules & Services Techniques

- **Matching IA** : Algo de répartition basé sur distance, note, disponibilité, historiques
- **Pricing IA** : Estimation dynamique selon distance, trafic, heure, historique
- **Notifications** : Push (Web, PWA), SMS, emails transactionnels (Twilio/API locale)
- **Paiement** : Intégration UniPesa (API), fallback Stripe/PayDunya possible
- **Temps réel** : Socket.IO pour suivi course/chat/matching
- **IA support** : OpenAI assistant (chat client, analyse incidents, suggestions proactives)
- **Détection fraude** : Pattern annulation, multi-compte, géoloc suspecte, scoring automatique

## Stack Technique

### Frontend
- Framework : Next.js (React 18+)
- UI : Tailwind CSS, dark mode natif, animations Framer Motion
- Cartographie : Mapbox GL ou Leaflet.js
- State/data : Context API + React Query
- Auth : JWT + refresh, pages publiques/privées
- Multilingue : FR, EN, Lingala, Swahili (i18n)
- Pages : login, dashboard, réservation, suivi live, historique, paiement, support, admin

### Backend
- Node.js + Express
- ORM : Prisma (PostgreSQL)
- Auth : JWT (access + refresh), gestion des rôles, middleware sécurisés
- API : RESTful, versionnée, doc Swagger auto
- Services : matching, pricing, notification, paiement, chat, IA, admin
- Sockets : Socket.IO
- Tests : Jest, Supertest, coverage min 80%

### Infrastructure & DevOps
- CI/CD : GitHub Actions (test/build/deploy auto)
- Déploiement : Vercel (frontend), Railway/Render (backend), Netlify (optionnel)
- Env : .env, gestion secrets cloud, Dockerfile, scripts seed DB, backup
- Monitoring : Sentry (frontend), Prometheus/Grafana (backend)
- Logs : Winston/Morgan (backend), export CSV/PDF

## Roadmap de Réalisation

1. Initialisation repo monorepo, structure dossiers
2. Setup backend : Express, Prisma, auth JWT, doc Swagger
3. Setup frontend : Next.js, Tailwind, dark mode, pages bases
4. Connexion carto temps réel (Mapbox/Leaflet + Socket.IO)
5. Implémentation matching IA + pricing dynamique
6. Intégration paiements UniPesa sandbox
7. Module chat Socket.IO, notifications push/SMS
8. Dashboard admin, reporting
9. Implémentation IA support (OpenAI, modération, analyse incidents)
10. Tests automatisés, coverage
11. CI/CD, Docker, déploiement Railway/Vercel
12. Tests terrain RDC, feedback, itérations

## Livrables attendus

- Plateforme opérationnelle : web, mobile responsive
- API RESTful sécurisée, doc Swagger, endpoints testés
- UI/UX premium, dark mode, mobile-first
- Module paiement mobile money, admin, reporting
- Assistant IA fonctionnel pour support client et admin
- Documentation technique et business complète
- Scripts de déploiement, Docker, seed DB

## Avantages stratégiques

- Design moderne, expérience premium locale
- IA native, automatisation, zero intervention manuelle
- Paiement mobile local, conformité RDC
- Scalable, modulaire, ouvert pour extensions (livraison, e-commerce)
- Adapté cloud (Railway, Vercel, Render, Netlify, on-prem RDC possible)

## Installation et Démarrage

Instructions à venir lors de l'initialisation du projet.

## Licence

Propriétaire - Tous droits réservés
