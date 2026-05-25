<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetPublicCacheHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only override for safe GET/HEAD HTML on guest sessions. POST forms,
        // authenticated requests, and JSON API hits stay no-store.
        if (! $request->isMethodCacheable() || $request->user() || $response->isRedirection()) {
            return $response;
        }

        // Laravel's session middleware emits Cache-Control: private, must-revalidate
        // plus Pragma: no-cache and Expires: -1 to protect session data. For an
        // anonymous public marketing page we want intermediaries (and PSI's
        // browser cache simulation) to be able to cache the HTML briefly.
        $response->headers->remove('pragma');
        $response->headers->remove('expires');
        $response->headers->set(
            'Cache-Control',
            'public, max-age=0, s-maxage=300, must-revalidate',
        );

        return $response;
    }
}
