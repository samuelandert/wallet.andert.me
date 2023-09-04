import type { IProvider } from '$lib/services/provider/IProvider';
import { LitAccessControlConditionResource, LitAbility } from '@lit-protocol/auth-helpers';

export async function createLitSession(
    provider: IProvider,
    pkpPublicKey: string,
    authMethod: any,
): Promise<any> {
    const litResource = new LitAccessControlConditionResource('*');
    return await provider.getSessionSigs({
        pkpPublicKey,
        authMethod,
        sessionSigsParams: {
            chain: 'xdai',
            resourceAbilityRequests: [
                {
                    resource: litResource,
                    ability: LitAbility.PKPSigning
                }
            ]
        }
    });
}
