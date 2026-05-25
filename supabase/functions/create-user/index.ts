import { createAdminClient } from "../_shared/supabase-admin.ts";
import { verifyAdminSecret } from "../_shared/admin.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  if (!verifyAdminSecret(req)) {
    return jsonResponse({ success: false, error: "Unauthorized admin" }, 401);
  }

  try {
    const body = await req.json();
    const { name, email, password, role, team, avatarColor } = body;

    if (!name || !email || !password) {
      return jsonResponse(
        { success: false, error: "name, email, and password are required" },
        400,
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      return jsonResponse(
        { success: false, error: "email must be a valid address (e.g. user@example.com)" },
        400,
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role: role || "user",
          team: team || "Global",
          avatarColor: avatarColor || "#22C55E",
        },
      });

    if (authError) throw authError;

    const authUser = authData.user;
    if (!authUser) {
      throw new Error("User creation failed: no auth user returned.");
    }

    // Trigger on_auth_user_created should insert the profile; upsert as fallback.
    const { error: profileError } = await supabaseAdmin.from("users").upsert(
      {
        id: authUser.id,
        name,
        email: normalizedEmail,
        password: "auth_managed",
        role: role || "user",
        team: team || "Global",
        avatar_color: avatarColor || "#22C55E",
        created_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );

    if (profileError) throw profileError;

    return jsonResponse({
      success: true,
      message: "User created. They can log in with email and password.",
      user: {
        id: authUser.id,
        email: authUser.email,
        name,
        role: role || "user",
        team: team || "Global",
        avatarColor: avatarColor || "#22C55E",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ success: false, error: message }, 400);
  }
});
