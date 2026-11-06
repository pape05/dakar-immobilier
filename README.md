# Dakar Immobilier

Application web de gestion immobilière destinée aux agences et administrateurs de biens au Sénégal. Elle permet de gérer les bâtiments, appartements, locataires, contrats de location et paiements depuis une interface unique, moderne et sécurisée.

## Fonctionnalités principales

- **Gestion des biens** — Bâtiments et appartements avec photos, superficies, états (libre / occupé / en travaux)
- **Gestion des locataires** — Fiches locataires avec pièce d'identité, création automatique de compte utilisateur
- **Contrats de location** — Création, suivi, résiliation avec mise à jour automatique de l'état des appartements
- **Paiements et quittances** — Enregistrement des paiements, suivi des impayés, génération de quittances PDF
- **Tableau de bord** — Statistiques en temps réel : revenus mensuels, taux d'occupation, paiements en attente
- **Rapports et exports** — Rapports revenus, occupation, impayés avec export CSV
- **Alertes intelligentes** — Loyers en retard, contrats expirant bientôt, taux d'occupation faible
- **Espace locataire** — Interface dédiée pour consulter son contrat, ses paiements et télécharger ses quittances
- **Multi-agences** — Chaque agent ne voit que les données de son agence (isolation des données)
- **Sécurité** — Authentification par token (Sanctum), changement de mot de passe obligatoire à la première connexion

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Backend** | Laravel 12 / PHP 8.2 — API REST |
| **Authentification** | Laravel Sanctum (tokens Bearer) |
| **Frontend** | React 19 / TypeScript / Vite |
| **UI** | Tailwind CSS v4, Framer Motion, Phosphor Icons |
| **Base de données** | PostgreSQL |
| **PDF** | TCPDF (quittances de loyer) |
| **Tests** | PHPUnit (62 tests / 148 assertions) |

## Architecture

```
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # 13 contrôleurs API REST
│   │   └── Middleware/         # CheckRole (contrôle d'accès par rôle)
│   ├── Models/                 # 7 modèles Eloquent
│   └── Services/               # QuittanceService (génération PDF)
├── database/
│   ├── migrations/             # 12 migrations
│   └── seeders/                # 7 seeders (données de démonstration)
├── routes/
│   └── api.php                 # Routes API groupées par rôle
├── tests/Feature/Api/          # Tests d'intégration API
└── frontend-immo/
    └── src/
        ├── pages/              # 30+ pages organisées par module
        ├── components/         # Composants réutilisables (Logo, Table, ProtectedRoute...)
        ├── services/           # 7 services API (axios)
        ├── contexts/           # AuthContext (gestion de session)
        └── types/              # Interfaces TypeScript
```

## Rôles utilisateur

| Rôle | Accès |
|------|-------|
| **Administrateur** | Accès complet : agences, utilisateurs, rapports, alertes, paramètres |
| **Agent** | Gestion courante scopée à son agence : bâtiments, appartements, locataires, locations, paiements |
| **Locataire** | Espace personnel : contrat, historique des paiements, notifications, quittances PDF |

## Installation

### Prérequis

- PHP 8.2+, Composer
- Node.js 18+, npm
- PostgreSQL

### Backend

```bash
composer install
cp .env.example .env
php artisan key:generate

# Configurer la base de données dans .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
php artisan migrate
php artisan db:seed        # Charge les données de démonstration
php artisan storage:link
php artisan serve          # http://localhost:8000
```

### Frontend

```bash
cd frontend-immo
npm install
npm run dev                # http://localhost:5173
```

### Tests

```bash
php artisan test
```

## Configuration

Variables d'environnement importantes (`.env`) :

```env
DB_CONNECTION=pgsql
DB_DATABASE=immo_db

FRONTEND_URL=http://localhost:5173
SANCTUM_TOKEN_EXPIRATION=480      # Durée du token en minutes (8h par défaut)
```

## Comptes de démonstration

Après `php artisan db:seed` :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@immo.sn | password | Administrateur |
| agent@immo.sn | password | Agent |
| locataire@immo.sn | password | Locataire |

> Les comptes locataires ont `must_change_password: true` — un changement de mot de passe sera demandé à la première connexion.

## API REST

Les endpoints sont organisés par rôle dans `routes/api.php` :

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/login` | Public | Authentification |
| GET | `/api/dashboard` | Auth | Tableau de bord |
| GET/POST/PUT/DELETE | `/api/batiments` | Admin, Agent | CRUD bâtiments |
| GET/POST/PUT/DELETE | `/api/appartements` | Admin, Agent | CRUD appartements |
| GET/POST/PUT/DELETE | `/api/locataires` | Admin, Agent | CRUD locataires |
| GET/POST/PUT/DELETE | `/api/locations` | Admin, Agent | CRUD contrats |
| GET/POST/PUT/DELETE | `/api/paiements` | Admin, Agent | CRUD paiements |
| GET | `/api/paiements/{id}/quittance` | Admin, Agent | Quittance PDF |
| GET/POST/PUT/DELETE | `/api/users` | Admin | CRUD utilisateurs |
| GET | `/api/rapports/*` | Admin | Rapports et exports |
| GET | `/api/alertes` | Admin, Agent | Alertes |
| GET | `/api/mon-espace` | Locataire | Espace locataire |
| GET | `/api/mon-espace/quittance/{id}` | Locataire | Quittance PDF |

## Licence

Projet universitaire — Licence 3 Informatique.
