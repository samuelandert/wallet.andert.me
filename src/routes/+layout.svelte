<script lang="ts">
  import "../app.css";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";
  import { client } from "$lib/wundergraph";
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { initChainProvider } from "$lib/setupChainProvider";
  import { googleSession } from "$lib/stores.js";
  import GoogleSigner from "$lib/GoogleSigner.svelte";
  import GooglePKP from "$lib/GooglePKP.svelte";

  let activeSession = true;

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
    <div class="text-lg bg-white">{activeSession}</div>
    <slot />
    {#if activeSession}active {:else} <GooglePKP /> {/if}
    <GoogleSigner />
  </QueryClientProvider>
</div>
