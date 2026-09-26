document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#admin-login-form");
  const message = document.querySelector("#admin-login-message");
  if (!form) return;

  const params = new URLSearchParams(location.search);
  if (params.get("reason") === "not-admin") {
    message.textContent = "This account does not have admin access.";
  } else if (params.get("reason") === "config") {
    message.textContent = "Supabase client could not load. Check your connection and configuration.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const client = window.vaynorSupabase;
    if (!client) {
      message.textContent = "Supabase did not load. Refresh the page and try again.";
      return;
    }

    const email = document.querySelector("#admin-email").value.trim();
    const password = document.querySelector("#admin-password").value;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    message.textContent = "Signing in…";

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile, error: profileError } = await client
        .from("profiles").select("role").eq("id", data.user.id).maybeSingle();

      if (profileError || profile?.role !== "admin") {
        await client.auth.signOut();
        throw new Error("This account is not assigned the admin role.");
      }

      location.replace("index.html");
    } catch (error) {
      message.textContent = error?.message || "Login failed. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
});
