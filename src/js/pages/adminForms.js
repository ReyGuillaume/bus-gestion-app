import { create, createChamp, createChampCheckbox, createChampRadio } from "../main";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Créneau 
//------------------------------------------------------- */
export const toggleAddCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout de crénaux")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

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
            createChampRadio(divRadio, type.name , "selectionType", type.id);
            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
          }
    });


    // Creation of the checkbox to define the bus involved in the timeslot
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez les bus participants :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id);
            label.setAttribute("for", bus.id);
          }
    });

    // Creation of the checkbox to define the users involved in the timeslot
    var divCheckboxUsers = create("div", form);
    create("label", divCheckboxUsers, "Choisissez les participants :");
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);
            var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        // selection of the start and end time
        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

        function typeTimeslot () {
            // select the types of timeslots and return the one who is checked in a string
            for(var type of document.querySelectorAll("input[name='selectionType']")){
                if (type.checked) {
                    return type.value;
                }
            }
        }

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
        // selection of the type of timeslot, participants and buses
        let type = typeTimeslot ();
        let users = participantsTimeslot();
        let buses = busesTimeslot();

        //creation of the url
        let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}`
        if (users){
            url += `&users=${users}`;
        }
        if (buses){
            url += `&buses=${buses}`;
        }

        axios.get(url)

    })
    form.appendChild(bouton);

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
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le creéneau à supprimer :");
    /*axios.get(`timeslots/timeslots.php?function=timeslots`).then((response)=>{
        console.log(response);
        for(var timeslot of response.data){
            createChampRadio(divRadio, timeslot.id , "selectionTimeslot", timeslot.id);
            var label = create("label", divRadio, timeslot.begining + " "+ timeslot.end);
            label.setAttribute("for", timeslot.id);
          }
    });*/




    // Creation of submit button
   /* const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        })
    form.appendChild(bouton);
    
    return main*/

}




//------------------------------------------------------- */
//   Gestion Utilisateurs
//------------------------------------------------------- */


export const toggleSupprimeUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression de User")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the user to delete
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le user à supprimer :");
    axios.get(`users/users.php?function=users`).then((response)=>{
        console.log(response);
        for(var user of response.data){
            createChampRadio(divRadio, user.id , "selectionBus", user.id);
            var label = create("label", divRadio, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });




    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        let idUser = 1; // A modifier
        
        console.log(idUser);

        axios.get(`users/users.php?function=delete&id=${idUser}`)
    })
    form.appendChild(bouton);
    
    return main

}

