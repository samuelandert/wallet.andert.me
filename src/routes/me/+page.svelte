<script lang="ts">
  import { createQuery } from "../../lib/wundergraph";
  import JWT from "$lib/JWT.svelte";

  const projectsQuery = createQuery({
    operationName: "Projects",
  });
</script>

<div class="w-full h-full overflow-y-auto">
  <JWT />

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
