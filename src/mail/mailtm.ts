import type { Env } from "../index";
import type { MailTmMessage } from "./types";

export async function getDomain(env: Env): Promise<string> {
  const res = await fetch(`${env.MAILTM_BASE_URL}/domains`);
  if (!res.ok) throw new Error(`Domains failed: ${res.status}`);
  const data: any = await res.json();
  return data["hydra:member"][0].domain;
}

export async function createAccount(
  env: Env,
  address: string,
  password: string
): Promise<{ id: string; address: string }> {
  const res = await fetch(`${env.MAILTM_BASE_URL}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password }),
  });
  if (!res.ok) throw new Error(`Account create failed: ${res.status}`);
  return res.json();
}

export async function getToken(
  env: Env,
  address: string,
  password: string
): Promise<string> {
  const res = await fetch(`${env.MAILTM_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password }),
  });
  if (!res.ok) throw new Error(`Token failed: ${res.status}`);
  const data: any = await res.json();
  return data.token;
}

export async function getMessages(
  env: Env,
  token: string
): Promise<MailTmMessage[]> {
  const res = await fetch(`${env.MAILTM_BASE_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Messages failed: ${res.status}`);
  const data: any = await res.json();
  return data["hydra:member"] ?? [];
}

export async function getMessage(
  env: Env,
  token: string,
  messageId: string
): Promise<MailTmMessage> {
  const res = await fetch(`${env.MAILTM_BASE_URL}/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Message failed: ${res.status}`);
  return res.json();
}
