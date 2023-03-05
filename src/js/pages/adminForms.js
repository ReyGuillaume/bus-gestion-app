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
    var divCheckboxCreneau = create("div", form);
    create("label", divRadio, "Choisissez le creéneau à supprimer :");
    axios.get(`timeslots/timeslots.php?function=timeslots`).then((response)=>{
        console.log(response);
        for(var timeslot of response.data){
            createChampCheckbox(divCheckboxCreneau, timeslot.id , "selectionTimeslot", timeslot.id);
            var label = create("label", divCheckboxCreneau, timeslot.begining + " "+ timeslot.end+ " ");
            label.setAttribute("for", timeslot.id);
          }
    });




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

export const toggleAjoutUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'Utilisateur")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)
    create("br", form);

    create("label", form, "Entrez le prénom de l'utilisateur :");
    createChamp(form, "text", "nameUser");
    create("br", form);

    create("label", form, "Entrez le nom de l'utilisateur :");
    createChamp(form, "text", "lastNameUser");
    create("br", form);

    create("label", form, "Entrez le login de l'utilisateur :");
    createChamp(form, "text", "loginUser");
    create("br", form);

    create("label", form, "Entrez son email :");
    createChamp(form, "email", "mailUser");
    create("br", form);

    create("label", form, "Entrez la date de naissance de l'utilisateur :");
    createChamp(form, "date", "birthDate");
    create("br", form);

    // creation of a radio to choose the role of the user created
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de l'utilisateur :");
    axios.get(`users/users.php?function=usertypes`).then((response)=>{
        console.log(response);
        for(var type of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, type.id , "typeUser", type.id);
            var label = create("label", divRadio, type.name );
            label.setAttribute("for", type.id);
          }
    });


    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        // return the type of the user checked
        function typeUser () {
            let res = null;
            for(var type of document.querySelectorAll("input[name='typeUser']")){
                if (type.checked) {
                    res = type.value;
                }
            }return res;
        }
        // selection the infos
        let login = document.querySelector("input[name='loginUser']").value;
        let date = document.querySelector("input[name='birthDate']").value;
        let name = document.querySelector("input[name='lastNameUser']").value;
        let firstname = document.querySelector("input[name='nameUser']").value;
        let email = document.querySelector("input[name='mailUser']").value;
        let type = typeUser();

        //creation of the url
        let url = `users/users.php?function=createEmploye&login=${login}&date=${date}&name=${name}&firstname=${firstname}&email=${email}&type=${type}`

        axios.get(url)

    })
    form.appendChild(bouton);

    return main
   

}

export const toggleSupprimeUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'Utilisateur")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the user to delete
    var divCheckboxUsers = create("div", form);
    create("label", divCheckboxUsers, "Choisissez le(s) utilisateur(s) à supprimer :");
    axios.get(`users/users.php?function=users`).then((response)=>{
        console.log(response);
        for(var user of response.data){
            create("br", divCheckboxUsers);
            createChampCheckbox(divCheckboxUsers, user.id , "selectionUSer", user.id);
            var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

            // delete the user who are checked
            for(var user of document.querySelectorAll("input[name='selectionUSer']")){
                let url = `users/users.php?function=delete&id=`;
                if (user.checked) {
                    url += user.value;
                    axios.get(url)
                }
            }
    })
    form.appendChild(bouton);

    return main

}



//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

export const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to add
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadio, bustype.name );
            label.setAttribute("for", bustype.id);
            

          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        for(var type of document.querySelectorAll("input[name='typeBus']")){
            if (type.checked) {
                axios.get(`buses/buses.php?function=create&type=`+type.value);
            }
        }
    })
    form.appendChild(bouton);

    return main
}

export const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to modify
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le bus à modifier :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        console.log(response);
        for(var bus of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bus.id , "idBus", bus.id);
            var label = create("label", divRadio, bus.id );
            label.setAttribute("for", bus.id);
          }
    });

    //Creation of the radio to choose the new type of the bus

    var divRadioType = create("div", form);
    create("label", divRadioType, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadioType);
            createChampRadio(divRadioType, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadioType, bustype.name );
            label.setAttribute("for", bustype.id);
          }
    });
    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        function idBus () {
            let res = null;
            for(var idBus of document.querySelectorAll("input[name='idBus']")){
                if (idBus.checked) {
                    res = idBus.value;
                }
            }return res;
        }
        function typeBus () {
            let res = null;
            for(var typeBus of document.querySelectorAll("input[name='typeBus']")){
                if (typeBus.checked) {
                    res = typeBus.value;
                }
            }return res;
        }

        let id = idBus();
        let type = typeBus();

        axios.get(`buses/buses.php?function=updatebus&id=${id}&type=${type}`);
    })
    form.appendChild(bouton);

    return main
}


export const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the bus to add
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez le(s) bus à supprimer :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        console.log(response);
        for(var bus of response.data){
            create("br", divCheckboxBus);
            createChampCheckbox(divCheckboxBus, bus.id , "idBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id );
            label.setAttribute("for", bus.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        for(var bus of document.querySelectorAll("input[name='idBus']")){
            let url = `buses/buses.php?function=delete&id=`;
            if (bus.checked) {
                url += bus.value;
                axios.get(url)
            }
        }
    })
    form.appendChild(bouton);

    return main
}