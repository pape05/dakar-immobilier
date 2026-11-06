<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware de vérification des rôles.
 *
 * Utilisé dans les routes pour restreindre l'accès selon le rôle de l'utilisateur.
 * Exemple : middleware('role:administrateur,agent') autorise ces deux rôles.
 */
class CheckRole
{
    /**
     * Vérifie que l'utilisateur authentifié possède l'un des rôles autorisés.
     * Retourne 401 si non authentifié, 403 si rôle non autorisé.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            if ($request->expectsJson()) {
                abort(401, 'Non authentifié.');
            }
            return redirect()->route('login');
        }

        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
