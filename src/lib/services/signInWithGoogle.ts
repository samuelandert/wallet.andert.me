// src/lib/services/signInWithGoogle.ts
import { connectProvider } from "$lib/setupLit";
import { isSignInRedirect, getProviderFromUrl } from "@lit-protocol/lit-auth-client";

export const signInWithGoogle = async () => {
    if (typeof window !== 'undefined') {
        try {
            let provider = await connectProvider();
            if (isSignInRedirect("http://localhost:3000/")) {
                const providerName = getProviderFromUrl();
                if (providerName) {
                    const authMethod = await provider.authenticate();
                    return { authMethod, provider, providerName }; // Return the data
                }
            } else {
                await provider.signIn();
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    } else {
        throw new Error("Cannot sign in with Google in a non-browser environment.");
    }
};