import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type";

export const command: SlashCommand = {
    metadata: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Health check"),
    execute: async (interaction) => {
        await interaction.reply(`Pong!\nThis command was run by ${interaction.user.username}.`);
    }
};
