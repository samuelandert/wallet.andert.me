import type { IRelayPKP } from '@lit-protocol/types';
import type { IProvider } from '$lib/IProvider';

export async function mintPkp(provider: IProvider, authMethod: any): Promise<IRelayPKP> {

    const txHash: string = await provider.mintPKPThroughRelayer(authMethod);
    const response = await provider.relay.pollRequestUntilTerminalState(txHash);
    if (response.status !== 'Succeeded') {
        throw new Error('Minting failed');
    }
    const newPKP: IRelayPKP = {
        tokenId: response.pkpTokenId,
        publicKey: response.pkpPublicKey,
        ethAddress: response.pkpEthAddress
    };

    return newPKP;
}
