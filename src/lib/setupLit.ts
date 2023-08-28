// litProviderSetup.ts

import {
    LitAuthClient,
    GoogleProvider,
    BaseProvider,
} from '@lit-protocol/lit-auth-client';
import { ProviderType } from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';

let provider: BaseProvider | undefined;

export async function connectProvider() {
    const litNodeClient = new LitNodeClient({
        litNetwork: 'serrano',
        debug: false
    });
    await litNodeClient.connect();

    const litAuthClient = new LitAuthClient({
        litRelayConfig: {
            relayApiKey: 'test-api-key'
        },
        litNodeClient
    });

    provider = litAuthClient.initProvider<GoogleProvider>(ProviderType.Google);

    return provider;
}
