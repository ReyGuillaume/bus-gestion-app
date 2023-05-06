import {create, createChamp} from "../utils/domManipulation";
import { createMenuElement} from "../components/menuItem";
import {redirect, redirectUser, toggleAlertMessage} from "../utils/redirection";
import { fetchUrlRedirectAndAlert} from "../utils/formGestion";
import axios from 'axios';
import {toggleAjoutUser, toggleModifyUser, toggleSupprimeUser} from "./gestionUsers.js";


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

function changerInfoAbonne (){

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => toggleInfoAbonne())

    //les informations de l'abonné à changer + le bouton pour valider
    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        const div = create("div", main);
        create("h2", div, "Voici vos informations personnelles :");

        create("label", div, "Votre nom :",);
        createChamp(div, "text", "nameAbo").value = response.data["name"];

        create("label", div, "Votre prénom :",);
        createChamp(div, "text", "firstnameAbo").value = response.data["firstname"];

        create("label", div, "Votre date de naissance :");
        createChamp(div, "date", "dateAbo").value =response.data["birth_date"];

        create("label", div, "Votre adresse mail :",);
        createChamp(div, "email", "emailAbo").value = response.data["email"];

        create("label", div, "Votre nom d'utilisateur :",);
        createChamp(div, "text", "loginAbo").value = response.data["login"];

        create("p", div, "Votre mot de passe : **********");


        const valider = create("div", div, "Valider le changement", ['gestion_infos'])
        valider.addEventListener("click", function () {

            //selection des informations
            let name = document.querySelector("input[name='nameAbo']").value;
            let firstname = document.querySelector("input[name='firstnameAbo']").value;
            let email = document.querySelector("input[name='emailAbo']").value;
            let login = document.querySelector("input[name='loginAbo']").value;
            let date = document.querySelector("input[name='dateAbo']").value;

            //création de l'url
            let url = `users/users.php?function=update&id=${sessionData["id"]}&email=${email}&login=${login}&name=${name}&firstname=${firstname}&date=${date}`;
            fetchUrlRedirectAndAlert(url, '/espace-informations-abonne', "Votre profil a bien été modifié.", "Votre profil n'a pas été modifié.")
        });
    })

    return main

}

function changerMdpAbonne (){

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    create("div", main, '<< Retour', ['return']).addEventListener("click", () => toggleInfoAbonne())

    const div = create("div", main);
    create("h2", div, "Voici vos informations personnelles :");

    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        create("p", div, "Votre nom : " + response.data["name"]);
        create("p", div, "Votre prénom : " + response.data["firstname"]);
        create("p", div, "Votre date de naissance : " + response.data["birth_date"]);
        create("p", div, "Votre adresse mail : " + response.data["email"]);
        create("p", div, "Votre nom d'utilisateur : " + response.data["login"]);


        create("label", div, "Votre ancien mot de passe :",);
        createChamp(div, "password", "oldPwdAbo");

        create("label", div, "Votre nouveau mot de passe :",);
        createChamp(div, "password", "newPwdAbo");

        create("label", div, "Confirmation du nouveau mot de passe :",);
        createChamp(div, "password", "confNewPwdAbo");


        const valider = create("div", div, "Valider le changement", ['gestion_infos'])
        valider.addEventListener("click", function () {

            //selection des informations

            let oldPwdAbo = document.querySelector("input[name='oldPwdAbo']").value;
            let newPwdAbo = document.querySelector("input[name='newPwdAbo']").value;
            let confNewPwdAbo = document.querySelector("input[name='confNewPwdAbo']").value;

            //création de l'url
            let url = `users/users.php?function=updatepwd&id=${sessionData["id"]}&old=${oldPwdAbo}&new=${newPwdAbo}&confirm=${confNewPwdAbo}`;
            fetchUrlRedirectAndAlert(url, '/espace-informations-abonne', "Votre mot de passe a bien été modifié.", "Votre mot de passe n'a pas été modifié.")
        });
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


export function displayReserv (container, data) {

    // recuperation des infos de l'utilisateur
    //const roleUser = JSON.parse(sessionStorage.getItem("userData")).role;

    for(let reserv of data){
        let divReserv = create("div", container);

        let title = reserv.arretDepart + "  -  "+ reserv.arretArrive;
        let message = reserv.dateDepart;

        let divInfoReserv = create("div", divReserv, null, ["divNotif"]);
        let div = create("div", divInfoReserv);
        create("h3", div, title);
        create("p", div, message);

        //if(roleUser != "Abonné"){
        //}
    }
}