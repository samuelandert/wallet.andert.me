// src/lib/services/createSession.ts
import { createLitSession } from '$lib/createLitSession';
import type { IRelayPKP } from "@lit-protocol/types";

export const createSession = async (provider, authMethod, pkps: IRelayPKP[]) => {
    try {
        let currentPKP;
        if (pkps.length === 0) {
            currentPKP = await provider.mintPKP(authMethod);
            pkps = [...pkps, currentPKP];
        } else {
            currentPKP = pkps[0];
        }

        const sessionSigs = await createLitSession(
            provider,
            currentPKP.publicKey,
            authMethod,
        );

        return { pkps, sessionSigs };
    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
};