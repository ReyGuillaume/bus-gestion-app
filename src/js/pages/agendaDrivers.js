import { create } from "../main";
import { toggleAgenda } from "./agenda";
import axios from 'axios';

// afficher la liste des chauffeurs
const drawDrivers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Agenda des chauffeurs", ['mainTitle'])

    const ul = create("ul", main, "Liste des chauffeurs :", ['lstDrivers'])

    // on récupère tous les chauffeurs de la base de données
    axios.get("users/users.php?function=bytype&type=3").then(function(response){

        let drivers = response.data;
        
        for(let driver of drivers){
            let li = create("li", ul)
            let a = create("a", li, driver.firstname + " " + driver.name.toUpperCase())
            a.addEventListener("click", function(){
                toggleAgenda(driver)
            })
        }
    })
    
    return main
}

export const toggleDrivers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))

    // si l'utilisateur n'est pas connecté
    if(!sessionData){
        window.location.href = "/"
    }
    // si l'utilisateur est un chauffeur
    else if(sessionData['role'] != "Responsable Logistique" && sessionData["role"] != "Directeur"){
        window.location.href = "/"
    }
    else{
        drawDrivers()
    }
    return main
}