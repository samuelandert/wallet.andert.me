<!-- src/routes/apps/+page.svelte -->
<script>
  import { mockApps } from "$lib/mockApps.js";
</script>

<h1>Apps List</h1>
<ul>
  {#each mockApps as app}
    <li>
      <a href="/me/apps/{app.name}">{app.name}</a>
    </li>
  {/each}
</ul>
