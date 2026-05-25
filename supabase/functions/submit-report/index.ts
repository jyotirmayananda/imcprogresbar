import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors, jsonResponse } from "../_shared/cors.ts";

function mapReportPayload(body: Record<string, unknown>, userId: string) {
  return {
    id: body.id as string,
    user_id: userId,
    date: body.date,
    products_sold: body.products_sold ?? body.productsSold ?? 0,
    total_sales_value: body.total_sales_value ?? body.totalSalesValue ?? 0,
    start_time: body.start_time ?? body.startTime ?? null,
    end_time: body.end_time ?? body.endTime ?? null,
    locations_visited: body.locations_visited ?? body.locationsVisited ?? [],
    customer_meetings: body.customer_meetings ?? body.customerMeetings ?? 0,
    pending_follow_ups: body.pending_follow_ups ?? body.pendingFollowUps ?? 0,
    deals_closed: body.deals_closed ?? body.dealsClosed ?? false,
    deals_details: body.deals_details ?? body.dealsDetails ?? null,
    challenges: body.challenges ?? "",
    notes: body.notes ?? "",
    created_at: body.created_at ?? body.createdAt ?? new Date().toISOString(),
    month_target_level: body.month_target_level ?? body.monthTargetLevel ?? null,
    month_target_joining:
      body.month_target_joining ?? body.monthTargetJoining ?? 0,
    month_target_team: body.month_target_team ?? body.monthTargetTeam ?? 0,
    month_target_home_meeting:
      body.month_target_home_meeting ?? body.monthTargetHomeMeeting ?? 0,
    month_target_ibm: body.month_target_ibm ?? body.monthTargetIbm ?? 0,
    personal_joining_today:
      body.personal_joining_today ?? body.personalJoiningToday ?? 0,
    team_joining_today: body.team_joining_today ?? body.teamJoiningToday ?? 0,
    products_sold_list: body.products_sold_list ?? body.productsSoldList ?? "",
    plan_shows_today: body.plan_shows_today ?? body.planShowsToday ?? 0,
    prospects_listed_today:
      body.prospects_listed_today ?? body.prospectsListedToday ?? 0,
    phone_shows_today: body.phone_shows_today ?? body.phoneShowsToday ?? 0,
    meeting_place: body.meeting_place ?? body.meetingPlace ?? null,
    meeting_type: body.meeting_type ?? body.meetingType ?? null,
    customers_connected:
      body.customers_connected ?? body.customersConnected ?? 0,
    associates_connected:
      body.associates_connected ?? body.associatesConnected ?? 0,
    book_read_today: body.book_read_today ?? body.bookReadToday ?? "",
    chat_with_surendra_vats:
      body.chat_with_surendra_vats ?? body.chatWithSurendraVats ?? false,
    work_done_on_time: body.work_done_on_time ?? body.workDoneOnTime ?? false,
    work_done_on_time_reason:
      body.work_done_on_time_reason ?? body.workDoneOnTimeReason ?? "",
  };
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ success: false, error: "Missing authorization" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ success: false, error: "Server misconfigured" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ success: false, error: "Invalid or expired session" }, 401);
  }

  try {
    const body = await req.json();
    if (!body.id || !body.date) {
      return jsonResponse(
        { success: false, error: "id and date are required" },
        400,
      );
    }

    const row = mapReportPayload(body, user.id);

    const { data, error } = await supabase
      .from("reports")
      .insert([row])
      .select()
      .single();

    if (error) throw error;

    return jsonResponse({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ success: false, error: message }, 400);
  }
});
