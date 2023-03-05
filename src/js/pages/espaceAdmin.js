import { create } from "../main";
import { toggleAgenda } from "../pages/agenda";
import { toggleAddCreneau,toggleSupprimeCreneau, toggleAjoutUser, toggleSupprimeUser, AjoutBus, SupprimerBus, ModifBus } from "../pages/adminForms";
import { toggleAddLine } from "../pages/gestionLigne";

export const toggleEspaceAdmin = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Bienvenue sur votre espace Admin")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir mon agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, "Ajouter un creneau", ['navBar__item']).addEventListener("click", toggleAddCreneau)
    create("div", nav, "Gerer les créneaux", ['navBar__item']).addEventListener("click", toggleGestionTimeslots)
    create("div", nav, 'Gerer les utilisateurs', ['navBar__item']).addEventListener("click", toggleGestionUsers)
    create("div", nav, 'Gerer les bus', ['navBar__item']).addEventListener("click", toggleGestionBus)
    create("div", nav, 'Gerer les lignes', ['navBar__item']).addEventListener("click", toggleGestionLigne)

    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}

export const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des utilisateurs")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Ajouter un utilisateur', ['navBar__item']).addEventListener("click", toggleAjoutUser)
    create("div", nav, "Modifier un utilisateur", ['navBar__item']).addEventListener("click", null)
    create("div", nav, "Supprimer un utilisateur", ['navBar__item']).addEventListener("click", toggleSupprimeUser)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)
    
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}

export const toggleGestionBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Bus")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Ajouter un bus', ['navBar__item']).addEventListener("click", AjoutBus)
    create("div", nav, "Modifier un bus", ['navBar__item']).addEventListener("click", ModifBus)
    create("div", nav, "Supprimer un bus", ['navBar__item']).addEventListener("click", SupprimerBus)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)
    
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}

export const toggleGestionTimeslots = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Créneaux")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, "Ajouter un Creneau", ['navBar__item']).addEventListener("click", toggleAddCreneau)
    create("div", nav, "Modifier un Creneau", ['navBar__item']).addEventListener("click", null)
    create("div", nav, "Supprimer un Creneau", ['navBar__item']).addEventListener("click", toggleSupprimeCreneau)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)
    
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}



export const toggleGestionLigne = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Lignes")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, "Ajouter une Ligne", ['navBar__item']).addEventListener("click", toggleAddLine)
    create("div", nav, "Modifier une Ligne", ['navBar__item']).addEventListener("click", null)
    create("div", nav, "Supprimer une Ligne", ['navBar__item']).addEventListener("click", null)
    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)
    
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}