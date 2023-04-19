import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleAddCreneau,toggleSupprimeCreneau,toggleModifCreneau } from "../pages/gestionTimeslots";
import{toggleAjoutUser, toggleSupprimeUser, toggleModifyUser} from "../pages/gestionUsers";
import {AjoutBus, SupprimerBus, ModifBus}from "../pages/gestionBuses";
import { toggleAddLine, toggleSupprLine, toggleModifLine, toggleVerifCouvertureSemaine, toggleRemplissageAutoConduiteSemaine } from "./gestionLigne";
import { toggleDrivers, toggleResp, toggleBuses, toggleLines } from "./agendaUsers";


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
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar_Admin'])

    // agenda
    const div = create("div", nav, null, ["navBar_container"])
    div.addEventListener("click", toggleAgenda)
    const img = create("div", div, null, ["navBar_image", "rose"])
    create("img", img).src = "src/assets/images/nav_agenda.png"
    create("div", div, 'Voir mon agenda', ['navBar__item'])

    // agenda chauffeurs
    const div2 = create("div", nav, null, ["navBar_container"])
    div2.addEventListener("click", toggleDrivers)
    const img2 = create("div", div2, null, ["navBar_image", "jaune"])
    create("img", img2).src = "src/assets/images/nav_gens.png"
    create("div", div2, "Voir l'agenda des chauffeurs", ['navBar__item'])

    // agenda responsables
    if(sessionData["role"] == "Directeur"){
        const div3 = create("div", nav, null, ["navBar_container"])
        div3.addEventListener("click", toggleResp)
        const img3 = create("div", div3, null, ["navBar_image", "orange"])
        create("img", img3).src = "src/assets/images/nav_gens.png"
        create("div", div3, "Voir l'agenda des responsables logistiques", ['navBar__item'])
    }

    // agenda bus
    const div4 = create("div", nav, null, ["navBar_container"])
    div4.addEventListener("click", toggleBuses)
    const img4 = create("div", div4, null, ["navBar_image", "rouge"])
    create("img", img4).src = "src/assets/images/nav_bus.png"
    create("div", div4, "Voir l'agenda des bus", ['navBar__item'])

    // agenda lignes de bus
    const div5 = create("div", nav, null, ["navBar_container"])
    div5.addEventListener("click", toggleLines)
    const img5 = create("div", div5, null, ["navBar_image", "bleu"])
    create("img", img5).src = "src/assets/images/nav_ligne.png"
    create("div", div5, "Voir l'agenda des lignes de bus", ['navBar__item'])

    // créneaux
    const div6 = create("div", nav, null, ["navBar_container"])
    div6.addEventListener("click", toggleGestionTimeslots)
    const img6 = create("div", div6, null, ["navBar_image", "gris"])
    create("img", img6).src = "src/assets/images/nav_creneau.png"
    create("div", div6, "Gérer les créneaux", ['navBar__item'])

    // utilisateurs
    const div7 = create("div", nav, null, ["navBar_container"])
    div7.addEventListener("click", toggleGestionUsers)
    const img7 = create("div", div7, null, ["navBar_image", "violet"])
    create("img", img7).src = "src/assets/images/nav_user.png"
    create("div", div7, 'Gérer les utilisateurs', ['navBar__item'])

    // bus
    const div8 = create("div", nav, null, ["navBar_container"])
    div8.addEventListener("click", toggleGestionBus)
    const img8 = create("div", div8, null, ["navBar_image", "vert"])
    create("img", img8).src = "src/assets/images/nav_bus.png"
    create("div", div8, 'Gérer les bus', ['navBar__item'])

    // lignes
    const div9 = create("div", nav, null, ["navBar_container"])
    div9.addEventListener("click", toggleGestionLigne)
    const img9 = create("div", div9, null, ["navBar_image", "bleu_clair"])
    create("img", img9).src = "src/assets/images/nav_gestion.png"
    create("div", div9, 'Gérer les lignes', ['navBar__item'])

    return main
}

export const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des utilisateurs")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

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
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir la disponibilité des bus', ['navBar__item']).addEventListener("click", DisponibilityBus)
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
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

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
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, "Ajouter une Ligne", ['navBar__item']).addEventListener("click", toggleAddLine)
    create("div", nav, "Modifier une Ligne", ['navBar__item']).addEventListener("click", toggleModifLine)
    create("div", nav, "Supprimer une Ligne", ['navBar__item']).addEventListener("click", toggleSupprLine)
    create("div", nav, "Verifier la couverture d'une semaine", ['navBar__item']).addEventListener("click", toggleVerifCouvertureSemaine)
    create("div", nav, "Remplissage automatique des conduite de la semaine", ['navBar__item']).addEventListener("click", toggleRemplissageAutoConduiteSemaine)

    create("div", nav, 'Retour', ['navBar__item']).addEventListener("click", toggleEspaceAdmin)

    return main
}