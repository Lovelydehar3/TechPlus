import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// FIX #4: Silent health-check ping to wake Render free tier on app init
if (typeof window !== 'undefined') {
    const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${apiBase}/api/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Only use StrictMode in development for faster production renders.
if (import.meta.env.DEV) {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    root.render(<App />);
}
