<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";
  import { client } from "$lib/wundergraph";
  import Cookies from "js-cookie";

  export let data: LayoutData;

  const token = Cookies.get("token");

  // Set the Authorization header token
  if (token) {
    client.setAuthorizationToken(token);
  }
</script>

<QueryClientProvider client={data.queryClient}>
  <slot />
</QueryClientProvider>
