<script>
  import Cookies from "js-cookie";

  async function login() {
    const response = await fetch("/api/auth", { method: "POST" });
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

<button on:click={login}>Login</button>
