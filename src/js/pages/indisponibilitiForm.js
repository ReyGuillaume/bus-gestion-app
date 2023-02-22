import { create, createChamp } from "../main";
import axios from 'axios';

export const toggleIndisponibilitiForm = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Ajout de crénaux d'indisponibilité")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)
    //form.setAttribute("method", "post");
    //form.setAttribute("action", "");

    // Creation of each champ
    create("label", form, "Entrez la date de début de l'indisponibilité :");
    createChamp(form, "datetime-local", "StartDateTime");
    create("br", form);
    create("label", form, "Entrez la date de fin de l'indisponibilité :");
    createChamp(form, "datetime-local", "EndDateTime");
    
    create("br", form);


    // Creation of submit button
    //var bouton = document.createElement("input");
    //bouton.setAttribute("type", "submit");
    //bouton.setAttribute("value", "Envoyer");
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        let idUser = 1;
        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
        console.log(StartDateTime);
        console.log(EndDateTime);

        axios.get(`timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${3}&users=${idUser}&buses=${0}`)


    });
    form.appendChild(bouton);


    return main

    

    
}

