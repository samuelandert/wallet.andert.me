<script lang="ts">
  import { createQuery } from "../../../lib/wundergraph";
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  const filesQuery = createQuery({
    operationName: "Files",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Files</h1>
  </div>

  <div slot="main" class="h-full w-full overflow-scroll">
    <div class="w-full h-full overflow-scroll">
      {#if $filesQuery.isLoading}
        <p>Loading...</p>
      {:else if $filesQuery.error}
        <pre>Error: {JSON.stringify($filesQuery.error, null, 2)}</pre>
      {:else}
        <div class="space-y-4">
          {#each $filesQuery.data.system_db_files as file}
            <div class="flex">
              <div class="w-1/4">
                {#if file.type === "application/pdf"}
                  <object
                    data={`https://directus.andert.me/assets/${
                      file.id
                    }?access_token=${
                      import.meta.env.VITE_DIRECTUS_TEMPORARY_ACCESS_TOKEN
                    }`}
                    type="application/pdf"
                    width="100%"
                    height="200px"
                  />
                {:else}
                  <img
                    src={`https://directus.andert.me/assets/${
                      file.id
                    }?access_token=${
                      import.meta.env.VITE_DIRECTUS_TEMPORARY_ACCESS_TOKEN
                    }`}
                    width="200"
                  />
                {/if}
              </div>
              <div class="w-3/4 p-4">
                <h2>{file.title}</h2>
                <p>{file.id}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</HeaderMain>
