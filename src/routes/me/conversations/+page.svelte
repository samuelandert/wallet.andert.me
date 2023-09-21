<script lang="ts">
  import MailViewer from "$lib/MailViewer.svelte";
  import { createQuery } from "../../../lib/wundergraph";
  import JsonViewer from "$lib/JsonViewer.svelte";

  const conversationsQuery = createQuery({
    operationName: "getChatwootConversations",
  });

  let selectedConversation = null;
  let messagesQuery;

  function selectConversation(conversation) {
    selectedConversation = conversation;
  }

  $: if ($conversationsQuery.data && !selectedConversation) {
    selectedConversation = $conversationsQuery.data.data.payload[0];
  }

  $: if (selectedConversation) {
    messagesQuery = createQuery({
      operationName: "getChatwootMessages",
      input: { conversationId: selectedConversation.id },
    });
  }
</script>

<div class="h-full w-full overflow-scroll flex">
  <div class="w-1/3 h-full overflow-scroll">
    {#if $conversationsQuery.isLoading}
      <p>Loading...</p>
    {:else if $conversationsQuery.error}
      Error: <JsonViewer json="$conversationsQuery.error}" />
    {:else}
      {#each $conversationsQuery.data.data.payload as conversation (conversation.id)}
        <div
          class="m-1 p-2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
          on:click={() => selectConversation(conversation)}
        >
          <h2 class="text-lg font-semibold">
            {conversation.meta.sender.name}
          </h2>
          <p>{conversation.messages[0].content.slice(0, 100)}...</p>
        </div>
      {/each}
    {/if}
  </div>
  <div class="w-2/3 h-full overflow-scroll relative">
    {#if selectedConversation}
      <div class="p-4 bg-white z-10 sticky top-0 left-0">
        <h2 class="font-bold text-xl">
          {selectedConversation.meta.sender.name}
        </h2>
        <p>
          {selectedConversation.id} - {selectedConversation.meta.sender.email}
        </p>
      </div>

      <div class="space-y-4 px-4">
        {#if $messagesQuery && $messagesQuery.data}
          {#each $messagesQuery.data.payload as message (message.id)}
            {#if message.content_attributes.email && (message.content_attributes.email.content_type.includes("text/html") || message.content_attributes.email.content_type.includes("multipart/alternative"))}
              <MailViewer
                html={message.content_attributes.email.html_content.full}
              />
            {:else}
              <div
                class="p-4 max-w-xs mx-auto bg-blue-100 rounded-xl shadow-md flex items-center space-x-4"
              >
                <p class="text-black">{message.content}</p>
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    {:else}
      <p>Select a conversation to view its details.</p>
    {/if}
  </div>
</div>

<style>
  .btn {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 0.25em;
  }
</style>
