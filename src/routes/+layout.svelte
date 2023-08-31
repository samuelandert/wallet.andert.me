<script lang="ts">
  import "../app.css";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";
  import { client } from "$lib/wundergraph";
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { initChainProvider } from "$lib/setupChainProvider";

  export let data: LayoutData;

  const token = Cookies.get("token");

  onMount(() => {
    initChainProvider();
  });

  if (token) {
    client.setAuthorizationToken(token);
  }
</script>

<QueryClientProvider client={data.queryClient}>
  <slot />
</QueryClientProvider>
