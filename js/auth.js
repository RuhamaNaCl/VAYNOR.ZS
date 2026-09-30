const SUPABASE_URL = "https://hddphtxjtcjqqeouxqmh.supabase.co";

const SUPABASE_KEY = "তোমার পাঠানো publishable key এখানে";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", () => {

  // LOGIN
  $("#login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("#email").value.trim();
    const password = $("#password")?.value || "";

    if (!password) {
      toast("Please enter your password");
      return;
    }

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      toast(error.message);
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

    if (!password) {
      toast("Please enter a password");
      return;
    }

    const { data, error } =
      await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

    if (error) {
      toast(error.message);
      return;
    }

    toast("Account created successfully");

    setTimeout(() => {
      location.href = "account.html";
    }, 700);
  });


  // LOGOUT
  $("#logout")?.addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    location.href = "index.html";
  });

});
