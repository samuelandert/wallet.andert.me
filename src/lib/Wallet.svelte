<script>
  import { useMachine } from "@xstate/svelte";
  import walletMachine from "./machines/walletMachine";
  import { onMount } from "svelte";

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
</script>

{#if $state.matches("creatingSession")}
  <div class="bg-white p-10">
    <p>Authenticated successfully. Selecting or minting PKP...</p>
  </div>
{:else if $state.matches("sessionAvailable")}
  <div class="bg-white p-10">
    <p>Signed in successfully. Here is your PKP:</p>
    <pre>{JSON.stringify($state.context.pkps[0].ethAddress, null, 2)}</pre>
    <p>Session available. Here are your session signatures:</p>
    <div class="flex flex-col">
      {#each Object.keys($state.context.sessionSigs) as key}
        <div class="flex items-center p-2 bg-white rounded shadow mb-2">
          <div
            class="w-4 h-4 mr-2 rounded-full"
            class:bg-green-500={!$state.context.sessionSigs[key].expired}
            class:bg-red-500={$state.context.sessionSigs[key].expired}
          />
          <div class="flex-grow">
            <p class="font-bold">{key}</p>
            <p class="text-sm text-gray-500">
              {$state.context.sessionSigs[key].sig}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if $state.matches("sessionExpired")}
  <div class="bg-white p-10">
    <p>Error creating session. Please try again.</p>
    <pre>{JSON.stringify($state.context.error, null, 2)}</pre>
  </div>
{/if}
