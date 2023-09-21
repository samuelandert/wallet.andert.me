<script lang="ts">
  import JsonViewer from "$lib/JsonViewer.svelte";
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const contactsQuery = createQuery({
    operationName: "getChatwootContacts",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Contacts</h1>
  </div>

  <div slot="main" class="h-full w-full overflow-scroll">
    <div class="w-full h-full overflow-scroll">
      {#if $contactsQuery.isLoading}
        <p>Loading...</p>
      {:else if $contactsQuery.error}
        <pre>Error: {JSON.stringify($contactsQuery.error, null, 2)}</pre>
      {:else}
        <div class="grid grid-cols-3 gap-4">
          {#each $contactsQuery.data.payload as contact (contact.id)}
            <div class="card">
              <header class="card-header">{contact.name}</header>
              <section class="p-4">
                ID: {contact.id}<br />{contact.email}
              </section>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</HeaderMain>
