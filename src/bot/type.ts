import type { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, } from "discord.js";

export type SlashCommandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;

export interface SlashCommand {
  readonly metadata: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  readonly execute: SlashCommandHandler;
}

export type ReuqiredBotParameters = {
  readonly token: string;
  readonly applicationId: string;
  readonly guildId: string;
}