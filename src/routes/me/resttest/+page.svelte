<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const cloudronQuery = createQuery({
    operationName: "Cloudron",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Cloudron Test</h1>
  </div>

  <div slot="main" class="h-full w-full overflow-scroll">
    <div class="w-full h-full overflow-scroll">
      {#if $cloudronQuery.isLoading}
        <p>Loading...</p>
      {:else if $cloudronQuery.error}
        <pre>Error: {JSON.stringify($cloudronQuery.error, null, 2)}</pre>
      {:else}
        <pre>{JSON.stringify($cloudronQuery.data, null, 2)}</pre>
      {/if}
    </div>
  </div>
</HeaderMain>
