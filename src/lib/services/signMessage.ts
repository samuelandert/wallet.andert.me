// $lib/services/signMessage.ts
import { ethers } from "ethers";

export async function signMessageWithPKP(sessionSigs, currentPKP, messageToSign) {
    try {
        const jsonString = JSON.stringify(messageToSign);
        const toSign = ethers.getBytes(ethers.hashMessage(jsonString));

        const litActionCode = `
      const go = async () => {
        const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
      };
      go();
    `;

        const litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
        await litNodeClient.connect();

        const results = await litNodeClient.executeJs({
            code: litActionCode,
            sessionSigs: sessionSigs,
            jsParams: {
                toSign: toSign,
                publicKey: currentPKP.publicKey,
                sigName: "sig1",
            },
        });

        const result = results.signatures["sig1"];
        const messageSignature = ethers.Signature.from({
            r: "0x" + result.r,
            s: "0x" + result.s,
            v: result.recid,
        });

        return { messageSignature };
    } catch (err) {
        console.error(err);
        return { error: err };
    }
}