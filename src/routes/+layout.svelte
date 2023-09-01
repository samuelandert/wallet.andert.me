<script lang="ts">
  import "../app.css";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";
  import { client } from "$lib/wundergraph";
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { initChainProvider } from "$lib/setupChainProvider";
  import { googleSession } from "$lib/stores.js";
  import GooglePKP from "$lib/GooglePKP.svelte";
  import GoogleSession from "$lib/GoogleSession.svelte";
  import Wallet from "$lib/Wallet.svelte";

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
    client.setAuthorizationToken(token);
  }
</script>

<div
  class="flex items-center justify-center h-screen bg-cover bg-center"
  style="background-image: url('lake.jpeg');"
>
  <QueryClientProvider client={data.queryClient}>
    <Wallet />
    <!-- <GoogleSession />
    <div class="text-lg bg-white">{activeSession}</div> -->
    <slot />
    <!-- {#if activeSession}active {:else} expired {/if}
    <GooglePKP /> -->
  </QueryClientProvider>
</div>
