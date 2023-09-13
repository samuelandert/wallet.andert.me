<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const filesQuery = createQuery({
    operationName: "Files",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Files</h1>
  </div>

  <div slot="main">
    <div class="w-full h-full overflow-y-auto">
      <div class="w-full h-full results">
        {#if $filesQuery.isLoading}
          <p>Loading...</p>
        {:else if $filesQuery.error}
          <pre>Error: {JSON.stringify($filesQuery.error, null, 2)}</pre>
        {:else}
          <pre>{JSON.stringify($filesQuery.data, null, 2)}</pre>
          {#each $filesQuery.data.system_db_files as file}{/each}
        {/if}
      </div>
    </div>
  </div>
</HeaderMain>
