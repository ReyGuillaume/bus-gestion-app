import { create, createChamp } from "../main";

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
    createChamp(form, type ="submit", value = "Envoyer");

    // Creation of submit button
    var bouton = document.createElement("input");
    bouton.setAttribute("type", "submit");
    bouton.setAttribute("value", "Envoyer");
    form.appendChild(bouton);


    return main

    

    
}