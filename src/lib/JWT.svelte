<script>
  import { createJWT } from "$lib/services/createJWT";
  import Cookies from "js-cookie";

  let jwt = "";

  async function handleCreateClick() {
    jwt = await createJWT();
    Cookies.set("token", jwt);
  }
</script>

<div class="p-12">
  <button on:click={handleCreateClick} class="btn variant-filled-primary"
    >Create JWT</button
  >
</div>
