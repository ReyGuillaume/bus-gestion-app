import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { convertMinutesToTime } from "../utils/dates"
import { redirectUser, redirect } from "../utils/redirection";
import axios from 'axios';

const createListeItem = (ul, elem, itemText, color) => {
    let li = create("li", ul, null, [color])
    let div = create("div", li, itemText)
    div.onclick = () => toggleAgenda(elem)
}

// afficher la liste des users de type idtype
const drawUsers = (idtype) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    
    if(idtype == 2){
        create("h2", main, "Agenda des responsables logistiques", ['mainTitle'])
        create("div", main, "Liste des responsables logistiques :", ["presentation"])
    } else if(idtype == 3){
        create("h2", main, "Agenda des chauffeurs", ['mainTitle'])
        create("div", main, "Liste des chauffeurs :", ["presentation"])
    }
    
    const ul = create("ul", main, null, ['navBar'])
    // on récupère tous les users de la base de données, du type renseigné
    axios.get("users/users.php?function=bytype&type="+idtype).then(function(response){
        let users = response.data;

        users.forEach(user => createListeItem(ul, user, `${user.firstname} ${user.name.toUpperCase()}`, "liste_users_"+idtype))

        if(idtype == 3){
            create("div", main, "Vision globale", ["submitButton"]).onclick = () => toggleAgenda(undefined, undefined, true)
        }
    })
    
    return main
}

// fonction qui réclame l'affichage de la liste des chauffeurs de bus
const toggleDrivers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    drawUsers(3)
}

// fonction qui réclame l'affichage de la liste des responsables logistiques
const toggleResp = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    drawUsers(2)
}

// afficher l'agenda des bus
const toggleBuses = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    create("h2", main, "Agenda des bus", ['mainTitle'])
    create("div", main, "Liste des bus :", ["presentation"])
    const ul = create("ul", main, null, ["navBar"])

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("buses/buses.php?function=buses").then(function(response){

        let buses = response.data;
        
        for(let bus of buses){
            axios.get("buses/buses.php?function=bus&id="+bus.id).then(function(responseBus){

                let bus = responseBus.data
                createListeItem(ul, bus, `Bus n°${bus.id} (${bus.nb_places} places)`, "liste_bus")
            })
        }
    })
}


// afficher l'agenda des lignes de bus
const toggleLines = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    // redirection vers l'accueil si user n'est pas connecté
    redirectUser(
        () => null, 
        () => null, 
        () => null, 
        () => redirect("/")
    )

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    create("h2", main, "Agenda des lignes de bus", ['mainTitle'])
    create("div", main, "Liste des lignes de bus :", ["presentation"])
    const ul = create("ul", main, null, ['navBar'])

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("lines/lines.php?function=lines").then(function(response){
        let lines = response.data;
        lines.forEach(line => createListeItem(ul, line, `Ligne ${line.number} (${convertMinutesToTime(line.travel_time)} de trajet)`, "liste_lignes"))
    })
}

export {
    toggleDrivers,
    toggleBuses,
    toggleResp,
    toggleLines
}