import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleAddCreneau } from "../pages/gestionTimeslots";
import { toggleAjoutUser, toggleSupprimeUser, toggleModifyUser } from "../pages/gestionUsers";
import { DisponibilityBus, AjoutBus, SupprimerBus, ModifBus }from "../pages/gestionBuses";
import { toggleAddLine, toggleSupprLine, toggleModifLine, toggleVerifCouvertureSemaine, toggleRemplissageAutoConduiteSemaine } from "./gestionLigne";
import { toggleDrivers, toggleResp, toggleBuses, toggleLines } from "./agendaUsers";
import { toggleNotificationCenter } from "./notificationCenter.js";
import { createMenuElement } from "../components/menuItem";


const toggleEspaceAdmin = () => {
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
    createMenuElement(nav, toggleAgenda, "rose", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // agenda chauffeurs
    createMenuElement(nav, toggleDrivers, "jaune", "src/assets/images/nav_gens.png", "Voir l'agenda des chauffeurs", "Voir l'agenda des chauffeurs")

    // agenda responsables
    if(sessionData["role"] == "Directeur")
        createMenuElement(nav, toggleResp, "orange", "src/assets/images/nav_gens.png", "Voir l'agenda des responsables logistiques", "Voir l'agenda des responsables logistiques")

    // agenda bus
    createMenuElement(nav, toggleBuses, "rouge", "src/assets/images/nav_bus.png", "Voir l'agenda des bus", "Voir l'agenda des bus")

    // agenda lignes de bus
    createMenuElement(nav, toggleLines, "bleu", "src/assets/images/nav_ligne.png", "Voir l'agenda des lignes de bus", "Voir l'agenda des lignes de bus")

    // créneaux
    createMenuElement(nav, toggleAddCreneau, "gris", "src/assets/images/nav_creneau.png", "Ajouter un créneaux", "Ajouter un créneaux")

    // utilisateurs
    createMenuElement(nav, toggleGestionUsers, "violet", "src/assets/images/nav_user.png", 'Gérer les utilisateurs', 'Gérer les utilisateurs')

    // bus
    createMenuElement(nav, toggleGestionBus, "vert", "src/assets/images/nav_bus.png", 'Gérer les bus', 'Gérer les bus')

    // lignes
    createMenuElement(nav, toggleGestionLigne, "bleu_clair", "src/assets/images/nav_gestion.png", 'Gérer les lignes', 'Gérer les lignes')

    // notif
    createMenuElement(nav, toggleNotificationCenter, "orange", "src/assets/images/nav_notif.png", 'Afficher les notifications', 'Afficher les notifications')

    return main
}

const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des utilisateurs")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Ajouter un utilisateur', ['navBar__item']).addEventListener("click", toggleAjoutUser)
    create("div", nav, "Modifier un utilisateur", ['navBar__item']).addEventListener("click", toggleModifyUser)
    create("div", nav, "Supprimer un utilisateur", ['navBar__item']).addEventListener("click", toggleSupprimeUser)

    return main
}

const toggleGestionBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Bus")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir la disponibilité des bus', ['navBar__item']).addEventListener("click", DisponibilityBus)
    create("div", nav, 'Ajouter un bus', ['navBar__item']).addEventListener("click", AjoutBus)
    create("div", nav, "Modifier un bus", ['navBar__item']).addEventListener("click", ModifBus)
    create("div", nav, "Supprimer un bus", ['navBar__item']).addEventListener("click", SupprimerBus)

    return main
}

const toggleGestionLigne = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Gestion des Lignes")
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleEspaceAdmin)
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

export {
    toggleEspaceAdmin,
    toggleGestionUsers,
    toggleGestionBus,
    toggleGestionLigne
}