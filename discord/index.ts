import { MintFunction, mint } from "./utils";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import discord, { Intents, Message } from "discord.js";

const PREFIX = process.env.PREFIX || ";";

const bot = new discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const commands = [
  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies with hello!"),
  new SlashCommandBuilder().setName("mint").setDescription("Mints NFT"),
].map(command => command.toJSON());

bot.on("ready", () => {
  console.log(`[🤖] Bot started! Username - ${bot.user?.tag}`);
  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

  rest
    .put(Routes.applicationCommands(bot.user?.id!), { body: commands })
    .then(() => console.log("[🛠] Discord commands registered successfully!"))
    .catch(console.error);

  bot.user?.setActivity({ name: "discord.gg/buidlers", type: "WATCHING" });
});

bot.on("messageCreate", async (message: Message): Promise<any> => {
  const content = message.content;
  const msgsplit = content.split(" ");

  if (msgsplit[0].toLowerCase() === `${PREFIX}hello`) {
    return message.reply("Hello");
  }

  if (msgsplit[0].toLowerCase() === `${PREFIX}mint`) {
    // Signature mint NFT
    // TODO: check if being replied
    // Check for any attached images
    if (message.attachments.size === 0) {
      return message.reply(
        "You must attach an image or reply to a message with an image!"
      );
    }

    let text: string = "";
    for (let i = 1; i < msgsplit.length; i++) {
      text += msgsplit[i] + " ";
    }

    const image = message.attachments.first()?.url!;
    const name = text.split("|")[0] || undefined;
    const description = text.split("|")[1] || undefined;

    message.reply("Upload in process...");

    const mintResponse: MintFunction | undefined = await mint(
      name,
      description,
      image
    );

    if (!mintResponse) return message.reply("Minting failed!");

    message.author.send(
      `Follow the following URL to mint and claim your NFT!\n\n${process.env.FRONTEND_BASE_URL}/mint/${mintResponse.data.id}`
    );
    message.reply("Check your DM to proceed with claiming the NFT");
  }
});

bot.login(process.env.DISCORD_TOKEN);
