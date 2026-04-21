import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
                    <div className="max-w-md w-full bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-purple-500">Something went wrong</h2>
                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            The application encountered a runtime error. Please try refreshing the page or check the console for more details.
                        </p>
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                            <p className="font-mono text-[10px] text-red-400 break-words">
                                {this.state.error?.toString()}
                            </p>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                        >
                            Refresh App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
