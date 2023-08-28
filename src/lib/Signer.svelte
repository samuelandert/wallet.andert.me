<!-- SignVerifyMessage.svelte -->
<script lang="ts">
  import { ethers } from "ethers";
  import { onMount } from "svelte";

  export let messageToSign = {};

  let currentPKP;
  let sessionSigs;
  let status = "";
  let litNodeClient;
  let messageSignature;

  onMount(async () => {
    litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();

    const sessionSigsLocalStorage = localStorage.getItem("google-signature");
    const currentPKPLocalStorage = localStorage.getItem("current-pkp");
    if (sessionSigsLocalStorage && currentPKPLocalStorage) {
      sessionSigs = JSON.parse(sessionSigsLocalStorage);
      currentPKP = JSON.parse(currentPKPLocalStorage);
    }
  });

  export async function signMessageWithPKP() {
    const userConfirmed = window.confirm(
      "Do you want to sign the following message?\n\n" +
        JSON.stringify(messageToSign, null, 2)
    );

    if (!userConfirmed) {
      status = "User did not allow to sign the message.";
      dispatch("status", status);
      return;
    }
    try {
      // Create a specific JSON object
      const jsonString = JSON.stringify(messageToSign);

      // Convert the JSON string to an array of character codes
      const toSign = ethers.getBytes(ethers.hashMessage(jsonString));

      const litActionCode = `
        const go = async () => {
          const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
        };
        go();
      `;

      // Sign message
      const results = await litNodeClient.executeJs({
        code: litActionCode,
        sessionSigs: sessionSigs,
        jsParams: {
          toSign: toSign,
          publicKey: currentPKP.publicKey,
          sigName: "sig1",
        },
      });

      // Get signature
      const result = results.signatures["sig1"];
      messageSignature = ethers.Signature.from({
        r: "0x" + result.r,
        s: "0x" + result.s,
        v: result.recid,
      });

      // Display the signed JSON
      status = JSON.stringify(messageToSign, null, 2);

      // Verify the signature
      const recoveredAddr = ethers.verifyMessage(jsonString, messageSignature);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentPKP.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();

      if (verified) {
        status = "The signature is valid.";
      } else {
        status = "The signature is invalid.";
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

<button on:click={signMessageWithPKP}>Sign Message</button>
{#if messageToSign}
  <pre>{JSON.stringify(messageToSign)}</pre>
{/if}

{#if status}
  <div class="mt-4 text-center">
    <p>Status: {status}</p>
  </div>
{/if}
{#if messageSignature}
  <div class="mt-4 text-center">
    <h3>Signature</h3>
    <pre>{JSON.stringify(messageSignature)}</pre>
  </div>
{/if}
