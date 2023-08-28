<script>
  import GoogleAuth from "$lib/GoogleAuth.svelte";
  import Signer from "$lib/Signer.svelte";

  let messageToSign = { user: "Sam", loggedIn: true };
</script>

<GoogleAuth />
<Signer {messageToSign} />
