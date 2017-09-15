var restify = require('restify');
var botbuilder = require('botbuilder');

//setup le serveur restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
	console.log('%s bot started at %s', server.name, server.url);
});

//create chat connector
var connector = new botbuilder.ChatConnector({
	appId: process.env.APP_ID,
	appPassword: process.env.APP_SECRET
});

// listen for user inputs
server.post('/api/messages', connector.listen());

//reply by echoing
var bot = new botbuilder.UniversalBot(connector, function(session){
    //session.sendTyping();
    /*setTimeout(function () {
        session.send("Hello there...");
    }, 3000);*/
	session.send('Vous avez saisi : %s | [longueur: %s]', session.message.text, session.message.text.length);
    
    //session.send(`you have tapped: ${session.message.text} | [length: ${session.message.text.length}]`);
	//session.send(JSON.stringify(session.dialogData));
	//session.send(JSON.stringify(session.sessionState));
	//session.send(JSON.stringify(session.conversationData));
	//session.send(JSON.stringify(session.message.type));

	//DONE : résoudre l'accumulation de message lors d'un typing
	//DONE : faire un message d'accueil
	//DONE : Message lors Typing
	//DONE : lors d'un join ou départ il faut renvoyer les infos de l'utilisateur ou du bot
});

/*Rédaction en cours*/
bot.on('typing', function(message){
    bot.send(new botbuilder.Message()
                    .address(message.address)
                    .text(`N'écrivez pas non plus tout un pavé ...`));
});

//Liste des utilisateurs
var users = [];

/*MAJ des Users*/
bot.on('conversationUpdate', function(message){
    //Arrivée
    if(message.membersAdded && message.membersAdded.length > 0){
        var membersAdded = message.membersAdded
                                    .map(function(x){
                                        var isSelf = x.id === message.address.bot.id;
                                        return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id = ' + x.id + ')'; 
                                    })
                                    .join(', ');
        users.push(message.membersAdded[0]);
        bot.send(new botbuilder.Message()
                        .address(message.address)
                        .text(`Bienvenue ${membersAdded}`));
        console.log(message.membersAdded);
    }
    
    //Départ
    if(message.membersRemoved && message.membersRemoved.length > 0) {
        var membersRemoved = message.membersRemoved
                                    .map(function (m) {
                                        var isSelf = m.id === message.address.bot.id;
                                        return (isSelf ? message.address.bot.name : m.name) || '' + ' (Id: ' + m.id + ')';
                                    })
                                    .join(', ');
        users.pop(message.membersRemoved[0]);
        bot.send(new botbuilder.Message()
                        .address(message.address)
                        .text(`The following members ${membersRemoved} were removed or left the conversation :(`));
    }

    //Récapitulatif 
    var list = `Sont présents sur ce chat : \n`;

    users.forEach(function (user){       
        list += `* ${user.name} (id : ${user.id}) \n`;
    });
    
    bot.send(new botbuilder.Message()
        .address(message.address)
        .text(list));
});