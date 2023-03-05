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
    
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
        let user = JSON.parse(sessionStorage.getItem("userData")).id;

        let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=3&users=${user}`
        axios.get(url)

    });
    form.appendChild(bouton);


    return main

    

    
}

