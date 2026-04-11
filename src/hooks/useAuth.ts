import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return { user, session, loading, loginWithGoogle, logout };
};
