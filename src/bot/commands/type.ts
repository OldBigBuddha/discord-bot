import { CreateSlashApplicationCommand, Interaction } from "@discordeno";

export type RunCommand = (interaction: Interaction) => Promise<void>;

export interface SlashCommand extends CreateSlashApplicationCommand {
  execute(interactioin: Interaction): Promise<unknown>;
}
