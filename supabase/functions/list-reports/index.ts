import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminSecret } from "../_shared/admin.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "GET") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const startDate = url.searchParams.get("start");
  const endDate = url.searchParams.get("end");

  try {
    const isAdmin = verifyAdminSecret(req);

    if (isAdmin) {
      const supabaseAdmin = createAdminClient();
      let query = supabaseAdmin.from("reports").select("*");

      if (userId && userId !== "all") {
        query = query.eq("user_id", userId);
      }
      if (startDate) query = query.gte("date", startDate);
      if (endDate) query = query.lte("date", endDate);

      const { data, error } = await query.order("date", { ascending: false });
      if (error) throw error;

      return jsonResponse({ success: true, data: data ?? [] });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ success: false, error: "Invalid session" }, 401);
    }

    let query = supabase.from("reports").select("*").eq("user_id", user.id);
    if (startDate) query = query.gte("date", startDate);
    if (endDate) query = query.lte("date", endDate);

    const { data, error } = await query.order("date", { ascending: false });
    if (error) throw error;

    return jsonResponse({ success: true, data: data ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ success: false, error: message }, 400);
  }
});
