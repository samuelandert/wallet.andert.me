import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

export async function sendTxWithPKPWallet(pkp, sessionSigs) {

    const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: pkp.publicKey,
        rpc: "https://rpc.gnosischain.com/"
    });
    await pkpWallet.init();

    const from = pkpWallet.address;
    const to = '0x1A5cfC9EA11afb50011F847fb7dC07bA1e18b05A';
    const value = BigInt(100000000000000000);
    const gasLimit = 21000;

    const tx = {
        from,
        to,
        value,
        gasLimit,
    };
    console.log('transaction created: ' + tx);

    const signedTx = await pkpWallet.signTransaction(tx);
    console.log('transaction signed: ' + signedTx);

    await pkpWallet.sendTransaction(signedTx);
    console.log('transaction sent');
}