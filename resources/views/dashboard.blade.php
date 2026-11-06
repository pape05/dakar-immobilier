<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Tableau de Bord - Gestion Immobilière
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="text-gray-500 text-sm">Bâtiments</div>
                        <div class="text-3xl font-bold text-blue-600">{{ $totalBatiments }}</div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="text-gray-500 text-sm">Appartements</div>
                        <div class="text-3xl font-bold text-green-600">{{ $totalAppartements }}</div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="text-gray-500 text-sm">Occupés</div>
                        <div class="text-3xl font-bold text-orange-600">{{ $appartementsOccupes }}</div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="text-gray-500 text-sm">Libres</div>
                        <div class="text-3xl font-bold text-purple-600">{{ $appartementsLibres }}</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4">Locations Actives</h3>
                        <div class="text-4xl font-bold text-indigo-600">{{ $locationsActives }}</div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4">Paiements du Mois</h3>
                        <div class="text-4xl font-bold text-green-600">{{ number_format($paiementsMoisEnCours, 0, ',', ' ') }} FCFA</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4">Paiements Récents</h3>
                        <div class="space-y-3">
                            @forelse($paiementsRecents as $paiement)
                                <div class="border-l-4 border-green-500 pl-3">
                                    <div class="font-medium">{{ $paiement->location->locataire->full_name }}</div>
                                    <div class="text-sm text-gray-600">
                                        {{ $paiement->mois_concerne }} - {{ number_format($paiement->montant, 0, ',', ' ') }} FCFA
                                    </div>
                                </div>
                            @empty
                                <p class="text-gray-500">Aucun paiement récent</p>
                            @endforelse
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-4">Locations Récentes</h3>
                        <div class="space-y-3">
                            @forelse($locationsRecentes as $location)
                                <div class="border-l-4 border-blue-500 pl-3">
                                    <div class="font-medium">{{ $location->locataire->full_name }}</div>
                                    <div class="text-sm text-gray-600">
                                        {{ $location->appartement->batiment->nom }} - Appt {{ $location->appartement->numero }}
                                    </div>
                                </div>
                            @empty
                                <p class="text-gray-500">Aucune location récente</p>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
