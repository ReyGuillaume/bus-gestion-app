import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleIndisponibilitiForm } from "../pages/indisponibilitiForm"
import {toggleNotificationCenter} from "./notificationCenter.js";
import { createMenuElement } from "../components/menuItem";

const toggleEspaceUser = () => {
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
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar_User'])

    // agenda
    createMenuElement(nav, toggleAgenda, "rose", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // signaler indispo
    createMenuElement(nav, toggleIndisponibilitiForm, "jaune", "src/assets/images/nav_creneau.png", "Signaler un creneau d'indisponibilité", "Signaler un creneau d'indisponibilité")

    // notif
    createMenuElement(nav, toggleNotificationCenter, "orange", "src/assets/images/nav_notif.png", "Afficher les notifications", "Afficher les notifications")
    
    return main
}

export { toggleEspaceUser }