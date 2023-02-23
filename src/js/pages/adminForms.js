import { create, createChamp, createChampCheckbox, createChampRadio } from "../main";

import axios from 'axios';

export const toggleAddCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout de crénaux")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)
    //form.setAttribute("method", "post");
    //form.setAttribute("action", "timeslots.php");

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
            createChampRadio(divRadio, type.name , "type", type.id);
            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
          }
    });


    // Creation of the checkbox to define the bus involved in the timeslot
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Coisissez les bus participants :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id);
            label.setAttribute("for", bus.id);
          }
    });

    // Creation of the checkbox to define the users involved in the timeslot
    var divCheckboxUsers = create("div", form);
    create("label", divCheckboxUsers, "Coisissez les participants :");
    axios.get(`users/users.php?function=users`).then((response)=>{
        console.log(response);
        for(var user of response.data){
            createChampCheckbox(divCheckboxUsers, user.id , "selectionBus", user.id);
            var label = create("label", divCheckboxUsers, user.id);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        event.preventDefault();
        let idUser = 1;
        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
        axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
            for(var type of response.data){
                let type = document.querySelector("input[name='type']").checked;
            }
        });

        console.log(StartDateTime);
        console.log(EndDateTime);
        console.log(type);

        axios.get(`timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}&users=${idUser}&buses=${0}`)
    })
    form.appendChild(bouton);
    
    
    
    

    return main

    

    
}