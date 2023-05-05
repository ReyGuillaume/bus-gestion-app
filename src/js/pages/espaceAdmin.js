import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleAddCreneau } from "../pages/gestionTimeslots";
import { toggleAjoutUser, toggleSupprimeUser, toggleModifyUser } from "../pages/gestionUsers";
import { DisponibilityBus, AjoutBus, SupprimerBus, ModifBus }from "../pages/gestionBuses";
import { toggleAddLine, toggleSupprLine, toggleModifLine, toggleVerifCouvertureSemaine, toggleRemplissageAutoConduiteSemaine } from "./gestionLigne";
import { toggleDrivers, toggleResp, toggleBuses, toggleLines } from "./agendaUsers";
import { toggleMultiEntities } from "./day";
import { createMenuElement } from "../components/menuItem";
import { redirect, redirectUser, toggleAlertMessage } from "../utils/redirection";


const toggleEspaceAdmin = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    redirectUser(
        () => null,
        () => null,
        () => redirect("/")
    )

    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()
        
    create("h2", main, "Bienvenue sur votre espace Admin")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])
        
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    const nav = create("nav", main, null, ['navBar_Admin'])

    // agenda
    createMenuElement(nav, toggleAgenda, "rose", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // agenda chauffeurs
    createMenuElement(nav, toggleDrivers, "jaune", "src/assets/images/nav_gens.png", "Voir l'agenda des chauffeurs", "Voir l'agenda des chauffeurs")


    // agenda responsables
    if(sessionData["role"] == "Directeur"){
        createMenuElement(nav, toggleResp, "orange", "src/assets/images/nav_gens.png", "Voir l'agenda des responsables logistiques", "Voir l'agenda des responsables logistiques")
        createMenuElement(nav, toggleMultiEntities, "jaune_clair", "src/assets/images/nav_agenda.png", "Croiser plusieurs agendas", "Croiser plusieurs agendas")
    }
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
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", 'Afficher les notifications', 'Afficher les notifications')

    return main
}

const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    create("h2", main, "Gestion des utilisateurs")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    create("div", nav, 'Ajouter un utilisateur', ['gestion_users']).addEventListener("click", toggleAjoutUser)
    create("div", nav, "Modifier un utilisateur", ['gestion_users']).addEventListener("click", toggleModifyUser)
    create("div", nav, "Supprimer un utilisateur", ['gestion_users']).addEventListener("click", toggleSupprimeUser)

    return main
}

const toggleGestionBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    create("h2", main, "Gestion des Bus")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    create("div", nav, 'Voir la disponibilité des bus', ['gestion_bus']).addEventListener("click", DisponibilityBus)
    create("div", nav, 'Ajouter un bus', ['gestion_bus']).addEventListener("click", AjoutBus)
    create("div", nav, "Modifier un bus", ['gestion_bus']).addEventListener("click", ModifBus)
    create("div", nav, "Supprimer un bus", ['gestion_bus']).addEventListener("click", SupprimerBus)

    return main
}

const toggleGestionLigne = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))
    create("h2", main, "Gestion des Lignes")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    create("div", nav, "Ajouter une Ligne", ['gestion_lignes']).addEventListener("click", toggleAddLine)
    create("div", nav, "Modifier une Ligne", ['gestion_lignes']).addEventListener("click", toggleModifLine)
    create("div", nav, "Supprimer une Ligne", ['gestion_lignes']).addEventListener("click", toggleSupprLine)

    create("div", nav, "Verifier la couverture d'une semaine", ['gestion_lignes']).addEventListener("click", toggleVerifCouvertureSemaine)
    create("div", nav, "Remplissage automatique des conduite de la semaine", ['gestion_lignes']).addEventListener("click", toggleRemplissageAutoConduiteSemaine)

    return main
}

export {
    toggleEspaceAdmin,
    toggleGestionUsers,
    toggleGestionBus,
    toggleGestionLigne
}