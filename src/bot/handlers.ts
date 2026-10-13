import { Bot } from "grammy";
import { createEmail, getMessages } from "../mail/dropmail";
import { saveSession, getSession, deleteSession } from "../storage/sessions";
import type { Env } from "../index";

export function registerHandlers(bot: Bot, env: Env) {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Привет! Я создаю временные почты (DropMail).\n\n" +
        "/tempmail — создать новый ящик\n" +
        "/check — проверить входящие\n" +
        "/drop — удалить текущий ящик"
    );
  });

  bot.command("tempmail", async (ctx) => {
    await ctx.reply("Создаю ящик...");

    try {
      const session = await createEmail(env);
      await saveSession(env, ctx.from!.id, session);

      await ctx.reply(
        `📧 Ящик создан:\n\n` +
          `Адрес: ${session.address}\n\n` +
          `Проверяй входящие командой /check\n` +
          `⚠️ Ящик живёт ограниченное время.`
      );
    } catch (e) {
      await ctx.reply(`Ошибка: ${e instanceof Error ? e.message : "unknown"}`);
    }
  });

  bot.command("check", async (ctx) => {
    const session = await getSession(env, ctx.from!.id);
    if (!session) {
      return ctx.reply("Сначала создай ящик: /tempmail");
    }

    try {
      const messages = await getMessages(env, session.sessionId);
      if (messages.length === 0) {
        return ctx.reply("📭 Входящих нет.");
      }

      const lines = messages
        .slice(0, 5)
        .map((m) => `• ${m.fromAddr}\n  ${m.headerSubject}\n  ${m.receivedAt}`);

      await ctx.reply(`📬 Входящие (${messages.length}):\n\n${lines.join("\n\n")}`);

      const body = messages[0].text || "(пусто)";
      await ctx.reply(`📄 Последнее письмо:\n\n${body.slice(0, 3000)}`);
    } catch (e) {
      await ctx.reply(`Ошибка: ${e instanceof Error ? e.message : "unknown"}`);
    }
  });

  bot.command("drop", async (ctx) => {
    await deleteSession(env, ctx.from!.id);
    await ctx.reply("🗑 Ящик удалён из памяти бота.");
  });
}
