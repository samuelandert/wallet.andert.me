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
  import { googleSession } from "./stores";

  const redirectUri = "http://localhost:3000/";

  let authMethod, provider;
  let status = "Initializing...";
  let pkps: IRelayPKP[] = [];

  onMount(async () => {
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
      const currentPKP = pkp; // Assign the selected PKP to currentPKP
      const sessionSigs = await createLitSession(
        provider,
        pkp.publicKey,
        authMethod
      );
      // Add the sessionSigs and PKP to localstorage
      localStorage.setItem(
        "myPKP",
        JSON.stringify({
          provider: "google",
          pkp: currentPKP,
          sessionSigs: sessionSigs,
        })
      );

      status = "Session created successfully.";
    } catch (err) {
      console.log(err);
    }
  }
</script>

<div>
  <div class="p-8 bg-white bg-opacity-75 rounded shadow-md">
    <button
      on:click={authWithGoogle}
      class="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700 flex items-center justify-center"
    >
      <span class="mr-2"><Icon icon="flat-color-icons:google" /></span>
      <span>Sign in with Google</span>
    </button>
  </div>
  <div class="px-4 bg-white bg-opacity-75 rounded shadow-md">
    <div class="mt-4 text-center">
      <p class="text-gray-600">{status}</p>
    </div>
  </div>
</div>
