import {
    create,
    createChamp,
    createChampCheckbox,
    createChampRadio,
    toggleError,
    toggleAlert
} from "../main";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { valueFirstElementChecked } from "../utils/formGestion";

import axios from 'axios';


// select the types of participants and return those who are checked in a string : 1,2,...
export const participantsTimeslot = () => {
    var response = "";
    for(var user of document.querySelectorAll("input[name='selectionParticipant']")){
        if (user.checked) {
            if (response != ""){
                response += ",";
            }
            response += user.value;
        }
    } return response;
}

// select the types of buses and return those who are checked in a string : 1,2,...
export const busesTimeslot = () => {
    var response = "";
    for(var bus of document.querySelectorAll("input[name='selectionBus']")){
        if (bus.checked) {
            if (response != ""){
                response += ",";
            }
            response += bus.value;
        }
    } return response;
}

// select the types of timeslots and return the one who is checked in a string
export const typeTimeslot = () => {
    for(var type of document.querySelectorAll("input[name='selectionType']")){
        if (type.checked) {
            return type.value;
        }
    }
}

// select the direction of the line and return the one who is checked in a string
export const lineDirectionTimeslot = () => {
    for(var direction of document.querySelectorAll("input[name='selectionDirection']")){
        if (direction.checked) {
            return direction.value;
        }
    }
}
    
// select the line of the timeslot and return the one who is checked in a string
export const lineTimeslot = () => {
    for(var line of document.querySelectorAll("input[name='selectionLigne']")){
        if (line.checked) {
            return line.value;
        }
    }
}


// Fonction de recuperation du type creneau selectionnée
function typeSelected () {
    for(var type of document.querySelectorAll("input[name='selectionType']")){
        if (type.checked) {
            return type.value;
        }
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
    }else {
        divCheckboxBus.replaceChildren("");
    }

     // On met le titre
    create("label", divCheckboxBus, "Choisissez les bus participants :");
    
    // On cree chaque champs 
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id);
            label.setAttribute("for", bus.id);
        }
    });

     // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
     var boutonBus = create("button", divCheckboxBus, "Afficher seulement les bus disponibles");
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
    divCheckboxBus.replaceChildren("");
    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des bus libres 
    create("label", divCheckboxBus, "Choisissez les bus parmis ceux disponibles :");
    axios.get(`buses/buses.php?function=freeBuses&beginning=${StartDateTime}&end=${EndDateTime}`).then((response)=>{
        for(var bus_id of response.data){
            axios.get(`buses/buses.php?function=bus&id=${bus_id}`).then((response)=>{
                let bus = response.data;
                createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
                var label = create("label", divCheckboxBus, bus.id);
                label.setAttribute("for", bus.id);
        })
    }
    });
    
    // On cree le bouton permettant d'afficher tous les utilisateurs
    var bouton = create("button", divCheckboxBus, "Afficher tous les bus");
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
            createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);
            var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
        }
    });

    // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
    var boutonUser = create("button", divCheckboxUsers, "Afficher seulement les utilisateur disponibles");
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
    divCheckboxUsers.replaceChildren("");
    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des utilisateurs libres 
    create("label", divCheckboxUsers, "Choisissez les participants parmis ceux disponibles :");
    axios.get(`users/users.php?function=freeUsers&beginning=${StartDateTime}&end=${EndDateTime}`).then((response)=>{
        for(var user_id of response.data){
            axios.get(`users/users.php?function=user&id=${user_id}`).then((response)=>{
                let user = response.data;
                createChampCheckbox(divCheckboxUsers, user["id"], "selectionParticipant", user["id"]);
                var label = create("label", divCheckboxUsers, user["name"] + " "+ user["firstname"]);
                label.setAttribute("for", user["id"]);
        })
    }
    });
    
    // On cree le bouton permettant d'afficher tous les utilisateurs
    var bouton = create("button", divCheckboxUsers, "Afficher tous les utilisateurs");
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
            createChampCheckbox(divCheckboxDrivers, user.id , "selectionConducteurs", user.id);
            var label = create("label", divCheckboxDrivers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
            }
        }
    });

    // On cree le bouton qui permet de choisir si on veut afficher seulement les disponibles
    var boutonUser = create("button", divCheckboxDrivers, "Afficher seulement les conducteurs disponibles");
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
    divCheckboxDrivers.replaceChildren("");
    
    // On la re remplie

    // On recupere le debut et la fin du creneau
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // On récupere et affiche les checkbox des conducteurs libres 
    create("label", divCheckboxDrivers, "Choisissez les conducteurs parmis ceux disponibles :");
    axios.get(`users/users.php?function=freeDrivers&beginning=${StartDateTime}&end=${EndDateTime}`).then((response)=>{
        for(var user_id of response.data){
            axios.get(`users/users.php?function=user&id=${user_id}`).then((response)=>{
                let user = response.data;
                createChampCheckbox(divCheckboxDrivers, user["id"], "selectionParticipant", user["id"]);
                var label = create("label", divCheckboxDrivers, user["name"] + " "+ user["firstname"]);
                label.setAttribute("for", user["id"]);
        })
    }
    });
    
    // On cree le bouton permettant d'afficher tous les conducteurs
    var bouton = create("button", divCheckboxDrivers, "Afficher tous les conducteurs");
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
         createChampRadio(divRadioLigne, line.number , "selectionLigne", line.number);
        var label = create("label", divRadioLigne, "Ligne " + line.number);
        label.setAttribute("for", line.number);
        }
    });
}

//------------------------------------------------------- */
//   Gestion URL
//------------------------------------------------------- */

// fonction qui renvoie les conducteurs selectionnés dans le formulaire.
function selectedDrivers () {
    // select the types of participants and return those who are checked in a string : 1,2,...
    var response = "";
    for(var user of document.querySelectorAll("input[name='selectionConducteurs']")){
        if (user.checked) {
            if (response != ""){
                response += ",";
            }
            response += user.value;
        }
    } return response;
}

// fonction qui renvoie les participants selectionnés dans le formulaire.
function selectedUsers () {
    // select the types of participants and return those who are checked in a string : 1,2,...
    var response = "";
    for(var user of document.querySelectorAll("input[name='selectionParticipant']")){
        if (user.checked) {
            if (response != ""){
                response += ",";
            }
            response += user.value;
        }
    } return response;
}

// fonction qui renvoie les bus selectionnés dans le formulaire.
function selectedBuses () {
    // select the types of buses and return those who are checked in a string : 1,2,...
    var response = "";
    for(var bus of document.querySelectorAll("input[name='selectionBus']")){
        if (bus.checked) {
            if (response != ""){
                response += ",";
            }
            response += bus.value;
        }
    } return response;
}

// fonction qui renvoie la direction selectionnée dans le formulaire.
function selectedDirection () {
    // select the direction of the line and return the one who is checked in a string
    for(var direction of document.querySelectorAll("input[name='selectionDirection']")){
        if (direction.checked) {
            return direction.value;
        }
    }
}

const getData = () => {
    return {
        users : selectedUsers(),
        drivers : selectedDrivers(),
        buses : selectedBuses(),
        line : valueFirstElementChecked("input[name='selectionLigne']"),
        direction : selectedDirection()
    }
}


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

    // depends on the type of the timeslot
    switch (type) {

        // CONDUITE
        case "1" :
            if (drivers != "" && buses != "" && line != "" && direction != ""){
                url += `&users=${drivers}&buses=${buses}&lines=${line}&directions=${direction}`;
                toggleAlert("REUSSITE", "Le créneau à bien été ajouté !");
                break;
            }
            else
            {
                toggleError("ATTENTION", "Formulaire invalide !"); break;
            }


        // REUNION
        case "2" :
            if (users != ""){
                url += `&users=${users}`;
                toggleAlert("REUSSITE", "Le créneau à bien été ajouté !");
                break;
            }
            else
            {
                toggleError("ATTENTION", "Formulaire invalide !"); break;
            }


        // INDISPONIBILITE
        case "3" :
            if (drivers != "") {
                url += `&users=${drivers}`;
                toggleAlert("REUSSITE", "Le créneau à bien été ajouté !");
                break;
            }
            else
            {
                toggleError("ATTENTION", "Formulaire invalide !"); break;
            }

        // ERREUR
        default :
            url = ``;
            toggleError("ATTENTION", "Formulaire invalide !"); break;

    }

    return url;
}

export const toggleAddCreneau = () => {
    const main = document.querySelector("#app");
    main.replaceChildren("");
    
    create("h2", main, "Ajout de crénaux");
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, " Rentrez les informations suivantes : ", ["presentation"]);

    // Creation of the form
    const form = create("div", main);

    // Creation of each champ
    create("label", form, "Entrez la date de début du créneau :");
    createChamp(form, "datetime-local", "StartDateTime");
    create("br", form);
    create("label", form, "Entrez la date de fin du creneau :");
    createChamp(form, "datetime-local", "EndDateTime");
    create("br", form);

    

    // Creation of the radio to define the type of the timeslot
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type du créneau :");
    axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
        for(var type of response.data){

        /*--------------
         Au clic du choix de type de créneau on affiche les autres infos à choisir 
         ---------------*/

            createChampRadio(divRadio, type.name , "selectionType", type.id).addEventListener('click', function(){

    
                // Recuperation du type du créneau en création
                var typeToHandle = typeSelected ();
                
                switch (typeToHandle){
                    //Conduite
                    case '1' :
                        choicesDiv.replaceChildren("");
                        toogleBusChoices(choicesDiv);
                        toogleDriversChoices(choicesDiv);
                        toogleLineChoices(choicesDiv);
                        toogleDirectionChoices(choicesDiv); 
                        break;

                    //Reunion 
                    case '2' :
                        choicesDiv.replaceChildren("");
                        toogleUserChoices(choicesDiv);
                        break;
                    //Indisponibilite
                    case '3' :
                        choicesDiv.replaceChildren("");
                        toogleDriversChoices(choicesDiv);
                        break;
                    default :
                        choicesDiv.replaceChildren("");
                        toogleBusChoices(choicesDiv)
                        toogleUserChoices(choicesDiv)
                        toogleLineChoices(choicesDiv);
                        toogleDirectionChoices(choicesDiv); 
                        break;



                };

            });


            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
          }
    });

    const choicesDiv = create("div", form);










    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function (event){

        let url = axiosUrlSendWhenADD(typeSelected());
        axios.get(url).then(function(response){
            toggleEspaceAdmin()
            if(response.data){
                toggleAlert("BRAVO", "Le créneau a bien été ajouté")
            }
            else{
                toggleError("ERREUR", "Le créneau n'a pas pu être ajouté")
            }
        })
    })

    form.appendChild(bouton);


    return main
}