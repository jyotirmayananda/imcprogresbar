/** Shared with Supabase Edge Function secret ADMIN_SECRET */
export function getAdminFunctionSecret(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_FUNCTION_SECRET ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    ''
  );
}
