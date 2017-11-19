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
var luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cd3f7ca0-4476-49a4-9dbb-99ff2d2ceddb?subscription-key=54f43e16c91e4f269766cf9ee8934e6b&verbose=true&timezoneOffset=0";
var luiRecognizer = new botbuilder.LuisRecognizer(luisEndpoint);
bot.recognizer(luiRecognizer);


/* MENU */
var menuItems = {
    "Résumé de Guillaume (texte)": {
        item: "resumeDescription"
    },
    "Ses différents projets (carroussel)": {
        item: "listProjects"
    },
    "Les langages de programmation acquis (LUIS)": {
        item: "resumeLanguage"
    },
    "Carte de visite numérique (AdaptiveCard)": {
        item: "resumeCard"
    },
    "Quitter": {
        item: "resumeExit"
    }
};

//Accueil
bot.dialog('greetings', [
	function (session,args, next){
        welcome = "Bienvenue sur le chatbot-CV de Guillaume, voici un aperçu de ce que je peux faire : ";
        session.send(welcome);
        //botbuilder.Prompts.attachment(session, "Upload a picture for me to transform.");
        session.beginDialog("Menu");
    },
	function (session, results){
        session.endDialog();        
	}
]);

/* ----DIALOGUES---- */

/* Dialogue du menu */
bot.dialog("Menu", [
    function(session){
        botbuilder.Prompts.choice(session, "Menu principal", menuItems, { listStyle: botbuilder.ListStyle.button });
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    },
    function(session){
        session.endDialog();
        //session.replaceDialog("Menu", { reprompt: true });
    }
]).triggerAction({
    matches: /^menu principal$/i,
});

/* Dialogue de la description */
bot.dialog('resumeDescription', [
	function (session, args, next){
		botbuilder.Prompts.number(session, 'How many are you ?');
    },
	function (session, results){
        botbuilder.Prompts.text(session, "Que souhaitez-vous faire ensuite ?");
		session.endDialogWithResult(results);
	}
]);

/* Dialogue de la carte de visite électronique */
bot.dialog('resumeCard', [
    function(session, args, next){
        var msg = session.message;
        if (msg && msg.value){ //Gestion du message envoyé
            console.log(msg);
            session.send("Message envoyé");

            // process your card's submit action
            if (msg.attachments && msg.attachments.length > 0) {
                // Echo back attachment
                var attachment = msg.attachments[0];
                session.send({
                    text: "You sent:",
                    attachments: [
                        {
                            contentType: attachment.contentType,
                            contentUrl: attachment.contentUrl,
                            name: attachment.name
                        }
                    ]
                });
            } 
            else {
                // Echo back users text
                session.send("You said: %s", msg.value.comment);
                session.send("Que souhaitez-vous faire ensuite ?");
                session.endDialog();
            }
        }
        else{ //Affichage de la carte de visite
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
                                        "text": "Développeur web full-stack",
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
                                                        "url": "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAYlAAAAJDc3MTZhYTU1LTI0ZTUtNDViNy1hYWFiLTFhODQwZmFmYzhlZQ.jpg",
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
                                                        "text": "Guillaume QUIRIN",
                                                        "weight": "bolder",
                                                        "wrap": true,
                                                        "size": "medium"
                                                    },
                                                    {
                                                        "type": "TextBlock",
                                                        "spacing": "none",
                                                        "text": "*Created {{DATE(2017-02-14T06:08:39Z,Short)}}*",
                                                        "isSubtle": true,
                                                        "wrap": true
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
                                        "text": "Guillaume QUIRIN est un étudiant en informatique à l'ESGI spécialisé dans le développement d'applications Web.",
                                        "wrap": true
                                    },
                                    {
                                        "type": "FactSet",
                                        "facts": [
                                            {
                                                "title": "Entreprise actuelle :",
                                                "value": "Régie Immobilière de la Ville de Paris (RIVP)"
                                            },
                                            {
                                                "title": "Disponibilité :",
                                                "value": "Septembre 2018"
                                            },
                                            {
                                                "title": "Localisation :",
                                                "value": "Paris"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "actions": [
                            /*{
                                "type": "Action.ShowCard",
                                "title": "Envoyer un message",
                                "card": {
                                    "type": "AdaptiveCard",
                                    "body": [
                                        {
                                            "type": "Input.Text",
                                            "id": "comment",
                                            "isMultiline": true,
                                            "placeholder": "Rédiger ici votre texte"
                                        }
                                    ],
                                    "actions": [
                                        {
                                            "type": "Action.Submit",
                                            "title": "OK"
                                        }
                                    ]
                                }
                            },*/
                            {
                                "type": "Action.OpenUrl",
                                "url": "https://www.gqui.eu/wp-content/uploads/2017/11/QUIRIN.pdf",
                                "title": "Accéder au CV (URL)"
                            },
                            {
                                "type": "Action.OpenUrl",
                                "url": "https://www.linkedin.com/in/gqui-fr/",
                                "title": "Accéder au Linkedin"
                            }
                        ]
                    }
                  }
                ]
            };
            session.send(card);
        }
    }
]);

/* Dialogue de LUIS */
bot.dialog('resumeLanguage', [
	function(session, args, next){
        session.send("Vous pouvez me demander quel langage Guillaume a-t-il appris :");
        session.endDialog();
    }
]);

/* Interface LUIS */
bot.dialog('Luis', [
	function(session, args, next){
        var intent = args.intent;
        console.log("---- SORTIE : "+intent.intent+" ----");
        var attribute = "";
        
        switch(intent.intent){
            case 'Resume.GetLanguage':
                attribute = 'Resume.Language';
                break;

            case 'None':
            default:
                attribute = '';
                break;
        }

        if(attribute != ""){
            var infosEntity = botbuilder.EntityRecognizer.findEntity(intent.entities, attribute);
            if(infosEntity!=null && infosEntity.entity != "Resume.GetLanguage"){
                session.conversationData.filter = infosEntity.entity;
                session.beginDialog("listProjects");
            }
            else
                session.send("Pas d'infos récupérées.");
        }
        else
            session.send("Entité non reconnue");
        next();
    },
    function(session){
        botbuilder.Prompts.text(session, "Que souhaitez-vous faire ensuite ?");
	},
    function(session, results){
        session.conversationData.decision = results.response;
        session.endDialog();
    }
]).triggerAction({
	matches: [/*"Weather.GetCondition", "Weather.GetForecast",*/ "Resume.GetLanguage"]
}).cancelAction('CancelLuis', 'request canceled', {
	matches: /^(cancel|abandonner)/i,
	confirmPrompt: 'Are you sure ?'
});

var Projects = {
    1:{
        "language": ["php","laravel","mvc"],
        "title": "Club littéraire numérique",
        "first": 1,
        "subtitle": "Projet Laravel de 4eme année",
        "text": "Réalisation d'un salon virtuel permettant aux utilisateurs de débattre d'une oeuvre",
        "image": "https://www.gqui.eu/wp-content/uploads/2017/08/screencapture-club-des-critiques.png",
        "url": "http://club-des-critiques.gqui.eu"
    },
    3:{
        "language": ["java"],
        "title": "Raccourcisseur d'URL",
        "first": 0,
        "subtitle": "Projet Java / JEE de 4eme année",
        "text": "Réalisation d'une application JEE sous Tomcat générant des URL raccourcies",
        "image": "http://petersapparel.parseapp.com/img/whiteshirt.png",
        "url": "http://club-des-critiques.gqui.eu"
    },
};

// Add dialog to return list of shirts available
bot.dialog('listProjects', function (session) {
    var filter = (session.conversationData.filter != null) ? "en "+session.conversationData.filter : "";
    session.send('Voici les projets développés par Guillaume '+filter+' :');

    var msg = new botbuilder.Message(session);
    msg.attachmentLayout(botbuilder.AttachmentLayout.carousel);

    var listProjects = [];
    for(var projet in Projects){
        var insert = false;

        if(session.conversationData.filter != null && Projects[projet].language.indexOf(session.conversationData.filter) != -1)
            insert = true;
        else if(session.conversationData.filter == null)
            insert = true;

        if(insert){
            var HeroCard = new botbuilder.HeroCard(session)
                                .title(Projects[projet].title)
                                .subtitle(Projects[projet].subtitle)
                                .text(Projects[projet].text)
                                .images([botbuilder.CardImage.create(session, Projects[projet].image)])
                                .buttons([
                                    botbuilder.CardAction.openUrl(session, Projects[projet].url, "Consulter le projet")
                                ]);
            listProjects.push(HeroCard);
        }
    }
    console.log("----Longueur liste langages----"+listProjects.length);

    //Réinitialisation du filtre de recherche
    session.conversationData.filter = null;
    if(listProjects.length<=0)
        msg = "Aucun projet n'a été trouvé.";
    else
        msg.attachments(listProjects);
    
    session.send(msg);
    session.endDialog();
}).triggerAction({ matches: /^(projects)/i });