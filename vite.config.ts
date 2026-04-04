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
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('scheduler')) {
                            return 'vendor-react';
                        }

                        if (id.includes('@radix-ui') || id.includes('@headlessui')) {
                            return 'vendor-ui';
                        }

                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }

                        if (id.includes('framer-motion') || id.includes('motion')) {
                            return 'vendor-motion';
                        }

                        if (id.includes('fontsource')) {
                            return 'vendor-fonts';
                        }
                    }
                },
            },
        },
    },
});
