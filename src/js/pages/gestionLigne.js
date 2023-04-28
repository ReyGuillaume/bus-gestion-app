import { create, createChamp, createChampCheckbox, createChampRadio } from "../utils/domManipulation";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked, createCheckboxOfElement } from "../utils/formGestion";

import axios from 'axios';

//------------------------------------------------------- */
//   Gestion Lignes
//------------------------------------------------------- */

const toggleAddLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'une Ligne ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the champ
    const div_num = create("div", form, null, ["form-div"])
    create("label", div_num, "Entrez le numero de la ligne à rentrer :", ["label-info"]);
    createChamp(div_num, "integer", "number");

    const div_tps = create("div", form, null, ["form-div"])
    create("label", div_tps, "Entrez la durée d'un trajet sur cette ligne (en minutes) :", ["label-info"]);
    createChamp(div_tps, "integer", "travel_time");

    //Creation of the radio to choose the type of the Line 
    var divRadioTypelines = create("div", form);
    axios.get(`lines/lines.php?function=typesline`).then((response)=>{
        for(var type of response.data){
            create("br", divRadioTypelines);
            createChampRadio(divRadioTypelines, type.id_type , "selectionTypeLine", type.id_type);
            var label = create("label", divRadioTypelines, "Type - " + type.name);
            label.setAttribute("for", type.id_type);
        }
    });

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function(){
        var id_type = valueFirstElementChecked("input[name='selectionTypeLine']");
        let number = document.querySelector("input[name='number']").value;
        let travel_time = document.querySelector("input[name='travel_time']").value;

        fetchUrlRedirectAndAlert(`lines/lines.php?function=create&number=${number}&travel_time=${travel_time}&id_type=${id_type}`, toggleEspaceAdmin, "La ligne a bien été ajoutée", "La ligne n'a pas pu être ajoutée")
    })
}

const toggleSupprLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'une Ligne ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisir la(les) ligne(s) à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the checkbox to define the user to delete
    axios.get(`lines/lines.php?function=lines`).then((response)=>{
        for(var line of response.data){
            let div = create("div", form, null, ["form-div-radio"])
            createChampCheckbox(div, line.number , "selectionLigne", line.number);
            var label = create("label", div, "Ligne " + line.number);
            label.setAttribute("for", line.number);
        }

        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.addEventListener("click", function(){
            for(var line of document.querySelectorAll("input[name='selectionLigne']")){
                if (line.checked) {
                    fetchUrlRedirectAndAlert(`lines/lines.php?function=delete&number=${line.value}`, toggleEspaceAdmin, "La ligne a bien été supprimée", "La ligne n'a pas pu être supprimée")
                }
            }
        })
   })
}

const createLineRadio = (form, container, line) => {
    //Ajout d'un evenement au clic d'un radio
    createChampRadio(container, line.number , "selectionLigne", line.number)
    .addEventListener('click', function(){
        // Recuperation de la ligne a modifier
        var numberligneToModify = valueFirstElementChecked("input[name='selectionLigne']");
        
        axios.get(`lines/lines.php?function=line&number=${numberligneToModify}`).then((responseLine) =>{
           
            // Creation du formulaire pré remplie de modif de ligne 
            form.replaceChildren("")

            const div_num = create("div", form, null, ["form-div"])
            create("label", div_num, "Numero de la ligne :", ["form-info"]);
            createChamp(div_num, "integer", "number").value = responseLine.data.number;

            const div_tps = create("div", form, null, ["form-div"])
            create("label", div_tps, "Durée d'un trajet sur cette ligne (en minutes) :", ["form-info"]);
            createChamp(div_tps, "integer", "travel_time").value = responseLine.data.travel_time;

            // Creation of submit button
            const bouton = create("div", form, "Modifier", ["submitButton"])
            bouton.addEventListener("click", function(){
                let travel_time = document.querySelector("input[name='travel_time']").value;
                let number = document.querySelector("input[name='number']").value;
                fetchUrlRedirectAndAlert(`lines/lines.php?function=updateline&number=${number}&travel_time=${travel_time}`, toggleEspaceAdmin, "La ligne a bien été modifiée", "La ligne n'a pas pu être modifiée")
            })
        })
    })
    var label = create("label", container, "Ligne " + line.number);
    label.setAttribute("for", line.number);
}

const toggleModifLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'une Ligne ")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Choisir la ligne à modifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

   // Recuperation de toutes les lignes 
   axios.get(`lines/lines.php?function=lines`).then(response => {
        for(var line of response.data){
            var div_line = create("div", form, null, ["form-div-radio"])
            createLineRadio(form, div_line, line)
        }
   })
}

const toggleVerifCouvertureSemaine = () => {

    // Recuperation de la div à modifier 
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    // Mise en place des titres
    create("h2", main, "Verification de couvertures des lignes")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Indiquez la semaine à vérifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Remplissage du formulaire 
    createChamp(form, "week", "semaine");

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function(){
        let semaine = document.querySelector("input[name='semaine']").value;
        fetchUrlRedirectAndAlert(`lines/lines.php?function=WeekCovered&week=${semaine}`, toggleEspaceAdmin, "Le semaine est bien couverte", "Il semblerait que tout ne soit pas bien rempli...")
    })

}

const toggleRemplissageAutoConduiteSemaine = () => {

    // Recuperation de la div à modifier 
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    // Mise en place des titres
    create("h2", main, "Remplissage automatique de la semaine")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Indiquer la semaine à remplir, attention cela supprime les créneaux de conduite déjà ajoutés", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Remplissage du formulaire 
    createChamp(form, "week", "semaine");

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function(){
        let semaine = document.querySelector("input[name='semaine']").value;
        fetchUrlRedirectAndAlert(`lines/lines.php?function=coverWeek&week=${semaine}`, toggleEspaceAdmin, "Toutes les conduites de la semaine ont étées ajoutées", "Il semblerait que tout ne se soit pas passé comme prévu...")
    })
}

export {
    toggleAddLine,
    toggleSupprLine,
    toggleModifLine,
    toggleVerifCouvertureSemaine,
    toggleRemplissageAutoConduiteSemaine
}