import {
    create,
    createChamp,
    createChampCheckbox,
    createChampRadio,
    toggleError,
    toggleAlert
} from "../utils/domManipulation";
import {
    valueFirstElementChecked,
    idOfAllElementChecked,
    fetchUrlRedirectAndAlert,
    createCheckBoxOfElements,
    addslashes
} from "../utils/formGestion";
import { redirect, redirectWithAlert } from "../utils/redirection";

import axios from 'axios';
import {formatedHour} from "../utils/dates.js";


// select the types of participants and return those who are checked in a string : 1,2,...
const participantsTimeslot = () => idOfAllElementChecked("input[name='selectionParticipant']")

// select the types of participants and return those who are checked in a string : 1,2,...
const selectedDrivers = () => idOfAllElementChecked("input[name='selectionConducteurs']")

// select the types of buses and return those who are checked in a string : 1,2,...
const busesTimeslot = () => idOfAllElementChecked("input[name='selectionBus']")

// select the types of timeslots and return the one who is checked in a string
const typeTimeslot = () => valueFirstElementChecked("input[name='selectionType']")

// select the direction of the line and return the one who is checked in a string
const lineDirectionTimeslot = () => valueFirstElementChecked("input[name='selectionDirection']")
    
// select the line of the timeslot and return the one who is checked in a string
const lineTimeslot = () => valueFirstElementChecked("input[name='selectionLigne']")

// renvoie un objet contenant les résultats des champs du formulaire d'ajout de créneau
const getData = () => {
    return {
        users : participantsTimeslot(),
        drivers : selectedDrivers(),
        buses : busesTimeslot(),
        line : lineTimeslot(),
        direction : lineDirectionTimeslot()
    }
}

// Creation of the checkbox to define the bus involved in the timeslot
// @param choiceDiv la div dans lequel mettre ça 
function toogleBusChoices(choicesDiv){
    // On recupere la div divCheckboxBus si elle n'existe pas on la crée
    var divCheckboxBus = document.querySelector("#divCheckboxBus");
    if (!divCheckboxBus) {
        divCheckboxBus = create("div", choicesDiv);
        divCheckboxBus.setAttribute("id", "divCheckboxBus");
    } else {
        divCheckboxBus.replaceChildren("");
    }

    // On met le titre
    create("label", divCheckboxBus, "Choisissez les bus participants :");
    
    // On cree chaque champs 
    axios.get(`buses/buses.php?function=buses`).then(response => {
        for(var bus of response.data){
            createChampCheckbox(divCheckboxBus, `b${bus.id}` , "selectionBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id);
            label.setAttribute("for", `b${bus.id}`);
        }
    });

    // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
    var boutonBus = create("button", divCheckboxBus, "Afficher seulement les bus disponibles");
    boutonBus.title = "Afficher seulement les bus disponibles"
    boutonBus.addEventListener("click", function (event){
        event.preventDefault();
        toogleFreeBusChoices(choicesDiv);
    });
}


// Creation of the checkbox to define the buses involved in the timeslot
// BUT with only the one that are free on the periode
// @param choiceDiv la div dans lequel mettre ça 
function toogleFreeBusChoices(choicesDiv){

    // On recupere la div de choix de bus
    var divCheckboxBus = document.querySelector("#divCheckboxBus");

    // On supprime ce qu'il y avait dans la div de choix d'utilisateur

    if (!divCheckboxBus) {
        divCheckboxBus = create("div", choicesDiv);
        divCheckboxBus.setAttribute("id", "divCheckboxBus");
    } else {
        divCheckboxBus.replaceChildren("");
    }

    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des bus libres 
    create("label", divCheckboxBus, "Choisissez les bus parmis ceux disponibles :")

    let axiosUrl = `buses/buses.php?function=freeBuses&beginning=${StartDateTime}&end=${EndDateTime}`
    createCheckBoxOfElements(axiosUrl, "buses/buses.php?function=bus&id=", divCheckboxBus, "selectionBus", (elt => elt.id), "b")
    
    // On cree le bouton permettant d'afficher tous les utilisateurs
    var bouton = create("button", divCheckboxBus, "Afficher tous les bus");
    bouton.title = "Afficher tous les bus"
    bouton.addEventListener("click", function (event){
        event.preventDefault();
        toogleBusChoices(choicesDiv);
    });
}

// Creation of the checkbox to define the users involved in the timeslot
// @param choiceDiv la div dans lequel mettre ça 
function toogleUserChoices(choicesDiv){
    // On recupere la div divCheckboxUsers si elle n'existe pas on la crée
    var divCheckboxUsers = document.querySelector("#divCheckboxUsers");
    if (!divCheckboxUsers) {
        divCheckboxUsers = create("div", choicesDiv);
        divCheckboxUsers.setAttribute("id", "divCheckboxUsers");
    }else {
        divCheckboxUsers.replaceChildren("");
    }
    
    // On met le titre 
    create("label", divCheckboxUsers, "Choisissez les participants :");

    // On cree chaque champs 
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            if (user.id_user_type !== "4") {
                createChampCheckbox(divCheckboxUsers, `u${user.id}`, "selectionParticipant", user.id);
                var label = create("label", divCheckboxUsers, user.name + " " + user.firstname);
                label.setAttribute("for", `u${user.id}`);
            }
        }
    });

    // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
    var boutonUser = create("button", divCheckboxUsers, "Afficher seulement les utilisateur disponibles");
    boutonUser.title = "Afficher seulement les utilisateur disponibles"
    boutonUser.addEventListener("click", function (event){
        event.preventDefault();
        toogleFreeUserChoices(choicesDiv);
    });
}

// Creation of the checkbox to define the users involved in the timeslot
// BUT with only the one that are free on the periode
// @param choiceDiv la div dans lequel mettre ça 
function toogleFreeUserChoices(choicesDiv){
    // On recupere la div de choix d'utilisateur
    var divCheckboxUsers = document.querySelector("#divCheckboxUsers");
    
    // On supprime ce qu'il y avait dans la div de choix d'utilisateur
    if (!divCheckboxUsers) {
        divCheckboxUsers = create("div", choicesDiv);
        divCheckboxUsers.setAttribute("id", "divCheckboxUsers");
    }else {
        divCheckboxUsers.replaceChildren("");
    }
    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des utilisateurs libres 
    create("label", divCheckboxUsers, "Choisissez les participants parmis ceux disponibles :");

    let axiosUrl = `users/users.php?function=freeUsers&beginning=${StartDateTime}&end=${EndDateTime}`

    createCheckBoxOfElements(axiosUrl, "users/users.php?function=user&id=", divCheckboxUsers, "selectionParticipant", (elt => `${elt.name} ${elt.firstname}`), "pd")
    
    // On cree le bouton permettant d'afficher tous les utilisateurs
    var bouton = create("button", divCheckboxUsers, "Afficher tous les utilisateurs");
    bouton.title = "Afficher tous les utilisateurs"
    bouton.addEventListener("click", function (event){
        event.preventDefault();
        toogleUserChoices(choicesDiv);
    });

}

//Creation of the checkbox to define drivers involved in the time slot
 // @param choiceDiv la div dans lequel mettre ça 

function toogleDriversChoices(choicesDiv){
    // On recupere la div divCheckboxDrivers si elle n'existe pas on la crée
    var divCheckboxDrivers = document.querySelector("#divCheckboxDrivers");
    if (!divCheckboxDrivers) {
        divCheckboxDrivers = create("div", choicesDiv);
        divCheckboxDrivers.setAttribute("id", "divCheckboxDrivers");
    }else {
        divCheckboxDrivers.replaceChildren("");
    }
   
    // On met le titre 
    create("label", divCheckboxDrivers, "Choisissez le(s) conducteur(s) :");

    // On cree chaque champs 
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            if (user.id_user_type == 3) {
                createChampCheckbox(divCheckboxDrivers, `u${user.id}` , "selectionConducteurs", user.id);
                var label = create("label", divCheckboxDrivers, user.name + " "+ user.firstname);
                label.setAttribute("for", `u${user.id}`);
            }
        }
    });

    // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
    var boutonUser = create("button", divCheckboxDrivers, "Afficher seulement les conducteurs disponibles");
    boutonUser.title = "Afficher seulement les conducteurs disponibles"
    boutonUser.addEventListener("click", function (event){
        event.preventDefault();
        toogleFreeDriverChoices(choicesDiv);
    });
}


// Creation of the checkbox to define the drivers involved in the timeslot
// BUT with only the one that are free on the periode
// @param choiceDiv la div dans lequel mettre ça 
function toogleFreeDriverChoices(choicesDiv){

    // On recupere la div de choix d'utilisateur
    var divCheckboxDrivers = document.querySelector("#divCheckboxDrivers");
    // On supprime ce qu'il y avait dans la div de choix d'utilisateur
    if (!divCheckboxDrivers) {
        divCheckboxDrivers = create("div", choicesDiv);
        divCheckboxDrivers.setAttribute("id", "divCheckboxDrivers");
    }else {
        divCheckboxDrivers.replaceChildren("");
    }
    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des conducteurs libres 
    create("label", divCheckboxDrivers, "Choisissez les conducteurs parmis ceux disponibles :");

    let axiosUrl = `users/users.php?function=freeDrivers&beginning=${StartDateTime}&end=${EndDateTime}`
    createCheckBoxOfElements(axiosUrl, "users/users.php?function=user&id=", divCheckboxDrivers, "selectionConducteurs", (elt => `${elt.name} ${elt.firstname}`), "cd")
    
    // On cree le bouton permettant d'afficher tous les conducteurs
    var bouton = create("button", divCheckboxDrivers, "Afficher tous les conducteurs");
    bouton.title = "Afficher tous les conducteurs"
    bouton.addEventListener("click", function (event){
        event.preventDefault();
        toogleDriversChoices(choicesDiv);
    });

}

// Creation of the radio to define the direction
// @param choiceDiv la div dans lequel mettre ça 
function toogleDirectionChoices(choicesDiv){
    var divRadioDirection = create("div", choicesDiv);
    create("label", divRadioDirection, "Choisissez la direction  :");
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");
    var label = create("label", divRadioDirection, "aller");
    label.setAttribute("for", "aller");
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
    var label = create("label", divRadioDirection, "retour");
    label.setAttribute("for", "retour");    
}

// Creation of the radio to define the line
// @param choiceDiv la div dans lequel mettre ça 
function toogleLineChoices(choicesDiv){
    var divRadioLigne = create("div", choicesDiv);
    create("label", divRadioLigne, "Choisissez une ligne :");
    axios.get(`lines/lines.php?function=lines`).then((response)=>{
    for(var line of response.data){
         createChampRadio(divRadioLigne, `l${line.number}` , "selectionLigne", line.number);
        var label = create("label", divRadioLigne, "Ligne " + line.number);
        label.setAttribute("for", `l${line.number}`);
        }
    });
}

//------------------------------------------------------- */
//   Gestion URL
//------------------------------------------------------- */


// fonction qui renvoie l'url axios en fonction du type de creneau selectionné
function axiosUrlSendWhenADD(type){

    // selection of the start and end time
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
    // creation of the variables
    let users, drivers, buses,  line, direction
    ({users, drivers, buses,  line, direction} = getData())

    // creation of the default url
    let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}`;
    // bool used to display alert
    let requestSuccess = false

    // depends on the type of the timeslot
    switch (type) {
        case "1" :  // CONDUITE
            if (![drivers, buses, line, direction].includes("")){
                url += `&users=${drivers}&buses=${buses}&lines=${line}&directions=${direction}`;
                requestSuccess = true
            }
            break;
        case "2" :  // REUNION
            if (users != ""){
                url += `&users=${users}`;
                requestSuccess = true
            }
            break;
        case "3" :  // INDISPONIBILITE
            if (drivers != "") {
                url += `&users=${drivers}`;
                requestSuccess = true
            }
            break;
        case "5" :  // astreinte
            if (drivers != "") {
                url += `&users=${drivers}`;
                requestSuccess = true
            }
            if (buses != "") {
                url += `&buses=${buses}`;
                requestSuccess = true
            }
            break;
        case "6" :  // reservation
            if (drivers != "") {
                url += `&users=${drivers}`;
                requestSuccess = true
            }
            if (buses != "") {
                url += `&buses=${buses}`;
                requestSuccess = true
            }
            break;
        default :   // ERREUR
            url = ``;
            break;
    }
    requestSuccess ? toggleAlert("REUSSITE", "Le créneau à bien été ajouté !") : toggleError("ATTENTION", "Formulaire invalide !")
    return url;
}

const sendNotifReunionOblige = async (idUser, startDateTime, endDateTime) => {
    let user = await axios.get(`users/users.php?function=user&id=` + idUser)
    user = user.data

    let heure_debut = formatedHour(new Date(startDateTime).getHours())
    let min_debut = formatedHour(new Date(startDateTime).getMinutes())
    let heure_fin = formatedHour(new Date(endDateTime).getHours())
    let min_fin = formatedHour(new Date(endDateTime).getMinutes())

    let debut_jour = formatedHour(new Date(startDateTime).getDate())
    let debut_annee = formatedHour(new Date(startDateTime).getFullYear())
    let debut_mois = formatedHour(new Date(startDateTime).getMonth())
    let fin_jour = formatedHour(new Date(endDateTime).getDate())
    let fin_annee = formatedHour(new Date(endDateTime).getFullYear())
    let fin_mois = formatedHour(new Date(endDateTime).getMonth())

    let debut = heure_debut+":"+min_debut
    let fin = heure_fin+":"+min_fin
    let debutDate = debut_jour+"/"+debut_mois+"/"+debut_annee
    let finDate = fin_jour+"/"+fin_mois+"/"+fin_annee

    const titre = "Convocation obligatoire à la réunion"
    let message = "Bonjour " + user.firstname +", <br><br>"
    message += "Nous espérons que vous allez bien. Nous vous rappelons que vous êtes <strong>obligé(e)</strong> de participer à la réunion qui aura lieu le <strong>"
    message += debutDate + "</strong> à <strong>" + debut + "</strong> et qui finira à <strong>" + finDate + "</strong> à <strong>" + fin + "</strong>"
    message += " dans notre salle de conférence principale. <br><br>"
    message += "Il est <strong>important</strong> que vous assistiez à cette réunion car nous discuterons de sujets importants concernant notre entreprise. Nous avons également des informations importantes à vous communiquer. <br><br>"
    message += "Nous vous prions de prendre les dispositions nécessaires pour être présent(e) à cette réunion et pour y contribuer de manière active. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. <br><br>"
    message += "Nous comptons sur votre présence et votre contribution pour faire avancer notre entreprise. Merci pour votre collaboration et à bientôt à la réunion. <br><br>"
    message += "Cordialement, <br>L'équipe GoBus."
    axios.get(`notifications/notifications.php?function=create&title=${addslashes(titre)}&message=${addslashes(message)}&recipient=` + idUser)

}

const selectUserOblige = (form) => {
    document.querySelector(".submitButton").remove()

    let startDateTime = document.querySelector("input[name='StartDateTime']").value;
    let endDateTime = document.querySelector("input[name='EndDateTime']").value;

    let tab = []
    for (var participant of document.querySelectorAll("input[name='selectionParticipant']")){
        if (participant.checked) {
            tab.push(participant.value)
        }
    }

    // On met le titre
    create("label", form, "Entrez les participants qui ont l'obligation de venir à la réunion :", ["label-info"]);

    // On recupere la div de choix d'utilisateur
    let divCheckboxUsers = create("div", form);
    divCheckboxUsers.setAttribute("id", "divCheckboxUsers");

    // On cree chaque champs
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            if (tab.includes(user.id)) {
                createChampCheckbox(divCheckboxUsers, `us${user.id}`, "selectionParticipantOblige", user.id);
                var label = create("label", divCheckboxUsers, user.name + " " + user.firstname);
                label.setAttribute("for", `us${user.id}`);
            }
        }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function (){

        for(let elem of document.querySelectorAll("input[name='selectionParticipantOblige']")){
            if (elem.checked) {
                let idUser = elem.value
                sendNotifReunionOblige (idUser, startDateTime, endDateTime)
            }
        }

        let url = axiosUrlSendWhenADD(typeTimeslot())
        fetchUrlRedirectAndAlert(url, "/espace-admin", "Le créneau a bien été ajouté", "Le créneau n'a pas pu être ajouté")
    })
}

const toggleAddCreneau = () => {
    const main = document.querySelector("#app");
    main.replaceChildren("");
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajout de crénaux", ["colocation"]);
    create("p", main, " Rentrez les informations suivantes : ", ["presentation"]);

    // Creation of the form
    const form = create("div", main, null, ["app-form"]);

    // Creation of each champ
    create("label", form, "Entrez la date de début du créneau :", ["label-info"]);
    createChamp(form, "datetime-local", "StartDateTime");
    create("br", form);
    create("label", form, "Entrez la date de fin du creneau :", ["label-info"]);
    createChamp(form, "datetime-local", "EndDateTime");
    create("br", form);

    // Creation of the radio to define the type of the timeslot
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type du créneau :", ["label-info"]);
    axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
        for(var type of response.data){

        /*--------------
         Au clic du choix de type de créneau on affiche les autres infos à choisir 
         ---------------*/

            createChampRadio(divRadio, type.name , "selectionType", type.id).addEventListener('click', function(){

                // Recuperation du type du créneau en création
                var typeToHandle = typeTimeslot();
                choicesDiv.replaceChildren("");

                switch (typeToHandle){
                    case '1' :  //Conduite
                        toogleFreeBusChoices(choicesDiv);
                        toogleFreeDriverChoices(choicesDiv);
                        toogleLineChoices(choicesDiv);
                        toogleDirectionChoices(choicesDiv); 
                        break;
                    case '2' :  //Reunion 
                        toogleFreeUserChoices(choicesDiv);
                        break;
                    case '3' : //Indisponibilite
                        toogleFreeDriverChoices(choicesDiv);
                        break;
                    case '5' :  //Astreinte
                        toogleBusChoices(choicesDiv);
                        toogleFreeDriverChoices(choicesDiv);
                        break;
                    case '4' :  //reservation
                        toogleBusChoices(choicesDiv);
                        toogleFreeDriverChoices(choicesDiv);
                        break;
                    default :
                        toogleBusChoices(choicesDiv)
                        toogleFreeUserChoices(choicesDiv)
                        toogleLineChoices(choicesDiv);
                        toogleDirectionChoices(choicesDiv);
                        break;
                }
            })

            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
        }
    })

    const choicesDiv = create("div", form);

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function (){
        let type = typeTimeslot()
        if (type == 2){
            selectUserOblige(form)
        }else {
            let url = axiosUrlSendWhenADD(type)
            //fetchUrlRedirectAndAlert(url, "/espace-admin", "Le créneau a bien été ajouté", "Le créneau n'a pas pu être ajouté")
        }
    })
}


export {
    participantsTimeslot,
    selectedDrivers,
    busesTimeslot,
    typeTimeslot,
    lineDirectionTimeslot,
    lineTimeslot,
    toggleAddCreneau,
    toogleBusChoices,
    toogleFreeBusChoices,
    toogleUserChoices,
    toogleFreeUserChoices,
    toogleDriversChoices
}