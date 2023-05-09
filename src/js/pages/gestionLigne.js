import { create, createChamp, createChampCheckbox, createChampRadio, toggleError } from "../utils/domManipulation";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked, countElementChecked } from "../utils/formGestion";
import { redirect } from "../utils/redirection";

import axios from 'axios';

//------------------------------------------------------- */
//   Gestion Lignes
//------------------------------------------------------- */

const toggleAddLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajout d'une Ligne ")
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
            createChampRadio(divRadioTypelines, "tl"+type.id_type , "selectionTypeLine", type.id_type);
            var label = create("label", divRadioTypelines, "Type - " + type.name);
            label.setAttribute("for", "tl"+type.id_type);
        }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){
        var id_type = valueFirstElementChecked("input[name='selectionTypeLine']");
        let number = document.querySelector("input[name='number']").value;
        let travel_time = document.querySelector("input[name='travel_time']").value;

        fetchUrlRedirectAndAlert(`lines/lines.php?function=create&number=${number}&travel_time=${travel_time}&id_type=${id_type}`, "/espace-admin", "La ligne a bien été ajoutée", "La ligne n'a pas pu être ajoutée")
    })
}

const toggleSupprLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Suppression d'une Ligne ")
    create("p", main, "Choisir la(les) ligne(s) à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the checkbox to define the user to delete
    axios.get(`lines/lines.php?function=lines`).then((response)=>{
        for(var line of response.data){
            let div = create("div", form, null, ["form-div-radio"])
            createChampCheckbox(div, "l"+line.number , "selectionLigne", line.number);
            var label = create("label", div, "Ligne " + line.number);
            label.setAttribute("for", "l"+line.number);
        }

        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.title = "Supprimer"
        bouton.addEventListener("click", function(){
            for(var line of document.querySelectorAll("input[name='selectionLigne']")){
                if (line.checked) {
                    fetchUrlRedirectAndAlert(`lines/lines.php?function=delete&number=${line.value}`, "/espace-admin", "La ligne a bien été supprimée", "La ligne n'a pas pu être supprimée")
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
            bouton.title = "Modifier"
            bouton.addEventListener("click", function(){
                let travel_time = document.querySelector("input[name='travel_time']").value;
                let number = document.querySelector("input[name='number']").value;
                fetchUrlRedirectAndAlert(`lines/lines.php?function=updateline&number=${number}&travel_time=${travel_time}`, "/espace-admin", "La ligne a bien été modifiée", "La ligne n'a pas pu être modifiée")
            })
        })
    })
    var label = create("label", container, "Ligne " + line.number);
    label.setAttribute("for", line.number);
}

const toggleModifLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Modification d'une Ligne ")
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
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Verification de couvertures des lignes")
    create("p", main, "Indiquez la semaine à vérifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Remplissage du formulaire 
    createChamp(form, "week", "semaine");

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){
        let semaine = document.querySelector("input[name='semaine']").value;
        fetchUrlRedirectAndAlert(`lines/lines.php?function=WeekCovered&week=${semaine}`, "/espace-admin", "Le semaine est bien couverte", "Il semblerait que tout ne soit pas bien rempli...")
    })
}

const toggleRemplissageAutoConduiteSemaine = () => {

    // Recuperation de la div à modifier 
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    // Mise en place des titres
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Remplissage automatique de la semaine")
    create("p", main, "Indiquer la semaine à remplir, attention cela ne prend pas en compte les créneaux de conduite déjà ajoutés", ["presentation"])


    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Remplissage du formulaire 
    createChamp(form, "week", "semaine");

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){
        let semaine = document.querySelector("input[name='semaine']").value;
        fetchUrlRedirectAndAlert(`lines/lines.php?function=coverWeek&week=${semaine}`, "/espace-admin", "Toutes les conduites de la semaine ont étées ajoutées", "Il semblerait que tout ne se soit pas passé comme prévu...")
    })
}


// TYPES DE LIGNES

// fonction qui renvoie un booléen indiquant si la plage horaire est vide
const PlageHoraireVide = (container) => {
    let debut = container.querySelector("input[name='StartDateTime']").value
    let fin = container.querySelector("input[name='EndDateTime']").value
    let intervalle = container.querySelector("input[name='intervalle']").value

    if(!debut || !fin || !intervalle){
        return true
    }
    else{
        return false
    }
}

const ToutesPlagesVides = (lst_plages) => {
    for(let plage of lst_plages){
        if(!PlageHoraireVide(plage)){
            return false
        }
    }
    return true
}

// fonction qui ajoute un formulaire de plage horaire
const createPlageHoraire = (container, supprimable=null) => {
    const div = create("div", container, null, ["plage-horaire"])

    create("label", div, "Heure de début :", ["label-info"])
    createChamp(div, "time", "StartDateTime")

    create("label", div, "Heure de fin :", ["label-info"])
    createChamp(div, "time", "EndDateTime")

    create("label", div, "Intervalle :", ["label-info"])
    createChamp(div, "integer", "intervalle")

    if(supprimable){
        const img = create("img", div, null, ["trash"])
        img.src = "src/assets/images/delete.png"
        img.addEventListener("click", () => div.remove())
    }
}

const toggleAddLineType = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajouter un type de ligne")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the champ
    const div_nom = create("div", form, null, ["form-div"])
    create("label", div_nom, "Entrez le nom du type de ligne :", ["label-info"])
    createChamp(div_nom, "integer", "nom")

    const plages_horaires = create("div", form, null, ["form-div"])

    // ajouter une plage horaire
    const add_btn = create("button", plages_horaires, "Ajouter une plage horaire de conduite", ["addButton", "unstyled-button"])
    add_btn.title = "Ajouter une plage horaire de conduite"
    add_btn.addEventListener("click", function(){
        createPlageHoraire(plages_horaires, true)
    })

    createPlageHoraire(plages_horaires)

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){

        const lst_plages = plages_horaires.querySelectorAll(".plage-horaire")
        var nom = document.querySelector("input[name='nom']").value

        if(ToutesPlagesVides(lst_plages)){
            toggleError("ERREUR", "Veuillez saisir des plages horaires")
        }
        else{
            if(nom){
                axios.get(`lines/lines.php?function=createtype&name=${nom}`).then(function(response){

                    if(response.data){

                        for(let plage of lst_plages){
                            let debut = plage.querySelector("input[name='StartDateTime']").value
                            let fin = plage.querySelector("input[name='EndDateTime']").value
                            let intervalle = plage.querySelector("input[name='intervalle']").value
                            if(debut && fin && intervalle){
                                fetchUrlRedirectAndAlert(`lines/lines.php?function=createcondition&name=${nom}&begin=${debut}&end=${fin}&intervalle=${intervalle}`, "/espace-admin", "Le type de ligne a bien été ajouté", "Certaines plages horaire entrent en collision")
                            }
                        }
                    }
                })
            }
            else{
                toggleError("ERREUR", "Veuillez renseigner un nom")
            }  
        }
    })
}


const toggleModifLineType = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Modifier un type de ligne")
    create("p", main, "Quel type de ligne souhaitez-vous modifier ?", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    axios.get(`lines/lines.php?function=typesline`).then(response => {
        
        for(var line of response.data){

            var div_line = create("div", form, null, ["form-div-radio"])

            create("div", div_line, line.name)
            createChampRadio(div_line, line.id_type, "selectionType", line.id_type).addEventListener("click", function(){

                // id du type de la ligne
                var id_type = valueFirstElementChecked("input[name='selectionType']")
                
                axios.get(`lines/lines.php?function=type&id=${id_type}`).then(function(res_type){
                    form.replaceChildren("")

                    create("div", form, "Liste des plages horaires du type de ligne choisi :", ["form-div"])

                    const plages_horaires = create("div", form, null, ["form-div"])

                    for(let plage of res_type.data){
                        let div_plage = create("div", plages_horaires, null, ["plage-horaire"])

                        create("label", div_plage, "Heure de début :", ["label-info"])
                        createChamp(div_plage, "time", "StartDateTime").value = plage.begin

                        create("label", div_plage, "Heure de fin :", ["label-info"])
                        createChamp(div_plage, "time", "EndDateTime").value = plage.end

                        create("label", div_plage, "Intervalle :", ["label-info"])
                        createChamp(div_plage, "integer", "intervalle").value = plage.intervalle

                        const img = create("img", div_plage, null, ["trash"])
                        img.src = "src/assets/images/delete.png"
                        img.addEventListener("click", () => div_plage.remove())
                    }

                    let prem_plage = plages_horaires.querySelector(".plage-horaire")
                    prem_plage.querySelector(".trash").remove()

                    // Creation of submit button
                    const bouton = create("button", form, "Modifier", ["submitButton", "unstyled-button"])
                    bouton.title = "Modifier"
                    bouton.addEventListener("click", async function(){

                        await axios.get(`lines/lines.php?function=deleteconditions&id=${id_type}`)
                        
                        const lst_plages = plages_horaires.querySelectorAll(".plage-horaire")

                        for(let plage of lst_plages){
                            let debut = plage.querySelector("input[name='StartDateTime']").value
                            let fin = plage.querySelector("input[name='EndDateTime']").value
                            let intervalle = plage.querySelector("input[name='intervalle']").value
                            fetchUrlRedirectAndAlert(`lines/lines.php?function=updatecondition&id=${id_type}&begin=${debut}&end=${fin}&intervalle=${intervalle}`, "/espace-admin", "Le type de ligne a bien été modifié", "Certaines plages horaire entrent en collision")
                        }
                    })
                })
            })
        }
   })
}


// delete the line types who are checked
const deleteTypesChecked = () => {
    for(var type of document.querySelectorAll("input[name='selectionType']")){
        if (type.checked) {
            let url = `lines/lines.php?function=deletetype&id=${type.value}`;
            fetchUrlRedirectAndAlert(url, "/espace-admin", "Le type de ligne a bien été supprimé", "Le type de ligne n'a pas pu être supprimé")
        }
    }
}

const toggleSupprLineType = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Supprimer un type de ligne")
    create("p", main, "Quel(s) type(s) de ligne souhaitez-vous supprimer ?", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    axios.get(`lines/lines.php?function=typesline`).then(response => {
        
        for(var line of response.data){

            var div_line = create("div", form, null, ["form-div-radio"])

            create("div", div_line, line.name + " ")
            createChampCheckbox(div_line, line.id_type, "selectionType", line.id_type)
        }
        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.title = "Supprimer"
        bouton.addEventListener("click", function(){
            if(countElementChecked("selectionType") == 0){
                toggleError("ERREUR", "Veuillez sélectionner au moins un type")
            }
            else{
                deleteTypesChecked()
            }
        })
    })
}

export {
    toggleAddLine,
    toggleSupprLine,
    toggleModifLine,
    toggleVerifCouvertureSemaine,
    toggleRemplissageAutoConduiteSemaine,
    toggleAddLineType,
    toggleModifLineType,
    toggleSupprLineType
}