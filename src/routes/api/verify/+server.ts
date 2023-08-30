import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';

export async function POST({ request }) {
    const { messageToSign, messageSignature, currentPKP } = await request.json();

    // Verify the signature
    const jsonString = JSON.stringify(messageToSign);
    const recoveredAddr = ethers.verifyMessage(jsonString, messageSignature);

    // Check if the address associated with the signature is the same as the current PKP
    const verified = currentPKP.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();

    return json({ verified }, { status: 200 });
}