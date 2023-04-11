import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleEspaceAdmin } from "./espaceAdmin";
import axios from 'axios';

// afficher la liste des users de type idtype
const drawUsers = (idtype) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const h2 = create("h2", main, null, ['mainTitle'])
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    const titre = create("div", main, "", ["presentation"])
    const ul = create("ul", main, null, ['navBar'])

    if(idtype == 2){
        h2.innerText = "Agenda des responsables logistiques"
        titre.innerText = "Liste des responsables logistiques :"
    }

    else if(idtype == 3){
        h2.innerText = "Agenda des chauffeurs"
        titre.innerText = "Liste des chauffeurs :"
    }

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("users/users.php?function=bytype&type="+idtype).then(function(response){

        let users = response.data;
        
        for(let user of users){
            let li = create("li", ul, null, ["navBar__item"])
            let a = create("div", li, user.firstname + " " + user.name.toUpperCase())
            a.addEventListener("click", function(){
                toggleAgenda(user)
            })
        }
    })
    
    return main
}

// fonction qui réclame l'affichage de la liste des chauffeurs de bus
export const toggleDrivers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    drawUsers(3)
    
    return main
}

// fonction qui réclame l'affichage de la liste des responsables logistiques
export const toggleResp = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    drawUsers(2)
    
    return main
}

// afficher l'agenda des bus
export const toggleBuses = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Agenda des bus", ['mainTitle'])
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("div", main, "Liste des bus :", ["presentation"])
    const ul = create("ul", main, null, ["navBar"])

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("buses/buses.php?function=buses").then(function(response){

        let buses = response.data;
        
        for(let bus of buses){
            axios.get("buses/buses.php?function=bus&id="+bus.id).then(function(responseBus){
                let li = create("li", ul, null, ["navBar__item"])
                let a = create("div", li, "Bus n°" + responseBus.data.id + " (" + responseBus.data.nb_places + " places)")
                a.addEventListener("click", function(){
                    toggleAgenda(bus)
                })
            })
        }
    })
    
    return main
}

// fonction qui prend en paramètres un nombre de minutes (int) et renvoie le temps en heures (string)
const convertMinutesToTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;
  
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (remainingMinutes < 10) {
      remainingMinutes = "0" + remainingMinutes;
    }
  
    return hours + "h" + remainingMinutes;
  }

// afficher l'agenda des lignes de bus
export const toggleLines = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Agenda des lignes de bus", ['mainTitle'])
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("div", main, "Liste des lignes de bus :", ["presentation"])
    const ul = create("ul", main, null, ['navBar'])

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("lines/lines.php?function=lines").then(function(response){

        let lines = response.data;
        
        for(let line of lines){
            let li = create("li", ul, null, ["navBar__item"])
            let a = create("div", li, "Ligne " + line.number + " (" + convertMinutesToTime(line.travel_time) + " de trajet)")
            a.addEventListener("click", function(){
                toggleAgenda(line)
            })
        }
    })
    
    return main
}