// src/lib/services/createJwt.ts
import { createSession } from './createSession';
import type { IProvider } from '$lib/IProvider';

export const createJwt = async (provider: IProvider, authMethod: any, pkps: IRelayPKP[]) => {
    const { sessionSigs } = await createSession(provider, authMethod, pkps);

    const litNodeClient = new LitNodeClient({
        provider,
        chain: 'xdai',
        authSig: sessionSigs,
    });

    const unifiedAccessControlConditions = [
        {
            conditionType: 'evmBasic',
            contractAddress: '',
            standardContractType: '',
            chain: 'xdai',
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
                comparator: '>=',
                value: '10000000000000',
            },
        },
    ];

    const jwt = await litNodeClient.getSignedToken({
        unifiedAccessControlConditions,
        sessionSigs,
        resourceId: 'wundergraph-auth', // replace with your resource id
    });

    return jwt;
};