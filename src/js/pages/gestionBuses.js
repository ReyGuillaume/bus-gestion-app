import { create, createChamp } from "../utils/domManipulation";
import { redirect } from "../utils/redirection";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked, createCheckboxOfElement } from "../utils/formGestion";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

const DisponibilityBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")){
        redirect("/")
    }else{
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/bus"))
    back.title = "Retour en arrière"

    create("h2", main, "Disponibilité des bus")
    create("p", main, "Afficher les bus disponibles selon la plage horaire :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Begining
    const div_debut = create("div", form, null, ["form-div"])
    create("label", div_debut, "Début : ", ["label-info"])
    createChamp(div_debut, "datetime-local", "StartDateTime")

    // End
    const div_fin = create("div", form, null, ["form-div"])
    create("label", div_fin, "Fin : ", ["label-info"])
    createChamp(div_fin, "datetime-local", "EndDateTime")

    const btn = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    btn.title = "Envoyer"
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
    })}
}

const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")){
        redirect("/")
    }else {
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/bus"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajout d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the radio to define the bus to add
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de bus : ", ["label-info"]);
    axios.get(`buses/buses.php?function=bustypes`).then(response => response.data.forEach(bustype => createCheckboxOfElement(divRadio, bustype.name, bustype.id, "typeBus","tb")))

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function (){
        for(var type of document.querySelectorAll("input[name='typeBus']")){
            if (type.checked) {
                fetchUrlRedirectAndAlert(`buses/buses.php?function=create&type=${type.value}`, "/bus", "Le bus a bien été ajouté", "Le bus n'a pas pu être ajouté")
            }
        }
    })}
}

const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")){
        redirect("/")
    }else{
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/bus"))
    back.title = "Retour en arrière"

    create("h2", main, "Modification d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the radio to define the bus to modify
    var divRadio = create("div", form, null, ["form-div-radio"]);
    create("label", divRadio, "Choisissez le bus à modifier : ", ["label-info"]);
    axios.get(`buses/buses.php?function=buses`).then(response => response.data.forEach(bus => createCheckboxOfElement(divRadio, bus.id, bus.id, "idBus", "b")))

    //Creation of the radio to choose the new type of the bus
    var divRadioType = create("div", form, null, ["form-div-radio"]);
    create("label", divRadioType, "Choisissez le type de bus : ", ["label-info"]);
    axios.get(`buses/buses.php?function=bustypes`).then(response => response.data.forEach(bustype => createCheckboxOfElement(divRadioType, bustype.name, bustype.id, "typeBus", "tb")))

    // Creation of submit button
    const bouton = create("button", form, "Modifier", ["submitButton", "unstyled-button"])
    bouton.title = "Modifier"
    bouton.addEventListener("click", function (){
        let id = valueFirstElementChecked("input[name='idBus']");
        let type = valueFirstElementChecked("input[name='typeBus']");
        let url = `buses/buses.php?function=updatebus&id=${id}&type=${type}`
        fetchUrlRedirectAndAlert(url, "/bus", "Le bus a bien été modifié", "Le bus n'a pas pu être modifié")
    })}
}

const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")){
        redirect("/")
    }else {
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/bus"))
    back.title = "Retour en arrière"

    create("h2", main, "Suppression d'un bus ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the checkbox to define the bus to add
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez le(s) bus à supprimer : ", ["label-info"]);
    axios.get(`buses/buses.php?function=buses`).then(response => response.data.forEach(bus => createCheckboxOfElement(divCheckboxBus, bus.id, bus.id, "idBus", "b")))

    // Creation of submit button
    const bouton = create("button", form, "Supprimer", ["submitButton", "unstyled-button"])
    bouton.title = "Supprimer"
    bouton.addEventListener("click", function (){
        for(var bus of document.querySelectorAll("input[name='idBus']")){
            let url = `buses/buses.php?function=delete&id=`;
            if (bus.checked) {
                url += bus.value;
                fetchUrlRedirectAndAlert(url, "/bus", "Le bus a bien été supprimé", "Le bus n'a pas pu être supprimé")
            }
        }
    })}
}

export {
    DisponibilityBus,
    ModifBus,
    SupprimerBus,
    AjoutBus,
}