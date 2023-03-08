import { create } from "../main";
import { toggleAgenda } from "./agenda";

import { toggleIndisponibilitiForm, toggleSupprIndispo } from "../pages/indisponibilitiForm"

export const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // si l'utilisateur n'est pas connecté
    if(!sessionData){
        window.location = "/"
    }
    // si l'utilisateur n'est pas un chauffeur
    else if(sessionData["role"] != "Conducteur"){
        window.location = "/"
    }

    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir mon agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, "Signaler un creneau d'indisponibilité", ['navBar__item']).addEventListener("click", toggleIndisponibilitiForm)
    create("div", nav, "Supprimer un creneau d'indisponibilité", ['navBar__item']).addEventListener("click", toggleSupprIndispo)
    
    return main
}

