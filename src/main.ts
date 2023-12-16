import {Client, Events, GatewayIntentBits} from 'discord.js';

import { slashCommandMap } from './bot/commands';

type Env = {
    // readonly NODE_ENV: string;
    readonly DISCORD_TOKEN: string;
}

function loadEnv(): Env | undefined {
    const { DISCORD_TOKEN } = process.env;
    if (DISCORD_TOKEN === undefined) {
        return undefined;
    }

    return {
        DISCORD_TOKEN,
    };
}

async function main(): Promise<void> {
    const env = loadEnv();
    if (env === undefined) {
        console.error("Lack of required environment variables.");
        process.exit(1);
    }

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
    
    await client.login(env.DISCORD_TOKEN);
}

main();