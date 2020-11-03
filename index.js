/*
Name:Ratchet
Version:1.0.0
Type: Discord.js.bot
*/

// Use prelude config to register .env
require('dotenv').config()

// Thanks

// Put .env private keys into constant variables
const token = process.env.TOKEN
const default_prefix = process.env.DEFAULT_PREFIX

// Require Discord.js and unstructure elements
const Discord = require('discord.js')
const { MessageEmbed, Client } = require('discord.js')

// Require other needed modules
const fs = require('fs')

// Create client
const client = new Client()

// Login Client
client.login(token)

// Handle events
client.on('guildCreate', (guild) => {
    const model_guild = require("./models/GuildConfig")
    const result_string_json_model = JSON.stringify(model_guild, null, "\t")
    console.log('+ Guild: ' + guild.name)
    try {
        fs.writeFileSync(`guilds/${guild.id}.json`, result_string_json_model)
    } catch (err)  {
        console.log("Could not setup config for new guild: " + err)
    }
})

client.on('ready', ()=>{
    console.log(`Signed in as: ${client.user.tag}`)
    

    client.user.setStatus('Available');
    client.user.setPresence({ activity: { name: "the greatest castles" } });
    try {
        client.user.setPresence({ activity: { type: "WATCHING", name: "the greatest castles!" } });
    } catch (err) {
        console.log(err)
    }
})

client.on('guildDelete', (guild)=>{
    fs.unlinkSync(`guilds/${guild.id}.json`)
    console.log('- Guild: ' + guild.name)
})

// Command Handler
client.on('message', async (message)=>{
    if(!message.guild || message.author.bot) return;
    let prefix = require(`./guilds/${message.guild.id}.json`).prefix
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const exists_parse = fs.existsSync(`commands/${command}.js`)
    if(exists_parse == false) return;
    
    try {
        const cmd = require('./commands/' + command + ".js")
        cmd(message, args, client)
    } catch (err) {
        const att = new Discord.MessageAttachment(err.toString(), "error.txt")
        message.channel.send(`There was an error trying to execute that command.
\`\`\`fix
${err.toString()}
\`\`\`
** **
\`\`\`ini
[This may be becuase this command is new, system is out-of-date or there is a problem with discord.]
\`\`\`
        `)
    }
})