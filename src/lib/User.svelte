<script>
  import { onMount } from "svelte";
  import Cookies from "js-cookie";
  let user = null;

  onMount(async () => {
    const token = Cookies.get("token");
    const response = await fetch("/api/auth/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      user = await response.json();
    } else {
      console.error("Failed to fetch user data");
    }
  });
</script>

{#if user}
  <p>Welcome, {user.name}!</p>
  <p>Your roles: {user.roles.join(", ")}</p>
{:else}
  <p>Loading...</p>
{/if}
