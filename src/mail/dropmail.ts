import type { Env } from "../index";

const BASE = "https://dropmail.me/api/graphql";

// Тип сессии для DropMail (в нём есть restoreKey, чтобы не потерять ящик)
export interface DropMailSession {
  address: string;
  restoreKey: string;
  sessionId: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

async function graphql<T>(
  token: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${BASE}/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`DropMail HTTP: ${res.status}`);

  const json: GraphQLResponse<T> = await res.json();
  if (json.errors?.length) throw new Error(`DropMail GQL: ${json.errors[0].message}`);
  if (!json.data) throw new Error("DropMail: no data returned");

  return json.data;
}

// 1. Создать новую сессию и ящик
export async function createEmail(env: Env): Promise<DropMailSession> {
  const data = await graphql<{
    introduceSession: {
      id: string;
      addresses: { address: string; restoreKey: string }[];
    };
  }>(env.DROPMAIL_TOKEN, `
    mutation {
      introduceSession(input: { withAddress: true }) {
        id
        addresses { address restoreKey }
      }
    }
  `);

  const session = data.introduceSession;
  const addr = session.addresses[0];

  return {
    sessionId: session.id,
    address: addr.address,
    restoreKey: addr.restoreKey,
  };
}

// 2. Получить список писем (у DropMail они возвращаются в объекте session)
export async function getMessages(env: Env, sessionId: string) {
  const data = await graphql<{
    session: {
      mails: {
        id: string;
        fromAddr: string;
        headerSubject: string;
        text: string;
        receivedAt: string;
      }[];
    } | null;
  }>(env.DROPMAIL_TOKEN, `
    query GetSession($id: ID!) {
      session(id: $id) {
        mails { id fromAddr headerSubject text receivedAt }
      }
    }
  `, { id: sessionId });

  return data.session?.mails ?? [];
}
