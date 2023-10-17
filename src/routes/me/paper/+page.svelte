<script lang="ts">
  import { createQuery } from "../../../lib/wundergraph";

  const paperQuery = createQuery({
    operationName: "paper",
  });
</script>

{#if $paperQuery.isLoading}
  <p>Loading...</p>
{:else if $paperQuery.error}
  <pre>Error: {JSON.stringify($paperQuery.error, null, 2)}</pre>
{:else}
  {JSON.stringify($paperQuery.data)}
{/if}
