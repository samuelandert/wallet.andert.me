<script lang="ts">
  import { signMessageWithPKP } from "$lib/services/signMessage";
  import { walletState, signRequest } from "$lib/stores.js";

  let currentPKP;
  let sessionSigs;
  let message;
  let signature;
  let status = "WAITING FOR SIGNATURE";

  walletState.subscribe((value) => {
    currentPKP = value.pkps[0];
    sessionSigs = value.sessionSigs;
  });

  signRequest.subscribe((value) => {
    message = value.messageToSign;
    signature = value.signature;
  });

  async function signMessage() {
    const result = await signMessageWithPKP(sessionSigs, currentPKP, message);
    if (result.error) {
      console.error(result.error);
    } else {
      (status = "SIGNED"),
        signRequest.set({
          messageToSign: message,
          signature: result.messageSignature,
          drawer: true,
        });
    }
  }

  function declineSign() {
    signRequest.set({
      messageToSign: {},
      signature: null,
      drawer: false,
    });
  }
</script>

<div class="flex flex-col items-center justify-center h-full space-y-4">
  <p class="text-sm font-bold">{status}</p>
  <p class="text-lg break-words max-w-2/3">{JSON.stringify(message)}</p>
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
