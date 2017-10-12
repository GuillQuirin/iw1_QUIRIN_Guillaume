var botbuilder = require('botbuilder');

const library = new botbuilder.Library('reservation');

library.dialog('hotel', [
	//Nom
	function (session, args, next){
		session.send('Début du chat');
		session.conversationData.profile = args || {};
		if(!session.conversationData.profile.name)
			session.beginDialog('askName');
		else
			next();
	},
	function (session,results){
		session.conversationData.profile.name = results.response;
		session.send('Hello %s', session.conversationData.profile.name);
		session.beginDialog('askEmail');
	},
	function(session, results){
		session.conversationData.profile.email = results.response;
		session.beginDialog('askAge');
	},
	function (session, results){
		session.conversationData.profile.age = results.response;
		session.beginDialog('askDestination');
	},
	function (session, results){
		session.conversationData.profile.destination = results.response;
		session.beginDialog('askDate');
	},
	function (session, results){
		session.conversationData.profile.date = botbuilder.EntityRecognizer.resolveTime([results.response]);
		session.beginDialog('askNights');
	},
	function (session, results){
		session.conversationData.profile.nights = results.response;
		session.beginDialog('stop');
	}
]);

library.dialog('askName', [
	function (session){
		botbuilder.Prompts.text(session, 'Hi What is your name ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('askEmail', [
	function (session){
		botbuilder.Prompts.text(session, 'What is your email @ ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('askAge', [
	function (session){
		botbuilder.Prompts.text(session, 'How old are you ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('askDestination', [
	function (session){
		botbuilder.Prompts.text(session, 'Where do you want to sleep ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('askDate', [
	function (session){
		botbuilder.Prompts.time(session, 'When do you come ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('askNights', [
	function (session){
		botbuilder.Prompts.number(session, 'How many nights ?');
	},
	function (session, results){
		session.endDialogWithResult(results);
	}
]);

library.dialog('stop', [
	function (session){	
		var msg = "Merci ";
			msg += "<br>Nom : "+session.conversationData.profile.name;
			msg +="<br>Email :"+session.conversationData.profile.email;
			msg +="<br>Age : "+session.conversationData.profile.age;
			msg +="<br>Destination : "+session.conversationData.profile.destination;
			msg +="<br>Date : "+session.conversationData.profile.date;
			msg +="<br>Nombre de nuits : "+session.conversationData.profile.nights;
		session.endConversation(msg);
	}
]);


module.exports = library;