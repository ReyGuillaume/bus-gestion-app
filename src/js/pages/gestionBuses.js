import { create, createChamp, createChampCheckbox, createChampRadio, toggleAlert, toggleError } from "../main";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { toggleAgenda } from "./agenda";
import { valueFirstElementChecked } from "../utils/formGestion";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

export const DisponibilityBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Disponibilité des bus")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
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
                        create("li", ul, "Bus n°"+bus.id + " est disponible").addEventListener("click", function(){
                            toggleAgenda(bus)
                        })
                    }
                })
            }
        })
    })
}

export const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'un bus ")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the radio to define the bus to add
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadio, bustype.name );
            label.setAttribute("for", bustype.id);
            

          }
    });
    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function (event){
        for(var type of document.querySelectorAll("input[name='typeBus']")){
            if (type.checked) {
                axios.get(`buses/buses.php?function=create&type=`+type.value).then(function(response){
                    toggleEspaceAdmin()
                    if(response.data){
                        toggleAlert("BRAVO", "Le bus a bien été ajouté")
                    }
                    else{
                        toggleError("ERREUR", "Le bus n'a pas pu être ajouté")
                    }
                })
            }
        }
    })
    form.appendChild(bouton);

    return main

}


export const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'un bus ")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the radio to define the bus to modify
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le bus à modifier :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        console.log(response);
        for(var bus of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bus.id , "idBus", bus.id);
            var label = create("label", divRadio, bus.id );
            label.setAttribute("for", bus.id);
          }
    });

    //Creation of the radio to choose the new type of the bus

    var divRadioType = create("div", form);
    create("label", divRadioType, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadioType);
            createChampRadio(divRadioType, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadioType, bustype.name );
            label.setAttribute("for", bustype.id);
          }
    });
    // Creation of submit button
    const bouton = create("div", form, "Modifier", ["submitButton"])
    bouton.addEventListener("click", function (){

        let id = valueFirstElementChecked("input[name='idBus']");
        let type = valueFirstElementChecked("input[name='typeBus']");

        let url = `buses/buses.php?function=updatebus&id=${id}&type=${type}`
        axios.get(url).then(function(response){
            toggleEspaceAdmin()
            if(response.data){
                toggleAlert("BRAVO", "Le bus a bien été modifié")
            }
            else{
                toggleError("ERREUR", "Le bus n'a pas pu être modifié")
            }
        })

    })

    return main
}


export const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'un bus ")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main)

    // Creation of the checkbox to define the bus to add
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez le(s) bus à supprimer :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        for(var bus of response.data){
            create("br", divCheckboxBus);
            createChampCheckbox(divCheckboxBus, bus.id , "idBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id );
            label.setAttribute("for", bus.id);
          }
    });
    // Creation of submit button
    const bouton = create("div", form, "Supprimer", ["submitButton"])
    bouton.addEventListener("click", function (event){
        for(var bus of document.querySelectorAll("input[name='idBus']")){
            let url = `buses/buses.php?function=delete&id=`;
            if (bus.checked) {
                url += bus.value;
                axios.get(url).then(function(response){
                    toggleEspaceAdmin()
                    if(response.data){
                        toggleAlert("BRAVO", "Le bus a bien été supprimé")
                    }
                    else{
                        toggleError("ERREUR", "Le bus n'a pas pu être supprimé")
                    }
                })
            }
        }
    })

    return main
}