<script lang="ts">
  import { createQuery } from "../../lib/wundergraph";
  import Login from "$lib/Login.svelte";
  import User from "$lib/User.svelte";

  const projectsQuery = createQuery({
    operationName: "Projects",
  });
</script>

<Login />
<User />

<br />
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
