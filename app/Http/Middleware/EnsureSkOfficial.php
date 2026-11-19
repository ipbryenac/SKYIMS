<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSkOfficial
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isSkOfficial()) {
            abort(403, 'Unauthorized. Access restricted to Sangguniang Kabataan officials.');
        }

        return $next($request);
    }
}
