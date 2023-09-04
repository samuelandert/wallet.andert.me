<script lang="ts">
  import Cookies from "js-cookie";
  import {
    createACC,
    deleteACC,
  } from "./services/mutateAccessControlConditions.ts";
  let signingConditions =
    JSON.parse(localStorage.getItem("signingConditions")) || [];
  let newParameter = "";
  let newComparator = "";
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

<div class="p-12">
  <h1>Access Control Conditions</h1>
  {#each signingConditions as condition, index (index)}
    {#each condition.accs as acc}
      <div class="text-lg p-4 border rounded-md shadow-md">
        <span class="text-xl"
          ><b>{condition.resourceId.baseUrl}{condition.resourceId.path}</b
          ></span
        >
        <p>
          {acc.parameters.join(", ")}
          {acc.returnValueTest.comparator}
          {acc.returnValueTest.value}
        </p>
        <p>
          <span class="text-xs">{JSON.stringify(condition)}</span>
        </p>
      </div>
    {/each}
    <p />
    <p />
    <button
      on:click={() => handleDeleteACC(index)}
      class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">Delete ACC</button
    >
  {/each}
  <div class="mt-4">
    <input
      bind:value={newParameter}
      placeholder="Parameter"
      class="px-4 py-2 border rounded-md mr-2"
    />
    <input
      bind:value={newComparator}
      placeholder="Comparator"
      class="px-4 py-2 border rounded-md mr-2"
    />
    <input
      bind:value={newValue}
      placeholder="Value"
      class="px-4 py-2 border rounded-md mr-2"
    />
    <button
      on:click={handleCreateNewACC}
      class="px-4 py-2 bg-blue-500 text-white rounded-md">Create New ACC</button
    >
  </div>
</div>
