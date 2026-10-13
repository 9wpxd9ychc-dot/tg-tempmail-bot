import { Bot } from "grammy";
import {
  getDomain,
  createAccount,
  getToken,
  getMessages,
  getMessage,
} from "../mail/mailtm";
import { saveSession, getSession, deleteSession } from "../storage/sessions";
import type { Env } from "../index";

export function registerHandlers(bot: Bot, env: Env) {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Привет! Я создаю временные почты.\n\n" +
        "/tempmail — создать новый ящик\n" +
        "/check — проверить входящие\n" +
        "/drop — удалить текущий ящик"
    );
  });

  bot.command("tempmail", async (ctx) => {
    await ctx.reply("Создаю ящик...");

    try {
      const domain = await getDomain(env);
      const rand = Math.random().toString(36).slice(2, 10);
      const address = `${rand}@${domain}`;
      const password = `pw_${rand}_${Date.now()}`;

      await createAccount(env, address, password);
      const token = await getToken(env, address, password);

      await saveSession(env, ctx.from!.id, { address, password, token });

      await ctx.reply(
        `📧 Ящик создан:\n\n` +
          `Адрес: ${address}\n` +
          `Пароль: ${password}\n\n` +
          `Проверяй входящие командой /check`
      );
    } catch (e) {
      await ctx.reply(
        `Ошибка: ${e instanceof Error ? e.message : "unknown"}`
      );
    }
  });

  bot.command("check", async (ctx) => {
    const session = await getSession(env, ctx.from!.id);
    if (!session) {
      return ctx.reply("Сначала создай ящик: /tempmail");
    }

    try {
      const messages = await getMessages(env, session.token);
      if (messages.length === 0) {
        return ctx.reply("📭 Входящих нет.");
      }

      const lines = messages
        .slice(0, 5)
        .map((m) => `• ${m.from.address}\n  ${m.subject}\n  ${m.intro}`);

      await ctx.reply(
        `📬 Входящие (${messages.length}):\n\n${lines.join("\n\n")}`
      );

      const full = await getMessage(env, session.token, messages[0].id);
      if (full.text) {
        await ctx.reply(
          `📄 Последнее письмо:\n\n${full.text.slice(0, 3000)}`
        );
      }
    } catch (e) {
      await ctx.reply(
        `Ошибка: ${e instanceof Error ? e.message : "unknown"}`
      );
    }
  });

  bot.command("drop", async (ctx) => {
    await deleteSession(env, ctx.from!.id);
    await ctx.reply("🗑 Ящик удалён из памяти бота.");
  });
}
