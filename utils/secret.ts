import * as dotenv from "dotenv";

await dotenv.load({
  envPath: ".env.local",
  export: true,
});

export const Secret = {
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
  GUILD_ID: Deno.env.get("GUILD_ID")!,
};
