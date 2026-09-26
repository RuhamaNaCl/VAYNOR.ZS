// VAYNOR Admin authentication guard.
// Requires js/supabase-client.js to load before this file.
(async function () {
  const client = window.vaynorSupabase;
  const path = window.location.pathname;
  const isLoginPage = path.endsWith("/admin/login.html");
  if (!client) {
    if (!isLoginPage) window.location.replace("login.html?reason=config");
    return;
  }

  const { data: { session }, error: sessionError } = await client.auth.getSession();
  if (isLoginPage) {
    if (session && !sessionError) {
      const { data: profile } = await client
        .from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      if (profile?.role === "admin") window.location.replace("index.html");
    }
    return;
  }

  if (sessionError || !session) {
    window.location.replace("login.html");
    return;
  }

  const { data: profile, error: profileError } = await client
    .from("profiles").select("role").eq("id", session.user.id).maybeSingle();

  if (profileError || profile?.role !== "admin") {
    await client.auth.signOut();
    window.location.replace("login.html?reason=not-admin");
    return;
  }

  document.documentElement.classList.add("vaynor-admin-authenticated");
  document.querySelectorAll("[data-admin-email]").forEach(el => {
    el.textContent = session.user.email || "Admin";
  });
  document.querySelectorAll("[data-admin-logout]").forEach(el => {
    el.addEventListener("click", async () => {
      await client.auth.signOut();
      window.location.replace("login.html");
    });
  });
})();
