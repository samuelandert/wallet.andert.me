<script>
  import GooglePKP from "$lib/GooglePKP.svelte";
  // import { signRequest, signedMessages } from "$lib/stores.js";

  // function trigger() {
  //   signRequest.set({ json: { hello: "test" } });
  // }
</script>

<GooglePKP />
<!-- <button on:click={trigger}>Sign Request</button> -->

<!-- <ul>
  {#each $signedMessages as { json, signature }}
    <li>
      <strong>Message:</strong>
      {JSON.stringify(json)}
      <br />
      <strong>Signature:</strong>
      {JSON.stringify(signature)}
    </li>
  {/each}
</ul> -->
