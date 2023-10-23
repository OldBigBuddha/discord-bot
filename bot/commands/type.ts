import { Bot, Interaction } from "@discordeno";

export type RunCommand = (bot: Bot, interaction: Interaction) => Promise<void>;
