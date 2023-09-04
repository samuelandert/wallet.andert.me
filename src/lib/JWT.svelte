<script>
  import { createJwt } from "$lib/services/createJwt";

  let jwt = "";

  async function handleClick() {
    jwt = await createJwt();
  }
</script>

<div class="p-12">
  <button on:click={handleClick} class="btn variant-filled-primary"
    >Create JWT</button
  >
  <p class="text-xs">{jwt}</p>
</div>
