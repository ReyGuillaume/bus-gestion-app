import {create, createChamp, toggleAlert} from "../utils/domManipulation.js";
import axios from "axios";
import {addslashes, fetchUrlRedirectAndAlert, idOfAllElementChecked} from "../utils/formGestion.js";
import {createReservationRadio, toggleInfoAbonne} from "./espaceAbonne.js";
import {removeContainerAndRemoveCacheClass} from "./userTask.js";
import {toogleBusChoices, toogleDriversChoices }from "./gestionTimeslots.js";
import { createHeader } from "../components/header.js";
import {createMenuElement} from "../components/menuItem.js";
import {redirect} from "../utils/redirection.js";
import {reecritDateEtHeure, sendMail, sendMailTemplate} from "../utils/sendMail.js";


function changerInfoAbonne (){

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")){
        redirect("/")
    }else {

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/informations-utilisateur"))
    back.title = "Retour en arrière"

    //les informations de l'abonné à changer + le bouton pour valider
    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        create("h2", main, "Voici vos informations personnelles :");

        const form = create("div", main, null, ["app-form"]);

        const div_nom = create("div", form, null, ["form-div"]);
        create("label", div_nom, "Votre nom :", ["label-info"]);
        createChamp(div_nom, "text", "nameAbo").value = response.data["name"];

        const div_prenom = create("div", form, null, ["form-div"]);
        create("label", div_prenom, "Votre prénom :", ["label-info"]);
        createChamp(div_prenom, "text", "firstnameAbo").value = response.data["firstname"];

        const div_naissance = create("div", form, null, ["form-div"]);
        create("label", div_naissance, "Votre date de naissance :", ["label-info"]);
        createChamp(div_naissance, "date", "dateAbo").value =response.data["birth_date"];

        const div_email = create("div", form, null, ["form-div"]);
        create("label", div_email, "Votre adresse mail :", ["label-info"]);
        createChamp(div_email, "email", "emailAbo").value = response.data["email"];

        const div_login = create("div", form, null, ["form-div"]);
        create("label", div_login, "Votre nom d'utilisateur :", ["label-info"]);
        createChamp(div_login, "text", "loginAbo").value = response.data["login"];

        const valider = create("button", form, "Valider le changement", ['gestion_infos', "unstyled-button"])
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
            sessionStorage.setItem("userData", JSON.stringify(userData))
            createHeader()
            fetchUrlRedirectAndAlert(url, '/informations-utilisateur', "Votre profil a bien été modifié.", "Votre profil n'a pas été modifié.")
        });
    })}

    return main

}

function changerMdpAbonne (){

    const main = document.querySelector("#app");
    main.replaceChildren("");

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData")) {
        redirect("/")
    }else {

    // recuperation des infos de l'utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/informations-utilisateur"))
    back.title = "Retour en arrière"

    create("h2", main, "Voici vos informations personnelles :");

    axios.get(`users/users.php?function=user&id=`+sessionData["id"]).then((response) => {
        const form = create("div", main, null, ["app-form"]);

        const div_nom = create("div", form, null, ["form-div-radio"]);
        create("div", div_nom, "Votre nom : ", ["label-info"]);
        create("div", div_nom, response.data["name"]);
        
        const div_prenom = create("div", form, null, ["form-div-radio"]);
        create("div", div_prenom, "Votre prénom : ", ["label-info"]);
        create("div", div_prenom, response.data["firstname"]);

        const div_naissance = create("div", form, null, ["form-div-radio"]);
        create("div", div_naissance, "Votre date de naissance : ", ["label-info"]);
        create("div", div_naissance, response.data["birth_date"]);

        const div_email = create("div", form, null, ["form-div-radio"]);
        create("div", div_email, "Votre adresse mail : ", ["label-info"]);
        create("div", div_email, response.data["email"]);

        const div_login = create("div", form, null, ["form-div-radio"]);
        create("div", div_login, "Votre nom d'utilisateur : ", ["label-info"]);
        create("div", div_login, response.data["login"]);

        const ancien_mdp = create("div", form, null, ["form-div"]);
        create("label", ancien_mdp, "Votre ancien mot de passe :", ["label-info"]);
        createChamp(ancien_mdp, "password", "oldPwdAbo");

        const nouveau_mdp = create("div", form, null, ["form-div"]);
        create("label", nouveau_mdp, "Votre nouveau mot de passe :", ["label-info"]);
        createChamp(nouveau_mdp, "password", "newPwdAbo");

        const confirme_mdp = create("div", form, null, ["form-div"]);
        create("label", confirme_mdp, "Confirmation du nouveau mot de passe :", ["label-info"]);
        createChamp(confirme_mdp, "password", "confNewPwdAbo");


        const valider = create("button", form, "Valider le changement", ['gestion_infos', "unstyled-button"])
        valider.title = "Valider"
        valider.addEventListener("click", function () {

            //selection des informations

            let oldPwdAbo = document.querySelector("input[name='oldPwdAbo']").value;
            let newPwdAbo = document.querySelector("input[name='newPwdAbo']").value;
            let confNewPwdAbo = document.querySelector("input[name='confNewPwdAbo']").value;

            //création de l'url
            let url = `users/users.php?function=updatepwd&id=${sessionData["id"]}&old=${oldPwdAbo}&new=${newPwdAbo}&confirm=${confNewPwdAbo}`;
            fetchUrlRedirectAndAlert(url, '/informations-utilisateur', "Votre mot de passe a bien été modifié.", "Votre mot de passe n'a pas été modifié.")
        });
    })}
    return main
}


function displayReserv(container, data) {
    // recuperation des infos de l'utilisateur
    const roleUser = JSON.parse(sessionStorage.getItem("userData")).role;
    if (data.length === 0)
        create("h3", container, "Il n'y a aucune réservation")

    for (let reserv of data) {
        let title = reserv.arretDepart + "  -  " + reserv.arretArrive;
        let message = "départ : " + reserv.dateDepart;

        let divReserv = create("div", container, null, ["divReserv"]);
        let div = create("div", divReserv, null, ["divInfoReserv"]);
        create("h3", div, title);
        let divHReserv = create("div", div, null, ["divHReserv"]);
        create("p", divHReserv, message);

        let divBoutonReserv = create("div", divReserv, null, ["divBoutonsReserv"]);
        let footer = document.querySelector("#footer")

        if (roleUser != "Abonné") {
            const b1 = create("button", divBoutonReserv, "Valider", ['gestion_notifs', "unstyled-button"])
            b1.onclick = () => toggleValideReservation(footer, reserv)
            b1.title = "Valider"
            const b2 = create("button", divBoutonReserv, "Refuser", ['gestion_notifs', "unstyled-button"])
            b2.onclick = () => toggleRefuseReservation(reserv.id_reserv, container, data)
            b2.title = "Refuser"
        } else {
            switch (reserv.etat) {
                case "attente" :
                    // Creation of the form
                    const form = create("div", footer, null, null, "task")
                    var div_reservation = create("div", container, null, ["form-div-radio"])
                    createMenuElement(divBoutonReserv, () => createReservationRadio(form, div_reservation, reserv, "/reservation-abonne"), "rouge", "../src/assets/images/edit.png", "modifier", "")
                    createMenuElement(divBoutonReserv, () =>
                            fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=` + reserv.id_reserv, "/reservation-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
                        , "rouge", "../src/assets/images/croix.png", "supprimer", "")
                    break;
                case "valide":
                    create("p", divHReserv, "arrivée : " + reserv.end, ["pArrivee"]);
                    break;
                case "refuse":
                    createMenuElement(divBoutonReserv, () =>
                            fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=` + reserv.id_reserv, "/reservation-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
                        , "rouge", "../src/assets/images/croix.png", "supprimer", "")
                    break;
                default:
                    break;
            }
        }
    }
}


const displayInscr = (container, lst_inscriptions) => {

    if(lst_inscriptions.length === 0)
        create("h3", container, "Il n'y a aucune demande d'inscription")

    for(let inscription of lst_inscriptions){
        let div = create("div", container, null, ["inscription"])

        let identite = create("div", div, null, ["inscription-container"])
        create("div", identite, inscription.firstname, ["inscription-prenom"])
        create("div", identite, inscription.name, ["inscription-nom"])

        let naissance = create("div", div, null, ["inscription-container"])
        create("div", naissance, "Date de naissance", ["inscription-info"])
        create("div", naissance, inscription.birth_date, ["inscription-valeur"])

        let email = create("div", div, null, ["inscription-container"])
        create("div", email, "Email", ["inscription-info"])
        create("div", email, inscription.email, ["inscription-valeur"])

        let btns = create("div", div, null, ["inscription-btns"])

        let btn = create("button", btns, "Valider", ["valideButton", "unstyled-button"])
        btn.addEventListener("click", async () => {
            //notification-mail au client
            sendMailTemplate("template_2lkyfis",
                {
                    firstname: inscription.firstname,
                    mail: inscription.email,
                    login:inscription.login
                })
            valideInscription(inscription.id, div);
        })
        btn.title = "Valider"

        btn = create("button", btns, "Refuser", ["refuseButton", "unstyled-button"])
        btn.addEventListener("click", () => {
            sendMail("RefusInscriptionAbonne",
                {firstname: inscription.firstname,
                    mail : inscription.email})
            refuseInscription(inscription.id, div)
        })
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
    axios.get("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=refuse_reservation&idReservation="+idReservation).then( async () => {
        let timeslot = await axios.get("timeslots/timeslots.php?function=fetch_by_id_reservation&idReservation="+idReservation)
        timeslot = timeslot.data
        let client = await axios.get(`users/users.php?function=user&id=` + timeslot.id_client)
        client = client.data
        sendMail("RefusReservationAbonne",
            {
                firstname: client.firstname,
                mail: client.email,
                arretDepart:timeslot.arretDepart,
                debutDate:reecritDateEtHeure(timeslot.dateDepart).debutDate,
                debut:reecritDateEtHeure(timeslot.dateDepart).debut,
                id:client.id
            })
        container.replaceChildren("")
        axios.get(`timeslots/timeslots.php?function=fetch_all_reservation_attente`).then((response) => {
            displayReserv(container, response.data);
        })
    })
}



const toggleValideReservation = (container, props, user = null, multi = false) => {
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

    create("p", modale, "Cette reservation demande le trajet : "+props.arretDepart +" - "+ props.arretArrive)
    create("label", modale, "Combien de minutes le trajet va durer :", ["form-info"]);
    createChamp(modale, "integer", "temps_trajet");

    const bouton = create("div", modale, "Valider", ["submitButton"])
    bouton.addEventListener("click", function(){
        // On recupere le temps du trajet
        let temps_trajet = document.querySelector("input[name='temps_trajet']").value;
        formValidationReservation (modale, props, user, multi, temps_trajet, overlay);


    })
    return container;
}

const formValidationReservation = (container, props, user = null, multi = false, temps_trajet, overlay) => {
    container.replaceChildren("");

    const back = create("button", container, '<< Retour', ['return', "unstyled-button"])
    back.title = "Retour en arrière"
    back.onclick = () => {
        container.remove()
        overlay.remove()
    }

    // Creation d'un affichage pour indiquer si la reservation est acceptable

    var acceptable_bus = create("div", container, "");

    let depart = new Date(props.dateDepart.replace(' ', 'T'));
    let fin = new Date(depart.getTime() + temps_trajet * 60000);

    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    const finAdjusted = new Date(fin.getTime() - timeZoneOffset);


    // Requête axios pour vérifier la disponibilité des bus
    let axiosUrl_bus = `buses/buses.php?function=freeBuses&beginning=${depart.toISOString().slice(0, 16)}&end=${finAdjusted.toISOString().slice(0, 16)};"}`;

    

    axios.get(axiosUrl_bus)
        .then(function (response) {
            // Vérification si la réponse contient des données
            if (response.data.length > 0) {
                acceptable_bus.textContent = "Un bus est disponible ";
                acceptable_bus.style.backgroundColor = "green"; 

            } else {
                acceptable_bus.textContent = "Pas de bus disponible";
                acceptable_bus.style.backgroundColor = "red";

            }
        })

    // Creation d'un affichage pour indiquer si la reservation est acceptable

    var acceptable_driver = create("div", container, "");

    // Requête axios pour vérifier la disponibilité des bus


    let axiosUrl = `users/users.php?function=freeDrivers&beginning=${depart.toISOString().slice(0, 16)}&end=${finAdjusted.toISOString().slice(0, 16)};"}`;

    axios.get(axiosUrl)
        .then(function (response) {
            // Vérification si la réponse contient des données
            if (response.data.length > 0) {
                acceptable_driver.textContent = "Un conducteur est disponible ";
                acceptable_driver.style.backgroundColor = "green"; 

            } else {
                acceptable_driver.textContent = "Pas de conducteur disponible";
                acceptable_driver.style.backgroundColor = "red"; 

            }
        })


    // Creation of each champ
    //create("label", container, "Début : " + props.dateDepart, ["form-info"]);

    
    create("label", container, "Début :", ["form-info"]);
    let champ =createChamp(container, "datetime-local", "StartDateTime");
    champ.value = props.dateDepart
    champ.value = props.dateDepart;
    champ.disabled = true;

    create("label", container, "Fin :", ["form-info"]);

    const endDateTimeInput = createChamp(container, "datetime-local", "EndDateTime");
    
    endDateTimeInput.value = finAdjusted.toISOString().slice(0, 16);
    endDateTimeInput.disabled = true;

    toogleBusChoices(container)
    toogleDriversChoices(container)

    // Creation of submit button
    const bouton = create("button", container, "Valider", ["submitButton", "unstyled-button"])
    bouton.title = "Valider"
    bouton.addEventListener("click", async function () {

        // On recupere le debut et la fin du creneau
        let startDateTime = props.dateDepart;
        let endDateTime = document.querySelector("input[name='EndDateTime']").value;

        // select the types of participants and return those who are checked in a string : 1,2,...
        const selectedDrivers = idOfAllElementChecked("input[name='selectionConducteurs']");
        // select the types of buses and return those who are checked in a string : 1,2,...
        const busesTimeslot = idOfAllElementChecked("input[name='selectionBus']");

        //notification-mail au client
        let client = await axios.get(`users/users.php?function=user&id=` + props.id_client)
        client = client.data

        let arret = await axios.get("timeslots/timeslots.php?function=fetch_by_id_reservation&idReservation="+props.id_reserv)
        arret = arret.data

        sendMail("ConfirmReserv",
            {firstname : client.firstname, mail:client.email, arretDepart:arret.arretDepart, arretArrive:arret.arretArrive, finDate: reecritDateEtHeure(endDateTime).debutDate, debutDate:reecritDateEtHeure(startDateTime).debutDate, debut:reecritDateEtHeure(startDateTime).debut, fin:reecritDateEtHeure(endDateTime).debut, id:client.id})


        removeContainerAndRemoveCacheClass(container)
        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=valide_reservation&idReservation=` + props.id_reserv + `&beginning=` + startDateTime + `&end=` + endDateTime + `&id_users=` + selectedDrivers + `&id_buses=` + busesTimeslot, "/espace-admin", "La réservation a bien été validée", "La réservation n'a pas pu être validée")
    })
}

export {
    changerInfoAbonne,
    changerMdpAbonne,
    displayReserv,
    displayInscr,
    toggleRefuseReservation
}