<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const bookmarksQuery = createQuery({
    operationName: "getBookmarks",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Bookmarks</h1>
  </div>

  <div slot="main">
    <div class="w-full h-full overflow-y-auto">
      <div class="w-full h-full results">
        {#if $bookmarksQuery.isLoading}
          <p>Loading...</p>
        {:else if $bookmarksQuery.error}
          <pre>Error: {JSON.stringify($bookmarksQuery.error, null, 2)}</pre>
        {:else}
          {#each $bookmarksQuery.data.directus_bookmarks as bookmark (bookmark.id)}
            <a href={bookmark.url} class="text-blue-500 hover:underline">
              {bookmark.name}
            </a>
            <div class="mt-2">
              {#each bookmark.tags as tag (tag)}
                <span
                  class="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full mr-2 mb-2"
                  >{tag}</span
                >
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</HeaderMain>
