<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }

                // Public site theme (dark by default), chosen with the header toggle.
                try {
                    if (localStorage.getItem('qz-public-theme') === 'light') {
                        document.documentElement.dataset.publicTheme = 'light';
                    }
                } catch (e) {}
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(0.985 0.005 180);
            }

            html.dark {
                background-color: oklch(0.13 0.012 245);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <meta name="theme-color" content="#0e0d0b">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <link rel="preload" as="font" type="font/woff2" href="{{ Vite::asset('resources/fonts/SpaceGrotesk-Variable.woff2') }}" crossorigin>

        {{-- Additional critical font preloads (LCP). Controllers can set
             $criticalFonts via ->withViewData() to start font fetches
             in parallel with CSS rather than after CSS parses. --}}
        @isset($criticalFonts)
            @foreach($criticalFonts as $fontUrl)
                <link rel="preload" as="font" type="font/woff2" href="{{ $fontUrl }}" crossorigin>
            @endforeach
        @endisset

        {{-- LCP image preload — for pages whose largest paint is an image
             (e.g. service pages, blog posts with hero photos). --}}
        @isset($lcpImage)
            <link rel="preload" as="image" href="{{ $lcpImage }}" fetchpriority="high">
        @endisset

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        {{-- Server-rendered head for crawlers and the first paint. Every tag
             carries data-inertia so Inertia's head manager adopts and replaces
             it on hydration and client navigation, leaving exactly one
             <title> (and one of each meta tag) in the document. --}}
        <x-inertia::head>
            <title data-inertia="">{{ $seo['title'] ?? config('app.name', 'Quartz') }}</title>
            @isset($seo)
                @if (! empty($seo['description']))
                    <meta name="description" content="{{ $seo['description'] }}" data-inertia="">
                    <meta property="og:description" content="{{ $seo['description'] }}" data-inertia="">
                    <meta name="twitter:description" content="{{ $seo['description'] }}" data-inertia="">
                @endif
                <meta property="og:title" content="{{ $seo['title'] ?? config('app.name') }}" data-inertia="">
                <meta property="og:url" content="{{ $seo['url'] ?? request()->url() }}" data-inertia="">
                <meta property="og:type" content="{{ $seo['type'] ?? 'website' }}" data-inertia="">
                <meta property="og:site_name" content="{{ config('app.name') }}" data-inertia="">
                @if (! empty($seo['image']))
                    <meta property="og:image" content="{{ $seo['image'] }}" data-inertia="">
                    <meta name="twitter:image" content="{{ $seo['image'] }}" data-inertia="">
                @endif
                <meta name="twitter:card" content="summary_large_image" data-inertia="">
                <meta name="twitter:title" content="{{ $seo['title'] ?? config('app.name') }}" data-inertia="">
                @if (! empty($seo['canonical']))
                    <link rel="canonical" href="{{ $seo['canonical'] }}" data-inertia="">
                @endif
                @isset($seo['hreflang'])
                    @foreach($seo['hreflang'] as $lang => $href)
                        <link rel="alternate" hreflang="{{ $lang }}" href="{{ $href }}" data-inertia="">
                    @endforeach
                @endisset
                @if (! empty($seo['robots']))
                    <meta name="robots" content="{{ $seo['robots'] }}" data-inertia="">
                @endif
            @endisset
        </x-inertia::head>
    </head>
    <body class="{{ app()->getLocale() === 'ar' ? 'font-arabic' : 'font-sans' }} antialiased">
        <x-inertia::app />
    </body>
</html>
