<?php

namespace App\Services;

class CriticalAssetService
{
    /**
     * Find compiled asset URLs whose paths match any of the given substrings
     * by reading the Vite manifest. Returns absolute URLs prefixed with /build/.
     *
     * @param  array<string>  $needles  Substrings of the source filename(s)
     *                                  to find — e.g. 'fraunces-latin-400-normal'.
     * @param  string|null    $ext      Optional extension filter (without dot).
     *                                  Pass 'woff2' to skip woff fallbacks.
     * @return array<string>            Resolved /build/assets/... URLs.
     */
    public static function findInManifest(array $needles, ?string $ext = null): array
    {
        $manifestPath = public_path('build/manifest.json');

        if (! file_exists($manifestPath)) {
            return [];
        }

        $manifest = json_decode(file_get_contents($manifestPath), true) ?: [];
        $urls = [];

        foreach ($manifest as $entry) {
            $file = $entry['file'] ?? null;

            if (! $file) {
                continue;
            }

            if ($ext !== null && ! str_ends_with($file, '.'.$ext)) {
                continue;
            }

            foreach ($needles as $needle) {
                if (str_contains($file, $needle)) {
                    $urls[] = '/build/'.$file;
                    break;
                }
            }
        }

        return array_values(array_unique($urls));
    }
}
