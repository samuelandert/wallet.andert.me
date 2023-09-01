// src/lib/services/signInWithGoogle.ts
import { connectProvider } from "$lib/setupLit";
import { isSignInRedirect, getProviderFromUrl } from "@lit-protocol/lit-auth-client";
import { writable } from 'svelte/store';

export let startSignIn = writable(false);

let providerName;

export const signInWithGoogle = async () => {
    if (typeof window !== 'undefined') {
        try {
            let provider = await connectProvider();
            if (isSignInRedirect("http://localhost:3000/")) {
                providerName = getProviderFromUrl();
                if (providerName) {
                    const authMethod = await provider.authenticate();
                    return { authMethod, provider, providerName };
                }
            } else {
                let shouldStartSignIn = false;
                startSignIn.subscribe(value => {
                    shouldStartSignIn = value;
                });
                if (!providerName && shouldStartSignIn) {
                    await provider.signIn();
                }
            }
        } catch (err) {
            console.error('Error during sign-in:', err);
            throw err;
        } finally {
            startSignIn.set(false);
        }
    } else {
        throw new Error("Cannot sign in with Google in a non-browser environment.");
    }
};