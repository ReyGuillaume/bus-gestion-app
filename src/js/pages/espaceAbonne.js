import {create} from "../utils/domManipulation";
import { createMenuElement} from "../components/menuItem";
import {redirect, redirectUser, toggleAlertMessage} from "../utils/redirection";
import axios from 'axios';
import {displayReserv} from "./gestionAbonne.js";


export function toggleEspaceAbonne() {
    const main = document.querySelector("#app");
    main.replaceChildren("");

    // redirection si l'utilisateur n'est pas un abonné
    redirectUser(
        () => redirect("/"),
        () => redirect("/"),
        () => redirect("/"),
        () => null
    );

    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    // création des titres
    create("h2", main, "Bienvenue sur votre espace personnel");
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"]);

    const nav = create("nav", main, null, ['navBar_User'])

    // informations de l'abonné
    createMenuElement(nav, () => redirect("/espace-informations-abonne"), "jaune", "src/assets/images/nav_gens.png", "Afficher mes informations", "Afficher mes informations")

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", "Afficher mes notifications", "Afficher mes notifications")


    // reservation
    createMenuElement(nav, toogleReservAbonne, "rouge", "src/assets/images/nav_reservation.png", "Gérer mes réservations", "Gérer mes réservations")

    return main
}


export function toggleInfoAbonne(){
    const main = document.querySelector("#app");
    main.replaceChildren("");

    // redirection si l'utilisateur n'est pas un abonné
    redirectUser(
        () => redirect("/"),
        () => redirect("/"),
        () => redirect("/"),
        () => null
    );

    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-abonne"))

    // les informations de l'abonné + les boutons pour mofier le profil et le mot de passe
    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        const div = create("div", main);
        create("h2", div, "Voici vos informations personnelles :");

        create("p", div, "Votre nom : "+ response.data["name"]);
        create("p", div, "Votre prénom : "+ response.data["firstname"]);
        create("p", div, "Votre date de naissance : "+ response.data["birth_date"]);
        create("p", div, "Votre adresse mail : "+ response.data["email"]);
        create("p", div, "Votre nom d'utilisateur : "+ response.data["login"]);
        create("p", div, "Votre mot de passe : **********");

        // bouton pour changer les infos de l'abonné
        const changerInfo = create("div", div, "Changer mes informations", ['gestion_infos'] )
        changerInfo.addEventListener("click", changerInfoAbonne);

        // bouton pour changer le mot de passe de l'abonné
        const changerMdp = create("div", div, "Changer mon mot de passe", ['gestion_infos'] )
        changerMdp.addEventListener("click", changerMdpAbonne);
    })
    return main
}


function toogleReservAbonne (){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => redirect("/espace-abonne"))
    create("h2", main, "Gestion des réservations")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])

    create("div", nav, 'Ajouter une réservation', ['gestion_users']).addEventListener("click", toggleAddReservation)
    create("div", nav, "Modifier une réservation", ['gestion_users']).addEventListener("click", toggleUpdateReservation)
    create("div", nav, "Supprimer une réservation", ['gestion_users']).addEventListener("click", toggleDeleteReservation)
    create("div", nav, "Voir les réservations", ['gestion_users']).addEventListener("click", toggleSeeReservation)

    return main
}


function toggleAddReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Ajouter une réservation")




    return main
}


function toggleUpdateReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Modifier une réservation")




    return main
}


function toggleDeleteReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Supprimer une réservation")




    return main
}


function toggleSeeReservation(){

    const main = document.querySelector("#app")
    main.replaceChildren("")

    // recuperation des infos de l'utilisateur
    const idClient = JSON.parse(sessionStorage.getItem("userData")).id;

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Voir les réservations")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['liste_gestion'])



    create("div", nav, "Voir les réservations en attente", ['gestion_users']).addEventListener("click", () => toggleSeeModeReservation(idClient, "attente"))
    create("div", nav, "Voir les réservations validées", ['gestion_users']).addEventListener("click", () => toggleSeeModeReservation(idClient, "valide"))
    create("div", nav, "Voir les réservations refusées", ['gestion_users']).addEventListener("click", () => toggleSeeModeReservation(idClient, "refuse"))

    return main
}


function toggleSeeModeReservation(idClient, etat){

    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toggleSeeReservation)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Voir les réservations")

    let divAllReserv = create("div", main);

    axios.get(`timeslots/timeslots.php?function=fetch_by_id_client_and_etat&idClient=`+idClient+`&etat=`+etat).then((response)=>{
        displayReserv (divAllReserv, response.data);
    })


    return main
}
