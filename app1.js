var restify = require('restify');
var botbuilder = require('botbuilder');

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
var bot = new botbuilder.UniversalBot(connector, function(session){
	session.beginDialog('greetings');
});

bot.dialog('greetings',[
	function (session, args, next){
		session.conversationData.profile = args || {};
		if(!session.conversationData.profile.name)
			session.beginDialog('askName');
		else
			next();
	},
	function (session,results){
		session.conversationData.profile.name = results.response;
		session.send('Hello %s', session.conversationData.profile.name);
		session.beginDialog('askDate');
	},
	function(session, results){
		session.conversationData.profile.date = results.response;
		session.beginDialog('askNumber');
	},
	function (session, results){
		session.conversationData.profile.number = results.response;
		session.beginDialog('askLeader');
	},
	function (session, results){
		if(results.response){
			session.conversationData.profile.leader = results.response;
			var msg = "Merci Nom: "+session.conversationData.profile.name;
			session.endConversation(msg);
		}
	}
]).endConversationAction(
	"endOrderDinner", "Ok.",
	{
		matches: /^cancel$|^goodbye$/i,
		confirmPrompt: "This will cancel, are you sure ?"	
	}
);

bot.dialog('askName', [
	function (session){
		botbuilder.Prompts.text(session, 'Hi What is your name ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

bot.dialog('askDate', [
	function (session){
		botbuilder.Prompts.time(session, 'When do you eat ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

bot.dialog('askNumber', [
	function (session){
		botbuilder.Prompts.number(session, 'How many are you ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

bot.dialog('askLeader', [
	function (session){
		botbuilder.Prompts.text(session, 'Who is the leader ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);
