import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Only use StrictMode in development for faster production renders
if (process.env.NODE_ENV === 'development') {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    root.render(<App />);
}
