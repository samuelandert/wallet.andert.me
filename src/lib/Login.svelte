<script>
  import Cookies from "js-cookie";

  async function login() {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Sam",
        loggedIn: true,
        roles: ["admin"],
      }),
    });
    if (!response.ok) {
      alert("Login failed");
    } else {
      let { token } = await response.json();
      Cookies.set("token", token);
      alert(`Login Success: ${token}`);
      console.log(token);
    }
  }
</script>

<button on:click={login} class="btn variant-filled-primary">Login</button>
