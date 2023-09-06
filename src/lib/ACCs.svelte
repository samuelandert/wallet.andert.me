<script lang="ts">
  import Cookies from "js-cookie";
  import {
    createACC,
    deleteACC,
  } from "./services/mutateAccessControlConditions.ts";
  let signingConditions =
    JSON.parse(localStorage.getItem("signingConditions")) || [];

  let newParameter = ":userAddress";
  let newComparator = "=";
  let newValue = "";

  async function handleCreateNewACC() {
    await createACC(newParameter, newComparator, newValue);
    signingConditions =
      JSON.parse(localStorage.getItem("signingConditions")) || [];
    Cookies.set("signingConditions", JSON.stringify(signingConditions));
  }

  async function handleDeleteACC(index) {
    await deleteACC(index);
    signingConditions =
      JSON.parse(localStorage.getItem("signingConditions")) || [];
  }
</script>

{#each signingConditions as condition, index (index)}
  {#each condition.accs as acc}
    <div
      class="card"
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;"
    >
      <div class="p-4">
        <h2 class="text-xl">
          <b>{condition.resourceId.baseUrl}{condition.resourceId.path}</b>
        </h2>
        <p>
          {acc.parameters.join(", ")}
          {acc.returnValueTest.comparator}
          {acc.returnValueTest.value}
        </p>
      </div>
      <button
        on:click={() => handleDeleteACC(index)}
        class="btn variant-filled-error mt-2">Delete ACC</button
      >
    </div>
  {/each}
{/each}
<div class="mt-4 flex">
  <input
    bind:value={newParameter}
    placeholder="Parameter"
    class="input mr-2"
    style="width: max-content; max-width: 125px;"
    readonly
  />
  <input
    bind:value={newComparator}
    placeholder="Comparator"
    class="input mr-2"
    style="width: max-content; max-width: 36px;"
    readonly
  />
  <input
    bind:value={newValue}
    placeholder="Value"
    class="input mr-2 flex-grow"
  />
  <button on:click={handleCreateNewACC} class="btn variant-filled flex-grow"
    >Create New ACC</button
  >
</div>
