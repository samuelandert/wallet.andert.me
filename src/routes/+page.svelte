<script>
  import GoogleAuth from "$lib/GoogleAuth.svelte";
  import { signRequest } from "$lib/stores.js";

  function trigger() {
    signRequest.set(true);
  }
</script>

<GoogleAuth />
<button on:click={trigger}>Sign Request</button>
