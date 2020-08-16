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

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!')
});


// logs any sent message into cmd prompt
client.on('message', message => {
	console.log(message.content)
});

// endconvo (responds to endconvo message with "sounds intriguing, well anyways I gtg see ya")
client.on('message', message => {
	if(message.content === prefix + "endconvo") {
        message.channel.send("sounds intriguing, well anyways I gtg see ya!")
    }
});

// login to Discord with your app's token
client.login(token)


