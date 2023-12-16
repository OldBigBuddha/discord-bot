import { run } from './bot';

type Env = {
    // readonly NODE_ENV: string;
    readonly DISCORD_TOKEN: string;
    readonly DISCORD_APPLICATION_ID: string;
    readonly DISCORD_GUILD_ID: string;
}

function loadEnv(): Env | undefined {
    const {
        DISCORD_TOKEN,
        DISCORD_APPLICATION_ID,
        DISCORD_GUILD_ID
    } = process.env;

    if (
        DISCORD_TOKEN === undefined ||
        DISCORD_APPLICATION_ID === undefined ||
        DISCORD_GUILD_ID === undefined
    ) {
        return undefined;
    }

    return {
        DISCORD_TOKEN,
        DISCORD_APPLICATION_ID,
        DISCORD_GUILD_ID,
    };
}

async function main(): Promise<void> {
    const env = loadEnv();
    if (env === undefined) {
        console.error("Lack of required environment variables.");
        process.exit(1);
    }

    await run({
        token: env.DISCORD_TOKEN,
        applicationId: env.DISCORD_APPLICATION_ID,
        guildId: env.DISCORD_GUILD_ID,
    });
}

main();