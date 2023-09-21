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
  import { goto } from "$app/navigation";

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
          class="btn variant-filled flex items-center justify-center py-2"
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
            <a href="/me" on:click|preventDefault={() => goto("/me")}>
              <div class="flex items-center space-x-2">
                <Icon
                  icon="iconamoon:profile-circle-fill"
                  class="w-12 h-12 text-gray-500"
                />
                <div>
                  <div class="text-sm">
                    <div class="font-semibold">Address</div>
                    {$state.context.pkps[0].ethAddress.substring(0, 8) + "..."}
                  </div>
                </div>
              </div>
            </a>
          </aside>
          <div class="col-span-5 w-full">
            <div class="flex justify-end space-x-4">
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
  <div class="flex justify-center items-center w-full pb-4">
    <div class="animate-spin">
      <Icon icon="la:spinner" width="48" height="48" />
    </div>
  </div>
{/if}
