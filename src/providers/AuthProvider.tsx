import { useContext, useState, useEffect, createContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const setData = async (): Promise<void> => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            setSession(data?.session || null);
            setUser(session?.user || null);
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser((session as Session)?.user || null); 
            setLoading(false);
        });

        setData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = async (): Promise<void> => {
        await supabase.auth.signOut();
    };

    const value: AuthContextType = {
        session,
        user,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
