import { createMenuElement} from "../components/menuItem";
import {redirect, redirectUser, toggleAlertMessage} from "../utils/redirection";
import axios from 'axios';
import {displayReserv} from "./gestionAbonne.js";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked } from "../utils/formGestion";
import { create, createChamp, createChampCheckbox, createChampRadio } from "../utils/domManipulation";


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

    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the champ
    const div_depart = create("div", form, null, ["form-div"])
    create("label", div_depart, "Entrez le nom de l'arret de départ :", ["label-info"]);
    createChamp(div_depart, "text", "arretDepart");

    const div_arrivee = create("div", form, null, ["form-div"])
    create("label", div_arrivee, "Entrez le nom de l'arret d'arrivée :", ["label-info"]);
    createChamp(div_arrivee, "text", "arretArrivee");

    const date = create("div", form, null, ["form-div"])
    create("label", date, "Entrez la date et l'horaire de départ :", ["label-info"]);
    createChamp(date, "datetime-local", "horaireDepart");


    const bouton = create("div", form, "Ajouter", ["submitButton"])
    bouton.addEventListener("click", function(){
        let dateDepart = document.querySelector("input[name='horaireDepart']").value;
        let arretDepart = document.querySelector("input[name='arretDepart']").value;
        let arretArrive = document.querySelector("input[name='arretArrivee']").value;
        const idClient = JSON.parse(sessionStorage.getItem("userData"))["id"];

        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=create_reservation&arretDepart=`+arretDepart+`&arretArrive=`+arretArrive+`&dateDepart=`+dateDepart+`&idClient=`+idClient, "/espace-abonne", "La réservation a bien été envoyée", "La réservation n'a pas pu être envoyée")
    })



    return main
}

const createReservationRadio = (form, container, reservation) => {
    //Ajout d'un evenement au clic d'un radio
    createChampRadio(container, reservation.id_reserv , "selectionReservation", reservation['id_reserv'])
    .addEventListener('click', function(){
        // Recuperation de la ligne a modifier
        var numberReservationToModify = valueFirstElementChecked("input[name='selectionReservation']");
        
        axios.get(`timeslots/timeslots.php?function=fetch_by_id_reservation&idReservation=${numberReservationToModify}`).then((responseReservation) =>{
           
            console.log(responseReservation.data["arretArrive"])
            // Creation du formulaire pré remplie de modif de la reservation
            form.replaceChildren("")
            
            const div_depart = create("div", form, null, ["form-div"])
            create("label", div_depart, "Entrez le nom de l'arret de départ :", ["label-info"]);
            createChamp(div_depart, "text", "arretDepart").value = responseReservation.data["arretDepart"];

            const div_arrivee = create("div", form, null, ["form-div"])
            create("label", div_arrivee, "Entrez le nom de l'arret d'arrivée :", ["label-info"]);
            createChamp(div_arrivee, "text", "arretArrivee").value = responseReservation.data["arretArrive"];

            const date = create("div", form, null, ["form-div"])
            create("label", date, "Entrez la date et l'horaire de départ :", ["label-info"]);
            createChamp(date, "datetime-local", "horaireDepart").value = responseReservation.data["dateDepart"];
            
            // Creation of submit button
            
            // +++++
        })
    })
    create("label", container, "Réservation : "+ reservation['id_reserv']+ " du "+ reservation['dateDepart']+ " depuis "+ reservation['arretDepart'], ["label-info"]).setAttribute('for', "r"+reservation['id_reserv']);
}

function toggleUpdateReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Modifier une réservation")
    create("p", main, "Choisir la reservation à modifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation de radio pour chaque reservation 
    var divRadio = create("div", form, null, ["form-div-radio"]);
    create("p", divRadio, "Choisissez la réservation à modifier : ");
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    axios.get(`timeslots/timeslots.php?function=fetch_by_id_client&idClient=`+sessionData["id"]).then(response => {
        for(var reservation of response.data){
            var div_reservation = create("div", form, null, ["form-div-radio"])
            createReservationRadio(form, div_reservation, reservation)
        }
    
      });





    return main
}


function toggleDeleteReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    create("div", main, '<< Retour', ['return']).addEventListener("click", toogleReservAbonne)

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Supprimer une réservation")

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation de radio pour chaque reservation 
    var divRadio = create("div", form, null, ["form-div-radio"]);
    create("p", divRadio, "Choisissez la réservation à supprimer : ");
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    axios.get(`timeslots/timeslots.php?function=fetch_by_id_client&idClient=`+sessionData["id"]).then(response => {
        response.data.forEach(reservation => {
          createChampRadio(divRadio, "r"+reservation['id_reserv']+" ", "idReservation", reservation['id_reserv']);
          create("label", divRadio, "Réservation : "+ reservation['id_reserv']+ " du "+ reservation['dateDepart']+ " depuis "+ reservation['arretDepart'], ["label-info"]).setAttribute('for', "r"+reservation['id_reserv']);
        });
      });

      // Creation of submit button
    const bouton = create("div", form, "Supprimer", ["submitButton"])
    bouton.addEventListener("click", function(){
        var id_reserv = valueFirstElementChecked("input[name='idReservation']");
        
        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=`+id_reserv, "/espace-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
    })


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
