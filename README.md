# tg-tempmail-bot

Telegram-бот для создания временных email через mail.tm на Cloudflare Workers.

## Стек
- Cloudflare Workers
- grammY
- mail.tm API
- Cloudflare KV

## Команды
- `/tempmail` — создать новый ящик
- `/check` — проверить входящие
- `/drop` — удалить ящик из памяти бота

## Деплой
1. Push в GitHub
2. Cloudflare автоматически задеплоит Worker
3. Добавь Secret `BOT_TOKEN` в Cloudflare
4. Создай KV `MAIL_SESSIONS` и вставь ID в `wrangler.toml`
5. Вызови `setWebhook`
   
