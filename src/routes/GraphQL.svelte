<script lang="ts">
  import { createQuery } from "../lib/wundergraph";

  //   const dragonsQuery = createQuery({
  //     operationName: "Dragons",
  //   });
  const projectsQuery = createQuery({
    operationName: "Projects",
  });
  const todosQuery = createQuery({
    operationName: "Todos",
  });
</script>

<!-- Dragons
<div class="results">
  {#if $dragonsQuery.isLoading}
    <p>Loading...</p>
  {:else if $dragonsQuery.error}
    <pre>Error: {JSON.stringify($dragonsQuery.error, null, 2)}</pre>
  {:else}
    <pre>{JSON.stringify($dragonsQuery.data, null, 2)}</pre>
  {/if}
</div> -->

Projects
<div class="results">
  {#if $projectsQuery.isLoading}
    <p>Loading...</p>
  {:else if $projectsQuery.error}
    <pre>Error: {JSON.stringify($projectsQuery.error, null, 2)}</pre>
  {:else}
    <pre>{JSON.stringify($projectsQuery.data, null, 2)}</pre>
  {/if}
</div>

Todos
<div class="results">
  {#if $todosQuery.isLoading}
    <p>Loading...</p>
  {:else if $todosQuery.error}
    <pre>Error: {JSON.stringify($todosQuery.error, null, 2)}</pre>
  {:else}
    <pre>{JSON.stringify($todosQuery.data, null, 2)}</pre>
  {/if}
</div>
