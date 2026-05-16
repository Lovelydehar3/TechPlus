import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        hmr: {
            clientPort: 5173,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        // Optimize bundle output
        cssCodeSplit: true,
        // Reduce chunk size warnings
        chunkSizeWarningLimit: 1000,
        // Enable minification
        minify: 'terser',
        // Optimize dependencies
        sourcemap: false, // Disable sourcemap in production for smaller bundle
        reportCompressedSize: false,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor chunks for better caching
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) {
                            return 'react-core';
                        }
                        if (id.includes('react-router')) {
                            return 'react-router';
                        }
                        if (id.includes('framer-motion')) {
                            return 'framer';
                        }
                        if (id.includes('axios')) {
                            return 'network';
                        }
                        // Group other vendors
                        return 'vendor';
                    }
                },
                // Optimize file names for better gzip compression
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'css/[name]-[hash][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                }
            },
        },
    },
})

