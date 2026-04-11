import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { LogIn, Mail, Lock, Chrome, ShieldCheck } from 'lucide-react';

interface AuthWallProps {
    onLoginSuccess: () => void;
}

const AuthWall: React.FC<AuthWallProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Check if running in Electron
            const isElectron = /Electron/.test(navigator.userAgent);
            const redirectUrl = isElectron 
                ? 'visualizerstudio://auth-callback' 
                : (window.location.origin.includes('localhost') ? window.location.origin : 'http://localhost:5000');

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: redirectUrl }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Google login failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                        <img 
                            src="/sampleswala.png" 
                            alt="Sampleswala" 
                            className="h-10 w-auto object-contain brightness-0 invert opacity-90" 
                        />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Visualizer Studio</h1>
                    <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Secured by Sampleswala Ecosystem</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-mono leading-relaxed">
                        ERROR: {error.toUpperCase()}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase ml-1">Account Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-white/40 transition-all font-medium"
                                placeholder="name@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-white/40 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full h-14 bg-white text-black rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                <LogIn size={18} />
                                Unlock Software
                            </>
                        )}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-mono text-white/20 uppercase">OR</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                    <Chrome size={18} />
                    Continue with Google
                </button>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-mono text-white/20 uppercase leading-relaxed">
                        By logging in you agree to<br/>
                        Visualizer Studio & Sampleswala Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthWall;
