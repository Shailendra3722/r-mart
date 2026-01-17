"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User
} from 'firebase/auth';

type AuthContextType = {
    user: any | null;
    admin: any | null;
    loginAdmin: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signupWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    verifyEmail: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdminAuthenticated: boolean;
    auth: any; // Expose auth instance for components to use (e.g. phone auth)
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [admin, setAdmin] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Listen for Firebase User (Real Auth)
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Check if we have a simulated mobile number in local storage
                const simulatedMobile = localStorage.getItem('simulated_mobile');

                // Map Firebase user to our app's user format
                const userData = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'R Mart Customer',
                    email: firebaseUser.email,
                    // Use real phone if available, otherwise fall back to simulated one
                    mobile: firebaseUser.phoneNumber || (simulatedMobile ? `+91${simulatedMobile}` : null),
                    photoURL: firebaseUser.photoURL,
                    emailVerified: firebaseUser.emailVerified
                };
                setUser(userData);
                localStorage.setItem('user_session', JSON.stringify(userData));

                // SYNC TO MONGODB
                // This allows the Admin Panel to see "Registered Customers" even before they order
                const syncUserToDB = async () => {
                    try {
                        await fetch('/api/users/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(userData),
                        });
                    } catch (error) {
                        console.error("Failed to sync user to DB:", error);
                    }
                };
                syncUserToDB();
                setUser(null);
                localStorage.removeItem('user_session');
                // Don't clear simulated_mobile here, we might need it for re-login or it clears on explicit logout
            }
            setLoading(false);
        });

        // Check for Admin Session (Still Mock)
        const savedAdmin = localStorage.getItem('admin_session');
        if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

        return () => unsubscribe();
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        // Mock Admin Credentials (INTERNAL USE ONLY)
        if (email === 'admin@rmart.com' && password === 'admin123') {
            const adminData = { name: 'Super Admin', email };
            setAdmin(adminData);
            localStorage.setItem('admin_session', JSON.stringify(adminData));
            return true;
        }
        return false;
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            return true;
        } catch (error) {
            console.error("Google Login Error:", error);
            return false;
        }
    };

    const signupWithEmail = async (email: string, password: string, name: string) => {
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update the user's display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // MANUALLY UPDATE LOCALLY to reflect name immediately
            // (onAuthStateChanged might have fired before name was set)
            setUser((prev: any) => ({
                ...prev,
                name: name
            }));

            // Sync with local storage session immediately
            const updatedUser = {
                uid: userCredential.user.uid,
                name: name,
                email: email,
                mobile: null,
                photoURL: null
            };
            localStorage.setItem('user_session', JSON.stringify(updatedUser));

            return { success: true };
        } catch (error: any) {
            console.error("Signup Error:", error);
            let errorMessage = 'Failed to create account. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            console.error("Login Error:", error);
            let errorMessage = 'Failed to login. Please check your credentials.';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const verifyEmail = async () => {
        if (!auth.currentUser) return;
        try {
            const { sendEmailVerification } = await import('firebase/auth');
            await sendEmailVerification(auth.currentUser);
            alert(`Verification email sent to ${auth.currentUser.email}`);
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Failed to send verification email. Please try again later.");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
            setAdmin(null);
            localStorage.removeItem('admin_session'); // Clear admin session
            localStorage.removeItem('simulated_mobile'); // Clear simulated mobile
            router.push('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                admin,
                loginAdmin,
                loginWithGoogle,
                loginWithEmail,
                signupWithEmail,
                verifyEmail,
                logout,
                isAuthenticated: !!user,
                isAdminAuthenticated: !!admin,
                auth // Export auth for LoginPage to use directly
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
