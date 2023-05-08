import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleAddCreneau } from "../pages/gestionTimeslots";
import { toggleAjoutUser, toggleSupprimeUser, toggleModifyUser } from "../pages/gestionUsers";
import { DisponibilityBus, AjoutBus, SupprimerBus, ModifBus }from "../pages/gestionBuses";
import { toggleAddLine, toggleSupprLine, toggleModifLine, toggleVerifCouvertureSemaine, toggleRemplissageAutoConduiteSemaine, toggleAddLineType, toggleModifLineType, toggleSupprLineType } from "./gestionLigne";
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
        () => redirect("/"),
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
        createMenuElement(nav, toggleMultiEntities, "vert", "src/assets/images/nav_agenda.png", "Croiser plusieurs agendas", "Croiser plusieurs agendas")
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
    createMenuElement(nav, toggleGestionBus, "vert_clair", "src/assets/images/nav_bus.png", 'Gérer les bus', 'Gérer les bus')

    // lignes
    createMenuElement(nav, toggleGestionLigne, "bleu_clair", "src/assets/images/nav_gestion.png", 'Gérer les lignes', 'Gérer les lignes')

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", 'Afficher les notifications', 'Afficher les notifications')

    return main
}

const toggleGestionUsers = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"
    
    create("h2", main, "Gestion des utilisateurs")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    const b1 = create("button", nav, 'Ajouter un utilisateur', ['gestion_users', "unstyled-button"])
    b1.addEventListener("click", toggleAjoutUser)
    b1.title = 'Ajouter un utilisateur'

    const b2 = create("button", nav, "Modifier un utilisateur", ['gestion_users', "unstyled-button"])
    b2.addEventListener("click", toggleModifyUser)
    b2.title = "Modifier un utilisateur"

    const b3 = create("button", nav, "Supprimer un utilisateur", ['gestion_users', "unstyled-button"])
    b3.addEventListener("click", toggleSupprimeUser)
    b3.title = "Supprimer un utilisateur"

    return main
}

const toggleGestionBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Gestion des Bus")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    const b1 = create("button", nav, 'Voir la disponibilité des bus', ['gestion_bus', "unstyled-button"])
    b1.addEventListener("click", DisponibilityBus)
    b1.title =  'Voir la disponibilité des bus'

    const b2 = create("button", nav, 'Ajouter un bus', ['gestion_bus', "unstyled-button"])
    b2.addEventListener("click", AjoutBus)
    b2.title = 'Ajouter un bus'

    const b3 = create("button", nav, "Modifier un bus", ['gestion_bus', "unstyled-button"])
    b3.addEventListener("click", ModifBus)
    b3.title = "Modifier un bus"

    const b4 = create("button", nav, "Supprimer un bus", ['gestion_bus', "unstyled-button"])
    b4.addEventListener("click", SupprimerBus)
    b4.title = "Supprimer un bus"

    return main
}

const toggleGestionLigne = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Gestion des Lignes")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    const lignes = create("div", nav, null, ["sous_gestion"])
    create("div", lignes, "Lignes", ["gestion_titre"])

    const b1 = create("button", lignes, "Ajouter une Ligne", ['gestion_lignes', "unstyled-button"])
    b1.addEventListener("click", toggleAddLine)
    b1.title = "Ajouter une Ligne"

    const b2 = create("button", lignes, "Modifier une Ligne", ['gestion_lignes', "unstyled-button"])
    b2.addEventListener("click", toggleModifLine)
    b2.title = "Modifier une Ligne"

    const b3 = create("button", lignes, "Supprimer une Ligne", ['gestion_lignes', "unstyled-button"])
    b3.addEventListener("click", toggleSupprLine)
    b3.title = "Supprimer une Ligne"

    const couv = create("div", nav, null, ["sous_gestion"])
    create("div", couv, "Couverture", ["gestion_titre"])

    const b4 = create("button", couv, "Verifier la couverture d'une semaine", ['gestion_lignes', "unstyled-button"])
    b4.addEventListener("click", toggleVerifCouvertureSemaine)
    b4.title = "Verifier la couverture d'une semaine"

    const b5 = create("button", couv, "Remplissage automatique des conduite de la semaine", ['gestion_lignes', "unstyled-button"])
    b5.addEventListener("click", toggleRemplissageAutoConduiteSemaine)
    b5.tile = "Remplissage automatique des conduite de la semaine"

    const types = create("div", nav, null, ["sous_gestion"])
    create("div", types, "Types de lignes", ["gestion_titre"])

    const b6 = create("button", types, "Ajouter un type de ligne", ['gestion_lignes', "unstyled-button"])
    b6.addEventListener("click", toggleAddLineType)
    b6.title = "Ajouter un type de ligne"

    const b7 = create("button", types, "Modifier un type de ligne", ['gestion_lignes', "unstyled-button"])
    b7.addEventListener("click", toggleModifLineType)
    b7.title = "Modifier un type de ligne"

    const b8 = create("button", types, "Supprimer un type de ligne", ['gestion_lignes', "unstyled-button"])
    b8.addEventListener("click", toggleSupprLineType)
    b8.title = "Supprimer un type de ligne"
}

export {
    toggleEspaceAdmin,
    toggleGestionUsers,
    toggleGestionBus,
    toggleGestionLigne
}