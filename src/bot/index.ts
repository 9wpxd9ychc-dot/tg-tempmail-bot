import { Bot } from "grammy";
import { registerHandlers } from "./handlers";
import type { Env } from "../index";

export function createBot(env: Env): Bot {
  const bot = new Bot(env.BOT_TOKEN);
  registerHandlers(bot, env);
  return bot;
}
