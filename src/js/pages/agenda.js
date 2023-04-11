import { calandar } from "../components/week";
import { toggleEspaceUser } from "./espaceUser";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { create } from "../main";

const drawAgenda = (user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("div", main, "<< Retour", ["return"])

    back.addEventListener("click", function(){
        const sessionData = JSON.parse(sessionStorage.getItem("userData"))
        if(sessionData["role"] == "Conducteur"){
            toggleEspaceUser()
        }
        else if(sessionData["role"] == "Responsable Logistique" || sessionData["role"] == "Directeur"){
            toggleEspaceAdmin()
        }
    })
    // agenda d'un utilisateur
    if(user.firstname){
        create("h2", main, "Agenda de " + user.firstname + " " + user.name.toUpperCase(), ['mainTitle'])
    }
    // agenda d'un bus
    else if(user.id_bus_type){
        create("h2", main, "Agenda du bus n°" + user.id, ['mainTitle'])
    }
    // agenda d'une ligne de bus
    else if(user.number){
        create("h2", main, "Agenda de la ligne " + user.number, ['mainTitle'])
    }
    // agenda personnel
    else{
        create("h2", main, "Votre Agenda", ['mainTitle'])
    }
    calandar(main, user)
    
    return main
}

export const toggleAgenda = (user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    let isUserConnected = JSON.parse(sessionStorage.getItem("userData"));

    if(isUserConnected) {
        drawAgenda(user)
    } else {
        create("h4", main, "connectez-vous")
    }
    return main
}