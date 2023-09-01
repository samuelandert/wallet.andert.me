<script>
  import { useMachine } from "@xstate/svelte";
  import walletMachine from "./machines/walletMachine";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import {
    signInWithGoogle,
    startSignIn as startSignInService,
  } from "./services/signInWithGoogle";

  const { state, send } = useMachine(walletMachine);

  $: {
    if ($state.context.pkps && $state.context.sessionSigs) {
      localStorage.setItem(
        "me",
        JSON.stringify({
          pkps: $state.context.pkps,
          sessionSigs: $state.context.sessionSigs,
        })
      );
    }
  }
  onMount(() => {
    const me = JSON.parse(localStorage.getItem("me"));
    if (me && me.pkps && me.sessionSigs) {
      send({ type: "RELOAD", ...me });
    }
  });

  async function startSignIn() {
    startSignInService.set(true);
    await signInWithGoogle();
  }
  function clearSession() {
    send("LOGOUT");
  }
</script>

{#if $state.matches("sessionAvailable") || $state.matches("creatingSession") || $state.matches("signIn")}
  {#if $state.matches("signIn")}
    <div class="w-1/3">
      <button
        on:click={startSignIn}
        class="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700 flex items-center justify-center"
      >
        <span class="mr-2"><Icon icon="flat-color-icons:google" /></span>
        <span>Sign in with Google</span>
      </button>
    </div>
  {:else if $state.context.pkps}
    <div
      class="fixed bottom-0 left-0 right-0 p-3 bg-white bg-opacity-75 rounded-t-lg shadow-md flex flex-col items-center space-y-4"
    >
      <div class="w-full flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-2">
          <div>
            <p class="text-sm">
              <span class="font-semibold">Address:</span>
              {$state.context.pkps[0].ethAddress}
            </p>
            <p class="text-xs">
              <span class="font-semibold">Provider:</span>
              {$state.context.providerName}
            </p>
          </div>
        </div>
        <button
          on:click={clearSession}
          class="py-1 px-2 text-white bg-red-500 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  {:else if $state.matches("sessionExpired")}
    <div class="bg-white p-10">
      <p>Error creating session. Please try again.</p>
      <pre>{JSON.stringify($state.context.error, null, 2)}</pre>
    </div>
  {/if}
{:else}
  <div class="bg-white p-10 rounded-full">
    <div class="bg-white rounded-full p-5 animate-spin">
      <Icon icon="la:spinner" width="100" height="100" />
    </div>
  </div>
{/if}
