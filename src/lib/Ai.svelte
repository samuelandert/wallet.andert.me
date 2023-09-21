<script>
  import { useChat } from "ai/svelte";
  import Icon from "@iconify/svelte";

  const { input, handleSubmit, messages } = useChat();
</script>

<div class="chat-grid h-full p-4">
  <ul class="overflow-auto flex flex-col p-4 text-sm">
    {#each $messages as message}
      <li class="message {message.role === 'user' ? 'user' : 'assistant'} p-2">
        {message.content}
      </li>
    {/each}
  </ul>
  <div class="w-full">
    <form on:submit={handleSubmit} class="flex items-center">
      <input bind:value={$input} class="input flex-grow mr-4" type="text" />
      <button class="btn-icon variant-filled-success" type="submit">
        <div class="px-4">
          <Icon icon="carbon:send-alt-filled" class="" width="24" height="24" />
        </div>
      </button>
    </form>
  </div>
</div>

<style>
  .chat-grid {
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
  }
  .message {
    max-width: 80%;
    padding: px;
    margin: 10px;
    border-radius: 10px;
  }
  .user {
    align-self: flex-end;
    background-color: #0d6efd;
    color: white;
  }
  .assistant {
    align-self: flex-start;
    background-color: lightblue;
  }
</style>
