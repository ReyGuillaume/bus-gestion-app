import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleEspaceAdmin } from "./espaceAdmin";
import axios from 'axios';

// afficher la liste des users de type idtype
const drawUsers = (idtype) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const h2 = create("h2", main, null, ['mainTitle'])
    const ul = create("ul", main, null, ['lstUsers'])

    if(idtype == 2){
        h2.innerText = "Agenda des responsables logistiques"
        ul.innerText = "Liste des responsables logistiques :"
    }

    else if(idtype == 3){
        h2.innerText = "Agenda des chauffeurs"
        ul.innerText = "Liste des chauffeurs :"
    }

    // on récupère tous les users de la base de données, du type renseigné
    axios.get("users/users.php?function=bytype&type="+idtype).then(function(response){

        let users = response.data;
        
        for(let user of users){
            let li = create("li", ul)
            let a = create("div", li, user.firstname + " " + user.name.toUpperCase())
            a.addEventListener("click", function(){
                toggleAgenda(user)
            })
        }

        create("div", main, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)
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