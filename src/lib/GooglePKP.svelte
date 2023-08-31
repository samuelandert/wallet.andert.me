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
  let view = "SIGN_IN";
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
      if (myPKP.sessionSigs) {
        myPKP.parsedSigs = parseSessionSigs(myPKP.sessionSigs);
        console.log("test:  " + JSON.stringify(myPKP.parsedSigs));
        myPKP.active = myPKP.parsedSigs.some((sig) => !sig.isExpired);
        if (!myPKP.active) {
          view = "SIGN_IN";
        } else if (myPKP.active) {
          view = "READY";
        }
      } else {
        myPKP.active = false;
        view = "SIGN_IN";
      }
      localStorage.setItem("myPKP", JSON.stringify(myPKP));
    }
  }
  function parseSessionSigs(jsonData) {
    let sessionList = Object.values(jsonData).map((session) => {
      let sessionData = JSON.parse(session.signedMessage);
      let expirationDate = new Date(sessionData.expiration);
      let isExpired = expirationDate < new Date();
      return {
        sig: session.sig,
        expiration: expirationDate,
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
      view = "";
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
      view = "";
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
    view = "";
    const newPKP: IRelayPKP = await mintPkp(provider, authMethod);
    pkps = [...pkps, newPKP];
    status = "New PKP minted.";
    await createSession(newPKP);
  }

  async function createSession(pkp: IRelayPKP) {
    try {
      view = "";
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

<div>
  {#if view === "SIGN_IN"}
    <div class="p-8 bg-white bg-opacity-75 rounded shadow-md">
      <button
        on:click={authWithGoogle}
        class="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700 flex items-center justify-center"
      >
        <span class="mr-2"><Icon icon="flat-color-icons:google" /></span>
        <span>Sign in with Google</span>
      </button>
    </div>
  {/if}
  {#if view != "READY"}
    <div class="px-4 bg-white bg-opacity-75 rounded shadow-md">
      <div class="mt-4 text-center">
        <p class="text-gray-600">{status}</p>
      </div>
    </div>
  {/if}
  {#if view === "READY"}
    <div
      class="fixed bottom-0 left-0 right-0 p-3 bg-white bg-opacity-75 rounded-t-lg shadow-md flex flex-col items-center space-y-4"
    >
      <div class="w-full flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-2">
          <Icon
            icon="ic:baseline-account-circle"
            class="text-gray-500 w-12 h-12"
          />
          <div>
            <p class="text-sm">
              <span class="font-semibold">Address:</span>
              {myPKP.pkp.ethAddress}
            </p>
            <p class="text-xs">
              <span class="font-semibold">Provider:</span>
              {myPKP.provider}
            </p>
          </div>
        </div>
        <button
          on:click={clearSession}
          class="py-1 px-2 text-white bg-red-500 rounded hover:bg-red-700"
        >
          Clear Session
        </button>
      </div>
    </div>
  {/if}
</div>
