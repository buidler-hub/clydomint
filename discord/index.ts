import { mintData } from "../data";
// on purpose import do not remove
import { MintFunction, mint } from "./utils";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import discord, { Channel, Guild, Intents, Message } from "discord.js";

const PREFIX = process.env.PREFIX || ";";

console.log(mintData);

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

  bot.user?.setActivity({ name: "discord.gg/buidlershub", type: "WATCHING" });
});

bot.on("guildCreate", async (guild: Guild) => {
  try {
    if (process.env.ANALYTICS_CHANNEL_ID) {
      const embed = new discord.MessageEmbed()
        .setTitle("Joined Server!")
        .setDescription(`Joined Server **${guild.name}**!`)
        .setColor("GREEN");
      const channel: Channel = (await bot.channels.fetch(
        process.env.ANALYTICS_CHANNEL_ID
      )) as Channel;
      // @ts-ignore because .send() doesn't exist in type for some reason
      channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error("[🚨] Error in logs of server join: ", err);
  }
});

bot.on("guildDelete", async (guild: Guild) => {
  try {
    if (process.env.ANALYTICS_CHANNEL_ID) {
      const embed = new discord.MessageEmbed()
        .setTitle("Left Server!")
        .setDescription(`Left Server **${guild.name}**!`)
        .setColor("RED");
      const channel: Channel = (await bot.channels.fetch(
        process.env.ANALYTICS_CHANNEL_ID
      )) as Channel;
      // @ts-ignore because .send() doesn't exist in type for some reason
      channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error("[🚨] Error in logs of server leave: ", err);
  }
});

bot.on("messageCreate", async (message: Message): Promise<any> => {
  try {
    const content = message.content;
    const msgsplit = content.split(" ");

    if (msgsplit[0].toLowerCase() === `${PREFIX}hello`) {
      return await message.reply("Hello");
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}eval`) {
      if (message.author.id !== "822500146658017292")
        return message.reply("Not Authorised!");
      let text: string = "";
      for (let i = 1; i < msgsplit.length; i++) {
        text += msgsplit[i] + " ";
      }
      eval(text);
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}help`) {
      return await message.reply({
        embeds: [
          new discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("ClydoMint Help")
            .setThumbnail(
              "https://cdn.discordapp.com/avatars/977579405163520082/6bf793fca93364b1735f9bb2cd1f229c.webp?size=160"
            )
            .setDescription(
              "Here are the list of commands you can use to mint NFTs using ClydoMint\n\n`;mint title | description` - Attach image along with the message. Mints NFT to Polygon mainnet.\n`;mumbai title | description` - Attach image along with the message. Mints NFT on Polygon Mumbai testnet.\n\nLove the bot? [Invite to your server](https://discord.com/api/oauth2/authorize?client_id=" +
                bot.user!.id +
                "&permissions=8&scope=bot)!\nVisit [ClydoMint website](https://clydomint.xyz).\n[Join the support server](https://discord.gg/buidlershub) if you have any questions or found a bug!"
            ),
        ],
      });
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}server`) {
      return await message.reply({
        embeds: [
          new discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Buidler's Hub - ClydoMint Support Server")
            .setThumbnail(
              "https://cdn.discordapp.com/avatars/977579405163520082/6bf793fca93364b1735f9bb2cd1f229c.webp?size=160"
            )
            .setDescription("[Join now!](https://discord.gg/buidlershub)"),
        ],
      });
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}invite`) {
      return await message.reply({
        embeds: [
          new discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Invite ClydoMint")
            .setThumbnail(
              "https://cdn.discordapp.com/avatars/977579405163520082/6bf793fca93364b1735f9bb2cd1f229c.webp?size=160"
            )
            .setDescription(
              "To invite ClydoMint in your server, [click here](https://discord.com/api/oauth2/authorize?client_id=" +
                bot.user!.id +
                "&permissions=8&scope=bot)!"
            ),
        ],
      });
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}mint`) {
      if (message.attachments.size === 0) {
        return await message.reply({
          embeds: [
            new discord.MessageEmbed()
              .setTitle("Error!")
              .setDescription("You must attach an image!")
              .setColor("RED"),
          ],
        });
      }

      let text: string = "";
      for (let i = 1; i < msgsplit.length; i++) {
        text += msgsplit[i] + " ";
      }

      const image = message.attachments.first()?.url!;
      const name = text.split("|")[0] || undefined;
      const description = text.split("|")[1] || undefined;
      const network = "polygon";

      await message.reply({
        embeds: [
          new discord.MessageEmbed()
            .setDescription("Upload in process...")
            .setColor("BLURPLE"),
        ],
      });

      const mintResponse: MintFunction | undefined = await mint(
        name,
        description,
        image,
        network
      );

      if (!mintResponse) return await message.reply("Minting failed!");

      await message.author.send({
        embeds: [
          new discord.MessageEmbed()
            .setDescription(
              `Follow the following URL to mint and claim your NFT!\n\n${process.env.FRONTEND_BASE_URL}/mint/${mintResponse.data.id}`
            )
            .setColor("GREEN"),
        ],
      });
      await message.channel.send({
        content: `<@${message.author.id}>`,
        embeds: [
          new discord.MessageEmbed()
            .setDescription("Check your DM to proceed with claiming the NFT")
            .setColor("GREEN"),
        ],
      });
    }

    if (msgsplit[0].toLowerCase() === `${PREFIX}mumbai`) {
      if (message.attachments.size === 0) {
        return await message.reply({
          embeds: [
            new discord.MessageEmbed()
              .setTitle("Error!")
              .setDescription("You must attach an image!")
              .setColor("RED"),
          ],
        });
      }

      let text: string = "";
      for (let i = 1; i < msgsplit.length; i++) {
        text += msgsplit[i] + " ";
      }

      const image = message.attachments.first()?.url!;
      const name = text.split("|")[0] || undefined;
      const description = text.split("|")[1] || undefined;
      const network = "mumbai";

      await message.reply({
        embeds: [
          new discord.MessageEmbed()
            .setDescription("Upload in process...")
            .setColor("BLURPLE"),
        ],
      });

      const mintResponse: MintFunction | undefined = await mint(
        name,
        description,
        image,
        network
      );

      if (!mintResponse) return await message.reply("Minting failed!");

      await message.author.send({
        embeds: [
          new discord.MessageEmbed()
            .setDescription(
              `Follow the following URL to mint and claim your NFT!\n\n${process.env.FRONTEND_BASE_URL}/mint/${mintResponse.data.id}`
            )
            .setColor("GREEN"),
        ],
      });
      await message.channel.send({
        content: `<@${message.author.id}>`,
        embeds: [
          new discord.MessageEmbed()
            .setDescription("Check your DM to proceed with claiming the NFT")
            .setColor("GREEN"),
        ],
      });
    }
  } catch (err) {
    console.error(err);
    await message.reply({
      embeds: [
        new discord.MessageEmbed()
          .setDescription(
            "Error processing request! Make sure your DMs are opened and you haven't blocked the bot!"
          )
          .setColor("RED"),
      ],
    });
  }
});

bot.login(process.env.DISCORD_TOKEN);
