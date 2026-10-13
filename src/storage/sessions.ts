import type { Env } from "../index";
import type { OneSecMailSession } from "../mail/types";

export async function saveSession(
  env: Env,
  telegramId: number,
  session: OneSecMailSession
): Promise<void> {
  await env.MAIL_SESSIONS.put(`user:${telegramId}`, JSON.stringify(session));
}

export async function getSession(
  env: Env,
  telegramId: number
): Promise<OneSecMailSession | null> {
  const raw = await env.MAIL_SESSIONS.get(`user:${telegramId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function deleteSession(
  env: Env,
  telegramId: number
): Promise<void> {
  await env.MAIL_SESSIONS.delete(`user:${telegramId}`);
}
