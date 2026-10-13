import { Bot } from "grammy";
import { registerHandlers } from "./handlers";

export function createBot(env: Env): Bot {
  const bot = new Bot(env.BOT_TOKEN);
  registerHandlers(bot, env);
  return bot;
}
