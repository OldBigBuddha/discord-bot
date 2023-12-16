import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { slashCommandMap } from "./commands/index.ts";
import { ReuqiredBotParameters } from "./type.ts";

async function registerSlashCommands(token: string, applicationId: string, guildId: string): Promise<void> {
  const rest = new REST().setToken(token);

  try {
    console.log(`Start to sync ${slashCommandMap.size} slash commands...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(applicationId, guildId),
      {
        body: Array.from(slashCommandMap.values()).map((c) => {
          return c.metadata.toJSON();
        }),
      }
    );

    console.debug(data);
    console.log("Finish to sync all slash commands successfully.");
  } catch (error) {
    console.error("Failed to refresh slash commands of your guild.");
    console.error(error);
  }
}

export async function run(params: ReuqiredBotParameters): Promise<void> {
  console.log("Starting discord bot...");

  const { token, applicationId: clientId, guildId } = params;
  await registerSlashCommands(token, clientId, guildId);

  const client = new Client({intents: [GatewayIntentBits.Guilds]});

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  // routing slash commands
  client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand() === false) {
          return;
      }

      const command = slashCommandMap.get(interaction.commandName);
      if (command === undefined) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          await interaction.reply(`No command matching ${interaction.commandName} was found.`);
          return;
      }

      try {
          await command.execute(interaction);
      } catch (error) {
          console.error(error);

          if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
          } else {
              await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
          }
  
      }
  });
  
  await client.login(token);

}