document.addEventListener("DOMContentLoaded", async () => {
  try {
    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      location.href = "login.html";
      return;
    }

    // Email comes from Supabase Auth
    if ($("#account-email")) {
      $("#account-email").textContent = user.email || "";
    }

    // Get customer profile
    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile error:", error);
      if ($("#account-name")) {
        $("#account-name").textContent =
          user.user_metadata?.name || "VAYNOR Customer";
      }
      return;
    }

    if ($("#account-name")) {
      $("#account-name").textContent =
        profile?.full_name ||
        user.user_metadata?.name ||
        "VAYNOR Customer";
    }

  } catch (error) {
    console.error("Account error:", error);
    location.href = "login.html";
  }
});
