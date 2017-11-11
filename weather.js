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

//Listen for messages from users
server.post('/api/messages', connector.listen());

//Recevive messages from the user and respond bu echoing each message back (prefixed withou 'You said:')
var bot = new botbuilder.UniversalBot(connector, function(session){
    session.send("Pending waterfall...");
});

//Integrer Luis
var luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e888404d-8229-4890-a64c-8d86be821b72?subscription-key=54f43e16c91e4f269766cf9ee8934e6b&verbose=true&timezoneOffset=0";
var luiRecognizer = new botbuilder.LuisRecognizer(luisEndpoint);
bot.recognizer(luiRecognizer);

bot.dialog('Weather', [
	function(session, args, next){
		var intent = args.intent;
		console.log("SORTIE : "+intent.intent);
		if(intent.intent === 'Weather.GetCondition'){
			var location = botbuilder.EntityRecognizer.findEntity(intent.entities, 'Weather.Location');
			session.send('intent : '+intent.intent+' || location : '+location.entity);
		}
	}
]).triggerAction({
	matches: ["Weather.GetCondition", "Weather.GetForecast"]
}).cancelAction('CancelWeather', 'request canceled', {
	matches: /^(cancel|abandonner)/i,
	confirmPrompt: 'Are you sure ?'
});