import type { Env } from "../index";
import type { OneSecMailMessage, OneSecMailFullMessage } from "./types";

const BASE = "https://www.1secmail.com/api/v1/";

// Получить список доступных доменов
export async function getDomains(): Promise<string[]> {
  const res = await fetch(`${BASE}?action=getDomainList`);
  if (!res.ok) throw new Error(`Domains failed: ${res.status}`);
  return res.json();
}

// Сгенерировать случайный адрес
export async function generateEmail(): Promise<{ address: string; login: string; domain: string }> {
  const res = await fetch(`${BASE}?action=genRandomMailbox&count=1`);
  if (!res.ok) throw new Error(`Generate failed: ${res.status}`);
  const data: string[] = await res.json();
  const address = data[0];
  const [login, domain] = address.split("@");
  return { address, login, domain };
}

// Получить список писем
export async function getMessages(
  login: string,
  domain: string
): Promise<OneSecMailMessage[]> {
  const res = await fetch(
    `${BASE}?action=getMessages&login=${login}&domain=${domain}`
  );
  if (!res.ok) throw new Error(`Messages failed: ${res.status}`);
  return res.json();
}

// Прочитать конкретное письмо
export async function readMessage(
  login: string,
  domain: string,
  id: number
): Promise<OneSecMailFullMessage> {
  const res = await fetch(
    `${BASE}?action=readMessage&login=${login}&domain=${domain}&id=${id}`
  );
  if (!res.ok) throw new Error(`Read failed: ${res.status}`);
  return res.json();
}
