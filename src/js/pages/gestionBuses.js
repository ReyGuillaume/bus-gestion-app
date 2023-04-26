import { create, createChamp } from "../utils/domManipulation";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { toggleAgenda } from "./agenda";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked, createCheckboxOfElement } from "../utils/formGestion";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

const DisponibilityBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("h2", main, "Disponibilité des bus")
    create("p", main, "Afficher les bus disponibles selon la plage horaire :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

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
            ul = create("ul", form, "Liste des bus disponibles :", ["ul-info"], "lstBuses")
            
            for(let bus of buses){
                axios.get("buses/buses.php?function=available&id="+bus.id+"&beginning="+start+"&end="+end)
                .then(function(response){
                    if(response.data){
                        create("li", ul, "Bus n°"+bus.id + " est disponible")
                    }
                })
            }
        })
    })
}

const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("h2", main, "Ajout d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the radio to define the bus to add
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then(response => response.data.forEach(bustype => createCheckboxOfElement(divRadio, bustype, "typeBus")))

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function (){
        for(var type of document.querySelectorAll("input[name='typeBus']")){
            if (type.checked) {
                fetchUrlRedirectAndAlert(`buses/buses.php?function=create&type=${type.value}`, toggleEspaceAdmin, "Le bus a bien été ajouté", "Le bus n'a pas pu être ajouté")
            }
        }
    })
}

const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("h2", main, "Modification d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the radio to define the bus to modify
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le bus à modifier :");
    axios.get(`buses/buses.php?function=buses`).then(response => response.data.forEach(bus => createCheckboxOfElement(divRadio, bus, "idBus")))

    //Creation of the radio to choose the new type of the bus
    var divRadioType = create("div", form);
    create("label", divRadioType, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then(response => response.data.forEach(bustype => createCheckboxOfElement(divRadioType, bustype, "typeBus")))

    // Creation of submit button
    const bouton = create("div", form, "Modifier", ["submitButton"])
    bouton.addEventListener("click", function (){
        let id = valueFirstElementChecked("input[name='idBus']");
        let type = valueFirstElementChecked("input[name='typeBus']");
        let url = `buses/buses.php?function=updatebus&id=${id}&type=${type}`
        fetchUrlRedirectAndAlert(url, toggleEspaceAdmin, "Le bus a bien été modifié", "Le bus n'a pas pu être modifié")
    })
}

const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("h2", main, "Suppression d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the checkbox to define the bus to add
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez le(s) bus à supprimer :");
    axios.get(`buses/buses.php?function=buses`).then(response => response.data.forEach(bus => createCheckboxOfElement(divCheckboxBus, bus, "idBus")))

    // Creation of submit button
    const bouton = create("div", form, "Supprimer", ["submitButton"])
    bouton.addEventListener("click", function (){
        for(var bus of document.querySelectorAll("input[name='idBus']")){
            let url = `buses/buses.php?function=delete&id=`;
            if (bus.checked) {
                url += bus.value;
                fetchUrlRedirectAndAlert(url, toggleEspaceAdmin, "Le bus a bien été supprimé", "Le bus n'a pas pu être supprimé")
            }
        }
    })
}

export {
    DisponibilityBus,
    ModifBus,
    SupprimerBus,
    AjoutBus,
}