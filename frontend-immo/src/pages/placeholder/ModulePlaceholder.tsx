import { ArrowRight, Wrench } from '@phosphor-icons/react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  nextStep: string;
}

const ModulePlaceholder = ({ title, description, nextStep }: ModulePlaceholderProps) => {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Module
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">{description}</p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
              <Wrench size={25} weight="duotone" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Pret a developper</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{nextStep}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
            Prochaine passe
            <ArrowRight size={16} weight="bold" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModulePlaceholder;
