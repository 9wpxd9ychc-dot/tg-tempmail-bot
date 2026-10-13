import type { Env } from "../index";
import type { DropMailSession, DropMailMessage } from "./types";

const BASE = "https://dropmail.me/api/graphql";

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

  const json = await res.json();
  if (json.errors?.length) throw new Error(`DropMail GQL: ${json.errors[0].message}`);
  if (!json.data) throw new Error("DropMail: no data returned");

  return json.data;
}

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

export async function getMessages(env: Env, sessionId: string): Promise<DropMailMessage[]> {
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
