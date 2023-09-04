<script>
    import { createJwt } from '$lib/services/createJwt';
  
    let jwt = '';
  
    async function handleClick() {
      jwt = await createJwt();
    }
  </script>
  
  <button on:click={handleClick}>Create JWT</button>
  <p>{jwt}</p>