import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export default function GoogleAuthProvider({ children }: { children: ReactNode }) {
    const env = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!env) {
        throw new Error("Google Client ID is missing!");
    }
    return (
        <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
        </GoogleOAuthProvider>
    )
}