import eris from "eris";
import ConfigLoader from "./lib/config";
import { escapeMarkdown } from "./lib/util";

const config = new (class extends ConfigLoader {
  guildID!: string;
  memberLogChannel!: string;
  memberJoinEmote!: string;
  memberLeaveEmote!: string;
  memberBanEmote!: string;
  token!: string;

  constructor() {
    super(require.resolve("../config.json"), ["guildID", "memberLogChannel", "memberJoinEmote", "memberLeaveEmote", "memberBanEmote", "token"]);
    this.load();
  }
})();

const client = new eris.Client(config.token, {
  intents: ["guilds", "guildMessages", "guildMembers", "guildBans"],
});

client.on("guildMemberAdd", async (guild, member) => {
  if (guild.id !== config.guildID) return;
  await client.createMessage(
    config.memberLogChannel,
    `${config.memberJoinEmote}  ${member.mention} (||${escapeMarkdown(member.username)}#${member.discriminator} / ${member.id}||) joined the server! Welcome!`
  );
});

client.on("guildMemberRemove", async (guild, member) => {
  if (guild.id !== config.guildID) return;
  await client.createMessage(
    config.memberLogChannel,
    `${config.memberLeaveEmote}  ${escapeMarkdown(member.user.username)}#${member.user.discriminator} / ${member.id} left the server!`
  );
});

client.on("guildBanAdd", async (guild, user) => {
  if (guild.id !== config.guildID) return;
  await client.createMessage(
    config.memberLogChannel,
    `${config.memberBanEmote}  ${escapeMarkdown(user.username)}#${user.discriminator} / ${user.id} was banned from the server!`
  );
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator} in ${client.guilds.size} guilds.`);
  client.editStatus("online", {
    type: 1,
    name: "Shino",
    url: "https://twitch.tv/shinotheshino",
  });
});

console.log("Connecting...");
client.connect();
