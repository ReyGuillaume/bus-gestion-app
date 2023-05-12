import {create, createChamp, toggleAlert} from "../utils/domManipulation.js";
import axios from "axios";
import {fetchUrlRedirectAndAlert, idOfAllElementChecked} from "../utils/formGestion.js";
import {removeContainerAndRemoveCacheClass} from "./userTask.js";
import {toogleBusChoices, toogleDriversChoices }from "./gestionTimeslots.js";
import { createHeader } from "../components/header.js";
import { redirect } from "../utils/redirection.js";

function changerInfoAbonne (){

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-informations-abonne"))
    back.title = "Retour en arrière"

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

        const valider = create("button", div, "Valider le changement", ['gestion_infos', "unstyled-button"])
        valider.title = "Valider"
        valider.addEventListener("click", function () {

            //selection des informations
            let id = sessionData["id"]
            let role = sessionData["role"]
            let idrole = sessionData["idrole"]

            let nom = document.querySelector("input[name='nameAbo']").value;
            let prenom = document.querySelector("input[name='firstnameAbo']").value;
            let email = document.querySelector("input[name='emailAbo']").value;
            let login = document.querySelector("input[name='loginAbo']").value;
            let date = document.querySelector("input[name='dateAbo']").value;

            //création de l'url
            let url = `users/users.php?function=update&id=${id}&email=${email}&login=${login}&name=${nom}&firstname=${prenom}&date=${date}`;
            const userData = { id, prenom, nom, role, idrole, email }
            // console.log(userData)
            sessionStorage.setItem("userData", JSON.stringify(userData))
            createHeader()
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

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-informations-abonne"))
    back.title = "Retour en arrière"

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


        const valider = create("button", div, "Valider le changement", ['gestion_infos', "unstyled-button"])
        valider.title = "Valider"
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


function displayReserv (container, data) {

    // recuperation des infos de l'utilisateur
    const roleUser = JSON.parse(sessionStorage.getItem("userData")).role;

    if(data.length === 0)
        create("h3", container, "Il n'y a aucune demande de réservation")

    for(let reserv of data){
        let divReserv = create("div", container);

        let title = reserv.arretDepart + "  -  "+ reserv.arretArrive;
        let message = reserv.dateDepart;

        let divInfoReserv = create("div", divReserv, null, ["divNotif"]);
        let div = create("div", divInfoReserv);
        create("h3", div, title);
        create("p", div, message);

        if(roleUser != "Abonné"){
            let divResp = create("div", divInfoReserv);
            
            let btn = create("button", divResp, "Valider", ['gestion_users', "unstyled-button"])
            btn.addEventListener("click", () => toggleValideReservation(reserv))
            btn.title = "Valider"
            btn = create("button", divResp, "Refuser", ['gestion_users', "unstyled-button"])
            btn.addEventListener("click", () => toggleRefuseReservation(reserv.id_reserv, container, data))
            btn.title = "Refuser"
        }
    }
}


const displayInscr = (container, lst_inscriptions) => {

    if(lst_inscriptions.length === 0)
        create("h3", container, "Il n'y a aucune demande d'inscription")

    for(let inscription of lst_inscriptions){
        let div = create("div", container, null, ["inscription"])

        let identite = create("div", div, null, ["inscription-identité"])
        create("div", identite, inscription.firstname)
        create("div", identite, inscription.name)

        create("div", div, inscription.birth_date)

        create("div", div, inscription.email)

        let btns = create("div", div, null, ["inscription-btns"])

        let btn = create("button", btns, "Valider", ["valideButton", "unstyled-button"])
        btn.addEventListener("click", () => valideInscription(inscription.id, div))
        btn.title = "Valider"

        btn = create("button", btns, "Refuser", ["refuseButton", "unstyled-button"])
        btn.addEventListener("click", () => refuseInscription(inscription.id, div))
        btn.title = "Refuser"
    }
}


const valideInscription = (id_inscription, container) => {
    axios.get(`users/users.php?function=valide_inscription&id=${id_inscription}`).then(function(){
        toggleAlert("BRAVO", "Inscription validée")
        container.remove()
    })
}

const refuseInscription = (id_inscription, container) => {
    axios.get(`users/users.php?function=refuse_inscription&id=${id_inscription}`).then(function(){
        toggleAlert("BRAVO", "Inscription refusée")
        container.remove()
    })
}

const toggleRefuseReservation = (idReservation,container, data) => {
    axios.get("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=refuse_reservation&idReservation="+idReservation).then( () => {
        container.replaceChildren("")
        axios.get(`timeslots/timeslots.php?function=fetch_all_reservation_attente`).then((response)=>{
            displayReserv (container, response.data);
        })
    })
}

const toggleValideReservation = (props) => {
    const app = document.querySelector("#app")
    const overlay = create("div", app, null, ["overlay"])
    const modale = create("div", overlay, null, ["validation"])
    const back = create("button", modale, '<< Retour', ['return', "unstyled-button"])
    back.title = "Retour en arrière"

    // ajout des actions au clic
    overlay.onclick = e => {
        e.stopPropagation()
        e.target.remove()
    }
    modale.onclick = e => {
        e.stopPropagation()
    }
    back.onclick = () => {
        modale.remove()
        overlay.remove()
    }

    create("label", modale, "Début :", ["form-info"]);
    const champ1 = createChamp(modale, "datetime-local", "StartDateTime");
    champ1.value = props.dateDepart
    champ1.disabled = true;
    
    create("label", modale, "Fin :", ["form-info"]);
    const champ2 = createChamp(modale, "datetime-local", "EndDateTime")
    champ2.value = props.dateDepart;

    toogleBusChoices(modale)
    toogleDriversChoices(modale)

    // Creation of submit button

    const bouton = create("button", modale, "Valider", ["submitButton", "unstyled-button"])
    bouton.title = "Valider"
    bouton.addEventListener("click", function(){
        // On recupere le debut et la fin du creneau
        let startDateTime = props.dateDepart;
        let endDateTime = champ2.value;

        // select the types of participants and return those who are checked in a string : 1,2,...
        const selectedDrivers = () => idOfAllElementChecked("input[name='selectionConducteurs']")

        // select the types of buses and return those who are checked in a string : 1,2,...
        const busesTimeslot = () => idOfAllElementChecked("input[name='selectionBus']")

        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=valide_reservation&idReservation=`+props.id_reserv+`&beginning=`+startDateTime+`&end=`+endDateTime+`&id_users=`+selectedDrivers()+`&id_buses=`+busesTimeslot(), "/espace-admin", "La réservation a bien été validée", "La réservation n'a pas pu être validée")
    })
}

export {
    changerInfoAbonne,
    changerMdpAbonne,
    displayReserv,
    displayInscr,
    toggleRefuseReservation
}