<script>
  function shadowroot(node, { html }) {
    node.attachShadow({ mode: "open" }).innerHTML = html;
    return {
      update({ html }) {
        node.shadowRoot.innerHTML = html;
      },
    };
  }

  export let html = "<h1>Some custom HTML</h1>";
</script>

<div use:shadowroot={{ html }} />
