/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
            colors: {
                base: '#0a0a0a',
                surface: '#111111',
                elevated: '#161616',
                purple: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
                blue: { 400: '#60a5fa', 500: '#3b82f6' },
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            },
            boxShadow: {
                'glow-sm': '0 0 20px rgba(124,58,237,0.2)',
                'glow-md': '0 0 40px rgba(124,58,237,0.3)',
                'glow-lg': '0 0 80px rgba(124,58,237,0.25)',
                'card': '0 20px 60px rgba(0,0,0,0.4)',
            },
            animation: {
                'fade-up': 'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'spin-slow': 'spin 2s linear infinite',
                'scroll-up': 'scrollUp 60s linear infinite',
                'scroll-down': 'scrollDown 60s linear infinite',
            },
            keyframes: {
                fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                scrollUp: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-50%)' } },
                scrollDown: { '0%': { transform: 'translateY(-50%)' }, '100%': { transform: 'translateY(0)' } }
            },
        },
    },
    plugins: [],
};
