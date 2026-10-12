document.addEventListener("DOMContentLoaded", () => {

  const client = window.vaynorSupabase;

  if (!client) {
    console.error("VAYNOR Supabase client not found.");
    toast("Connection error. Please try again.");
    return;
  }

  // LOGIN
  $("#login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("#email").value.trim();
    const password = $("#password")?.value || "";

    if (!email || !password) {
      toast("Please enter your email and password.");
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Login error:", error);
      toast(error.message);
      return;
    }

    if (!data?.user) {
      toast("Login failed. Please try again.");
      return;
    }

    toast("Login successful");

    setTimeout(() => {
      location.href = "account.html";
    }, 700);
  });


  // REGISTER
  $("#register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = $("#reg-name").value.trim();
    const email = $("#reg-email").value.trim();
    const password = $("#reg-password")?.value || "";

    if (!name || !email || !password) {
      toast("Please fill in all fields.");
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      console.error("Register error:", error);
      toast(error.message);
      return;
    }

    // Create profile if a session exists
    if (data?.user && data?.session) {
      const { error: profileError } = await client
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: name
        });

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      toast("Account created successfully");

      setTimeout(() => {
        location.href = "account.html";
      }, 700);

    } else {
      toast("Account created. Please verify your email, then login.");
    }
  });


  // LOGOUT
  $("#logout")?.addEventListener("click", async () => {
    await client.auth.signOut();
    location.href = "index.html";
  });

});
