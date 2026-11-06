# Structure du Frontend React - Gestion Immobilière

## 📁 Architecture des dossiers

```
src/
├── pages/                      # Pages de l'application
│   ├── auth/                  # Pages d'authentification
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── dashboard/             # Page tableau de bord
│   │   └── Dashboard.tsx
│   ├── batiments/             # Pages bâtiments
│   │   ├── BatimentsList.tsx
│   │   ├── BatimentCreate.tsx
│   │   ├── BatimentEdit.tsx
│   │   └── BatimentDetail.tsx
│   ├── appartements/          # Pages appartements
│   │   ├── AppartementsList.tsx
│   │   ├── AppartementCreate.tsx
│   │   ├── AppartementEdit.tsx
│   │   └── AppartementDetail.tsx
│   ├── locataires/            # Pages locataires
│   │   ├── LocatairesList.tsx
│   │   ├── LocataireCreate.tsx
│   │   ├── LocataireEdit.tsx
│   │   └── LocataireDetail.tsx
│   ├── locations/             # Pages locations
│   │   ├── LocationsList.tsx
│   │   ├── LocationCreate.tsx
│   │   ├── LocationEdit.tsx
│   │   └── LocationDetail.tsx
│   ├── paiements/             # Pages paiements
│   │   ├── PaiementsList.tsx
│   │   ├── PaiementCreate.tsx
│   │   ├── PaiementEdit.tsx
│   │   ├── PaiementDetail.tsx
│   │   └── HistoriquePaiements.tsx
│   ├── users/                 # Pages utilisateurs (Admin)
│   │   ├── UsersList.tsx
│   │   ├── UserCreate.tsx
│   │   └── UserEdit.tsx
│   ├── agences/               # Pages agences (Admin)
│   │   ├── AgencesList.tsx
│   │   ├── AgenceCreate.tsx
│   │   └── AgenceEdit.tsx
│   └── errors/                # Pages d'erreur
│       ├── NotFound.tsx       # 404
│       ├── Forbidden.tsx      # 403
│       └── ServerError.tsx    # 500
│
├── components/                 # Composants réutilisables
│   ├── common/                # Composants communs
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   ├── Loader.tsx
│   │   ├── Alert.tsx
│   │   ├── Badge.tsx
│   │   └── Breadcrumb.tsx
│   └── layout/                # Composants de mise en page
│       ├── MainLayout.tsx
│       ├── Sidebar.tsx
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── services/                   # Services API
│   ├── api.ts                 # Configuration Axios
│   ├── authService.ts         # Login, Register, Logout
│   ├── batimentService.ts     # CRUD Bâtiments
│   ├── appartementService.ts  # CRUD Appartements
│   ├── locataireService.ts    # CRUD Locataires
│   ├── locationService.ts     # CRUD Locations
│   ├── paiementService.ts     # CRUD Paiements + Quittance
│   ├── userService.ts         # CRUD Users (Admin)
│   ├── agenceService.ts       # CRUD Agences (Admin)
│   └── dashboardService.ts    # Statistiques Dashboard
│
├── hooks/                      # Custom Hooks
│   ├── useAuth.ts             # Hook authentification
│   ├── useBatiments.ts        # Hook pour bâtiments
│   ├── useAppartements.ts     # Hook pour appartements
│   ├── useLocataires.ts       # Hook pour locataires
│   ├── useLocations.ts        # Hook pour locations
│   ├── usePaiements.ts        # Hook pour paiements
│   └── useDashboard.ts        # Hook pour dashboard
│
├── contexts/                   # Contexts React
│   └── AuthContext.tsx        # Context d'authentification
│
├── types/                      # Types TypeScript
│   ├── index.ts               # Export de tous les types
│   ├── auth.ts                # Types auth
│   ├── batiment.ts            # Types bâtiment
│   ├── appartement.ts         # Types appartement
│   ├── locataire.ts           # Types locataire
│   ├── location.ts            # Types location
│   └── paiement.ts            # Types paiement
│
├── utils/                      # Utilitaires
│   ├── constants.ts           # Constantes
│   ├── helpers.ts             # Fonctions helper
│   └── formatters.ts          # Formatage dates, monnaie, etc.
│
├── App.tsx                     # Composant principal
├── main.tsx                    # Point d'entrée
└── index.css                   # Styles globaux (Tailwind)
```

## 🔌 Configuration Backend API

**Base URL**: `http://localhost:8000/api`

### Endpoints disponibles

#### Authentification
- POST `/register` - Inscription
- POST `/login` - Connexion
- POST `/logout` - Déconnexion
- GET `/user` - Info utilisateur connecté

#### Dashboard
- GET `/dashboard` - Statistiques

#### Bâtiments
- GET `/batiments` - Liste
- POST `/batiments` - Créer
- GET `/batiments/{id}` - Détail
- PUT `/batiments/{id}` - Modifier
- DELETE `/batiments/{id}` - Supprimer

#### Appartements
- GET `/appartements` - Liste
- POST `/appartements` - Créer
- GET `/appartements/{id}` - Détail
- PUT `/appartements/{id}` - Modifier
- DELETE `/appartements/{id}` - Supprimer

#### Locataires
- GET `/locataires` - Liste
- POST `/locataires` - Créer
- GET `/locataires/{id}` - Détail
- PUT `/locataires/{id}` - Modifier
- DELETE `/locataires/{id}` - Supprimer

#### Locations
- GET `/locations` - Liste
- POST `/locations` - Créer
- GET `/locations/{id}` - Détail
- PUT `/locations/{id}` - Modifier
- DELETE `/locations/{id}` - Supprimer

#### Paiements
- GET `/paiements` - Liste
- POST `/paiements` - Créer
- GET `/paiements/{id}` - Détail
- PUT `/paiements/{id}` - Modifier
- DELETE `/paiements/{id}` - Supprimer
- GET `/paiements/{id}/quittance` - Générer PDF

## 🛠️ Technologies recommandées

### Core
- **React 18+**
- **TypeScript**
- **Vite**

### Routing
- **React Router DOM** v6

### State Management & Data Fetching
- **React Query (TanStack Query)** - Cache, mutations, auto-refetch
- OU **SWR** - Alternative à React Query

### Forms
- **React Hook Form** - Gestion formulaires performante
- **Zod** - Validation schéma TypeScript

### HTTP Client
- **Axios** - Requêtes HTTP

### UI & Styling
- **Tailwind CSS** ✅ (déjà configuré)
- **Headless UI** - Composants accessibles
- OU **Shadcn/ui** - Composants réutilisables

### Icons
- **Heroicons** - Icons pour Tailwind
- OU **Lucide React**

### Dates
- **date-fns** - Manipulation dates

### PDF
- **React-PDF** - Affichage PDF si besoin

### Toasts/Notifications
- **React Hot Toast**
- OU **Sonner**

## 📦 Installation des dépendances

```bash
# Dans frontend-immo/
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install react-hook-form zod @hookform/resolvers
npm install @headlessui/react
npm install @heroicons/react
npm install date-fns
npm install react-hot-toast
```

## 🚀 Démarrage

```bash
# Backend Laravel
cd immo-gestion
php artisan serve

# Frontend React  
cd frontend-immo
npm run dev
```

## 🔐 Authentification

Le backend utilise **Laravel Sanctum** avec tokens Bearer.

Lors de la connexion:
1. Appeler POST `/api/login`
2. Récupérer le `access_token`
3. Stocker dans localStorage/sessionStorage
4. Envoyer dans le header: `Authorization: Bearer {token}`

## 📝 Comptes de test

```
Admin:
- email: admin@immo.sn
- password: password

Agent Dakar:
- email: agent@immo.sn
- password: password

Agent Thiès:
- email: agent.thies@immo.sn
- password: password
```
