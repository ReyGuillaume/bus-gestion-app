import { create } from "../utils/domManipulation";
import { createMenuElement } from "../components/menuItem";
import { redirect, redirectUser, toggleAlertMessage } from "../utils/redirection";
import axios from "axios";
import { displayReserv, displayInscr } from "./gestionAbonne.js";


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
    createMenuElement(nav, () => redirect("/agenda"), "rose", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // agenda chauffeurs
    createMenuElement(nav, () => redirect("/agenda-chauffeurs"), "jaune", "src/assets/images/nav_gens.png", "Voir l'agenda des chauffeurs", "Voir l'agenda des chauffeurs")


    // agenda responsables
    if(sessionData["role"] == "Directeur"){
        createMenuElement(nav, () => redirect("/agenda-responsables"), "orange", "src/assets/images/nav_gens.png", "Voir l'agenda des responsables logistiques", "Voir l'agenda des responsables logistiques")
        createMenuElement(nav, () => redirect("/agenda-multiple"), "vert", "src/assets/images/nav_agenda.png", "Croiser plusieurs agendas", "Croiser plusieurs agendas")
    }
    // agenda bus
    createMenuElement(nav, () => redirect("/agenda-bus"), "rouge", "src/assets/images/nav_bus.png", "Voir l'agenda des bus", "Voir l'agenda des bus")

    // agenda lignes de bus
    createMenuElement(nav, () => redirect("/agenda-lignes"), "bleu", "src/assets/images/nav_ligne.png", "Voir l'agenda des lignes de bus", "Voir l'agenda des lignes de bus")

    // créneaux
    createMenuElement(nav, () => redirect("/creneau"), "gris", "src/assets/images/nav_creneau.png", "Ajouter un créneaux", "Ajouter un créneaux")

    // utilisateurs
    createMenuElement(nav, () => redirect("/utilisateurs"), "violet", "src/assets/images/nav_user.png", 'Gérer les utilisateurs', 'Gérer les utilisateurs')

    // bus
    createMenuElement(nav, () => redirect("/bus"), "vert_clair", "src/assets/images/nav_bus.png", 'Gérer les bus', 'Gérer les bus')

    // lignes
    createMenuElement(nav, () => redirect("/lignes"), "bleu_clair", "src/assets/images/nav_gestion.png", 'Gérer les lignes', 'Gérer les lignes')

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", 'Afficher les notifications', 'Afficher les notifications')

    // reservation
    createMenuElement(nav, () => redirect("/reservation"), "rouge", "src/assets/images/nav_reservation.png", "Voir les réservations", "Voir les réservations")

    // inscriptions
    createMenuElement(nav, () => redirect("/inscriptions"), "bleu", "src/assets/images/nav_profil.png", "Voir les inscriptions", "Voir les inscriptions")
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
    b1.addEventListener("click", () => redirect("/utilisateurs/ajout"))
    b1.title = 'Ajouter un utilisateur'

    const b2 = create("button", nav, "Modifier un utilisateur", ['gestion_users', "unstyled-button"])
    b2.addEventListener("click", () => redirect("/utilisateurs/modification"))
    b2.title = "Modifier un utilisateur"

    const b3 = create("button", nav, "Supprimer un utilisateur", ['gestion_users', "unstyled-button"])
    b3.addEventListener("click", () => redirect("/utilisateurs/suppression"))
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
    b1.addEventListener("click", () => redirect("/bus/disponibilite"))
    b1.title =  'Voir la disponibilité des bus'

    const b2 = create("button", nav, 'Ajouter un bus', ['gestion_bus', "unstyled-button"])
    b2.addEventListener("click", () => redirect("/bus/ajout"))
    b2.title = 'Ajouter un bus'

    const b3 = create("button", nav, "Modifier un bus", ['gestion_bus', "unstyled-button"])
    b3.addEventListener("click", () => redirect("/bus/modification"))
    b3.title = "Modifier un bus"

    const b4 = create("button", nav, "Supprimer un bus", ['gestion_bus', "unstyled-button"])
    b4.addEventListener("click", () => redirect("/bus/suppression"))
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
    b1.addEventListener("click", () => redirect("/lignes/ajout"))
    b1.title = "Ajouter une Ligne"

    const b2 = create("button", lignes, "Modifier une Ligne", ['gestion_lignes', "unstyled-button"])
    b2.addEventListener("click", () => redirect("/lignes/modification"))
    b2.title = "Modifier une Ligne"

    const b3 = create("button", lignes, "Supprimer une Ligne", ['gestion_lignes', "unstyled-button"])
    b3.addEventListener("click", () => redirect("/lignes/suppression"))
    b3.title = "Supprimer une Ligne"

    const couv = create("div", nav, null, ["sous_gestion"])
    create("div", couv, "Couverture", ["gestion_titre"])

    const b4 = create("button", couv, "Verifier la couverture d'une semaine", ['gestion_lignes', "unstyled-button"])
    b4.addEventListener("click", () => redirect("/lignes/couverture-verification"))
    b4.title = "Verifier la couverture d'une semaine"

    const b5 = create("button", couv, "Remplissage automatique des conduite de la semaine", ['gestion_lignes', "unstyled-button"])
    b5.addEventListener("click", () => redirect("/lignes/remplissage"))
    b5.tile = "Remplissage automatique des conduite de la semaine"

    const types = create("div", nav, null, ["sous_gestion"])
    create("div", types, "Types de lignes", ["gestion_titre"])

    const b6 = create("button", types, "Ajouter un type de ligne", ['gestion_lignes', "unstyled-button"])
    b6.addEventListener("click", () => redirect("/lignes/ajout-type"))
    b6.title = "Ajouter un type de ligne"

    const b7 = create("button", types, "Modifier un type de ligne", ['gestion_lignes', "unstyled-button"])
    b7.addEventListener("click", () => redirect("/lignes/modification-type"))
    b7.title = "Modifier un type de ligne"

    const b8 = create("button", types, "Supprimer un type de ligne", ['gestion_lignes', "unstyled-button"])
    b8.addEventListener("click", () => redirect("/lignes/suppression-type"))
    b8.title = "Supprimer un type de ligne"
}

const toggleReservation = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-admin"))

    create("h2", main, "Voir les réservations")

    let divAllReserv = create("div", main);

    axios.get(`timeslots/timeslots.php?function=fetch_all_reservation_attente`).then((response)=>{
        displayReserv (divAllReserv, response.data);
    })

    return main
}

const toggleInscriptions = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Voir les demandes d'inscription")

    let divAllInscr = create("div", main)

    axios.get(`users/users.php?function=fetch_inscriptions`).then((response)=>{
        displayInscr(divAllInscr, response.data)
    })

    return main
}

export {
    toggleEspaceAdmin,
    toggleGestionUsers,
    toggleGestionBus,
    toggleGestionLigne,
    toggleReservation,
    toggleInscriptions
}