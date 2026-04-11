import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- 1. ELECTRON DEEP LINK LISTENER ---
        if (typeof window !== 'undefined' && 'electronAPI' in window) {
            // This would normally listen for IPC, but for simplicity
            // Supabase handles the session from the URL hash automatically
            // if we are on a web-view. For .exe, we might need to reload.
        }

        // --- 2. REGULAR AUTH LOGIC ---
        // Safety timeout to prevent infinite black screen
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth check timed out. Checking local state...");
                setLoading(false);
            }
        }, 5000);

        try {
            // Init session
            supabase.auth.getSession().then(({ data: { session }, error }) => {
                if (error) {
                    console.error("Supabase Session Error:", error);
                }
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
                clearTimeout(timeout);
            }).catch(err => {
                console.error("Auth Exception:", err);
                setLoading(false);
                clearTimeout(timeout);
            });

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => {
                subscription.unsubscribe();
                clearTimeout(timeout);
            }
        } catch (e) {
            setLoading(false);
            return () => clearTimeout(timeout);
        }
    }, [loading]);

    const [isLicensed, setIsLicensed] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyLicense = async (userEmail: string) => {
            try {
                const { data, error } = await supabase
                    .from('software_orders')
                    .select('*')
                    .eq('user_email', userEmail)
                    .eq('status', 'complete')
                    .or('software_name.eq.Visualizer Studio,software_name.eq.VisualizerStudio');

                if (error) throw error;
                setIsLicensed(data && data.length > 0);
            } catch (err) {
                console.error("License Check Error:", err);
                setIsLicensed(false);
            }
        };

        if (user) verifyLicense(user.email!);
        else if (!loading) setIsLicensed(null);
    }, [user, loading]);

    const loginWithGoogle = async () => {
        const isElectron = /Electron/.test(navigator.userAgent);
        const redirectUrl = isElectron 
                ? 'visualizerstudio://auth-callback' 
                : (window.location.origin.includes('localhost') ? window.location.origin : 'http://localhost:5000');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl }
        });
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return { user, session, loading, loginWithGoogle, logout, isLicensed };
};
