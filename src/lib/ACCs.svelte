<script>
  let accs = [
    // Mock data
    { id: 1, name: "ACC 1" },
    { id: 2, name: "ACC 2" },
    { id: 3, name: "ACC 3" },
  ];

  function createNewACC() {
    // Logic for creating a new ACC goes here
    console.log("Create new ACC button clicked");
  }
</script>

<div class="p-12">
  <h1>Access Control Conditions</h1>
  {#each accs as acc (acc.id)}
    <p>{acc.name}</p>
  {/each}
  <button on:click={createNewACC}>Create New ACC</button>
</div>

<style>
  /* Add your Tailwind CSS classes here */
</style>
