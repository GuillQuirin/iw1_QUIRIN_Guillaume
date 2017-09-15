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
	session.send('you have tapped: %s | [length: %s]', session.message.text, session.message.text.length);
    
    //session.send(`you have tapped: ${session.message.text} | [length: ${session.message.text.length}]`);
	//session.send(JSON.stringify(session.dialogData));
	//session.send(JSON.stringify(session.sessionState));
	//session.send(JSON.stringify(session.conversationData));
	//session.send(JSON.stringify(session.message.type));
	

	//Il faut initialiser la conversation pour qu'une écoute soit réalisée
	//TODO : résoudre l'accumulation de message lors d'un typing
	//TODO : faire un message d'accueil
	//TODO : Message lors Typing
	//TODO : lors d'un join ou départ il faut renvoyer les infos de l'utilisateur ou du bot
	bot.on('typing', function(){
		//var message = new botbuilder.Message().address();
		session.send('Tu tapes ?');
	});

	bot.on('conversationUpdate', function(message){
        //Arrivée
		if(message.membersAdded && message.membersAdded.length > 0){
			var membersAdded = message.membersAdded
										.map(function(x){
											var isSelf = x.id === message.address.bot.id;
											return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id = ' + x.id + ')'; 
										})
										.join(', ');
            bot.send(new botbuilder.Message()
                                        .address(message.address)
                                        .text(`Bienvenue ${membersAdded}`));
        }
        
        //Départ
        if(message.membersRemoved && message.membersRemoved.length > 0) {
            var membersRemoved = message.membersRemoved
                                        .map(function (m) {
                                            var isSelf = m.id === message.address.bot.id;
                                            return (isSelf ? message.address.bot.name : m.name) || '' + ' (Id: ' + m.id + ')';
                                        })
                                        .join(', ');

            bot.send(new botbuilder.Message()
                                        .address(message.address)
                                        .text(`The following members ${membersRemoved} were removed or left the conversation :(`));
        }
		console.log(session);
	});
});

