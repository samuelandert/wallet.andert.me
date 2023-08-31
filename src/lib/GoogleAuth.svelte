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
  let currentPKP, authMethod, provider;
  let status = "Initializing...";
  let pkps: IRelayPKP[] = [];
  let view = "SIGN_IN";

  onMount(async () => {
    initialize();

    const storedSession = localStorage.getItem("google-session");
    const storedPKP = localStorage.getItem("current-pkp");
    if (storedSession != null) {
      sessionSigs = JSON.parse(storedSession);
      currentPKP = JSON.parse(storedPKP);
      view = "READY";
    } else {
      view = "SIGN_IN";
    }
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
        localStorage.setItem("google-session", JSON.stringify(sessionSigs));
        localStorage.setItem("current-pkp", JSON.stringify(currentPKP));
      });
      status = "Session created successfully.";
      view = "SIGN_IN";
    } catch (err) {
      console.log(err);
    }
  }
</script>

<div class="flex items-center justify-center h-screen">
  <div>
    {#if view === "SIGN_IN"}
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
      <p>{status}</p>
    </div>
  </div>
</div>
