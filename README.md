# Immo Gestion — Dakar Immobilier

Application web de gestion immobilière destinée aux agences et administrateurs de biens au Sénégal. Elle permet de gérer les bâtiments, appartements, locataires, contrats de location et paiements depuis une interface unique.

## Stack technique

- **Backend** : Laravel 12 / PHP 8.2 — API REST avec authentification Sanctum
- **Frontend** : React 19 / TypeScript / Vite — SPA avec Tailwind CSS v4
- **Base de données** : PostgreSQL
- **PDF** : TCPDF (quittances de loyer)

## Architecture

```
immo-gestion/
├── app/                    # Backend Laravel
│   ├── Http/Controllers/Api/   # Contrôleurs API REST
│   ├── Models/                 # Modèles Eloquent
│   └── Services/               # QuittanceService
├── database/
│   ├── migrations/             # Schéma de base de données
│   └── seeders/                # Données de démonstration
├── routes/
│   └── api.php                 # Routes API
├── frontend-immo/          # Frontend React
│   └── src/
│       ├── pages/              # Pages par module
│       ├── components/         # Composants réutilisables
│       ├── services/           # Services API (axios)
│       ├── contexts/           # AuthContext
│       └── types/              # Interfaces TypeScript
```

## Rôles utilisateur

| Rôle | Accès |
|------|-------|
| **Administrateur** | Accès complet : agences, utilisateurs, rapports, alertes |
| **Agent** | Gestion courante scopée à son agence : bâtiments, appartements, locataires, locations, paiements |
| **Locataire** | Espace personnel : contrat, paiements, notifications, quittances |

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

# Configurer la base de données dans .env
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### Frontend

```bash
cd frontend-immo
npm install
npm run dev
```

## Configuration

Variables d'environnement importantes (`.env`) :

```
DB_CONNECTION=pgsql
DB_DATABASE=immo_db

FRONTEND_URL=http://localhost:5173
SANCTUM_TOKEN_EXPIRATION=480
```

## Comptes de démonstration

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@immo.sn | password | Administrateur |
| agent@immo.sn | password | Agent |
| locataire@immo.sn | password | Locataire |

## Licence

Projet universitaire — Licence 3 Informatique.
