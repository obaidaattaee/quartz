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
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png">
        <link rel="apple-touch-icon" href="/images/favicon-192.png">

        <meta name="theme-color" content="#0e0d0b">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        @isset($seo)
            <meta name="description" content="{{ $seo['description'] ?? '' }}">
            <meta property="og:title" content="{{ $seo['title'] ?? config('app.name') }}">
            <meta property="og:description" content="{{ $seo['description'] ?? '' }}">
            <meta property="og:image" content="{{ $seo['image'] ?? '' }}">
            <meta property="og:url" content="{{ $seo['url'] ?? request()->url() }}">
            <meta property="og:type" content="{{ $seo['type'] ?? 'website' }}">
            <meta property="og:site_name" content="{{ config('app.name') }}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="{{ $seo['title'] ?? config('app.name') }}">
            <meta name="twitter:description" content="{{ $seo['description'] ?? '' }}">
            <meta name="twitter:image" content="{{ $seo['image'] ?? '' }}">
            <link rel="canonical" href="{{ $seo['canonical'] ?? request()->url() }}">
            @isset($seo['hreflang'])
                @foreach($seo['hreflang'] as $lang => $href)
                    <link rel="alternate" hreflang="{{ $lang }}" href="{{ $href }}">
                @endforeach
            @endisset
        @endisset

        <link rel="preload" as="font" type="font/woff2" href="{{ Vite::asset('resources/fonts/SpaceGrotesk-Variable.woff2') }}" crossorigin>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="{{ app()->getLocale() === 'ar' ? 'font-arabic' : 'font-sans' }} antialiased">
        <x-inertia::app />
    </body>
</html>
