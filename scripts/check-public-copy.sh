#!/usr/bin/env bash
# Print all matches, including intentionally unchanged legal references.
set -eu
pattern='Gulf|الخليج|Saudi|السعود|Riyadh|الرياض|KSA|NCA ECC|SAMA|PDPL|NPHIES|Nafath|نفاذ|Absher|أبشر|UAE Pass|Noor|Etimad|DGA|mada|SAR\b|ريال|Book a Call|احجز مكالمة|Live product|منتج حي'
rg -n "$pattern" database/seeders resources/lang \
    resources/js/components/landing-b resources/js/components/services \
    resources/js/components/industries || test "$?" -eq 1
printf '\nZATCA examples (one per rendered retail locale):\n'
rg -n 'ZATCA' database/seeders resources/lang \
    resources/js/components/landing-b resources/js/components/services \
    resources/js/components/industries || test "$?" -eq 1
