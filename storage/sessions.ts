export interface Session {
  address: string;
  password: string;
  token: string;
}

export async function saveSession(
  env: Env,
  telegramId: number,
  session: Session
): Promise<void> {
  await env.MAIL_SESSIONS.put(`user:${telegramId}`, JSON.stringify(session));
}

export async function getSession(
  env: Env,
  telegramId: number
): Promise<Session | null> {
  const raw = await env.MAIL_SESSIONS.get(`user:${telegramId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function deleteSession(
  env: Env,
  telegramId: number
): Promise<void> {
  await env.MAIL_SESSIONS.delete(`user:${telegramId}`);
}
