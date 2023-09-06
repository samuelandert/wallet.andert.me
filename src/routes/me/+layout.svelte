<div class="w-full h-full overflow-hidden grid grid-cols-6">
  <aside class="col-span-1">
    <nav class="list-nav p-6">
      <h3 class="text-xl font-bold mb-4">MY HOME</h3>
      <ul>
        <li><a href="/me">Dashboard</a></li>
        <li><a href="/me/projects">My Projects</a></li>
        <li><a href="/me/banking">Banking</a></li>
        <li><a href="/me/bookmarks">Bookmarks</a></li>
        <li><a href="/me/acc">Access Control</a></li>
      </ul>
    </nav>
  </aside>
  <div class="col-span-5 w-full h-full overflow-hidden bg-white rounded-bl-3xl">
    <slot />
  </div>
</div>
