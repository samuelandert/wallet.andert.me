<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const projectsQuery = createQuery({
    operationName: "Projects",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Projects</h1>
  </div>

  <div slot="main">
    <div class="w-full h-full overflow-y-auto">
      <div class="w-full h-full results">
        {#if $projectsQuery.isLoading}
          <p>Loading...</p>
        {:else if $projectsQuery.error}
          <pre>Error: {JSON.stringify($projectsQuery.error, null, 2)}</pre>
        {:else}
          <pre>{JSON.stringify($projectsQuery.data, null, 2)}</pre>
        {/if}
      </div>
    </div>
  </div>
</HeaderMain>
