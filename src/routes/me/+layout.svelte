<script>
  import Icon from "@iconify/svelte";
</script>

<div class="w-full h-full overflow-hidden grid grid-cols-6">
  <aside class="col-span-1">
    <nav class="list-nav p-2">
      <h3 class="text-xl font-bold mb-4">MY HOME</h3>
      <ul>
        <li>
          <a href="/me">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/me/projects">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            My Projects
          </a>
        </li>

        <li>
          <a href="/me/contacts">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Contacts
          </a>
        </li>
        <li>
          <a href="/me/conversations">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Email
          </a>
        </li>
        <li>
          <a href="/me/chatGPT">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            ChatGPT
          </a>
        </li>
        <li>
          <a href="/me/banking">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Banking
          </a>
        </li>
        <li>
          <a href="/me/paperless">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Paperless
          </a>
        </li>
        <li>
          <a href="/me/acc">
            <Icon
              icon="iconamoon:profile-circle-fill"
              class="w-8 h-8 text-gray-500"
            />
            Access Control
          </a>
        </li>
      </ul>
    </nav>
  </aside>
  <div class="col-span-5 w-full h-full overflow-hidden bg-white rounded-bl-3xl">
    <slot />
  </div>
</div>

<style>
  .collapsed {
    width: 3rem; /* Adjust as needed */
  }
</style>
