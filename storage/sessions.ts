import type { Env } from "../index";
import type { MailTmSession } from "../mail/types";

export async function saveSession(
  env: Env,
  telegramId: number,
  session: MailTmSession
): Promise<void> {
  await env.MAIL_SESSIONS.put(`user:${telegramId}`, JSON.stringify(session));
}

export async function getSession(
  env: Env,
  telegramId: number
): Promise<MailTmSession | null> {
  const raw = await env.MAIL_SESSIONS.get(`user:${telegramId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function deleteSession(
  env: Env,
  telegramId: number
): Promise<void> {
  await env.MAIL_SESSIONS.delete(`user:${telegramId}`);
}
