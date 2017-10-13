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

var menuItems = {
    "Créer une alarme": {
        item: "dialogCreate"
    },
    "Alarmes actives": {
        item: "dialogSee"
    },
    "Toutes les alarmes": {
        item: "dialogAll"
    },
    "Quitter": {
        item: "dialogExit"
    }
};

var alarms = {
    "defautAlarm": {
        date: "02/02/1980 00:00:01",
        nom: "alarme test 1",
        statut: 0,
        createur: "defaultCreator"
    },
    "defautAlarm2": {
        date: "01/01/1970 00:00:01",
        nom: "alarme test 2",
        statut: 0,
        createur: "defaultCreator1"
    },
    "defautAlarm3": {
        date: "03/03/2000 00:00:01",
        nom: "alarme test 3",
        statut: 1,
        createur: "defaultCreator2"
    }
};

bot.dialog('greetings',[
	function (session, args, next){
        session.conversationData.profile = args || {};
        session.conversationData.newalarm = {};
		if(!session.conversationData.profile.name)
            botbuilder.Prompts.text(session, 'Bonjour, quel est ton nom ?');
		else
			next();
	},
	function (session,results){
		session.conversationData.profile.name = results.response;
		session.send('Bonjour %s', session.conversationData.profile.name);
		session.beginDialog('mainMenu');
	},
	function (session, results){
        session.send("Vous pouvez : retourner au menu principal");
	}
]).triggerAction({
    matches: /^menu principal$/i,
}).reloadAction(
    "restart", "Ok recommençons",
    {
        matches: /^recommencer$/i,
        confirmPrompt: "Souhaitez-vous recommencer ?"
    }
).cancelAction(
    "annuler","Tapez 'Menu Principal' pour continuer",
    {
        matches: /^annuler$/i,
        confirmPrompt: "La demande sera annulée, en êtes-vous sûr ?"
    }
);


bot.dialog("mainMenu", [
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
    }
]);

bot.dialog('dialogCreate', [
	function (session){
        session.send("-----CREATION-----");
		botbuilder.Prompts.text(session, "Nom de l'alarme ?");
	},
	function (session, results){
        session.conversationData.newalarm.nom = results.response;
        botbuilder.Prompts.choice(session, "Activer l'alarme ?", "oui|non", { listStyle: botbuilder.ListStyle.button });
    },
    function (session, results){
        session.conversationData.newalarm.statut = session.results;
        botbuilder.Prompts.time(session, "Quand souhaitez-vous activer l'alarme ?");
    },
    function (session, results){
        session.conversationData.newalarm.date = botbuilder.EntityRecognizer.resolveTime([results.response]);
        session.conversationData.newalarm.createur = session.conversationData.profile.name;

        var size = Object.keys(alarms).length+1;
        alarms['alarm'+size] = {};
        alarms['alarm'+size].nom = session.conversationData.newalarm.nom;
        alarms['alarm'+size].statut = session.conversationData.statut;
        alarms['alarm'+size].createur = session.conversationData.newalarm.createur;
        alarms['alarm'+size].date = session.conversationData.newalarm.date;
        
        session.send("Nombre d'alarmes créées : "+size);
        session.endDialog();
    }
]);

bot.dialog('dialogSee', [
    function (session){
        var msg = "";
        for(var alarm in alarms){
            if(alarms[alarm].statut){
                msg =  "Alarme '"+alarm+"'<br>";
                msg += "Nom : '"+alarms[alarm].nom+"'<br>";
                msg += "Statut : ";
                msg += (alarms[alarm].statut) ? "active<br>" : "inactive<br>";
                msg += "Createur : "+alarms[alarm].createur+"<br>";
                msg += "Date : "+alarms[alarm].date;
                session.send(msg);
            }
        }
	},
	function (session, results){
		session.endDialog();
	}
]);


bot.dialog('dialogAll', [
    function (session){
        var msg = "";
        for(var alarm in alarms){
            msg =  "Alarme '"+alarm+"'<br>";
            msg += "Nom : '"+alarms[alarm].nom+"'<br>";
            msg += "Statut : ";
            msg += (alarms[alarm].statut) ? "active<br>" : "inactive<br>";
            msg += "Createur : "+alarms[alarm].createur+"<br>";
            msg += "Date : "+alarms[alarm].date;
            session.send(msg);
        }
	},
	function (session, results){
		session.endDialog();
	}
]);


bot.dialog('dialogExit', [
    function(session){
        session.endConversation("Au revoir");
    }
]);