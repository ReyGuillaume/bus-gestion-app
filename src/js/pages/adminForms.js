import { create, createChamp, createChampRadio } from "../main";

import axios from 'axios';

export const toggleAddCreneau = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout de crénaux")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)
    form.setAttribute("method", "post");
    form.setAttribute("action", "timeslots.php");

    // Creation of each champ
    create("label", form, "Entrez la date de début du créneau :");
    createChamp(form, "datetime-local", "StartDateTime");
    create("br", form);
    create("label", form, "Entrez la date de fin du creneau :");
    createChamp(form, "datetime-local", "EndDateTime");
    create("br", form);

    

    // Creation of the radio to define the type of the timeslot
    var divRadio = create("div", form);
    create("label", form, "Coisissez le type du créneau :");
    axios.get(`timeslots/timeslots.php?function=types`).then((response)=>{
        for(var type of response.data){
            createChampRadio(divRadio, type.name , "type", type.id);
            var label = create("label", divRadio, type.name);
            label.setAttribute("for", type.name);
          }
    });


    // Creation of submit button
    var bouton = document.createElement("input");
    bouton.setAttribute("type", "submit");
    bouton.setAttribute("value", "Envoyer");
    form.appendChild(bouton);
    
    
    
    

    return main

    

    
}