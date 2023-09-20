<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../lib/wundergraph";
  import { Avatar } from "@skeletonlabs/skeleton";

  const meQuery = createQuery({
    operationName: "Me",
  });
</script>

<HeaderMain>
  <div slot="header">
    <h1>Profile</h1>
  </div>

  <div slot="main" class="h-full w-full overflow-scroll">
    <div class="w-full h-full overflow-scroll">
      {#if $meQuery.isLoading}
        <p>Loading...</p>
      {:else if $meQuery.error}
        <pre>Error: {JSON.stringify($meQuery.error, null, 2)}</pre>
      {:else}
        <div class="container mx-auto p-8 space-y-8">
          <div class="flex items-center space-x-4">
            <Avatar
              class="rounded-full w-24"
              src={`https://directus.andert.me/assets/${
                $meQuery.data.system_db_users_me?.avatar.id
              }?access_token=${
                import.meta.env.VITE_DIRECTUS_TEMPORARY_ACCESS_TOKEN
              }`}
            />
            <div>
              <h3 class="h3">Welcome back</h3>
              <h2 class="h2">
                {$meQuery.data.system_db_users_me?.first_name}
                {$meQuery.data.system_db_users_me?.last_name}
              </h2>
              {$meQuery.data.system_db_users_me?.external_identifier}
              <p />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</HeaderMain>
