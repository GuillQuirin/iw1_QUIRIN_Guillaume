var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

//setup the restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8888, function(){
	console.log('%s bot started at %s', server.name, server.url);
});

//create chat connector
var connector = new botbuilder.ChatConnector({
	appId: process.env.APP_ID,
	appPassword: process.env.APP_SECRET
});

// listen for user inputs
server.post('/api/messages', connector.listen());

//Initialisation du bot
var bot = new botbuilder.UniversalBot(connector, function(session){
    session.beginDialog('greetings');
});

// LUIS
var luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cd3f7ca0-4476-49a4-9dbb-99ff2d2ceddb?subscription-key=54f43e16c91e4f269766cf9ee8934e6b&verbose=true&timezoneOffset=1.0";
var luiRecognizer = new botbuilder.LuisRecognizer(luisEndpoint);
bot.recognizer(luiRecognizer);


/* MENU */
var menuItems = {
    "Résumé et souhaits de Guillaume": {
        item: "resumeDesires"
    },
    "Son experience professionnelle": {
        item: "resumeJobs"
    },
    "Les formations suivies": {
        item: "resumeStudies"
    },
    "Contacter Guillaume": {
        item: "resumeContact"
    },
    "Télecharger son CV": {
        item: "resumePDF"
    },
    "Accèder à son profil Linkedin": {
        item: "resumeLinkedin"
    },
    "Quitter": {
        item: "resumeExit"
    }
};

/* ----DIALOGUES---- */

//Accueil
bot.dialog('greetings', [
	function (session,args, next){
        welcome = "Bienvenue sur le chatbot-CV de Guillaume, voici un aperçu de ce que je peux faire : ";
        session.send(welcome);
        next();
    },
    function(session){
        botbuilder.Prompts.choice(session, "Menu principal", menuItems, { listStyle: botbuilder.ListStyle.button });
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    },
    function(session){
        session.replaceDialog("mainMenu", { reprompt: true });
    },
	function (session, results){
		session.endDialog();
	}
]);



bot.dialog('Luis', [
	function(session, args, next){
        var intent = args.intent;
        console.log("---- SORTIE : "+intent.intent+" ----");
        var attribute = "";
        
        switch(intent.intent){
            case 'Weather.GetCondition':
                attribute = 'Weather.Location';
                break;

            case 'Weather.GetForecast':
                attribute = 'Weather.Location';
                break;

            case 'Events.Book':
                attribute = 'Events.Name';
                break;
        }

        if(attribute != ""){
            var infosEntity = botbuilder.EntityRecognizer.findEntity(intent.entities, attribute);
            if(infosEntity!=null)
                session.send('intent : '+intent.intent+' || location : '+infosEntity.entity);
            else
                session.send("Pas d'infos récupérées.");
        }
	}
]).triggerAction({
	matches: ["Weather.GetCondition", "Weather.GetForecast", "Events.Book"]
}).cancelAction('CancelWeather', 'request canceled', {
	matches: /^(cancel|abandonner)/i,
	confirmPrompt: 'Are you sure ?'
});



bot.dialog('greeting',[
	function(session, results){
		session.conversationData.profile.date = results.response;
		session.beginDialog('askNumber');
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

bot.dialog('askNumber', [
	function (session){
		botbuilder.Prompts.number(session, 'How many are you ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);
