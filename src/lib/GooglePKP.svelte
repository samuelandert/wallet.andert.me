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

  let authMethod, provider;
  let status = "Initializing...";
  let pkps: IRelayPKP[] = [];
  let view = "";
  let myPKP;

  onMount(async () => {
    initialize();
    myPKP = JSON.parse(localStorage.getItem("myPKP"));
    if (myPKP.active) {
      view = "READY";
    }
  });

  $: {
    if (myPKP) {
      if (myPKP && myPKP.sessionSigs) {
        myPKP.parsedSigs = parseSessionSigs(myPKP.sessionSigs);
        myPKP.active = myPKP.parsedSigs.some((sig) => !sig.isExpired);
        if (!myPKP.active) {
          view = "SIGN_IN";
        }
      } else {
        myPKP.active = false;
        view = "SIGN_IN";
      }
      localStorage.setItem("myPKP", JSON.stringify(myPKP));
    }
  }

  // Add this function
  function parseSessionSigs(jsonData) {
    let sessionList = Object.values(jsonData).map((session) => {
      let sessionData = JSON.parse(session.signedMessage);
      let expirationDate = new Date(sessionData.expiration);
      let isExpired = expirationDate < new Date();
      return {
        sig: session.sig,
        expiration: sessionData.expiration,
        isExpired: isExpired,
      };
    });
    return sessionList;
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
          active: true,
        })
      );
      myPKP = JSON.parse(localStorage.getItem("myPKP"));
      status = "Session created successfully.";
      view = "READY";
    } catch (err) {
      console.log(err);
    }
  }
  function clearSession() {
    localStorage.removeItem("myPKP");
    myPKP = null;
    view = "SIGN_IN";
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
        <h3>Your PKP:</h3>
        <p>Address: {myPKP.pkp.ethAddress}</p>
        <p>Provider: {myPKP.provider}</p>
        <button on:click={clearSession} class="btn variant-filled"
          >Clear Session</button
        >
      </div>
    {/if}
    <div class="mt-4 text-center">
      <p>{status}</p>
    </div>
  </div>
</div>
