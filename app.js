const fs = require('fs');
let rawdata = fs.readFileSync('commands.json');
const command_list = JSON.parse(rawdata);
require('dotenv').config();
const tmi = require('tmi.js');


const client = new tmi.Client({
    options: { 
        debug: true, 
        messagesLogLevel: "info" 
    },
    connection: {
        reconnect: true,
        secure: true
    },
    connection: {
        reconnect: true,
        secure: true,
        timeout: 180000,
        reconnectDecay: 1.4,
        reconnectInterval: 1000,
    },
    identity: {
        username: `${process.env.BOT_USERNAME}`,
        password: `${process.env.OAUTH_TOKEN}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
});
client.connect().catch(console.error);


client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    checkTwitchChat(userstate, message, channel)

    //commands only
    if (!message.startsWith('!')) { return; }
    const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
    console.log(message.match(regexpCommand))
    let [raw, command, argument] = message.match(regexpCommand);
    command = command.toLowerCase();

    let command_item;
    if(command_item = command_list.find((element) => element.command === command)) {
        client.say(channel, command_item.response);
        return
    }
});

function checkTwitchChat(userstate, message, channel) {
    message = message.toLowerCase()
    let shouldSendMessage = false
    if (shouldSendMessage) {
      // tell user
      client.say(channel, `@${userstate.username}, sorry!  You message was deleted.`)
      // delete message
      client.deletemessage(channel, userstate.id)
    }
  }