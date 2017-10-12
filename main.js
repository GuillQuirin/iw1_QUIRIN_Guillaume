var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

//setup le serveur restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function(){
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
var bot = new botbuilder.UniversalBot(connector);

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: '86e173b8-423c-47c2-b215-fe4ee50491b0', //Cle de notre QnAMaker 
	subscriptionKey: '5ba68673f0334d28bcbccbebfcaa9e61', //Token de notre QnAMaker
});

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers : [recognizer],
	defaultMessage: "Pas de correspondance",
	qnaThreshold: 0.3 //Score minimum autorisé pour accepter cette réponse
});

bot.dialog('/', basicQnAMakerDialog);