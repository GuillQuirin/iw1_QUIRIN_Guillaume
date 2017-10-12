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
        date: "01/01/1970 00:00:01",
        nom: "defaut",
        statut: 0,
        createur: "defaultCreator"
    },
    "defautAlarm2": {
        date: "01/01/1970 00:00:01",
        nom: "defaut",
        statut: 0,
        createur: "defaultCreator"
    },
    "defautAlarm3": {
        date: "01/01/1970 00:00:01",
        nom: "defaut",
        statut: 1,
        createur: "defaultCreator"
    }
};

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
		session.send('Bonjour %s', session.conversationData.profile.name);
		session.beginDialog('mainMenu');
	},
	function (session, results){

	}
]);

bot.dialog('askName', [
	function (session){
		botbuilder.Prompts.text(session, 'Bonjour, quel est ton nom ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);


bot.dialog("mainMenu", [
    function(session){
        botbuilder.Prompts.choice(session, "Menu principal", menuItems, { listStyle: botbuilder.ListStyle.button });
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    }
]).triggerAction({
    matches: /^menu principal$/i,
    confirmPrompt: "Vous allez retourner au menu, êtes-vous sûr ?"
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

bot.dialog('dialogCreate', [
	function (session){
        session.send("-----CREATION-----");
		botbuilder.Prompts.text(session, "Nom de l'alarme ?");
	},
	function (session, results){
        session.conversationData.newalarm.nom = session.results;
        botbuilder.Prompts.choice(session, "Activer l'alarme ?", "oui|non", { listStyle: botbuilder.ListStyle.button });
    },
    function (session, results){
        session.conversationData.newalarm.statut = session.results;
        botbuilder.Prompts.text(session, "Nom du créateur de l'alarme ?");
    },
    function (session, results){
        //session.conversationData.newalarm.createur = session.results;
        //botbuilder.Prompts.choice(session, "Activer l'alarme ?", "oui|non", { listStyle: botbuilder.ListStyle.button });
        session.conversationData.list.count = Object.keys(alarms).length+1;
        alarm['alarm'+session.conversationData.newalarm.count] = session.conversationData.newalarm;
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
                msg += "Statut : "+alarms[alarm].statut+"'<br>";
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
            msg += "Statut : "+alarms[alarm].statut+"'<br>";
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