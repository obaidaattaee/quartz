import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        // The dev container starts Vite with `--host 0.0.0.0` so it is
        // reachable from outside the container. Laravel writes the resolved
        // dev-server address into `public/hot`, and without an explicit hmr
        // host that address is the bind address — so the browser is told to
        // load assets from `http://0.0.0.0:5173`, which is not a reachable
        // origin and collides with anything else serving that port. Advertise
        // a browser-reachable host instead; VITE_HMR_HOST is already set by
        // docker-compose, and VITE_HMR_CLIENT_PORT covers the case where the
        // container port is published on a different host port.
        hmr: {
            host: process.env.VITE_HMR_HOST || 'localhost',
            ...(process.env.VITE_HMR_CLIENT_PORT
                ? { clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) }
                : {}),
        },
    },
    // Inertia pages are lazy-loaded via import.meta.glob, so Vite's dep scan
    // only sees app.tsx. Each first visit to a page with a new dependency
    // (tiptap, react-colorful, radix-ui…) then triggers a re-optimise and a
    // forced reload, and until it lands two React copies run side by side:
    // "Invalid hook call", dead clicks. Scan every page up front instead.
    optimizeDeps: {
        entries: ['resources/js/app.tsx', 'resources/js/pages/**/*.tsx'],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    build: {
        modulePreload: {
            polyfill: false,
            resolveDependencies: (_filename, deps) =>
                deps.filter(
                    (dep) =>
                        !dep.includes('json-ld') &&
                        !dep.includes('seo-head'),
                ),
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;

                    // Anchor on /node_modules/<pkg>/ so substring matches don't
                    // pull e.g. @radix-ui/react-* into vendor-react.
                    if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
                        return 'vendor-react';
                    }

                    if (id.includes('@radix-ui') || id.includes('@headlessui') || /[\\/]node_modules[\\/]radix-ui[\\/]/.test(id)) {
                        return 'vendor-ui';
                    }

                    if (id.includes('@inertiajs')) {
                        return 'vendor-inertia';
                    }

                    if (id.includes('framer-motion') || /[\\/]node_modules[\\/]motion[\\/]/.test(id)) {
                        return 'vendor-motion';
                    }

                    if (id.includes('lucide-react')) {
                        return 'vendor-icons';
                    }

                    if (/[\\/]node_modules[\\/]@?gsap[\\/]/.test(id)) {
                        return 'vendor-gsap';
                    }

                    // Intentionally NOT grouping @tiptap + prosemirror into a
                    // single vendor-editor chunk: Rolldown hoists React into it
                    // (since TipTap depends on react-dom internals) and the
                    // chunk gets pulled into every page's preload graph. Letting
                    // Rolldown auto-split keeps TipTap on admin pages only.

                    if (id.includes('fontsource')) {
                        return 'vendor-fonts';
                    }
                },
            },
        },
    },
});
