import { createMenuElement} from "../components/menuItem";
import {redirect, redirectUser, toggleAlertMessage} from "../utils/redirection";
import { displayReserv} from "./gestionAbonne.js";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked } from "../utils/formGestion";
import { create, createChamp, createChampRadio } from "../utils/domManipulation";

import axios from 'axios';

export function toggleEspaceAbonne() {
    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

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

    // espace utilisateur
    createMenuElement(nav, () => redirect("/informations-utilisateur"), "jaune", "src/assets/images/nav_profil.png", "Afficher mes informations", "Afficher mes informations")

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", "Afficher mes notifications", "Afficher mes notifications")

    // reservation
    createMenuElement(nav, () => redirect("/reservation-abonne"), "rouge", "src/assets/images/nav_reservation.png", "Gérer mes réservations", "Gérer mes réservations")

    return main
}


export function toggleInfoAbonne(){
    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // bouton de retour
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-abonne"))
    back.title = "Retour en arrière"

    // les informations de l'abonné + les boutons pour mofier le profil et le mot de passe
    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        const div = create("div", main);
        create("h2", div, "Voici vos informations personnelles :", ["colocation"]);

        create("p", div, "Votre nom : "+ response.data["name", "espacio"]);
        create("p", div, "Votre prénom : "+ response.data["firstname"]);
        create("p", div, "Votre date de naissance : "+ response.data["birth_date"]);
        create("p", div, "Votre adresse mail : "+ response.data["email"]);
        create("p", div, "Votre nom d'utilisateur : "+ response.data["login"]);

        // bouton pour changer les infos de l'abonné
        const changerInfo = create("button", div, "Changer mes informations", ['gestion_infos', "unstyled-button"] )
        changerInfo.addEventListener("click", () => redirect("/informations-utilisateur/informations"));
        changerInfo.title = "Changer mes informations"

        // bouton pour changer le mot de passe de l'abonné
        const changerMdp = create("button", div, "Changer mon mot de passe", ['gestion_infos', "unstyled-button"] )
        changerMdp.addEventListener("click", () => redirect("/informations-utilisateur/mot-de-passe"));
        changerMdp.title = "Changer mon mot de passe"
    })
    return main
}


function toogleReservAbonne (){
    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-abonne"))
    back.title = "Retour en arrière"

    create("h2", main, "Gestion des réservations")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])
    
    const nav = create("div", main)

    let b = create("button", nav, 'Ajouter une réservation', ['gestion_users', "unstyled-button"])
    b.addEventListener("click", () => redirect('/reservation-abonne/ajout'))
    b.title = 'Ajouter une réservation'

    b = create("button", nav, "Voir les réservations", ['gestion_users', "unstyled-button"])
    b.addEventListener("click", () => redirect('/reservation-abonne/visualisation'))
    b.title = "Voir les réservations"

    return main
}


  
async function  showSuggestions(input) {
    let inputValue = input.value.toLowerCase().trim(); 

    if (inputValue.length < 2) {
      return; // ne rien faire si l'utilisateur n'a saisi que 1 caractère ou moins
    }

    return await axios.get("arrets/arrets.php?function=all_arret").then((response)=>{
        let arrets = response.data;

        let filteredArrets = arrets.filter(arret => arret.name.toLowerCase().startsWith(inputValue));

        return filteredArrets;
    });
  }
  


function toggleAddReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/reservation-abonne"))
    back.title = "Retour en arrière"

    create("h2", main, "Gestion des réservations")
    create("h3", main, "Ajouter une réservation")

    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the champ
    const div_depart = create("div", form, null, ["form-div"])
    create("label", div_depart, "Entrez le nom de l'arret de départ :", ["label-info"]);
    //createChamp(div_depart, "text", "arretDepart");


    // Filtrage 

    let input_depart = createChamp(div_depart, "text", "arretDepart");
    let arretList_depart = create("select", div_depart, ["arret-list"]);
    
    
    input_depart.addEventListener("input", async function() {
        
        let filteredArrets = await showSuggestions(input_depart);
       
        if (filteredArrets) {
        // supprimer les options précédentes
        arretList_depart.innerHTML = ""; 
        arretList_depart.size = filteredArrets.length;
        
        // remplir automatiquement le champ de saisie
        filteredArrets.forEach(arret => {
            let option = document.createElement("option");
            option.textContent = arret.name;
            arretList_depart.appendChild(option);
        });

        arretList_depart.addEventListener("click", () => {
            if (arretList_depart.selectedIndex != -1){
            let selectedOption = arretList_depart.options[arretList_depart.selectedIndex];
            input_depart.value = selectedOption.value;
            arretList_depart.replaceChildren(""); 
            arretList_depart.size = 0;
            }

        });
    }
    });
    const div_arrivee = create("div", form, null, ["form-div"])
    create("label", div_arrivee, "Entrez le nom de l'arret d'arrivée :", ["label-info"]);
    //createChamp(div_arrivee, "text", "arretArrivee");

    let input_arrive = createChamp(div_arrivee, "text", "arretArrivee");
    let arretList_arrive = create("select", div_arrivee, ["arret-list"]);
    
    
    input_arrive.addEventListener("input", async function() {

        let filteredArretsArrive =  await showSuggestions(input_arrive);

        if (filteredArretsArrive) {
        // supprimer les options précédentes
        arretList_arrive.innerHTML = ""; 
        arretList_arrive.size = filteredArretsArrive.length;

        // remplir automatiquement le champ de saisie
        filteredArretsArrive.forEach(arret => {
            let option = document.createElement("option");
            option.textContent = arret.name;
            arretList_arrive.appendChild(option);
        });

        arretList_arrive.addEventListener("click", () => {
            if (arretList_arrive.selectedIndex != -1){
            let selectedOption2 = arretList_arrive.options[arretList_arrive.selectedIndex];
            input_arrive.value = selectedOption2.value;
            arretList_arrive.replaceChildren(""); 
            arretList_arrive.size = 0;
            }
        });
    }
    });

    const date = create("div", form, null, ["form-div"])
    create("label", date, "Entrez la date et l'horaire de départ :", ["label-info"]);
    createChamp(date, "datetime-local", "horaireDepart");


    // Creation of submit button

    const bouton = create("button", form, "Ajouter", ["submitButton", "unstyled-button"])
    bouton.title = "Ajouter"
    bouton.addEventListener("click", function(){
        let dateDepart = document.querySelector("input[name='horaireDepart']").value;
        let arretDepart = document.querySelector("input[name='arretDepart']").value;
        let arretArrive = document.querySelector("input[name='arretArrivee']").value;
        const idClient = JSON.parse(sessionStorage.getItem("userData"))["id"];

        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=create_reservation&arretDepart=`+arretDepart+`&arretArrive=`+arretArrive+`&dateDepart=`+dateDepart+`&idClient=`+idClient, "/reservation-abonne", "La réservation a bien été envoyée", "La réservation n'a pas pu être envoyée")
    })

    return main
}

const createReservationRadio = (form, container, reservation, route) => {
        axios.get(`timeslots/timeslots.php?function=fetch_by_id_reservation&idReservation=${reservation.id_reserv}`).then((responseReservation) =>{

            // Creation du formulaire pré remplie de modif de la reservation
            form.replaceChildren("")
            // bouton de retour
            const back = create("button", form, '<< Retour', ['return', "unstyled-button"])
            back.onclick = () => form.replaceChildren("");
            back.title = "Retour en arrière"
            
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
            const bouton = create("div", form, "Modifier", ["submitButton"])
            bouton.addEventListener("click", function(){
                let dateDepart = document.querySelector("input[name='horaireDepart']").value;
                let arretDepart = document.querySelector("input[name='arretDepart']").value;
                let arretArrive = document.querySelector("input[name='arretArrivee']").value;
                const idClient = responseReservation.data["id_client"];

                form.replaceChildren("")
                fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=create_reservation&arretDepart=`+arretDepart+`&arretArrive=`+arretArrive+`&dateDepart=`+dateDepart+`&idClient=`+idClient, route, "La réservation a bien été ajoutée", "La réservation n'a pas pu être ajoutée")
            })
        })
}

function toggleUpdateReservation(){
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // bouton de retour
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])

    back.addEventListener("click", () => redirect("/reservations"))
    back.title = "Retour en arrière"

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
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/reservations"))
    back.title = "Retour en arrière"

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
    const bouton = create("button", form, "Supprimer", ["submitButton", "unstyled-button"])
    bouton.title = "Supprimer"
    bouton.addEventListener("click", function(){
        var id_reserv = valueFirstElementChecked("input[name='idReservation']");
        
        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=`+id_reserv, "/reservation-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
    })


    return main
}

function toggleSeeModeReservation(idClient, etat){

    const main = document.querySelector("#app")

    const old_divAllReserv = document.querySelector(".divAllReserv")

    if(old_divAllReserv){
        old_divAllReserv.remove()
    }

    let divAllReserv = create("div", main, null, ['divAllReserv']);

    if (etat != "all"){
        axios.get(`timeslots/timeslots.php?function=fetch_by_id_client_and_etat&idClient=`+idClient+`&etat=`+etat).then((response)=>{
            displayReserv (divAllReserv, response.data);
        })
    } else {
        axios.get(`timeslots/timeslots.php?function=fetch_by_id_client&idClient=` + idClient).then((response) => {
            displayReserv(divAllReserv, response.data);
        })
    }



    return main
}


function toggleSeeReservation(){
    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()

    const main = document.querySelector("#app")
    main.replaceChildren("")

    // recuperation des infos de l'utilisateur
    const idClient = JSON.parse(sessionStorage.getItem("userData")).id;

    // bouton de retour

    let b = create("button", main, '<< Retour', ['return', "unstyled-button"])
    b.addEventListener("click", () => redirect("/reservation-abonne"))
    b.title = "Retour en arrière"

    const nav = create("ul", main, null, ['navNotif']);
    let listeStatus = ["en attente", "validées", "refusées", "toutes"];

    var divTitres = create("div", main, null, ['divTitresNotif']);
    create("p", divTitres, "Réservation");
    create("hr", divTitres);
    create("p", divTitres, "Actions");
    toggleSeeModeReservation(idClient, "all");

    for(var status of listeStatus){
        // Au clic du choix de type de créneau on affiche les autres infos à choisir
        let li = create("li", nav, null, ['navNotif_item']);
        var radio = createChampRadio(li, status , "selectionStatus", status);
        radio.style.position = "fixed";
        radio.style.opacity = 0;

        radio.addEventListener('click', async function () {
            // Recuperation du type de réservation sélectionné
            var statusToHandle = valueFirstElementChecked("input[name='selectionStatus']");

            switch (statusToHandle) {
                case 'en attente' :
                    toggleSeeModeReservation(idClient, "attente");
                    break;
                case 'validées' :
                    toggleSeeModeReservation(idClient, "valide");
                    break;
                case 'refusées' :
                    toggleSeeModeReservation(idClient, "refuse");
                    break;
                default :
                    toggleSeeModeReservation(idClient, "all");
                    break;

            }
        });

        var label = create("label", li, status, ["navNotif_name"]);
        label.setAttribute("for", status);
    }
}

export {
    toogleReservAbonne,
    toggleAddReservation,
    toggleUpdateReservation,
    createReservationRadio,
    toggleDeleteReservation,
    toggleSeeReservation
}
