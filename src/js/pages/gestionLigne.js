import { create, createChamp, createChampCheckbox, createChampRadio } from "../main";

import axios from 'axios';


//------------------------------------------------------- */
//   Gestion Lignes
//------------------------------------------------------- */

export const toggleAddLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'une Ligne ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the champ
    create("label", form, "Entrez le numero de la ligne à rentrer :");
    createChamp(form, "integer", "number");
    create("br", form);
    create("label", form, "Entrez la durée d'un trajet sur cette ligne en minute:");
    createChamp(form, "integer", "travel_time");
    create("br", form);




    // Creation of submit button
}