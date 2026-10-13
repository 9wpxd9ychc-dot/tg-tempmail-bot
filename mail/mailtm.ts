const BASE = "https://api.mail.tm";

// 1. Получить доступный домен
export async function getDomain(): Promise<string> {
  const res = await fetch(`${BASE}/domains`);
  const data = await res.json();
  return data["hydra:member"][0].domain;
}

// 2. Создать аккаунт
export async function createAccount(
  address: string,
  password: string
): Promise<{ address: string; password: string; id: string }> {
  const res = await fetch(`${BASE}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password }),
  });
  if (!res.ok) throw new Error(`Account create failed: ${res.status}`);
  const data = await res.json();
  return { id: data.id, address: data.address, password };
}

// 3. Получить токен
export async function getToken(
  address: string,
  password: string
): Promise<string> {
  const res = await fetch(`${BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password }),
  });
  if (!res.ok) throw new Error(`Token failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

// 4. Получить входящие
export async function getMessages(token: string): Promise<MailTmMessage[]> {
  const res = await fetch(`${BASE}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Messages failed: ${res.status}`);
  const data = await res.json();
  return data["hydra:member"] ?? [];
}

// 5. Получить полный текст письма
export async function getMessage(
  token: string,
  messageId: string
): Promise<MailTmMessage> {
  const res = await fetch(`${BASE}/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Message failed: ${res.status}`);
  return res.json();
}
