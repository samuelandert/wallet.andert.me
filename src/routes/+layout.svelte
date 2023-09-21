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

  const signingConditionsCookie = Cookies.get("signingConditions");
  let signingConditions = signingConditionsCookie
    ? JSON.parse(signingConditionsCookie)
    : [];
  let correctCondition = signingConditions
    ? signingConditions.find(
        (condition) =>
          condition.resourceId.baseUrl === "https://localhost:3000" &&
          condition.resourceId.path === "/server/wundergraph" &&
          condition.resourceId.role === "owner"
      )
    : null;

  const token = correctCondition ? correctCondition.jwt : null;

  googleSession.subscribe((value) => {
    activeSession = value.activeSession;
  });

  onMount(() => {
    initChainProvider();
  });

  if (token) {
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
<div class="grid h-screen grid-layout bg-color">
  <QueryClientProvider client={data.queryClient} class="main">
    <slot />
  </QueryClientProvider>

  <footer>
    <Wallet />
  </footer>
</div>

<style>
  .bg-color {
    background-color: #e6e7e1;
  }
  .grid-layout {
    grid-template-areas:
      "main "
      "footer ";
    grid-template-rows: 1fr auto;
  }
  .main {
    grid-area: main;
  }

  footer {
    grid-area: footer;
  }
</style>
