<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Append RFC 8288 Link headers pointing agents at the site's discovery
 * resources. Runs after AddLinkHeadersForPreloadedAssets so Laravel's
 * preload hints are preserved.
 */
class AgentLinkHeaders
{
    /**
     * Link relations to advertise on every HTML response. Targets are
     * site-absolute paths; agents resolve them against the request origin.
     *
     * @var list<string>
     */
    private array $links = [
        '</.well-known/api-catalog>; rel="api-catalog"',
        '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/index"',
        '</.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"',
        '</llms.txt>; rel="https://llmstxt.org/rel"',
        '</sitemap.xml>; rel="sitemap"',
        '</robots.txt>; rel="alternate"; type="text/plain"; title="robots"',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        // Only advertise on HTML pages; agents that hit JSON/XML endpoints
        // already have what they need from the URL.
        $contentType = $response->headers->get('Content-Type', '');

        if (! str_contains($contentType, 'text/html')) {
            return $response;
        }

        $existing = $response->headers->get('Link');
        $merged = $existing
            ? $existing.', '.implode(', ', $this->links)
            : implode(', ', $this->links);

        $response->headers->set('Link', $merged);

        return $response;
    }
}
