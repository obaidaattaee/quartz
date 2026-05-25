<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

/**
 * Serves agent-discovery resources from /.well-known/* with correct
 * content types. RFC 8615 governs the well-known URI namespace; the
 * specific resource shapes follow RFC 9727 (API catalog), the Cloudflare
 * Agent Skills RFC v0.2.0, and the MCP server card SEP-1649 draft.
 */
class AgentDiscoveryController extends Controller
{
    private function siteOrigin(): string
    {
        return config('app.url', 'https://quartz-solutions.net');
    }

    /**
     * RFC 9727 API catalog as application/linkset+json.
     * Lists Quartz's publicly addressable endpoints (the public form
     * endpoints + the two product subdomains). No private API today.
     */
    public function apiCatalog(): JsonResponse
    {
        $origin = $this->siteOrigin();

        $catalog = [
            'linkset' => [
                [
                    'anchor' => $origin.'/en/contact',
                    'service-desc' => [
                        ['href' => $origin.'/.well-known/agent-skills/contact.md', 'type' => 'text/markdown'],
                    ],
                    'service-doc' => [
                        ['href' => $origin.'/en/contact', 'type' => 'text/html'],
                    ],
                    'status' => [
                        ['href' => $origin.'/up'],
                    ],
                ],
                [
                    'anchor' => $origin.'/en/newsletter/subscribe',
                    'service-desc' => [
                        ['href' => $origin.'/.well-known/agent-skills/newsletter.md', 'type' => 'text/markdown'],
                    ],
                ],
                [
                    'anchor' => 'https://bo.quartz-solutions.net',
                    'service-doc' => [
                        ['href' => 'https://bo.quartz-solutions.net', 'type' => 'text/html', 'title' => 'Quartz POS — back office'],
                    ],
                ],
                [
                    'anchor' => 'https://cyber.quartz-solutions.net',
                    'service-doc' => [
                        ['href' => 'https://cyber.quartz-solutions.net', 'type' => 'text/html', 'title' => 'Quartz Cyber — human-risk platform'],
                    ],
                ],
            ],
        ];

        return response()
            ->json($catalog, 200, [
                'Content-Type' => 'application/linkset+json',
                'Cache-Control' => 'public, max-age=3600',
            ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Agent Skills discovery index (Cloudflare RFC v0.2.0).
     * Lists the SKILL.md files agents can pull to learn how to interact
     * with the site's verbs. Each entry carries a sha256 of the linked
     * file so agents can verify content didn't drift.
     */
    public function agentSkillsIndex(): JsonResponse
    {
        $origin = $this->siteOrigin();
        $skillDir = public_path('.well-known/agent-skills');

        $skills = [];

        $files = [
            'contact' => 'Submit a project inquiry / book a consultation.',
            'newsletter' => 'Subscribe an email address to the Quartz newsletter.',
            'browse-services' => 'Read the catalogue of services Quartz offers.',
            'browse-portfolio' => 'List published case studies with outcomes.',
        ];

        foreach ($files as $name => $description) {
            $path = $skillDir.'/'.$name.'.md';

            if (! File::exists($path)) {
                continue;
            }

            $skills[] = [
                'name' => $name,
                'type' => 'skill',
                'description' => $description,
                'url' => $origin.'/.well-known/agent-skills/'.$name.'.md',
                'digest' => 'sha256-'.base64_encode(hash_file('sha256', $path, true)),
            ];
        }

        $index = [
            '$schema' => 'https://agentskills.io/schema/v0.2.0.json',
            'name' => 'Quartz Solutions',
            'description' => 'Skills for interacting with the Quartz Solutions public site.',
            'skills' => $skills,
        ];

        return response()
            ->json($index, 200, [
                'Content-Type' => 'application/json',
                'Cache-Control' => 'public, max-age=3600',
            ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * MCP Server Card (SEP-1649 draft). Quartz doesn't run an MCP server
     * today — this card declares the site as a "documentary" anchor, points
     * at the agent-skills index for what agents *can* do, and leaves the
     * transport endpoint empty so honest negotiation is preserved.
     */
    public function mcpServerCard(): JsonResponse
    {
        $origin = $this->siteOrigin();

        $card = [
            'serverInfo' => [
                'name' => 'quartz-solutions',
                'version' => '0.1.0',
                'title' => 'Quartz Solutions',
                'description' => 'Public site for Quartz Solutions. No live MCP transport yet; consult the agent-skills index for available actions.',
                'homepage' => $origin,
            ],
            'transport' => null,
            'capabilities' => [
                'tools' => false,
                'resources' => false,
                'prompts' => false,
            ],
            'discovery' => [
                'agentSkills' => $origin.'/.well-known/agent-skills/index.json',
                'apiCatalog' => $origin.'/.well-known/api-catalog',
                'llmsTxt' => $origin.'/llms.txt',
            ],
        ];

        return response()
            ->json($card, 200, [
                'Content-Type' => 'application/json',
                'Cache-Control' => 'public, max-age=3600',
            ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}
