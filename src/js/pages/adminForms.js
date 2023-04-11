import { create, createChamp, createChampCheckbox, createChampRadio, toggleAlert, toggleError } from "../main";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { timeSlotCanBeSubmit } from "./testTimeSlot"
import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Créneau 
//------------------------------------------------------- */

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

export const toggleAddCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout de créneaux")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of each champ
    create("label", form, "Début :");
    createChamp(form, "datetime-local", "StartDateTime");

    create("label", form, "Fin :");
    createChamp(form, "datetime-local", "EndDateTime");
    

    // Creation of the radio to define the type of the timeslot
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type du créneau : ", ["form-info"]);
    axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
        for(var type of response.data){
            var radio = createChampRadio(divRadio, type.name , "selectionType", type.id);
            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
        }
        radio.checked = true;
    });

     
     

    // Creation of the checkbox to define the bus involved in the timeslot
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez les bus participants : ", ["form-info"]);
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id);
            label.setAttribute("for", bus.id);
          }
    });

    // Creation of the checkbox to define the users involved in the timeslot
    var divCheckboxUsers = create("div", form);
    create("label", divCheckboxUsers, "Choisissez les participants : ", ["form-info"]);
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);
            var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of the radio to define the line
    var divRadioLigne = create("div", form);
    create("label", divRadioLigne, "Choisissez une ligne : ", ["form-info"]);
    axios.get(`lines/lines.php?function=lines`).then((response)=>{
        for(var line of response.data){
            createChampRadio(divRadioLigne, line.number , "selectionLigne", line.number);
            var label = create("label", divRadioLigne, "Ligne " + line.number);
            label.setAttribute("for", line.number);
          }
    });

    // Creation of the radio to define the direction
    var divRadioDirection = create("div", form);
    create("label", divRadioDirection, "Choisissez la direction  :", ["form-info"]);
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");
    var label = create("label", divRadioDirection, "aller");
    label.setAttribute("for", "aller");
    create("br", divRadioDirection);
    createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
    var label = create("label", divRadioDirection, "retour");
    label.setAttribute("for", "retour");    

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", async function(){

        // selection of the start and end time
        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

        // selection of the type of timeslot, participants and buses
        let type = typeTimeslot();
        let users = participantsTimeslot();
        let buses = busesTimeslot();
        let line = lineTimeslot();
        let direction = lineDirectionTimeslot();

        if (await timeSlotCanBeSubmit(StartDateTime, EndDateTime, type, users, buses)) {
            //creation of the url
            let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}`
            if (type){
                url += `&type=${type}`;
            }
            else{
                url += `&type=`;
            }

            if (users){
                url += `&users=${users}`;
            }
            else{
                url += `&users=`;
            }

            if (buses){
                url += `&buses=${buses}`;
            }
            else{
                url += `&buses=`;
            }

            if (line){
                url += `&lines=${line}`;
            }
            else{
                url += `&lines=`;
            }

            if (direction){
                url += `&directions=${direction}`;
            }
            else{
                url += `&directions=`;
            }

            axios.get(url).then(function(response){
                toggleEspaceAdmin();
                if(response.data){
                    toggleAlert("BRAVO", "Le créneau a bien été ajouté");
                }
                else{
                    toggleError("ERREUR", "Le créneau n'a pas pu être ajouté");
                }
            })
        } else {
            toggleError("ERREUR", "L'un des participant ajoutés n'est pas disponible...");
        }
    })

    return main

}

const executeModifCreneau = (container, id_creneau) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${id_creneau}`).then((responseCreneau) =>{
    
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

         // Creation of each champ
        create("label", container, "Début :");
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Fin :");
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
        

        // Creation of the radio to define the type of the timeslot
        var divRadio = create("div", container);
        create("label", divRadio, "Le type du créneau : ", ["form-info"]);
        axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
            for(var type of response.data){
                var champType = createChampRadio(divRadio, type.name , "selectionType", type.id);
                if (type.id == responseCreneau.data.id_time_slot_type ){
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
        var divCheckboxBus = create("div", container);
        create("label", divCheckboxBus, "Les bus participants : ", ["form-info"]);
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
        var divCheckboxUsers = create("div", container);
        create("label", divCheckboxUsers, "Les participants : ", ["form-info"]);
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
        var divRadioLigne = create("div", container);
        create("label", divRadioLigne, "La ligne : ", ["form-info"]);
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
        var divRadioDirection = create("div", container);
        create("label", divRadioDirection, "La direction : ", ["form-info"]);
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
        const bouton = create("div", container, "Modifier", ["submitButton"])
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            // selection of the type of timeslot, participants and buses
            let users = participantsTimeslot();
            let buses = busesTimeslot();
            let line = lineTimeslot();
            let direction = lineDirectionTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${id_creneau}&beginning=${StartDateTime}&end=${EndDateTime}`;

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

            axios.get(url).then(function(response){
                toggleEspaceAdmin();
                if(response.data){
                    toggleAlert("BRAVO", "Le créneau a bien été modifié");
                }
                else{
                    toggleError("ERREUR", "Le créneau n'a pas pu être modifié");
                }
            })
        })
    });
}

export const toggleModifCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification de créneaux")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, " Choisir le créneau à modifier :", ["presentation"])

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
                var idCreneauToModify = creneauSelected();

                executeModifCreneau(form, idCreneauToModify);
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
    
    create("h2", main, "Suppression de créneaux")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisissez le(s) créneau(x) à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the timeslot to delete
    axios.get(`timeslots/timeslots.php?function=timeslots`).then((response)=>{
        for(var timeslot of response.data){
            let div = create("div", form)
            createChampCheckbox(div, timeslot.id , "selectionTimeslot", timeslot.id);
            var label = create("label", div, timeslot.begining + " "+ timeslot.end+ " ");
            label.setAttribute("for", timeslot.id);
        }
        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.addEventListener("click", function(){
            for(var date of document.querySelectorAll("input[name='selectionTimeslot']")){
                if (date.checked) {
                    axios.get (`timeslots/timeslots.php?function=delete&id=${date.value}`).then(function(){
                        toggleEspaceAdmin();
                        toggleAlert("BRAVO", "Le créneau a bien été supprimé");
                    })
                }
            }
        })
    });
    
    return main

}




//------------------------------------------------------- */
//   Gestion Utilisateurs
//------------------------------------------------------- */

export const toggleAjoutUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'Utilisateur")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, " Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    create("label", form, "Entrez le prénom de l'utilisateur :", ["form-info"]);
    createChamp(form, "text", "nameUser");

    create("label", form, "Entrez le nom de l'utilisateur :", ["form-info"]);
    createChamp(form, "text", "lastNameUser");

    create("label", form, "Entrez le login de l'utilisateur :", ["form-info"]);
    createChamp(form, "text", "loginUser");

    create("label", form, "Entrez son email :", ["form-info"]);
    createChamp(form, "email", "mailUser");

    create("label", form, "Entrez la date de naissance de l'utilisateur :", ["form-info"]);
    createChamp(form, "date", "birthDate");

    // creation of a radio to choose the role of the user created
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de l'utilisateur :", ["form-info"]);
    axios.get(`users/users.php?function=usertypes`).then((response)=>{
        for(var type of response.data){
            create("br", divRadio);
            var radio = createChampRadio(divRadio, type.id , "typeUser", type.id);
            var label = create("label", divRadio, type.name );
            label.setAttribute("for", type.id);
        }
        radio.checked = true;
    });


    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function(){
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
        let url = `users/users.php?function=create&login=${login}&password=gobus123&confirm=gobus123&date=${date}&name=${name}&firstname=${firstname}&email=${email}&type=${type}`

        axios.get(url).then(function(){
            toggleEspaceAdmin();
            toggleAlert("BRAVO", "L'utilisateur a bien été ajouté");
        })

    })

    return main
   

}

export const toggleModifyUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'Utilisateur")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, " Choisissez l'utilisateur à modifier :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to select the user to modify
    var divRadioUser = create("div", form);

    // Recuperation de tous les utilisateurs
    axios.get(`users/users.php?function=users`).then((response)=>{

        for(var user of response.data){
            create("br", divRadioUser);

            //Ajout d'un evenement au clic d'un radio
           createChampRadio(divRadioUser, user.id , "selectionUser", user.id).addEventListener('click', function(){
                
                // Fonction de recuperation de l'user selectionnée
                function userSelected () {
                    for(var user of document.querySelectorAll("input[name='selectionUser']")){
                        if (user.checked) {
                            return user.value;
                        }
                    }
                }


            // Recuperation de l'utilisateur a modifier
            var idUserToModify = userSelected ();
            axios.get(`users/users.php?function=user&id=${idUserToModify}`).then((responseUser) =>{
                   
                // Creation du formulaire pré remplie de modif de user
                main.replaceChildren("")
                create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
                const form = create("form", main)

                create("label", form, "Le prénom de l'utilisateur :", ["form-info"]);
                createChamp(form, "text", "nameUser").value = responseUser.data.firstname;

                create("label", form, "Le nom de l'utilisateur :", ["form-info"]);
                createChamp(form, "text", "lastNameUser").value = responseUser.data.name;

                create("label", form, "Le login de l'utilisateur :", ["form-info"]);
                createChamp(form, "text", "loginUser").value = responseUser.data.login;

                create("label", form, "L'email de l'utilisateur :", ["form-info"]);
                createChamp(form, "email", "mailUser").value = responseUser.data.email;

                create("label", form, "La date de naissance de l'utilisateur :", ["form-info"]);
                createChamp(form, "date", "birthDate").value = responseUser.data.birth_date;

                const bouton = create("div", form, "Modifier", ["submitButton"])
                bouton.addEventListener("click", function (){
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
                    let url = `users/users.php?function=update&id=${idUserToModify}&email=${email}&login=${login}`;
                    axios.get(url).then(function(){
                        toggleEspaceAdmin();
                        toggleAlert("BRAVO", "L'utilisateur a bien été modifié");
                    })

                })

            });
        });

            var label = create("label", divRadioUser, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    return main
}

export const toggleSupprimeUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'Utilisateur")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisissez le(s) utilisateur(s) à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the user to delete
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            let div = create("div", form)
            createChampCheckbox(div, user.id , "selectionUSer", user.id);
            var label = create("label", div, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
        }
        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.addEventListener("click", function(){

            // delete the user who are checked
            for(var user of document.querySelectorAll("input[name='selectionUSer']")){
                let url = `users/users.php?function=delete&id=`;
                if (user.checked) {
                    url += user.value;
                    axios.get(url).then(function(){
                        toggleEspaceAdmin();
                        toggleAlert("BRAVO", "L'utilisateur a bien été supprimé");
                    })
                }
            }
        })
    });

    return main

}



//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

export const DisponibilityBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Disponibilité des bus")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Afficher les bus disponibles selon la plage horaire :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

     // Begining
     create("label", form, "Début :")
     createChamp(form, "datetime-local", "StartDateTime")

     // End
     create("label", form, "Fin :")
     createChamp(form, "datetime-local", "EndDateTime")

     const btn = create("div", form, "Envoyer", ["submitButton"])
     btn.addEventListener("click", function(){

        let start = document.querySelector("input[name='StartDateTime']").value;
        let end = document.querySelector("input[name='EndDateTime']").value;

        axios.get("buses/buses.php?function=buses").then(function(response){

            let buses = response.data;
            let ul = document.querySelector("#lstBuses");
            if(ul){
                ul.remove()
            }
            ul = create("ul", main, "Liste des bus disponibles :", null, "lstBuses")
            
            for(let bus of buses){
                axios.get("buses/buses.php?function=available&id="+bus.id+"&beginning="+start+"&end="+end).then(function(response){
                    if(response.data){
                        create("li", ul, "Bus n°"+bus.id + " est disponible")
                    }
                })
            }
        })

     })
}

export const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'un bus ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisissez le type de bus :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to add
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        for(var bustype of response.data){
            let div = create("div", form)
            createChampRadio(div, bustype.id , "typeBus", bustype.id);
            var label = create("label", div, bustype.name );
            label.setAttribute("for", bustype.id);
        }
        // Creation of submit button
        const bouton = create("div", form, "Envoyer", ["submitButton"])
        bouton.addEventListener("click", function(){
            for(var type of document.querySelectorAll("input[name='typeBus']")){
                if (type.checked) {
                    axios.get(`buses/buses.php?function=create&type=`+type.value).then(function(){
                        toggleEspaceAdmin();
                        toggleAlert("BRAVO", "Le bus a bien été ajouté");
                    })
                }
            }
        })
    });

    return main

}

export const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'un bus ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisissez le bus à modifier :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to modify
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            let div = create("div", form)
            createChampRadio(div, bus.id , "idBus", bus.id);
            var label = create("label", div, bus.id );
            label.setAttribute("for", bus.id);
        }

        //Creation of the radio to choose the new type of the bus
        create("p", main, "Choisissez le type de bus :", ["presentation"])
        const form2 = create("form", main)

        axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
            for(var bustype of response.data){
                let div = create("div", form2)
                createChampRadio(div, bustype.id , "typeBus", bustype.id);
                var label = create("label", div, bustype.name );
                label.setAttribute("for", bustype.id);
            }
            // Creation of submit button
            const bouton = create("div", form, "Modifier", ["submitButton"])
            bouton.addEventListener("click", function(){

                function idBusModify () {
                    for (var bus of document.querySelectorAll("input[name='idBus']")) {
                        if (bus.checked) {
                            return bus.value;
                        }
                    }
                }

                function typeBusModify () {
                    for (var user of document.querySelectorAll("input[name='typeBus']")) {
                        if (user.checked) {
                            return user.value;
                        }
                    }
                }

                let id = idBusModify();
                let type = typeBusModify();

                let url = `buses/buses.php?function=updatebus&id=${id}&type=${type}`
                axios.get(url).then(function(){
                    toggleEspaceAdmin();
                    toggleAlert("BRAVO", "Le bus a bien été modifié");
                })
            })
        });
    });

    return main
}


export const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'un bus ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisissez le(s) bus à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the bus to add
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            let div = create("div", form)
            createChampCheckbox(div, bus.id , "idBus", bus.id);
            var label = create("label", div, bus.id );
            label.setAttribute("for", bus.id);
        }
        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.addEventListener("click", function (){
            for(var bus of document.querySelectorAll("input[name='idBus']")){
                let url = `buses/buses.php?function=delete&id=`;
                if (bus.checked) {
                    url += bus.value;
                    axios.get(url).then(function(){
                        toggleEspaceAdmin();
                        toggleAlert("BRAVO", "Le bus a bien été supprimé");
                    })
                }
            }
        })
    });

    return main
}