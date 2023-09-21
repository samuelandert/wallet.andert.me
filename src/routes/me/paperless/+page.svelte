<script lang="ts">
  import HeaderMain from "$lib/layouts/HeaderMain.svelte";
  import { createQuery } from "../../../lib/wundergraph";

  const paperlessQuery = createQuery({
    operationName: "getPaperless",
  });

  let pdfDataUrls = [];
  let selectedPdfUrl = null;

  $: if ($paperlessQuery.data) {
    pdfDataUrls = $paperlessQuery.data.map((document) => {
      const pdfData = atob(document.pdfData);
      const pdfDataArray = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        pdfDataArray[i] = pdfData.charCodeAt(i);
      }
      const blob = new Blob([pdfDataArray], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    });
  }

  function selectPdf(i) {
    selectedPdfUrl = pdfDataUrls[i];
  }
</script>

<HeaderMain>
  <!-- <div slot="header">
    <h1>Paperless Documents</h1>
  </div> -->

  <div slot="main" class="h-full w-full overflow-scroll flex">
    <div class="w-1/4 h-full overflow-scroll">
      {#if $paperlessQuery.isLoading}
        <p>Loading...</p>
      {:else if $paperlessQuery.error}
        <pre>Error: {JSON.stringify($paperlessQuery.error, null, 2)}</pre>
      {:else}
        {#each $paperlessQuery.data as document, i}
          <a href="#" on:click|preventDefault={() => selectPdf(i)}>
            <div
              class="my-4 p-2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <h2 class="text-lg font-semibold">
                {document.archived_file_name}
              </h2>
              <p>Correspondent: {document.correspondent.name}</p>
              <p>Tags: {document.tags.map((tag) => tag.name).join(", ")}</p>
              <p>{document.document_type.name}</p>
            </div>
          </a>
        {/each}
      {/if}
    </div>
    <div class="w-3/4 h-full overflow-scroll">
      {#if selectedPdfUrl}
        <object
          data={selectedPdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      {/if}
    </div>
  </div>
</HeaderMain>
