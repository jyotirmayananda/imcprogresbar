export type AdminAuthFailure =
  | "secret_not_configured"
  | "header_missing"
  | "header_mismatch";

export function checkAdminSecret(req: Request): AdminAuthFailure | null {
  const secret = Deno.env.get("ADMIN_SECRET");
  if (!secret) return "secret_not_configured";

  const header = req.headers.get("x-admin-secret");
  if (!header) return "header_missing";
  if (header !== secret) return "header_mismatch";

  return null;
}

/** @deprecated Use checkAdminSecret for clearer errors */
export function verifyAdminSecret(req: Request): boolean {
  return checkAdminSecret(req) === null;
}
