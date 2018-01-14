var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

var express=require('express');
var nodemailer = require("nodemailer");
var app=express();


//setup the restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8888, function(){
	console.log('%s bot started at %s', server.name, server.url);
});

//create chat connector
var connector = new builder.ChatConnector({
	appId: "***********",
	appPassword: "***********"
});

// listen for user inputs
server.post('/api/messages', connector.listen());

//Initialisation du bot
var bot = new builder.UniversalBot(connector, function(session){
    //Connexion à l'API Web
    var http = require('https');
    var url = 'https://chatbot.gqui.eu';
    http.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var obj = JSON.parse(body);
            session.conversationData.candidat = obj.candidat;
            session.conversationData.Projects = obj.projects;
            session.beginDialog('greetings');
        });
    }).on('error', function(e){
          session.send("Got an error: ", e);
          console.log("Got an error: ", e);
    });
});
 
// LUIS
var luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cd3f7ca0-4476-49a4-9dbb-99ff2d2ceddb?subscription-key=54f43e16c91e4f269766cf9ee8934e6b&verbose=true&timezoneOffset=0";
var luiRecognizer = new builder.LuisRecognizer(luisEndpoint);
bot.recognizer(luiRecognizer);

/* Recherche d'un mot clé avec LUIS */
bot.dialog('projectsSearch', [
    function(session, args, next){
        //Duplication du tableau Projects
        var tableau = session.conversationData.Projects.slice(0);

        var list = [];
        if(typeof args!="undefined" && typeof args.intent!="undefined"){
            var entities = args.intent.entities;
            if(typeof entities!="undefined" && Array.isArray(entities)){
                //Parcours des entités
                entities.forEach(function(entity){
                    //Parcours des projets
                    tableau.forEach(function(project){
                        var index = project.language.indexOf(entity.entity);
                        //On déplace le projet dans un nouveau tableau 
                        if(index !== -1){
                            list.push(tableau[index]);
                            tableau.splice(index,1);
                            return;
                        }
                    });
                });
                session.send(displayProject(list, session));
            }
        }
        else{
            session.send("Si vous évoquez des technologies informatiques que le candidat pourrait connaitre, je vous l'indiquerai immédiatement.")
        }
        session.endDialog();
    }
]).triggerAction({
    matches: ["Resume.GetLanguage"]
}).cancelAction('CancelLuis', 'Recherche abandonnée', {
    matches: /^(cancel|abandonner)/i,
    confirmPrompt: 'Etes-vous sur ?'
});

/* Récupération des projets principaux */
bot.dialog('projectsList', function (session) {
    session.send('Voici les principaux projets développés par le candidat :');   
    session.send(displayProject(session.conversationData.Projects, session));
    session.endDialog();
}).triggerAction({ matches: /^(projects)/i });


/* Affcihage d'une liste de projet sous forme d'Adaptative Card */
function displayProject(list, session){
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);

    var listProjects = [];
    for(var index in list){
        console.log(list[index].image);
        var HeroCard = new builder.HeroCard(session)
                            .title(list[index].titre)
                            //.subtitle(list[index].subtitle)
                            .text(list[index].description)
                            .images([builder.CardImage.create(session, list[index].image)])
                            .buttons([
                                builder.CardAction.openUrl(session, list[index].url, "Accéder au projet")
                            ]);
        listProjects.push(HeroCard);
    }

    if(listProjects.length<=0)
        msg = "Désolé, aucun projet n'a été trouvé.";
    else
        msg.attachments(listProjects);

    return msg;
}

/* MENU */
var menuItems = {
    "Présentation du candidat (texte)": {
        item: "resumeDescription"
    },
    "Ses principaux projets (carroussel)": {
        item: "projectsList"
    },
    "Les langages de programmation acquis (LUIS)": {
        item: "projectsSearch"
    },
    "Carte de visite numérique (AdaptiveCard)": {
        item: "resumeCard"
    },
    "Demander un entretien (Formulaire)": {
        item: "resumeContact"
    },
    "Quitter": {
        item: "resumeExit"
    }
};

//Accueil
bot.dialog('greetings', [
	function (session,args, next){
        session.send("Bienvenue sur le chatbot-CV de "+session.conversationData.candidat.prenom+" "+session.conversationData.candidat.nom+", voici un aperçu de ce que vous pouvez faire : ");
        session.beginDialog("Menu");
    },
	function (session, results){
        session.endDialog();        
	}
]);

/* -----------------DIALOGUES---------------- */

/* Dialogue du menu */
bot.dialog("Menu", [
    function(session){
        builder.Prompts.choice(session, "Que souhaitez-vous faire ? ", menuItems, { listStyle: builder.ListStyle.button });
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    },
    function(session){
        session.replaceDialog("Menu", { reprompt: true });
    }
]).triggerAction({
    matches: /^menu/i,
});

/* Dialogue de la description */
bot.dialog('resumeDescription', [
	function (session, args, next){
		session.send(session.conversationData.candidat.description);
        session.endDialog();
    }
]);

/* Dialogue de la carte de visite électronique */
bot.dialog('resumeCard', [
    function(session, args, next){
        var card = {
            "type": "message",
            "text": "Vous trouverez ci-joint une carte de visite reconstituée : ",
            "attachments": [
              {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                  "type": "AdaptiveCard",
                  "version": "1.0",
                  "body": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": session.conversationData.candidat.metier,
                                    "weight": "bolder",
                                    "size": "large",
                                    "horizontalAlignment": "center"
                                },
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        {
                                            "type": "Column",
                                            "width": "auto",
                                            "items": [
                                                {
                                                    "type": "Image",
                                                    "url": session.conversationData.candidat.picture,
                                                    "size": "medium",
                                                    "style": "person",
                                                    "horizontalAlignment": "center"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": session.conversationData.candidat.nom+" "+session.conversationData.candidat.prenom,
                                                    "weight": "bolder",
                                                    "wrap": true,
                                                    "size": "medium"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": session.conversationData.candidat.description,
                                    "wrap": true
                                },
                                {
                                    "type": "FactSet",
                                    "facts": [
                                        {
                                            "title": "Entreprise actuelle :",
                                            "value": session.conversationData.candidat.entreprise
                                        },
                                        {
                                            "title": "Disponibilité :",
                                            "value": session.conversationData.candidat.disponibilite
                                        },
                                        {
                                            "title": "Localisation :",
                                            "value": session.conversationData.candidat.location
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.OpenUrl",
                            "url": session.conversationData.candidat.cv,
                            "title": "Accéder au CV (URL)"
                        },
                        {
                            "type": "Action.OpenUrl",
                            "url": session.conversationData.candidat.linkedin,
                            "title": "Accéder au Linkedin"
                        },
                    ]
                }
              }
            ]
        };
        session.send(card);
        session.endDialog();
    }
]);


/* Dialogue de l'entretien */
bot.dialog('resumeContact', [
    function (session){
        session.send('Si vous souhaitez contacter le candidat, vous pouvez nous transmettre vos coordonnées.');
        session.beginDialog('askName');
    },
    function (session){
        session.beginDialog('askEmail');
    },
    function (session){
        session.beginDialog('askDate');
    },
    function (session){
        session.beginDialog('askMethod');
    },
    function (session,results){
        session.beginDialog(contactItems[results.response.entity].item);
    },
    function (session){
        session.beginDialog('askConfirm');
    },
    function (session, results){        
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "*********",
                pass: "*********"
            }
        });

        var mailOptions={
            from: 'chatbot-gqui@noreply.com',
            to : 'gui.quirin@hotmail.fr',
            subject : 'Nouvel entretien souhaité',
            html : session.privateConversationData.recap
        };

        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                session.send("error");
            }
            else{
                session.send("Le candidat a correctement été informé de votre message.");
            }
            smtpTransport.close();
        });
        session.endDialog();
    },
]);


bot.dialog('askName', [
    function (session) {
        builder.Prompts.text(session, 'Votre nom/prénom : ');
    },
    function (session, results) {
        session.privateConversationData.nom = results.response;
        session.endDialog();
    }
]);

bot.dialog('askEmail', [
    function (session) {
        builder.Prompts.text(session, 'Votre adresse email : ');
    },
    function (session, results, next) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(results && re.test(results.response)){
            session.privateConversationData.email = results.response;
            session.endDialog();
        }
        else{
            session.send('Adresse email non valide, réessayer.')
            session.replaceDialog('askEmail');
        }
    }
]);

bot.dialog('askDate', [
    function (session) {
        builder.Prompts.time(session, 'Proposez une date d\'entretien : ');
    },
    function (session, results) {
        session.privateConversationData.date = results.response;
        session.endDialog();
    }
]);

bot.dialog('askMethod', [
    function (session) {
        builder.Prompts.choice(session, 'Moyen de contact souhaité pour une réponse', contactItems, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

/* Contact */
var contactItems = {
    "Entretien sur place": {
        item: "askPlace"
    },
    "Entretien télephonique": {
        item: "askPhone"
    },
    "Vidéoconférence sur Skype": {
        item: "askSkype"
    }
};

bot.dialog('askPlace', [
    function (session) {
        builder.Prompts.text(session, 'Adresse de l\'entretien :');
    },
    function (session, results) {
        session.privateConversationData.place = results.response;
        session.endDialog();
    }
]);

bot.dialog('askPhone', [
    function (session) {
        builder.Prompts.text(session, 'Votre numéro de télephone : ');
    },
    function (session, results) {
        if(results && results.response.length<10){
            session.send("Un numéro de telephone doit comporter 10 chiffres.");
            session.replaceDialog('askPhone');
        }
        else{
            session.privateConversationData.phone = results.response;
            session.endDialog();
        }
    }
]);

bot.dialog('askSkype', [
    function (session) {
        builder.Prompts.text(session, 'Votre identifiant Skype : ');
    },
    function (session, results) {
        session.privateConversationData.skype = results.response;
        session.endDialog();
    }
]);


bot.dialog('askConfirm', [
    function (session) {
        var msg = "";
        for(var data in session.privateConversationData){
            msg+=data+": "+session.privateConversationData[data]+"<br>";
        }
        session.send("Récapitulatif :<br>"+msg);
        session.privateConversationData.recap = msg;
        builder.Prompts.choice(session, "Confirmez-vous ces informations ?", "oui|non", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if(results && results.response.entity==1){
            session.replaceDialog('resumeContact');
        }
        else{
            session.endDialog();
        }
    }
]);


/*FIN*/
bot.dialog('resumeExit', [
    function (session){
        session.send("Au revoir");
        session.endConversation();
    }
]).triggerAction({
    matches: /^Quitter/i,
});;

