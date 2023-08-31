<script>
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import { googleSession } from "$lib/stores.js";

  let myPKP;

  onMount(() => {
    myPKP = JSON.parse(localStorage.getItem("myPKP"));
    if (myPKP) {
      let parsedSigs = parseSessionSigs(myPKP.sessionSigs);
      let active = parsedSigs.some((sig) => !sig.isExpired);
      if (!active) {
        clearSession();
        googleSession.set({ activeSession: false });
      } else {
        googleSession.set({ activeSession: true });
      }
    }
  });

  $: {
    if (myPKP) {
      let parsedSigs = parseSessionSigs(myPKP.sessionSigs);
      let active = parsedSigs.some((sig) => !sig.isExpired);
      googleSession.set({ activeSession: true });
      if (!active) {
        clearSession();
        googleSession.set({ activeSession: false });
      } else {
        googleSession.set({ activeSession: true });
      }
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

  function clearSession() {
    localStorage.removeItem("myPKP");
    myPKP = null;
  }
</script>

{#if myPKP}
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
