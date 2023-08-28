<script lang="ts">
  import { onMount } from "svelte";
  import {
    isSignInRedirect,
    getProviderFromUrl,
  } from "@lit-protocol/lit-auth-client";
  import type { IRelayPKP } from "@lit-protocol/types";
  import Icon from "@iconify/svelte";
  import { createLitSession } from "./createLitSession";
  import { connectProvider } from "./setupLit";
  import { ethers } from "ethers";

  const redirectUri = "http://localhost:3000/";

  let sessionSigs, error, currentPKP, authMethod, provider;
  let messageToSign = { user: "Sam", loggedIn: true, signature: "" };
  let status = "Initializing...";
  let jsonObjectToVerify = null;
  let pkps: IRelayPKP[] = [];
  let view = "SIGN_IN";

  onMount(() => {
    initialize();
  });

  async function initialize() {
    status = "Connecting to Google provider...";
    try {
      provider = await connectProvider();
      status = "Connected to Google provider.";
      if (isSignInRedirect(redirectUri)) {
        const providerName = getProviderFromUrl();
        if (providerName) {
          await handleRedirect(providerName);
        }
      }
    } catch (err) {
      setError(err);
    }
  }

  async function authWithGoogle() {
    try {
      if (!provider) {
        provider = await connectProvider();
        status = "Reconnected to Google provider.";
      }
      await provider.signIn();
      status = "Signed in with Google.";
    } catch (err) {
      setError(err);
    }
  }

  async function handleRedirect(providerName: string) {
    try {
      if (!provider) throw new Error("Invalid provider.");
      authMethod = await provider.authenticate();
      status = "Authenticated successfully.";
      pkps = await provider.fetchPKPsThroughRelayer(authMethod);
      status = "Fetched PKPs.";
      if (pkps.length === 0) {
        status = "No PKPs found. Minting...";
        await mint();
      } else {
        // Update the view to 'PKP' to show the available PKPs
        view = "PKP";
      }
    } catch (err) {
      setError(err);
    }
  }

  async function mint() {
    const newPKP: IRelayPKP = await mintPkp(provider, authMethod);
    pkps = [...pkps, newPKP];
    status = "New PKP minted.";
    await createSession(newPKP);
  }

  async function createSession(pkp: IRelayPKP) {
    try {
      currentPKP = pkp; // Assign the selected PKP to currentPKP
      sessionSigs = await createLitSession(provider, pkp.publicKey, authMethod);
      status = "Session created successfully.";
      view = "READY";
    } catch (err) {
      setError(err);
    }
  }

  function setError(err) {
    error = err;
    view = "ERROR";
    status = `Error: ${err.message}`;
  }

  async function signMessageWithPKP() {
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

      console.log(
        "JSON object to sign: " + JSON.stringify(jsonObjectToVerify, null, 2)
      );

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
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }
</script>

<div class="flex items-center justify-center h-screen">
  <div>
    {#if error}
      <div class="mt-4 text-center">
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    {:else if view === "SIGN_IN"}
      <button on:click={authWithGoogle} class="btn variant-filled">
        <span><Icon icon="flat-color-icons:google" /></span>
        <span>Sign in with Google</span>
      </button>
    {/if}
    {#if view === "PKP"}
      <div>
        <h1>Select a PKP</h1>
        <ul>
          {#each pkps as pkp (pkp.publicKey)}
            <li>
              <button on:click={() => createSession(pkp)}>Use this PKP</button>
              <pre>{JSON.stringify(pkp, null, 2)}</pre>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if view === "READY"}
      <div>
        <h1>Ready to sign</h1>
        <button on:click={signMessageWithPKP}>Sign Message</button>
        {#if messageToSign}
          <pre>{JSON.stringify(messageToSign)}</pre>
        {/if}
      </div>
    {/if}
    <div class="mt-4 text-center">
      <h1>Status</h1>
      <p>{status}</p>
    </div>
  </div>
</div>
