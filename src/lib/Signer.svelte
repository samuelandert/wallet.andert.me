<script lang="ts">
  import { signMessageWithPKP } from "$lib/services/signMessage";
  import { walletState, messageToSign, messageSignature } from "$lib/stores.js";

  let currentPKP;
  let sessionSigs;
  let message;
  let signature;

  walletState.subscribe((value) => {
    currentPKP = value.pkps[0];
    sessionSigs = value.sessionSigs;
  });

  messageToSign.subscribe((value) => {
    message = value;
  });

  messageSignature.subscribe((value) => {
    signature = value;
  });

  async function signMessage() {
    const result = await signMessageWithPKP(sessionSigs, currentPKP, message);
    if (result.error) {
      console.error(result.error);
    } else {
      messageSignature.set(result.messageSignature);
    }
  }

  function declineSign() {
    messageSignature.set(null);
  }
</script>

<div class="flex flex-col items-center justify-center h-full space-y-4">
  <p class="text-lg break-words">{JSON.stringify(message)}</p>
  {#if signature}
    <p class="text-sm font-bold break-words">
      Signature: {JSON.stringify(signature)}
    </p>
  {/if}
  <div
    class="absolute bottom-0 flex items-center justify-center w-full pb-4 space-x-4"
  >
    <button on:click={declineSign} class="btn variant-filled-error"
      >Decline</button
    >
    <button on:click={signMessage} class="btn variant-filled-success"
      >Sign</button
    >
  </div>
</div>
