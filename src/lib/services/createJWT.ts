import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type { AccsEVMParams } from "@lit-protocol/types";

export const createJWT = async () => {

    const litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();

    const me = JSON.parse(localStorage.getItem('me'));
    if (!me || !me.sessionSigs) {
        throw new Error('No sessionSigs found in local storage');
    }

    const resourceId = {
        baseUrl: "https://localhost:3000/",
        path: "wunderauth",
        orgId: "°",
        role: "owner",
        extraData: ""
    }

    const sessionSigs = me.sessionSigs;

    const unifiedAccessControlConditions: AccsEVMParams[] = [
        {
            conditionType: 'evmBasic',
            contractAddress: '',
            standardContractType: '',
            chain: 'xdai',
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
                comparator: '>=',
                value: '1000000000000',
            },
        },
    ];

    await litNodeClient.saveSigningCondition({
        unifiedAccessControlConditions,
        sessionSigs,
        resourceId,
        chain: "litSessionSign",
    });


    const jwt = await litNodeClient.getSignedToken({
        unifiedAccessControlConditions,
        chain: 'xdai',
        sessionSigs,
        resourceId
    });

    return jwt;
};