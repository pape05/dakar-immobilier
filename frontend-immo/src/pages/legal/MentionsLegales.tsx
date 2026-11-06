import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

const MentionsLegales = () => {
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

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-brand">Mentions légales</h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600">
          <section>
            <h2 className="text-lg font-semibold text-brand">1. Éditeur du site</h2>
            <p className="mt-3">
              Le site Dakar Immobilier est édité par la société Dakar Immobilier SARL,
              au capital de 1 000 000 FCFA, immatriculée au Registre du Commerce et du
              Crédit Mobilier de Dakar.
            </p>
            <p className="mt-2">
              <strong>Siège social :</strong> Dakar, Sénégal<br />
              <strong>Téléphone :</strong> +221 33 842 17 90<br />
              <strong>Email :</strong> contact@dakar-immobilier.sn
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">2. Directeur de la publication</h2>
            <p className="mt-3">
              Le directeur de la publication est le représentant légal de la société
              Dakar Immobilier SARL.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">3. Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé par un prestataire professionnel garantissant la
              disponibilité et la sécurité des données.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">4. Propriété intellectuelle</h2>
            <p className="mt-3">
              L'ensemble du contenu du site (textes, images, graphismes, logo, icônes,
              logiciels) est la propriété exclusive de Dakar Immobilier, sauf mention
              contraire. Toute reproduction, représentation, modification ou adaptation
              de tout ou partie du site est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">5. Limitation de responsabilité</h2>
            <p className="mt-3">
              Dakar Immobilier s'efforce de fournir des informations aussi précises que
              possible. Toutefois, elle ne pourra être tenue responsable des omissions,
              des inexactitudes ou des carences dans la mise à jour des informations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand">6. Droit applicable</h2>
            <p className="mt-3">
              Les présentes mentions légales sont régies par le droit sénégalais.
              En cas de litige, les tribunaux de Dakar seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MentionsLegales;
