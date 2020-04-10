
// Load configuration
const Config = require('./config.json');

const Discord = require('discord.js');

// Create discord client
let discordClient = new Discord.Client();

// Counter of wtf word
var wtfcounter = 0;

/**
 * Save the wtfcounter on file
 */
function save(number) {
    const fs = require('fs');
    let dataToSave = JSON.stringify({"number":number});
    const filename = "wtf.txt";
    fs.writeFile(filename, dataToSave, err => {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * Load the wtfcounter from file
 */
function load() {
    const fs = require('fs');
    const filename = "wtf.txt";
    if (fs.existsSync(filename)) {
        let obj = JSON.parse(fs.readFileSync(filename));
        wtfcounter = obj.number;
    }
}

discordClient.once('ready', () => {
    load();
    console.log("==== Bot Connected ====");
});

discordClient.on('message', async message => {
    // If bot message, don't take it to account
    if (message.author.bot) {
        return;
    }

    // Ignore all private message
    if (message.channel.type === 'dm') {
        return;
    }

    if (message.content[0] === '!') {
        const args = message.content.split(' ');
        const cmd = args[0].substring(1);

        if (cmd === "wtf") {
            message.channel.send("`Scoreboard: " + wtfcounter + " #WTF`");
        }
        return;
    }

    let count = (message.content.match(/#WTF/g) || []).length;
    if (count) {
        wtfcounter += count;
        save(wtfcounter);
    } else {
        // Also detect facepalm emoticon
        let faceplan = 0;
        for (let i = 0; i < message.content.length; i++) {
            let emoticon = message.content.codePointAt(i) + "" + message.content.codePointAt(i + 1);
            if (emoticon == "12931856614") {
                faceplan++;
            }
        }
        if (faceplan) {
            wtfcounter += faceplan;
            save(wtfcounter);
        }
    }

    return;
});

// Authenticate discord bot
discordClient.login(Config.token);

