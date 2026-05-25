export function verifyAdminSecret(req: Request): boolean {
  const secret = Deno.env.get("ADMIN_SECRET");
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret");
  return header === secret;
}
