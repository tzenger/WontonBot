// require the discord.js module
const Discord = require('discord.js')
const ytdl = require("ytdl-core")

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
//client.on('message', message => {
//	console.log(message.content)
//})

//VARS --------------------
var servers = {}
var joinedMusic = false // boolean describing if the bot is in a voice channel or not
var currentlyPlaying = "" // keeps track of what is currently playing

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



//LISTENER --------------------------
client.on('message', message => { //listening for any of the messages down below
//process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//COMMUNICATION -----------------
    if(message.content.includes(`${prefix}ping`) && !checkAt(message.content) && message.content !== `${prefix}ping`) { // ping (pings a specified person on the server)
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
        
        let args = message.content.substring(prefix.length).split(" ")
        switch (args[0]) {
            case 'play':

            function play(connection, message) {

                var server = servers[message.guild.id]

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: 'audioonly'})) // downloads and plays the song from the URL
                currentlyPlaying = server.queue[0] // sets the currently playing song as the var

                server.queue.shift() // deletes the song currently playing from the queue

                server.dispatcher.on("finish", () => { // once the song is done
                    if(server.queue[0]) { // if there is another song in the queue
                        play(connection, message) // play it
                    }
                    else { // or else
                        server.queue = [] // reset the queue
                        connection.disconnect() // disconnect from the voice channel
                        joinedMusic = false // set joinedMusic back to false (the bot exited the voice channel)
                    }
                })
            }

                if(!args[1]) {
                    message.channel.send("You need to provide a link!")
                    return
                }
                
                if(!message.member.voice.channel) {
                    message.channel.send("You must be in a voice channel in order to play the bot!")
                    return
                }

                if(!servers[message.guild.id]) {
                    servers[message.guild.id] = { queue: [] }
                }
                    
                
                var server = servers[message.guild.id]

                if(ytdl.validateURL(args[1]))
                server.queue.push(args[1])
                else{
                    message.channel.send("Please include a valid YouTube URL")
                    break
                }
                

                console.log(server.queue)

                if(!message.member.voice.connection && !joinedMusic) {
                message.member.voice.channel.join().then(function(connection) { play(connection, message) })
                joinedMusic = true
                }
            break

            case 'skip':
                var server = servers[message.guild.id]
                if(server.dispatcher)
                server.dispatcher.end()
                message.channel.send('**Song Skipped**')
                break
            
            case 'stop':
                var server = servers[message.guild.id]
                console.log(server.queue)
                if(message.member.voice.connection) {
                    for(var i = server.queue.length - 1; i <= 0; i--)
                    server.queue.splice(i, 1)
                }
                console.log(server.queue)

                server.dispatcher.end()
                message.channel.send('**Queue ended and leaving the voice channel**')

                if(!message.member.voice.connection)
                message.member.voice.channel.leave()
                joinedMusic = false
                break;

            case 'pause':
                var server = servers[message.guild.id]
                server.dispatcher.pause()
                message.channel.send("**WontonBot paused**")
                break

            case 'resume':
                var server = servers[message.guild.id]
                server.dispatcher.resume()
                message.channel.send("**WontonBot resumed**")
                break
                
            case 'queue':
                var server = servers[message.guild.id]
                if(server) {
                var videos = []
                for(var i = 0; i < server.queue.length; i++) // equivalent of server.queue, but will be turned into promises
                videos.push(server.queue[i])

                for(var i = 0; i < server.queue.length; i++)
                    videos[i] = ytdl.getBasicInfo(videos[i]) // turning the URLs into promises for metadata
                videos.push(ytdl.getBasicInfo(currentlyPlaying)) // appends the currentlyPlaying promise to the videos array


                Promise.all(videos) // once all the promises in the array videos are complete
                .then((result) => { // then
                    var queueOutput = "> **Queue for " + message.guild.name + "**\n\n__Now Playing__\n" + result[server.queue.length].videoDetails.title + "\n\n__In Queue__\n"

                    for(var i = 0; i < server.queue.length; i++)
                        queueOutput = queueOutput + (i + 1) + ". " + result[i].videoDetails.title + "\n"; // adding the titles to the queueOutput
                        message.channel.send(queueOutput) // sending out the message
                    })
                }
                else
                message.channel.send("Queue is empty")
                break
              
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
    

    if(message.content === `val?`) { // startconvo
        message.channel.send('yo val sucks ass bro why do u even play it')
        message.channel.send('i want to die when i play it theres just stupid oppers and all they do is eat butt lol')
        message.channel.send('literally worst game ever')
    }

});

// login to Discord with your app's token
client.login(token)