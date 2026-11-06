import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import EspaceLocataire from './pages/espace-locataire/EspaceLocataire';
import MesPaiements from './pages/espace-locataire/MesPaiements';
import MesNotifications from './pages/espace-locataire/MesNotifications';
import MonProfil from './pages/espace-locataire/MonProfil';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LocataireLayout from './components/layout/LocataireLayout';
import BatimentsList from './pages/batiments/BatimentsList';
import BatimentCreate from './pages/batiments/BatimentCreate';
import BatimentEdit from './pages/batiments/BatimentEdit';
import BatimentDetail from './pages/batiments/BatimentDetail';
import AppartementsList from './pages/appartements/AppartementsList';
import AppartementCreate from './pages/appartements/AppartementCreate';
import AppartementEdit from './pages/appartements/AppartementEdit';
import AppartementDetail from './pages/appartements/AppartementDetail';
import LocatairesList from './pages/locataires/LocatairesList';
import LocataireCreate from './pages/locataires/LocataireCreate';
import LocataireEdit from './pages/locataires/LocataireEdit';
import LocataireDetail from './pages/locataires/LocataireDetail';
import LocationsList from './pages/locations/LocationsList';
import LocationCreate from './pages/locations/LocationCreate';
import LocationEdit from './pages/locations/LocationEdit';
import LocationDetail from './pages/locations/LocationDetail';
import PaiementsList from './pages/paiements/PaiementsList';
import PaiementCreate from './pages/paiements/PaiementCreate';
import PaiementEdit from './pages/paiements/PaiementEdit';
import PaiementDetail from './pages/paiements/PaiementDetail';
import UtilisateursList from './pages/utilisateurs/UtilisateursList';
import UtilisateurCreate from './pages/utilisateurs/UtilisateurCreate';
import UtilisateurEdit from './pages/utilisateurs/UtilisateurEdit';
import AgencesList from './pages/agences/AgencesList';
import AgenceCreate from './pages/agences/AgenceCreate';
import AgenceEdit from './pages/agences/AgenceEdit';
import Rapports from './pages/rapports/Rapports';
import Alertes from './pages/alertes/Alertes';
import Parametres from './pages/parametres/Parametres';
import ChangePassword from './pages/auth/ChangePassword';
import NotFound from './pages/NotFound';
import MentionsLegales from './pages/legal/MentionsLegales';
import PolitiqueConfidentialite from './pages/legal/PolitiqueConfidentialite';

const ADMIN = ['administrateur'] as const;
const ADMIN_AGENT = ['administrateur', 'agent'] as const;
const LOCATAIRE = ['locataire'] as const;

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#1a1a1a', color: '#fff', fontSize: '14px' } }} />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/changer-mot-de-passe" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* Dashboard (admin + agent) */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />

          {/* Batiments (admin + agent) */}
          <Route path="/batiments" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><BatimentsList /></MainLayout></ProtectedRoute>} />
          <Route path="/batiments/create" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><BatimentCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/batiments/:id" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><BatimentDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/batiments/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><BatimentEdit /></MainLayout></ProtectedRoute>} />

          {/* Appartements (admin + agent) */}
          <Route path="/appartements" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><AppartementsList /></MainLayout></ProtectedRoute>} />
          <Route path="/appartements/create" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><AppartementCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/appartements/:id" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><AppartementDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/appartements/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><AppartementEdit /></MainLayout></ProtectedRoute>} />

          {/* Locataires (admin + agent) */}
          <Route path="/locataires" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocatairesList /></MainLayout></ProtectedRoute>} />
          <Route path="/locataires/create" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocataireCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/locataires/:id" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocataireDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/locataires/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocataireEdit /></MainLayout></ProtectedRoute>} />

          {/* Locations (admin + agent) */}
          <Route path="/locations" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocationsList /></MainLayout></ProtectedRoute>} />
          <Route path="/locations/create" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocationCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/locations/:id" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocationDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/locations/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><LocationEdit /></MainLayout></ProtectedRoute>} />

          {/* Paiements (admin + agent) */}
          <Route path="/paiements" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><PaiementsList /></MainLayout></ProtectedRoute>} />
          <Route path="/paiements/create" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><PaiementCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/paiements/:id" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><PaiementDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/paiements/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><PaiementEdit /></MainLayout></ProtectedRoute>} />

          {/* Rapports (admin uniquement) */}
          <Route path="/rapports" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><Rapports /></MainLayout></ProtectedRoute>} />

          {/* Alertes (admin uniquement) */}
          <Route path="/alertes" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><Alertes /></MainLayout></ProtectedRoute>} />

          {/* Paramètres (admin + agent) */}
          <Route path="/parametres" element={<ProtectedRoute allowedRoles={[...ADMIN_AGENT]}><MainLayout><Parametres /></MainLayout></ProtectedRoute>} />

          {/* Utilisateurs (admin uniquement) */}
          <Route path="/utilisateurs" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><UtilisateursList /></MainLayout></ProtectedRoute>} />
          <Route path="/utilisateurs/create" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><UtilisateurCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/utilisateurs/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><UtilisateurEdit /></MainLayout></ProtectedRoute>} />

          {/* Agences (admin uniquement) */}
          <Route path="/agences" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><AgencesList /></MainLayout></ProtectedRoute>} />
          <Route path="/agences/create" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><AgenceCreate /></MainLayout></ProtectedRoute>} />
          <Route path="/agences/:id/edit" element={<ProtectedRoute allowedRoles={[...ADMIN]}><MainLayout><AgenceEdit /></MainLayout></ProtectedRoute>} />

          {/* Espace Locataire */}
          <Route path="/mon-espace" element={<ProtectedRoute allowedRoles={[...LOCATAIRE]}><LocataireLayout><EspaceLocataire /></LocataireLayout></ProtectedRoute>} />
          <Route path="/mon-espace/paiements" element={<ProtectedRoute allowedRoles={[...LOCATAIRE]}><LocataireLayout><MesPaiements /></LocataireLayout></ProtectedRoute>} />
          <Route path="/mon-espace/notifications" element={<ProtectedRoute allowedRoles={[...LOCATAIRE]}><LocataireLayout><MesNotifications /></LocataireLayout></ProtectedRoute>} />
          <Route path="/mon-espace/profil" element={<ProtectedRoute allowedRoles={[...LOCATAIRE]}><LocataireLayout><MonProfil /></LocataireLayout></ProtectedRoute>} />

          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
