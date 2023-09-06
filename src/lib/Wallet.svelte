<script>
  import { useMachine } from "@xstate/svelte";
  import walletMachine from "./machines/walletMachine";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import { walletState, signRequest } from "./stores";
  import {
    signInWithGoogle,
    startSignIn as startSignInService,
  } from "./services/signInWithGoogle";
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  const { state, send } = useMachine(walletMachine);
  const drawerStore = getDrawerStore();

  let search = "";
  $: walletState.set($state.context);

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

  function signRequestTrigger() {
    signRequest.set({
      status: "SIGN REQUEST",
      messageToSign: { hello: "test" },
      signature: null,
      drawer: true,
    });
  }

  $: if ($signRequest.drawer) {
    const settings = { position: "bottom", id: "signMessage" };
    drawerStore.open(settings);
  } else {
    drawerStore.close();
  }
</script>

{#if $state.matches("sessionAvailable") || $state.matches("creatingSession") || $state.matches("signIn")}
  {#if $state.matches("signIn")}
    <div class="flex items-center justify-center pb-4">
      <div class="flex flex-col items-center w-1/3">
        <button
          on:click={startSignIn}
          class="flex items-center justify-center w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <span class="mr-2"><Icon icon="flat-color-icons:google" /></span>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  {:else if $state.context.pkps}
    <div class="flex flex-col items-center p-3 space-y-4">
      <div class="flex items-center justify-between w-full space-x-4">
        <div class="w-full h-full overflow-hidden grid grid-cols-6">
          <aside class="col-span-1">
            <div class="flex items-center space-x-2">
              <Icon
                icon="iconamoon:profile-circle-fill"
                class="w-12 h-12 text-gray-500"
              />
              <div>
                <p class="text-sm">
                  <span class="font-semibold">Address:</span>
                  {$state.context.pkps[0].ethAddress.substring(0, 8) + "..."}
                </p>
                <p class="text-xs">
                  <span class="font-semibold">Provider:</span>
                  {$state.context.providerName}
                </p>
              </div>
            </div>
          </aside>
          <div class="col-span-5 w-full">
            <div class="flex justify-end space-x-4">
              <div class="w-full">
                <input bind:value={search} class="input" type="text" />
              </div>
              <button type="button" class="btn-icon variant-filled-success">
                <div class="px-4">
                  <Icon
                    icon="carbon:send-alt-filled"
                    class=""
                    width="24"
                    height="24"
                  />
                </div>
              </button>
              <button
                on:click={signRequestTrigger}
                type="button"
                class="btn variant-filled">SignRequest</button
              >
              <button
                type="button"
                class="btn variant-filled"
                on:click={clearSession}>Logout</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if $state.matches("sessionExpired")}
    <div class="p-10 bg-white">
      <p>Error creating session. Please try again.</p>
      <pre>{JSON.stringify($state.context.error, null, 2)}</pre>
    </div>
  {/if}
{:else}
  <div class="p-10 bg-white rounded-full">
    <div class="p-5 bg-white rounded-full animate-spin">
      <Icon icon="la:spinner" width="100" height="100" />
    </div>
  </div>
{/if}
