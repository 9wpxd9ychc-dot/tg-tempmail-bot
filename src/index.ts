import { webhookCallback } from "grammy";
import { createBot } from "./bot";

export interface Env {
  BOT_TOKEN: string;
  DROPMAIL_TOKEN: string;
  MAIL_SESSIONS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    try {
      const bot = createBot(env);
      const cb = webhookCallback(bot, "cloudflare-mod");
      return await cb(request);
    } catch (e) {
      console.error("Webhook error:", e);
      return new Response("OK", { status: 200 });
    }
  },
};
