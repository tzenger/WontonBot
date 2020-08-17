// require the discord.js module
const Discord = require('discord.js')

/**
// require data values stored in the config.json file
const config = require('./config.json');
**/

// destructures the config file values into values which can be used in index.js
const {prefix, token} = require('./config.json')

// create a new Discord client
const client = new Discord.Client()
var fs = require('fs');
var commandList = fs.readFileSync('commandList.txt', 'utf8')

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!')
});

// logs any sent message into cmd prompt
client.on('message', message => {
	console.log(message.content)
});

client.on('message', message => {

    // help (prints the help menu txt thingy)
    if(message.content === `${prefix}help`) {
        message.channel.send(commandList)
        }

    // endconvo (responds to endconvo message with "sounds intriguing, well anyways I gtg see ya")
	if(message.content === `${prefix}endconvo`) {
        message.channel.send('Sounds intriguing, but I gtg so see ya!')
    }

    // fish (blubs))
    if(message.content === `${prefix}fish`) {
        for(i = 0; i < 5; i++)
        message.channel.send('blub')
    }

    

});

// login to Discord with your app's token
client.login(token)


