import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Monthly Household Expenses',
                short_name: 'Expenses',
                theme_color: '#4B5563',
                icons: [
                    {
                        src: '/logo.png', // Placeholder
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/logo.png', // Placeholder
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
