<!-- SignVerifyMessage.svelte -->
<script lang="ts">
  import { ethers } from "ethers";
  import { onMount } from "svelte";
  // import { fetchBalance, serialize } from "@wagmi/core";

  export let messageToSign = {};

  let currentPKP;
  let sessionSigs;
  let status = "";
  let litNodeClient;
  let messageSignature;

  onMount(async () => {
    litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
    await litNodeClient.connect();

    const sessionSigsLocalStorage = localStorage.getItem("google-session");
    const currentPKPLocalStorage = localStorage.getItem("current-pkp");
    if (sessionSigsLocalStorage && currentPKPLocalStorage) {
      sessionSigs = JSON.parse(sessionSigsLocalStorage);
      currentPKP = JSON.parse(currentPKPLocalStorage);
    }
  });

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
      messageSignature = ethers.Signature.from({
        r: "0x" + result.r,
        s: "0x" + result.s,
        v: result.recid,
      });

      // verify();
    } catch (err) {
      console.error(err);
    }
  }
  async function verify() {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageToSign,
        messageSignature,
        currentPKP,
      }),
    });
    if (!response.ok) {
      alert("verify failed");
    } else {
      let json = await response.json();
      alert(json.verified ? "Signature valid" : "! Signature NOT valid !");
    }
  }

  // async function getJWT() {
  //   var unifiedAccessControlConditions = [
  //     {
  //       conditionType: "evmBasic",
  //       contractAddress: "",
  //       standardContractType: "",
  //       chain: "xdai",
  //       method: "eth_getBalance",
  //       parameters: [":userAddress", "latest"],
  //       returnValueTest: {
  //         comparator: ">=",
  //         value: "10000000000000",
  //       },
  //     },
  //   ];

  //   // Saving signing condition
  //   await litNodeClient.saveSigningCondition({
  //     unifiedAccessControlConditions,
  //     sessionSigs,
  //     resourceId: { test: "hello" },
  //     chain: "litSessionSign",
  //   });

  //   // Retrieving a signature
  //   let jwt = await litNodeClient.getSignedToken({
  //     unifiedAccessControlConditions,
  //     sessionSigs,
  //     resourceId: { test: "hello" },
  //   });

  //   alert("JWT: " + jwt);
  // }
</script>

<button on:click={signMessageWithPKP}>Sign Message</button>
<!-- <button on:click={getJWT}>Get JWT</button> -->

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
  <button on:click={verify}>Verify</button><br />
{/if}
