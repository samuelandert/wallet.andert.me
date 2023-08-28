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

  const redirectUri = "http://localhost:3000/";

  let sessionSigs = null;
  let litNodeClient, error, currentPKP, authMethod, provider;
  let status = "Initializing...";
  let pkps: IRelayPKP[] = [];
  let view = "SIGN_IN";
  let sessionSigsObject;

  onMount(async () => {
    // litNodeClient = new LitNodeClient({ litNetwork: "serrano" });
    // await litNodeClient.connect();
    const sessionSigsLocalStorage = localStorage.getItem("google-signature");
    const currentPKPLocalStorage = localStorage.getItem("current-pkp");
    if (sessionSigsLocalStorage && currentPKPLocalStorage) {
      sessionSigs = JSON.parse(sessionSigsLocalStorage);
      currentPKP = JSON.parse(currentPKPLocalStorage);
    } else {
      initialize();
    }
    if (sessionSigsLocalStorage) {
      sessionSigsObject = JSON.parse(sessionSigsLocalStorage);
    }
  });

  $: if (sessionSigs) {
    view = "READY";
  }

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
      status = "Signing in with Google...";
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
      status = "Fetching your Google PKP...";
      if (pkps.length === 0) {
        status = "No PKPs found. Minting new PKP...";
        await mint();
      } else {
        // Use the first PKP directly
        await createSession(pkps[0]);
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
      createLitSession(provider, pkp.publicKey, authMethod).then((sigs) => {
        sessionSigs = sigs;
        // Store sessionSigs and currentPKP in localStorage
        localStorage.setItem("google-signature", JSON.stringify(sessionSigs));
        localStorage.setItem("current-pkp", JSON.stringify(currentPKP));
      });
      status = "Session created successfully.";
    } catch (err) {
      setError(err);
    }
  }

  function setError(err) {
    error = err;
    view = "ERROR";
    status = `Error: ${err.message}`;
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
    {#if view === "READY"}
      <div>
        <h3>Your PKP Address:</h3>
        <p>{currentPKP.ethAddress}</p>
      </div>
    {/if}
    <div class="mt-4 text-center">
      <h1>Status</h1>
      <p>{status}</p>
    </div>
    <!-- <div class="mt-4 text-center">
      Session Signature
      {#if sessionSigsObject}
        <div class="mt-4 text-center">
          <h1>Session Signatures</h1>
          {#each Object.keys(sessionSigsObject) as nodeAddress}
            <div class="session-sig">
              <h2>{nodeAddress}</h2>
              <p>Signature: {sessionSigsObject[nodeAddress].sig}</p>
              <p>Derived Via: {sessionSigsObject[nodeAddress].derivedVia}</p>
              <p>Address: {sessionSigsObject[nodeAddress].address}</p>
              <p>Algorithm: {sessionSigsObject[nodeAddress].algo}</p>
              <h3>Signed Message</h3>
              <pre>{sessionSigsObject[nodeAddress].signedMessage}</pre>
            </div>
          {/each}
        </div>
      {/if}
    </div> -->
  </div>
</div>
