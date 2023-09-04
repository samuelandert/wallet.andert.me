<script lang="ts">
  import "../app.css";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";
  import { client } from "$lib/wundergraph";
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { initChainProvider } from "$lib/setupChainProvider";
  import { googleSession } from "$lib/stores.js";
  import Wallet from "$lib/Wallet.svelte";
  import { Drawer, initializeStores } from "@skeletonlabs/skeleton";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import Signer from "$lib/Signer.svelte";

  initializeStores();

  const drawerStore = getDrawerStore();

  let activeSession = false;

  export let data: LayoutData;

  const token = Cookies.get("token");

  googleSession.subscribe((value) => {
    activeSession = value.activeSession;
  });

  onMount(() => {
    initChainProvider();
  });

  if (token) {
    console.log("layout jwt token: " + token);
    client.setAuthorizationToken(token);
  }
</script>

<Drawer>
  {#if $drawerStore.id === "signMessage"}
    <Signer messageToSign={{ hello: "me" }} />
  {:else}
    <!-- (fallback contents) -->
  {/if}</Drawer
>

<div
  class="grid h-screen bg-center bg-cover grid-rows-layout"
  style="background-image: url('lake.jpeg');"
>
  <QueryClientProvider client={data.queryClient}>
    <div class="w-full h-full p-6 overflow-hidden">
      <div class="w-full h-full overflow-hidden bg-white rounded-xl">
        <slot />
      </div>
    </div>
  </QueryClientProvider>

  <div class="row-start-2 row-end-3">
    <Wallet />
  </div>
</div>

<style>
  .grid-rows-layout {
    grid-template-rows: 1fr auto;
  }
</style>
