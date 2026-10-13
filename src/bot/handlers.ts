import { Bot } from "grammy";
import {
  generateEmail,
  getMessages,
  readMessage,
} from "../mail/onesecmail";
import { saveSession, getSession, deleteSession } from "../storage/sessions";
import type { Env } from "../index";

export function registerHandlers(bot: Bot, env: Env) {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Привет! Я создаю временные почты (1secmail).\n\n" +
        "/tempmail — создать новый ящик\n" +
        "/check — проверить входящие\n" +
        "/drop — удалить текущий ящик"
    );
  });

  bot.command("tempmail", async (ctx) => {
    await ctx.reply("Создаю ящик...");

    try {
      const { address, login, domain } = await generateEmail();

      await saveSession(env, ctx.from!.id, { address, login, domain });

      await ctx.reply(
        `📧 Ящик создан:\n\n` +
          `Адрес: ${address}\n\n` +
          `Проверяй входящие командой /check\n` +
          `⚠️ Письма живут ~1 час, потом удаляются автоматически.`
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
      const messages = await getMessages(session.login, session.domain);
      if (messages.length === 0) {
        return ctx.reply("📭 Входящих нет.");
      }

      const lines = messages
        .slice(0, 5)
        .map((m) => `• ${m.from}\n  ${m.subject}\n  ${m.date}`);

      await ctx.reply(
        `📬 Входящие (${messages.length}):\n\n${lines.join("\n\n")}`
      );

      // Последнее письмо целиком
      const full = await readMessage(session.login, session.domain, messages[0].id);
      const body = full.textBody || full.body || "(пусто)";
      await ctx.reply(`📄 Последнее письмо:\n\n${body.slice(0, 3000)}`);
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
