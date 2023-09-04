import { LitNodeClient } from "@lit-protocol/lit-node-client";
import type { AccsEVMParams } from "@lit-protocol/types";

export const createACC = async (newParameter, newComparator, newValue) => {
    const litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();

    const me = JSON.parse(localStorage.getItem('me'));
    if (!me || !me.sessionSigs) {
        throw new Error('No sessionSigs found in local storage');
    }

    const newACC = {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "",
        chain: "xdai",
        method: "",
        parameters: [newParameter],
        returnValueTest: {
            comparator: newComparator,
            value: newValue,
        },
    };

    const resourceId = {
        baseUrl: "https://localhost:3000",
        path: "/server/wundergraph",
        orgId: "°",
        role: "owner",
        extraData: "",
    };

    const sessionSigs = me.sessionSigs;

    await litNodeClient.saveSigningCondition({
        unifiedAccessControlConditions: [newACC],
        sessionSigs,
        resourceId,
        chain: "litSessionSign",
    });

    const jwt = await litNodeClient.getSignedToken({
        unifiedAccessControlConditions: [newACC],
        chain: 'xdai',
        sessionSigs,
        resourceId
    });

    let signingConditions = JSON.parse(localStorage.getItem("signingConditions")) || [];
    signingConditions = [
        ...signingConditions,
        {
            accs: [newACC],
            resourceId,
            jwt,
        },
    ];
    localStorage.setItem("signingConditions", JSON.stringify(signingConditions));
};

export const deleteACC = async (index) => {
    let signingConditions = JSON.parse(localStorage.getItem("signingConditions")) || [];
    signingConditions = signingConditions.filter((_, i) => i !== index);
    localStorage.setItem("signingConditions", JSON.stringify(signingConditions));
};
