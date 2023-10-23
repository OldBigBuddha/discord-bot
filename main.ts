import { ApplicationCommandOptionTypes, createBot, CreateSlashApplicationCommand, GuildFeatures, Intents, InteractionResponseTypes, Member, startBot } from "./deps.ts"
import { Secret } from "./secret.ts"

type MemberWithPoint = {
    member: Member;
    point: number;
}

const kv = await Deno.openKv();

const bot = createBot({
    token: Secret.DISCORD_TOKEN,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {
        ready: (_bot, payload) => {
            console.log(`${payload.user.username} is ready!`)
        },
    },
});

const nekoCommand: CreateSlashApplicationCommand = {
    name: "neko",
    description: "にゃーんと返します",
};
const niceCommand: CreateSlashApplicationCommand = {
    name: "nice",
    description: "Nice!",
    options: [{
        type: ApplicationCommandOptionTypes.User,
        name: "target",
        description: "Nice person",
        required: true,
        nameLocalizations: {
            ja: "対象者",
        }
    }],
}

await bot.helpers.createGuildApplicationCommand(nekoCommand, Secret.GUILD_ID);
await bot.helpers.createGuildApplicationCommand(niceCommand, Secret.GUILD_ID);
await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [nekoCommand, niceCommand]);

bot.events.interactionCreate = (b, interaction) => {
    switch (interaction.data?.name) {
        case "neko": {
            b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: "にゃーん！！",
                },
            });
            break;
        }
        case "nice": {
            const options = interaction.data?.options;
            if (options == null) {
                throw Error("invalid request");
            }
            const target = options[0].value;
            if (target == null || typeof target !== "string") {
                throw Error("no user passed");
            }

            b.helpers.getMember(Secret.GUILD_ID, target).then((m) => {
                return new Promise<{ point: number | null, target: Member }>((resolve) => {
                    return kv.get<number>([target]).then((entry) => {
                        return resolve({ point: entry.value, target: m });
                    });
                })
            })
            .then(({ target, point }) => {
                const newPoint = point != null ? point + 1 : 1;
                return new Promise<MemberWithPoint>((resolve) => {
                    return kv.set([target.id], newPoint).then((r) => {
                        return resolve({member: target, point: newPoint})
                    });
                });
            })
            .then(({ member, point }) => {
                return b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: {
                        content: `Nice! ${member.nick ?? member.user?.username}\ncurrent point: ${point}`,
                    },
                });
            })
            .catch((e) => {
                console.error(e);
            });
            
            break;
        }
        default: {
            break
        }
    }
};

await startBot(bot);