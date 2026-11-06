import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

const PolitiqueConfidentialite = () => {
  return (
    <main className="min-h-[100dvh] bg-sand px-4 py-16 font-sans antialiased sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-brand"
        >
          <ArrowLeft size={14} weight="bold" />
          Retour à l'accueil
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-brand">
          Politique de confidentialité
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600">
          <section>
            <h2 className="text-lg font-semibold text-brand">1. Collecte des données</h2>
            <p className="mt-3">
              Dakar Immobilier collecte les données personnelles suivantes dans le cadre
              de son service de gestion immobilière :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nom, prénom et coordonnées (email, téléphone)</li>
              <li>Pièce d'identité et numéro de pièce (pour les locataires)</li>
              <li>Informations relatives aux baux et paiements</li>
              <li>Données de connexion (adresse IP, horodatage)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">2. Finalités du traitement</h2>
            <p className="mt-3">Les données collectées sont utilisées pour :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>La gestion des biens immobiliers et des contrats de location</li>
              <li>Le suivi des paiements de loyers</li>
              <li>La génération de quittances et documents contractuels</li>
              <li>La communication avec les locataires et propriétaires</li>
              <li>L'amélioration de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">3. Conservation des données</h2>
            <p className="mt-3">
              Les données personnelles sont conservées pendant la durée nécessaire à la
              gestion de la relation contractuelle, et au-delà pour les obligations
              légales et comptables (10 ans pour les documents comptables).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">4. Sécurité des données</h2>
            <p className="mt-3">
              Dakar Immobilier met en place des mesures techniques et organisationnelles
              pour protéger vos données : chiffrement des mots de passe, authentification
              par token, contrôle d'accès basé sur les rôles et protection contre les
              accès non autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">5. Droits des utilisateurs</h2>
            <p className="mt-3">
              Conformément à la loi sénégalaise sur la protection des données personnelles,
              vous disposez des droits suivants :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit de suppression de vos données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à l'adresse :
              <strong> contact@dakar-immobilier.sn</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">6. Cookies</h2>
            <p className="mt-3">
              Le site utilise des cookies techniques nécessaires au fonctionnement de
              l'application (authentification, session). Aucun cookie publicitaire ou
              de suivi n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">7. Modifications</h2>
            <p className="mt-3">
              Dakar Immobilier se réserve le droit de modifier la présente politique
              de confidentialité à tout moment. Les utilisateurs seront informés de
              toute modification significative.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PolitiqueConfidentialite;
