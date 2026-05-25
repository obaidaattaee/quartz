import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
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
