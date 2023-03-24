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

    // Creation of the radio to define the line
    var divRadioLigne = create("div", form);
    create("label", divRadioLigne, "Choisissez une ligne :");
    axios.get(`lines/lines.php?function=lines`).then((response)=>{
        for(var line of response.data){
            createChampRadio(divRadioLigne, line.number , "selectionLigne", line.number);
            var label = create("label", divRadioLigne, "Ligne " + line.number);
            label.setAttribute("for", line.number);
          }
    });

    // Creation of the radio to define the direction
    var divRadioDirection = create("div", form);
    create("label", divRadioDirection, "Choisissez la direction  :");
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");
    var label = create("label", divRadioDirection, "aller");
    label.setAttribute("for", "aller");
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
    var label = create("label", divRadioDirection, "retour");
    label.setAttribute("for", "retour");    

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
        let type = typeTimeslot ();
        let users = participantsTimeslot();
        let buses = busesTimeslot();
        let line = lineTimeslot();
        let direction = lineDirectionTimeslot();

        //creation of the url
        let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}`
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


            // Recuperation de la ligne a modifier
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

