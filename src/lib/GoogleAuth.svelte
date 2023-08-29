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
  import Signer from "./Signer.svelte";

  const redirectUri = "http://localhost:3000/";

  let sessionSigs = null;
  let error, currentPKP, authMethod, provider;
  let status = "Initializing...";
  let pkps: IRelayPKP[] = [];
  let view = "SIGN_IN";
  let sessionStatuses;
  let activeSession = null;

  let messageToSign = { user: "Sam", loggedIn: true };

  onMount(async () => {
    initialize();
  });

  $: if (sessionSigs) {
    // Update sessionStatuses
    sessionStatuses = Object.entries(sessionSigs).map(([node, data]) => {
      const sessionKey = JSON.parse(data.signedMessage).sessionKey;
      const expiration = new Date(JSON.parse(data.signedMessage).expiration);
      const isExpired = expiration < new Date();
      return {
        node,
        sessionKey,
        expiration: expiration.toISOString(),
        isExpired,
      };
    });

    // Find an active session and store it in local storage
    activeSession = sessionStatuses.find(({ isExpired }) => !isExpired);
    if (activeSession) {
      localStorage.setItem("google-session", JSON.stringify(activeSession));
    }

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
      Signer
      <Signer {messageToSign} />
      Sessions
      {#if activeSession}
        <div>
          <h3>Active Session:</h3>
          <p>Node: {activeSession.node}</p>
          <p>Session Key: {activeSession.sessionKey}</p>
          <p>Expiration: {activeSession.expiration}</p>
        </div>
      {/if}
      {#each sessionStatuses as { node, sessionKey, expiration, isExpired }}
        <p>
          {isExpired ? "🔴" : "🟢"} Node: {node}, Session Key: {sessionKey},
          Expiration: {expiration}
        </p>
      {/each}
    {/if}
    <div class="mt-4 text-center">
      <p>{status}</p>
    </div>
  </div>
</div>
