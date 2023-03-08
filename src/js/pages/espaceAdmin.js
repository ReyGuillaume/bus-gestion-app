import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleAddCreneau,toggleSupprimeCreneau,toggleModifCreneau, toggleAjoutUser, toggleSupprimeUser, AjoutBus, SupprimerBus, ModifBus, toggleModifyUser } from "../pages/adminForms";
import { toggleAddLine, toggleSupprLine, toggleModifLine } from "./gestionLigne";
import { toggleDrivers } from "./agendaUsers";
import { toggleResp } from "./agendaUsers";


export const toggleEspaceAdmin = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // si l'utilisateur n'est pas connecté
    if(!sessionData){
        window.location = "/"
    }
    // si l'utilisateur est un chauffeur
    else if(sessionData["role"] == "Conducteur"){
        window.location = "/"
    }

    create("h2", main, "Bienvenue sur votre espace Admin")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir mon agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, "Voir l'agenda des chauffeurs", ['navBar__item']).addEventListener("click", toggleDrivers)
    if(sessionData["role"] == "Directeur"){
        create("div", nav, "Voir l'agenda des responsables logistiques", ['navBar__item']).addEventListener("click", toggleResp)
    }
    create("div", nav, "Ajouter un creneau", ['navBar__item']).addEventListener("click", toggleAddCreneau)
    create("div", nav, "Gérer les créneaux", ['navBar__item']).addEventListener("click", toggleGestionTimeslots)
    create("div", nav, 'Gérer les utilisateurs', ['navBar__item']).addEventListener("click", toggleGestionUsers)
    create("div", nav, 'Gérer les bus', ['navBar__item']).addEventListener("click", toggleGestionBus)
    create("div", nav, 'Gérer les lignes', ['navBar__item']).addEventListener("click", toggleGestionLigne)

    return main
}

export const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des utilisateurs")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Ajouter un utilisateur', ['navBar__item']).addEventListener("click", toggleAjoutUser)
    create("div", nav, "Modifier un utilisateur", ['navBar__item']).addEventListener("click", toggleModifyUser)
    create("div", nav, "Supprimer un utilisateur", ['navBar__item']).addEventListener("click", toggleSupprimeUser)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)

    return main
}

export const toggleGestionBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Bus")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Ajouter un bus', ['navBar__item']).addEventListener("click", AjoutBus)
    create("div", nav, "Modifier un bus", ['navBar__item']).addEventListener("click", ModifBus)
    create("div", nav, "Supprimer un bus", ['navBar__item']).addEventListener("click", SupprimerBus)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)

    return main
}

export const toggleGestionTimeslots = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Créneaux")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, "Ajouter un Creneau", ['navBar__item']).addEventListener("click", toggleAddCreneau)
    create("div", nav, "Modifier un Creneau", ['navBar__item']).addEventListener("click", toggleModifCreneau)
    create("div", nav, "Supprimer un Creneau", ['navBar__item']).addEventListener("click", toggleSupprimeCreneau)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)

    return main
}



export const toggleGestionLigne = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Lignes")
    create("p", main, "Que souhaitez-vous faire ?")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, "Ajouter une Ligne", ['navBar__item']).addEventListener("click", toggleAddLine)
    create("div", nav, "Modifier une Ligne", ['navBar__item']).addEventListener("click", toggleModifLine)
    create("div", nav, "Supprimer une Ligne", ['navBar__item']).addEventListener("click", toggleSupprLine)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)

    return main
}