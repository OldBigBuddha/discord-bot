# Discord Bot with discordeno

discordeno を用いて作成した Discord Bot です。

起動には以下の環境変数が必要です。

| 環境変数名      | 概要                                                          |
| --------------- | ------------------------------------------------------------- |
| `DENO_ENV`      | 実行環境の情報、`"production"` のときのみ本番環境だと判定する |
| `DISCORD_TOKEN` | Bot Token                                                     |
| `GUILD_ID`      | この Bot を導入したい Discord サーバーの ID                   |
