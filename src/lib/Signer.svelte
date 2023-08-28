<!-- SignVerifyMessage.svelte -->
<script lang="ts">
  import { ethers } from "ethers";
  import { createEventDispatcher } from "svelte";

  export let litNodeClient;
  export let currentPKP;
  export let sessionSigs;
  export let messageToSign = { user: "Sam", loggedIn: true };

  let status = "";
  let jsonObjectToVerify = null;

  const dispatch = createEventDispatcher();

  async function signMessageWithPKP() {
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
      const signature = ethers.Signature.from({
        r: "0x" + result.r,
        s: "0x" + result.s,
        v: result.recid,
      });

      // Add the signature to the JSON object
      messageToSign.signature = signature;

      jsonObjectToVerify = { ...messageToSign };

      // Display the signed JSON
      status = JSON.stringify(messageToSign, null, 2);

      // Verify the signature
      const recoveredAddr = ethers.verifyMessage(jsonString, signature);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentPKP.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();

      if (verified) {
        status = "The signature is valid.";
      } else {
        status = "The signature is invalid.";
      }

      dispatch("status", status);
    } catch (err) {
      console.error(err);
      dispatch("error", err);
    }
  }
</script>

<button on:click={signMessageWithPKP}>Sign Message</button>
{#if messageToSign}
  <pre>{JSON.stringify(messageToSign)}</pre>
{/if}
