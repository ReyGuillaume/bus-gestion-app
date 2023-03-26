import {
    create,
    createChamp,
    createChampCheckbox,
    createChampRadio,
    toggleError,
    toggleAlert
} from "../main";

import axios from 'axios';


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

// fonction qui renvoie la ligne selectionnée dans le formulaire.
function selectedLine () {
    // select the line of the timeslot and return the one who is checked in a string
    for(var line of document.querySelectorAll("input[name='selectionLigne']")){
        if (line.checked) {
            return line.value;
        }
    }
}

// fonction qui renvoie l'url axios en fonction du type de creneau selectionné
function axiosUrlSendWhenADD(type){

    // selection of the start and end time
    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

    // creation of the variables
    let users;
    let drivers;
    let buses;
    let line;
    let direction;

    // creation of the default url
    let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}`;

    // depends on the type of the timeslot
    switch (type) {

        // CONDUITE
        case "1" :
            drivers = selectedDrivers();
            buses = selectedBuses();
            line = selectedLine();
            direction = selectedDirection();
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
            users = selectedUsers();
            if (users != ""){
                url += `&users=${users}`; break;
                toggleAlert("REUSSITE", "Le créneau à bien été ajouté !");
            }
            else
            {
                toggleError("ATTENTION", "Formulaire invalide !"); break;
            }


        // INDISPONIBILITE
        case "3" :
            drivers = selectedDrivers();
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











// ------------------------------------------------------- */
//   Gestion Créneau
//------------------------------------------------------- */
export const toggleAddCreneau = () => {
    const main = document.querySelector("#app");
    main.replaceChildren("");
    
    create("h2", main, "Ajout de crénaux");
    create("p", main, " Rentrez les informations suivantes : ");

    // Creation of the form
    const form = create("form", main);

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
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        let url = axiosUrlSendWhenADD(typeSelected());
        axios.get(url);
    })

    form.appendChild(bouton);


    return main
}

export const toggleModifCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification de Créneau")
    create("p", main, " Choisir le créneau à modifier : ")

    // Creation of the form
    const form = create("form", main)

   // Creation of the radio to select the timeslot to modify
    var divRadioCreneau = create("div", form);
     // Recuperation de toutes les lignes
    
    axios.get(`timeslots/timeslots.php?function=timeslots`).then((response)=>{
        
        for(var timeslot of response.data){
            create("br", divRadioCreneau);

           //Ajout d'un evenement au clic d'un radio
            createChampRadio(divRadioCreneau, timeslot.id , "selectionTimeslot", timeslot.id).addEventListener('click', function(){

            // Fonction de recuperation du creneau selectionnée
            function creneauSelected () {
                for(var creneau of document.querySelectorAll("input[name='selectionTimeslot']")){
                    if (creneau.checked) {
                        return creneau.value;
                    }
                }
            }


            // Recuperation du creneau a modifier
            var idCreneauToModify = creneauSelected ();




            axios.get(`timeslots/timeslots.php?function=timeslot&id=${idCreneauToModify}`).then((responseCreneau) =>{
    
                // Creation du formulaire pré remplie de modif de ligne 
                console.log(responseCreneau.data);
                form.replaceChildren("")

                 // Creation of each champ
                create("label", form, "La date de début du créneau :");
                createChamp(form, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;
                create("br", form);
                create("label", form, "Entrez la date de fin du creneau :");
                createChamp(form, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
                create("br", form);
                

                // Creation of the radio to define the type of the timeslot
                var divRadio = create("div", form);
                create("label", divRadio, "Le type du créneau :");
                axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
                    for(var type of response.data){
                        var champType = createChampRadio(divRadio, type.name , "selectionType", type.id);
                        if (type.id = responseCreneau.data.id_time_slot_type ){
                            champType.checked = true;
                        }
                        var label = create("label", divRadio, type.name);
                        label.setAttribute("for", type.name);
                    }
                });

                
                //recup tous les bus 
                var tabBus= [];
                for (var bus of responseCreneau.data.buses){
                    tabBus.push(bus.id);
                }
               



                // Creation of the checkbox to define the bus involved in the timeslot
                var divCheckboxBus = create("div", form);
                create("label", divCheckboxBus, "Les bus participants :");
                axios.get(`buses/buses.php?function=buses`).then((response)=>{
                    for(var bus of response.data){
                        var champBus = createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
                        
                        if (tabBus.includes(bus.id)){
                            champBus.checked = true;
                        }

                        var label = create("label", divCheckboxBus, bus.id);
                        label.setAttribute("for", bus.id);
                    }
                });


                //recup tous les user 
                var tabUser= [];
                for (var user of responseCreneau.data.users){
                    tabUser.push(user.id);
                }
                // Creation of the checkbox to define the users involved in the timeslot
                var divCheckboxUsers = create("div", form);
                create("label", divCheckboxUsers, "Les participants :");
                axios.get(`users/users.php?function=users`).then((response)=>{
                    for(var user of response.data){
                        var champUser = createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);

                        if (tabUser.includes(user.id)){
                            champUser.checked = true;
                        }

                        var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
                        label.setAttribute("for", user.id);
                    }
                });

                //recup ligne 
                var tabLine= [];
                for (var line of responseCreneau.data.lines){
                    tabLine.push(line.number);
                }


                // Creation of the radio to define the line
                var divRadioLigne = create("div", form);
                create("label", divRadioLigne, "La ligne :");
                axios.get(`lines/lines.php?function=lines`).then((response)=>{
                    for(var line of response.data){
                        var champLine = createChampRadio(divRadioLigne, line.number , "selectionLigne", line.number);

                        if (tabLine.includes(line.number)){
                            champLine.checked = true;
                        }

                        var label = create("label", divRadioLigne, "Ligne " + line.number);
                        label.setAttribute("for", line.number);
                    }
                });

                 //recup direction 
                 var tabDirAller= true;
                 for (var line of responseCreneau.data.lines){
                    if (line.direction = 'retour'){
                        tabDirAller = false;
                    }
                     
                 }
                // Creation of the radio to define the direction
                var divRadioDirection = create("div", form);
                create("label", divRadioDirection, "La direction  :");
                create("br", divRadioDirection);
                var champAller = createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");

                var label = create("label", divRadioDirection, "aller");
                label.setAttribute("for", "aller");
                create("br", divRadioDirection);
                var champRetour =createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
                var label = create("label", divRadioDirection, "retour");
                label.setAttribute("for", "retour");    
                
                if(tabDirAller){
                    champAller.checked = true;
                }else{
                    champRetour.checked = true;
                }
                // Creation of submit button
                const bouton = create("button", form, "Envoyer")
                bouton.addEventListener("click", function (event){
                    // selection of the start and end time
                    let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
                    let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

                    function participantsTimeslot () {
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

                    function busesTimeslot () {
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

                    function lineDirectionTimeslot () {
                        // select the direction of the line and return the one who is checked in a string
                        for(var direction of document.querySelectorAll("input[name='selectionDirection']")){
                            if (direction.checked) {
                                return direction.value;
                            }
                        }
                    }

                    function lineTimeslot () {
                        // select the line of the timeslot and return the one who is checked in a string
                        for(var line of document.querySelectorAll("input[name='selectionLigne']")){
                            if (line.checked) {
                                return line.value;
                            }
                        }
                    }

                    // selection of the type of timeslot, participants and buses
                    let users = participantsTimeslot();
                    let buses = busesTimeslot();
                    let line = lineTimeslot();
                    let direction = lineDirectionTimeslot();

                    let url = `timeslots/timeslots.php?function=update&id=${idCreneauToModify}&beginning=${StartDateTime}&end=${EndDateTime}`;

                    if (users){
                        url += `&users=${users}`;
                    }
                    if (buses){
                        url += `&buses=${buses}`;
                    }
                    if (line){
                        url += `&lines=${line}`;
                    }
                    if (direction){
                        url += `&directions=${direction}`;
                    }

                    axios.get(url)
                })
                form.appendChild(bouton);
            });
        });
            var label = create("label", divRadioCreneau, timeslot.begining + " "+ timeslot.end+ " ");
            label.setAttribute("for", timeslot.id);
          }
    });

    return main
    

}


export const toggleSupprimeCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression de Créneau")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the timeslot to delete
    var divCheckboxCreneau = create("div", form);
    create("label", divCheckboxCreneau, "Choisissez le creéneau à supprimer :");
    axios.get(`timeslots/timeslots.php?function=timeslots`).then((response)=>{
        console.log(response);
        for(var timeslot of response.data){
            createChampCheckbox(divCheckboxCreneau, timeslot.id , "selectionTimeslot", timeslot.id);
            var label = create("label", divCheckboxCreneau, timeslot.begining + " "+ timeslot.end+ " ");
            label.setAttribute("for", timeslot.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        for(var date of document.querySelectorAll("input[name='selectionTimeslot']")){
            if (date.checked) {
                axios.get (`timeslots/timeslots.php?function=delete&id=${date.value}`);
            }
        }
        })
    form.appendChild(bouton);
    
    return main

}


