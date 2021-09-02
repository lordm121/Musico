var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
/*
*@info
* @license [MIT]
 MIT License

Copyright (c) 2021 Whirl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*@author Whirl

*/
var chalk = require("chalk");
console.log(chalk.redBright("If this takes too much time make sure the token is there"));
var _a = require("discord.js"), Client = _a.Client, Intents = _a.Intents, MessageEmbed = _a.MessageEmbed, DJSPermissions = _a.Permissions, MessageActionRow = _a.MessageActionRow, MessageButton = _a.MessageButton;
var client = new Client({
    //since we can now directly import the client class in djs v13 i did that
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});
var _b = require("discord-player"), Player = _b.Player, AudioFilters = _b.AudioFilters;
var wait = require("util").promisify(setTimeout);
var Lyrics = require("@discord-player/extractor").Lyrics;
var lyricsFinder = Lyrics.init();
var DiscordTogether = require("discord-together").DiscordTogether;
client.discordTogether = new DiscordTogether(client);
var config = require("./musico.config.json");
if (!config.token) {
    console.log(chalk.red("[ERROR] | No token found in config.json")); //if you face this error make sure your token is right
    process.exit(1);
}
var player = new Player(client);
/*
Trim function
*/
/**
 * @param  {} str
 * @param  {} max
 * @returns str
 */
var trim = function (str, max) {
    return str.length > max ? str.slice(0, max - 3) + "..." : str;
};
/** eval function */
var clean = function (text) {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
};
//AS the play even is when the song actually starts playing and not the command we send this embed
/**
 * @param  {} "trackStart"
 * @param  {} (queue
 * @param  {} track
 * @param  {[newMessageEmbed(} =>queue.metadata.channel.send({embeds
 */
player.on("trackStart", function (queue, track) {
    return queue.metadata.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Now Playing")
                .setDescription("**" + track.title + "**")
                .setThumbnail(track.thumbnail)
                .addField("Duration", track.duration + "s", true)
                .addField("Requested By", "" + track.requestedBy.username, true)
                .addField("Views", track.views.toString(), true)
                .addField("URL", "**[Click Here](" + track.url + ")**")
                .addField("ARTIST", track.author, true)
                .setFooter("\u00A9 " + client.user.username + " | Made By Whirl#0021"),
        ]
    });
});
client.once("ready", function () {
    client.user.setPresence({
        activities: [{ name: "with musical instruments" }],
        status: "dnd"
    });
    console.clear(); //Hello Please don't remove the footer credits ,
    //tho i cannot force you not too if you don't comply with license i can file a lawsuit on you
    console.log(chalk.yellowBright.bold("\n  \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557                               \n  \u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557                              \n  \u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551                              \n  \u2588\u2588\u2551\u255A\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551   \u2588\u2588\u2551                              \n  \u2588\u2588\u2551 \u255A\u2550\u255D \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D                              \n  \u255A\u2550\u255D     \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D                               \n                                                                                \n                      \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557    \u2588\u2588\u2557    \u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557     \n                      \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D    \u2588\u2588\u2551    \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551     \n                      \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u255A\u2588\u2588\u2588\u2588\u2554\u255D     \u2588\u2588\u2551 \u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551     \n                      \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557  \u255A\u2588\u2588\u2554\u255D      \u2588\u2588\u2551\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551     \n                      \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2551       \u255A\u2588\u2588\u2588\u2554\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\n                      \u255A\u2550\u2550\u2550\u2550\u2550\u255D    \u255A\u2550\u255D        \u255A\u2550\u2550\u255D\u255A\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n                                                                                \n  "));
    console.log(chalk.green.bold("[Musico] | Logged in as " + client.user.tag + "!"));
    console.log(chalk.yellow.bold("[Musico] | Servers! [\"" + client.guilds.cache.size + "\"]"));
    console.log(chalk.red.bold("[Musico] | Users! [\"" + client.users.cache.size + "\"]"));
    console.log(chalk.cyan.bold("[Musico] | Channels! [\"" + client.channels.cache.size + "\"]"));
    console.log(chalk.greenBright("[Musico] | Loaded all (/) commands"));
});
//when the queue ends
player.on("queueEnd", function (queue) {
    queue.metadata.channel.send("\uD83D\uDEB6\u200D\u2642\uFE0F | I left the voice channel , this might be because i was manually disconnected  or the queue ended or an error occured ");
});
/**
 * @param  {interaction} "interactionCreate"
 * @param  {} async(interaction)
 */
client.on("interactionCreate", function (interaction) { return __awaiter(_this, void 0, void 0, function () {
    var query, queue, _a, track, playEmbed, queue, queue, volume, queue, queue, x, y, queueEmbed, queue, queue, filter, help, kool, queue, embed, queue, queue, embed, queue, time, ttr, queue, queue, queue, skit, z, queue, song, lyrics, x, lyricsEmbed, queue, loop, queue, channel, string, lol, string, evaled, err_1, queue, query, track, playEmbed;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(interaction.commandName == "play")) return [3 /*break*/, 16];
                //if the in interaction is a command and has the name of play
                return [4 /*yield*/, interaction.deferReply()];
            case 1:
                //if the in interaction is a command and has the name of play
                _b.sent();
                if (!interaction.guild.me.permissions.has([
                    DJSPermissions.FLAGS.CONNECT,
                    DJSPermissions.FLAGS.SPEAK,
                ])) {
                    return [2 /*return*/, interaction.reply(config.error_emoji + " | I don't have permissions to join a voice channel and play music in this guild please try to re-invite me")];
                }
                if (!!interaction.member.voice.channelId) return [3 /*break*/, 3];
                return [4 /*yield*/, interaction.editReply({
                        content: " " + config.error_emoji + " | You are not in a voice channel!"
                    })];
            case 2: return [2 /*return*/, _b.sent()];
            case 3:
                if (!(interaction.guild.me.voice.channelId &&
                    interaction.member.voice.channelId !==
                        interaction.guild.me.voice.channelId)) return [3 /*break*/, 5];
                return [4 /*yield*/, interaction.editReply({
                        content: " " + config.error_emoji + " | You are not in my voice channel!"
                    })];
            case 4: return [2 /*return*/, _b.sent()];
            case 5:
                query = interaction.options.getString("song");
                queue = player.createQueue(interaction.guild, {
                    metadata: {
                        channel: interaction.channel,
                        int: interaction
                    }
                });
                _b.label = 6;
            case 6:
                _b.trys.push([6, 9, , 11]);
                if (!!queue.connection) return [3 /*break*/, 8];
                return [4 /*yield*/, queue.connect(interaction.member.voice.channel)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                _a = _b.sent();
                queue.destroy();
                return [4 /*yield*/, interaction.editReply({
                        content: config.error_emoji + " | Could not join your voice channel!",
                        ephemeral: true
                    })];
            case 10: return [2 /*return*/, _b.sent()];
            case 11: return [4 /*yield*/, player
                    .search(query, {
                    requestedBy: interaction.member
                })
                    .then(function (x) { return x.tracks[1]; })];
            case 12:
                track = _b.sent();
                if (!!track) return [3 /*break*/, 14];
                return [4 /*yield*/, interaction.editReply({
                        content: config.error_emoji + " | Track **" + query + "** not found!",
                        ephemeral: true
                    })];
            case 13: return [2 /*return*/, _b.sent()];
            case 14:
                queue.play(track);
                playEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("\uD83C\uDFB6 | New Song Added to queue")
                    .setThumbnail(track.thumbnail)
                    .setDescription("" + track.title)
                    .setFooter("Requested by " + track.requestedBy.username + " | Made By Whirl#0021");
                return [4 /*yield*/, interaction.editReply({ embeds: [playEmbed], ephemeral: true })];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16:
                if (!(interaction.commandName == "stop")) return [3 /*break*/, 19];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 18];
                return [4 /*yield*/, queue.destroy()];
            case 17:
                _b.sent();
                return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Music stopped !")];
            case 18: return [3 /*break*/, 83];
            case 19:
                if (!(interaction.commandName == "ping")) return [3 /*break*/, 20];
                interaction.reply(" - Pong!");
                return [3 /*break*/, 83];
            case 20:
                if (!(interaction.commandName == "volume")) return [3 /*break*/, 23];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                volume = interaction.options.getInteger("volume");
                if (!queue) return [3 /*break*/, 22];
                return [4 /*yield*/, queue.setVolume(volume)];
            case 21:
                _b.sent();
                return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Volume set to " + volume + " !")];
            case 22: return [3 /*break*/, 83];
            case 23:
                if (!(interaction.commandName == "shuffle")) return [3 /*break*/, 26];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 25];
                return [4 /*yield*/, queue.shuffle()];
            case 24:
                _b.sent();
                return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Queue shuffled !")];
            case 25: return [3 /*break*/, 83];
            case 26:
                if (!(interaction.commandName == "queue")) return [3 /*break*/, 27];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    x = queue.tracks
                        .map(function (song, index) { return "**" + (index + 1) + "** - **" + song.title + "**"; })
                        .join("\n");
                    y = trim(x, 1024);
                    queueEmbed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("\uD83C\uDFB6 | Queue")
                        .setDescription("Now Playing - " + queue.nowPlaying().title + "\n" + x)
                        .addField("Progress", queue.createProgressBar({ queue: true }))
                        .setFooter("\u00A9 " + config.bot_name + " 2021| Made By Whirl#0021");
                    return [2 /*return*/, interaction.reply({ embeds: [queueEmbed] })];
                }
                return [3 /*break*/, 83];
            case 27:
                if (!(interaction.commandName == "skip")) return [3 /*break*/, 30];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 29];
                return [4 /*yield*/, queue.skip()];
            case 28:
                _b.sent();
                return [2 /*return*/, interaction.reply(config.confirm_emoji + " | - Song skipped !")];
            case 29: return [3 /*break*/, 83];
            case 30:
                if (!(interaction.commandName == "filter")) return [3 /*break*/, 45];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                filter = interaction.options.getString("filter");
                if (!(filter == "8d")) return [3 /*break*/, 32];
                queue.setFilters({ "8D": true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - 8D filter enabled !")];
            case 31:
                _b.sent();
                _b.label = 32;
            case 32:
                if (!(filter == "karok")) return [3 /*break*/, 34];
                queue.setFilters({ karoke: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Karoke filter enabled !")];
            case 33:
                _b.sent();
                _b.label = 34;
            case 34:
                if (!(filter == "rev")) return [3 /*break*/, 36];
                queue.setFilters({ reverse: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Reverse filter enabled !")];
            case 35:
                _b.sent();
                _b.label = 36;
            case 36:
                if (!(filter == "ear")) return [3 /*break*/, 38];
                queue.setFilters({ earrape: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Earrape filter enabled !")];
            case 37:
                _b.sent();
                _b.label = 38;
            case 38:
                if (!(filter == "chor")) return [3 /*break*/, 40];
                queue.setFilters({ chorus: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Chorus filter enabled !")];
            case 39:
                _b.sent();
                _b.label = 40;
            case 40:
                if (!(filter == "mon")) return [3 /*break*/, 42];
                queue.setFilters({ mono: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Mono filter enabled !")];
            case 41:
                _b.sent();
                _b.label = 42;
            case 42:
                if (!(filter == "bass")) return [3 /*break*/, 44];
                queue.setFilters({ bassboost: true });
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Bassboost filter enabled !")];
            case 43:
                _b.sent();
                _b.label = 44;
            case 44: return [3 /*break*/, 83];
            case 45:
                if (!(interaction.commandName == "help")) return [3 /*break*/, 46];
                help = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("\uD83D\uDCD6 | Help")
                    .setDescription("**Here are all my commands**\n" +
                    "```play```  ```stop```  ```pause```  ```resume```  ```loop``` ```volume```  ```jump```  ```seek```  ```skip```  ```lyrics``` ```shuffle``` ```clearqueue``` ```filter```  ```nowplaying``` ```save``` ```back``` ```help```  ```eval``` ```activity```  ```invite```")
                    .setFooter("\u00A9 " + config.bot_name + " 2021| Use **/** before each command | Made By Whirl#0021");
                kool = new MessageActionRow().addComponents(new MessageButton()
                    .setLabel("Website")
                    .setStyle("LINK")
                    .setURL(config.website_url)
                    .setEmoji(config.website_emoji_id), new MessageButton()
                    .setLabel("Invite")
                    .setStyle("LINK")
                    .setURL(config.invite_link)
                    .setEmoji(config.invite_emoji_id), new MessageButton()
                    .setLabel("Github")
                    .setStyle("LINK")
                    .setURL(config.github_link)
                    .setEmoji(config.github_emoji_id), new MessageButton()
                    .setLabel("Support Server")
                    .setStyle("LINK")
                    .setURL(config.support_link)
                    .setEmoji(config.support_emoji_id));
                interaction.reply({ embeds: [help], components: [kool] });
                return [3 /*break*/, 83];
            case 46:
                if (!(interaction.commandName == "nowplaying")) return [3 /*break*/, 47];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("🎶 | Now Playing")
                        .setDescription(queue.nowPlaying().title)
                        .setThumbnail(queue.nowPlaying().thumbnail)
                        .addFields({ name: "Uploader", value: queue.nowPlaying().author, inline: true }, {
                        name: "Duration",
                        value: queue.nowPlaying().duration + "s",
                        inline: true
                    }, {
                        name: "Requested By",
                        value: queue.nowPlaying().requestedBy.username,
                        inline: true
                    }, {
                        name: "Views",
                        value: queue.nowPlaying().views.toString(),
                        inline: true
                    }, {
                        name: "Progress Bar",
                        value: queue.createProgressBar({ timecodes: true })
                    })
                        .setFooter("\u00A9 2021 " + config.bot_name + " | Made by Whirl#0021");
                    interaction.reply({ embeds: [embed] });
                }
                return [3 /*break*/, 83];
            case 47:
                if (!(interaction.commandName == "clearqueue")) return [3 /*break*/, 48];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    queue.clear();
                    return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Queue cleared !")];
                }
                return [3 /*break*/, 83];
            case 48:
                if (!(interaction.commandName == "save")) return [3 /*break*/, 51];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 50];
                embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("⏳ | Saved Song")
                    .setDescription(queue.nowPlaying().title)
                    .setThumbnail(queue.nowPlaying().thumbnail)
                    .addFields({ name: "Uploader", value: queue.nowPlaying().author, inline: true }, {
                    name: "Duration",
                    value: queue.nowPlaying().duration + "s",
                    inline: true
                }, {
                    name: "Requested By",
                    value: queue.nowPlaying().requestedBy.username,
                    inline: true
                }, {
                    name: "Views",
                    value: queue.nowPlaying().views.toString(),
                    inline: true
                }, {
                    name: "URL",
                    value: "[Click Here](" + queue.nowPlaying().url + ")",
                    inline: true
                })
                    .setFooter("\u00A9 2021 " + config.bot_name + " | Made by Whirl#0021");
                interaction.user
                    .send({ embeds: [embed] })["catch"](interaction.followUp("Could not dm you"));
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | - Check your Dm's !")];
            case 49:
                _b.sent();
                _b.label = 50;
            case 50: return [3 /*break*/, 83];
            case 51:
                if (!(interaction.commandName == "seek")) return [3 /*break*/, 52];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    time = interaction.options.getInteger("time") * 100;
                    ttr = queue.seek(time);
                    return [2 /*return*/, interaction.reply(ttr
                            ? config.confirm_emoji + ": | - Seeked to " + time / 100 + " seconds !"
                            : config.error_emoji + " | - An error ocurred !")];
                }
                return [3 /*break*/, 83];
            case 52:
                if (!(interaction.commandName == "pause")) return [3 /*break*/, 53];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    queue.setPaused({ paused: true });
                    return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Paused !")];
                }
                return [3 /*break*/, 83];
            case 53:
                if (!(interaction.commandName == "resume")) return [3 /*break*/, 54];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (queue) {
                    queue.setPaused(false);
                    return [2 /*return*/, interaction.reply(config.confirm_emoji + ": | - Resumed the music!")];
                }
                return [3 /*break*/, 83];
            case 54:
                if (!(interaction.commandName == "jump")) return [3 /*break*/, 57];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 56];
                skit = interaction.options.getInteger("amount");
                if (skit > queue.tracks.length) {
                    return [2 /*return*/, interaction.reply(config.error_emoji + ": | - There ain't that many songs in the queue  !")];
                }
                z = queue.jump(skit);
                return [4 /*yield*/, interaction.reply(z
                        ? config.confirm_emoji + " | - Skipped  " + skit + " songs!"
                        : config.error_emoji + " | An error ocurred !")];
            case 55:
                _b.sent();
                _b.label = 56;
            case 56: return [3 /*break*/, 83];
            case 57:
                if (!(interaction.commandName == "lyrics")) return [3 /*break*/, 62];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 61];
                return [4 /*yield*/, interaction.deferReply()];
            case 58:
                _b.sent();
                song = queue.nowPlaying();
                return [4 /*yield*/, lyricsFinder.search(song.title)];
            case 59:
                lyrics = _b.sent();
                x = lyrics ? lyrics.lyrics : "No lyrics found";
                lyricsEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Lyrics for " + song.title)
                    .setDescription(x)
                    .setFooter("\u00A9 " + config.bot_name + " 2021 | Made By Whirl#0021");
                return [4 /*yield*/, interaction.editReply({ embeds: [lyricsEmbed] })];
            case 60:
                _b.sent();
                _b.label = 61;
            case 61: return [3 /*break*/, 83];
            case 62:
                if (!(interaction.commandName == "loop")) return [3 /*break*/, 66];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 65];
                loop = interaction.options.getString("mode");
                return [4 /*yield*/, queue.setRepeatMode(loop)];
            case 63:
                _b.sent();
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + ": | Set the loop mode")];
            case 64:
                _b.sent();
                _b.label = 65;
            case 65: return [3 /*break*/, 83];
            case 66:
                if (!(interaction.commandName == "back")) return [3 /*break*/, 70];
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You're not in a voice channel !",
                            ephemeral: true
                        })];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.send({
                            content: config.error_emoji + " | - You are not in the same voice channel !",
                            ephemeral: true
                        })];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.reply({
                            content: config.error_emoji + " | - There is no music playing  in this guild !",
                            ephemeral: true
                        })];
                if (!queue) return [3 /*break*/, 69];
                return [4 /*yield*/, queue.back()];
            case 67:
                _b.sent();
                return [4 /*yield*/, interaction.reply(config.confirm_emoji + " | Playing the previous track ")];
            case 68:
                _b.sent();
                _b.label = 69;
            case 69: return [3 /*break*/, 83];
            case 70:
                if (!(interaction.commandName == "activity")) return [3 /*break*/, 71];
                channel = interaction.options.getChannel("channel");
                string = interaction.options.getString("activity");
                if (channel.type !== "GUILD_VOICE") {
                    return [2 /*return*/, interaction
                            .reply("The chosen channel must be a voice channel ")["catch"](console.error)];
                }
                if (string == "yt") {
                    client.discordTogether
                        .createTogetherCode(channel.id, "youtube")
                        .then(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, interaction.reply("[**Click here to join YouTube Together**](" + invite.code + " \"Join YouTube Together\")")];
                        });
                    }); });
                }
                else if (string == "poker") {
                    client.discordTogether
                        .createTogetherCode(channel.id, "poker")
                        .then(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, interaction.reply("[**Click here to join Poker Night**](" + invite.code + " \"Join Poker Night\")")];
                        });
                    }); });
                }
                else if (string == "fish") {
                    client.discordTogether
                        .createTogetherCode(channel.id, "fishing")
                        .then(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, interaction.reply("[**Click here to join Fishington.io**](" + invite.code + " \"Join fishington.io\")")];
                        });
                    }); });
                }
                else if (string == "bet") {
                    client.discordTogether
                        .createTogetherCode(channel.id, "betrayal")
                        .then(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, interaction.reply("[**Click here to join Betrayal.io**](" + invite.code + " \"Join betrayal.io\")")];
                        });
                    }); });
                }
                else if (string == "chess") {
                    client.discordTogether
                        .createTogetherCode(channel.id, "chess")
                        .then(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, interaction.reply("[**Click here to join Chess**](" + invite.code + " \"Join A game of Chess\")")];
                        });
                    }); });
                }
                return [3 /*break*/, 83];
            case 71:
                if (!(interaction.commandName == "invite")) return [3 /*break*/, 73];
                lol = new MessageActionRow().addComponents(new MessageButton()
                    .setLabel("Invite Me")
                    .setStyle("LINK")
                    .setURL(config.invite_link)
                    .setEmoji(config.invite_emoji_id));
                return [4 /*yield*/, interaction.reply({
                        content: "Click Below To Invite me",
                        components: [lol],
                        ephemeral: true
                    })];
            case 72:
                _b.sent();
                return [3 /*break*/, 83];
            case 73:
                if (!(interaction.commandName == "eval")) return [3 /*break*/, 78];
                string = interaction.options.getString("code");
                if (interaction.member.id !== "853161018629160990" || "853161018629160990")
                    return [2 /*return*/, interaction.reply("This command is devs only ")];
                _b.label = 74;
            case 74:
                _b.trys.push([74, 76, , 77]);
                evaled = eval(string);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                interaction.reply("Successfully evaled your code");
                return [4 /*yield*/, interaction.followUp({
                        content: "" + (clean(evaled), { code: "xl" }),
                        ephemeral: true
                    })];
            case 75:
                _b.sent();
                return [3 /*break*/, 77];
            case 76:
                err_1 = _b.sent();
                interaction.reply({
                    content: "`ERROR` ```xl\n" + clean(err_1) + "\n```",
                    ephemeral: true
                });
                return [3 /*break*/, 77];
            case 77: return [3 /*break*/, 83];
            case 78:
                if (!interaction.isContextMenu()) return [3 /*break*/, 83];
                interaction.deferReply();
                if (!interaction.member.voice.channel)
                    return [2 /*return*/, interaction.channel.editReply(config.error_emoji + " | - You're not in a voice channel !")];
                if (interaction.guild.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                        interaction.guild.me.voice.channel.id)
                    return [2 /*return*/, interaction.channel.editReply(config.error_emoji + " | - You are not in the same voice channel !")];
                queue = player.getQueue(interaction.guild.id);
                if (!queue || !queue.playing)
                    return [2 /*return*/, interaction.editReply(config.error_emoji + " | - There is no music playing  in this guild !")];
                if (!queue) return [3 /*break*/, 83];
                query = interaction.options.getMessage("message");
                return [4 /*yield*/, player
                        .search(query, {
                        requestedBy: interaction.member
                    })
                        .then(function (x) { return x.tracks[1]; })];
            case 79:
                track = _b.sent();
                if (!!track) return [3 /*break*/, 81];
                return [4 /*yield*/, interaction.editReply({
                        content: config.error_emoji + " | Track **" + query + "** not found!"
                    })];
            case 80: return [2 /*return*/, _b.sent()];
            case 81:
                queue.play(track);
                playEmbed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("\uD83C\uDFB6 | New Song Added to queue")
                    .setThumbnail(track.thumbnail)
                    .setDescription("" + track.title)
                    .setFooter("Requested by " + track.requestedBy.username + " | Made By Whirl#0021");
                return [4 /*yield*/, interaction.editReply({ embeds: [playEmbed], ephemeral: true })];
            case 82:
                _b.sent();
                _b.label = 83;
            case 83: return [2 /*return*/];
        }
    });
}); });
client.on("guild_create", function (guild) {
    var channel = guild.channels.cache.find(function (c) { return c.name.includes("general"); });
    if (channel) {
        channel.send(config.guild_join_message);
    }
});
client.on("messageCreate", function (message) { return __awaiter(_this, void 0, void 0, function () {
    var lol;
    return __generator(this, function (_a) {
        if (message.author.bot)
            return [2 /*return*/];
        if (message.content.includes("<@876761541481992212>") ||
            message.content.includes("<@!876761541481992212>")) {
            lol = new MessageActionRow().addComponents(new MessageButton()
                .setLabel("Invite Me")
                .setStyle("LINK")
                .setURL(config.invite_link)
                .setEmoji(config.invite_emoji_id));
            message.reply({
                content: "Click Below To Invite me",
                components: [lol],
                ephemeral: true
            });
        }
        return [2 /*return*/];
    });
}); });
client.login(config.token);
/*
If your bot does not work then feel free to join our server from readme.md and i
will help you with your issue.
*/
//thousand lines bruh :_:
