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

//reading help file framework
var fs = require('fs')
var commandList = fs.readFileSync('commandList.txt', 'utf8')

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!')
})

// logs any sent message into cmd prompt
client.on('message', message => {
	console.log(message.content)
})

//FUNCTIONS FOR CODING ----------------


function checkAt(msg) { // a function to check for the presence of an @, which is commonly associated with a user tag
    if(msg.indexOf("@") != -1)
        return true
    return false
}

function isolateTrailText(fulltext, initcmd) { // isolates the trailing text after a command
    return fulltext.slice(initcmd.length + 1, fulltext.length)
}

function txt2User(txt, guild) { // returns promise with the resulting user's data
    return guild.members.fetch({query: txt, limit: 1})
}

client.on('message', message => { //listening for any of the messages down below


//COMMUNICATION -----------------
    if(message.content.includes(`${prefix}ping`) && !checkAt(message.content)) { // ping (pings a specified person on the server)
        txt2User(isolateTrailText(message.content, `${prefix}ping`), message.guild)
        .then(res => { // extracts the user's id and sends it as a tagged message
            let guildMember = res
            console.log(guildMember.first().id)
            message.channel.send(`<@${guildMember.first().id}>`)
        })
        .catch(console.error)
    }
    

    if(message.content === `${prefix}help`) { // help (prints the help commandList.txt)
        message.channel.send(commandList)
        }
    
//MUSIC ----------------------

       if(message.content === `${prefix}play`) {
        message.channel.send('I would love to talk to you more about this!')
    } 

//FUN ------------------------
    
    

	if(message.content === `${prefix}startconvo`) { // startconvo
        message.channel.send('I would love to talk to you more about this!')
    }
    else if (message.content.includes(`${prefix}startconvo`) && checkAt(message.content)) {
             message.channel.send('I would love to talk to you, ' + message.content.slice(message.content.indexOf('@') - 1, message.content.indexOf('>') + 1) + ', more about this!')
     }
    else if (message.content.includes(`${prefix}startconvo`) && !checkAt(message.content)) {
        txt2User(isolateTrailText(message.content, `${prefix}startconvo`), message.guild)
        .then(res => { // extracts the user's id and sends it as a tagged message
            let guildMember = res
            console.log(guildMember.first().id)
            message.channel.send('I would love to talk to you, ' + `<@${guildMember.first().id}>` + ', more about this!')
        })
        .catch(console.error)
    }
    

	if(message.content === `${prefix}endconvo`) { // endconvo
        message.channel.send('Sounds intriguing, but I gtg so see ya!')
    }
    else if (message.content.includes(`${prefix}endconvo`) && checkAt(message.content)) {
             message.channel.send('Sounds intriguing ' + message.content.slice(message.content.indexOf('@') - 1, message.content.indexOf('>') + 1) + ', but I gtg so see ya!')
     }
    else if (message.content.includes(`${prefix}endconvo`) && !checkAt(message.content)) {
        txt2User(isolateTrailText(message.content, `${prefix}endconvo`), message.guild)
        .then(res => { // extracts the user's id and sends it as a tagged message
            let guildMember = res
            console.log(guildMember.first().id)
            message.channel.send('Sounds intriguing ' + `<@${guildMember.first().id}>` + ', but I gtg so see ya!')
        })
        .catch(console.error)
    }
    

    if(message.content === `${prefix}fish`) { // fish (blubs)
        for(i = 0; i < 5; i++)
        message.channel.send('blub')
    }


    if(message.content === `${prefix}github`) { // github (sends user link to official WontonBot github)
        message.channel.send("https://github.com/tzenger/WontonBot")
        }
    

});

// login to Discord with your app's token
client.login(token)