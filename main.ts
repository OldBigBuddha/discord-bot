import { startBot } from "@discordeno";
import { BOT } from "./bot/bot.ts";

import "@storage/kv";
await startBot(BOT);
