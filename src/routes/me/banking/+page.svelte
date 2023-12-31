<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "$lib/wundergraph";
  import Time from "svelte-time";
  import Icon from "@iconify/svelte";
  import { sendTxWithPKPWallet } from "$lib/services/sendTxWithPKPWallet";

  let me = JSON.parse(localStorage.getItem("me"));

  const getBalanceQuery = createQuery({
    operationName: "getBalance",
    input: {
      address: me.pkps[0].ethAddress,
    },
  });

  const getTransactionsQuery = createQuery({
    operationName: "getTransactions",
    input: {
      address: me.pkps[0].ethAddress,
    },
  });

  function fromWei(wei: BigInt): string {
    return (Number(wei) / 10 ** 18).toFixed(2);
  }

  function handleSendTx() {
    sendTxWithPKPWallet(me.pkps[0], me.sessionSigs);
  }
</script>

<HeaderMain>
  <div slot="header">
    <h1>Banking</h1>
  </div>

  <div slot="main">
    <div class="pb-4">
      ACCOUNT
      <p class="text-2xl">{me.pkps[0].ethAddress}</p>
    </div>
    <div class="pb-4">
      {#if $getBalanceQuery.isLoading}
        <p>Loading...</p>
      {:else if $getBalanceQuery.error}
        <pre>Error: {JSON.stringify($getBalanceQuery.error, null, 2)}</pre>
      {:else}
        BALANCE
        <p class="text-5xl">${fromWei($getBalanceQuery.data.balance)}</p>
      {/if}
    </div>
    <div class="pb-4">
      <button
        class="btn variant-filled-primary flex-grow"
        on:click={handleSendTx}
      >
        SEND $0.10
      </button>
    </div>
    <div class="pb-4">
      {#if $getTransactionsQuery.isLoading}
        <p>Loading...</p>
      {:else if $getTransactionsQuery.error}
        <pre>Error: {JSON.stringify($getTransactionsQuery.error, null, 2)}</pre>
      {:else}
        <div class="pb-4">TRANSACTIONS</div>
        <ul class="list-disc">
          {#each $getTransactionsQuery.data.transactions as transaction (transaction.hash)}
            <li class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <div class="pr-3">
                  <Icon icon="ri:user-received-2-line" width="44" height="44" />
                </div>
                <div>
                  <p class="text-xl">
                    from {transaction.from.substring(0, 10)}...
                  </p>
                  <p class="text-sm text-gray-500">
                    {transaction.hash}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl">
                  ${fromWei(BigInt(transaction.value))}
                </p>
                <p class="text-sm text-gray-500">
                  <Time timestamp={transaction.timestamp} relative />
                </p>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</HeaderMain>
