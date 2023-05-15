import {create, createChamp, toggleAlert} from "../utils/domManipulation.js";
import axios from "axios";
import {addslashes, fetchUrlRedirectAndAlert, idOfAllElementChecked} from "../utils/formGestion.js";
import {createReservationRadio, toggleInfoAbonne} from "./espaceAbonne.js";
import {removeContainerAndRemoveCacheClass} from "./userTask.js";
import {toogleBusChoices, toogleDriversChoices }from "./gestionTimeslots.js";
import { createHeader } from "../components/header.js";
import {createMenuElement} from "../components/menuItem.js";
import {redirect} from "../utils/redirection.js";
import {formatedHour} from "../utils/dates.js";


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
        create("h3", container, "Il n'y a aucune réservation")

    for(let reserv of data){
        let title = reserv.arretDepart + "  -  "+ reserv.arretArrive;
        let message = reserv.dateDepart;

        let divInfoReserv = create("div", container, null, ["divNotif"]);
        let div = create("div", divInfoReserv, null, ["divInfoReserv"]);
        create("h3", div, title);
        create("p", div, message);

        let divResp = create("div", divInfoReserv, null, ["divBoutonsReserv"]);
        let footer = document.querySelector("#footer")

        if(roleUser != "Abonné"){
            const b1 = create("button", divResp, "Valider", ['gestion_users'])
            b1.onclick = () => toggleValideReservation(footer, reserv)
            b1.title = "Valider"
            const b2 = create("button", divResp, "Refuser", ['gestion_users'])
            b2.onclick = () => toggleRefuseReservation(reserv.id_reserv, container, data)
            b2.title = "Refuser"
        }
        else{
            switch (reserv.etat){
                case "attente" :
                    // Creation of the form
                    const form = create("div", footer, null, null, "task")
                    var div_reservation = create("div", container, null, ["form-div-radio"])
                    createMenuElement(divResp, () => createReservationRadio(form, div_reservation, reserv, "/reservation-abonne"), "rouge", "../src/assets/images/edit.png", "modifier", ""  )
                    createMenuElement(divResp, () =>
                        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=`+reserv.id_reserv, "/reservation-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
                        , "rouge", "../src/assets/images/croix.png", "supprimer", ""  )
                    break;
                case "valide":
                    break;
                case "refuse":
                    createMenuElement(divResp, () =>
                            fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=delete_reservation&idReservation=`+reserv.id_reserv, "/reservation-abonne", "La réservation a bien été supprimée", "La réservation n'a pas pu être supprimée")
                        , "rouge", "../src/assets/images/croix.png", "supprimer", ""  )
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
        formValidationReservation (modale, props, user, multi, temps_trajet);


    })
    return container;
}

const formValidationReservation = (container, props, user = null, multi = false, temps_trajet) => {
    container.replaceChildren("");

    // Creation d'un affichage pour indiquer si la reservation est acceptable

    var acceptable_bus = create("div", container, "");

    let depart = new Date(props.dateDepart.replace(' ', 'T'));
    let fin = new Date(depart.getTime() + temps_trajet * 60000);

    // Requête axios pour vérifier la disponibilité des bus
    let axiosUrl_bus = `buses/buses.php?function=freeBuses&beginning=${depart}&end=${fin}`;

    axios.get(axiosUrl_bus)
        .then(function (response) {
            // Vérification si la réponse contient des données
            if (response.data.length > 0) {
                acceptable_bus.textContent = "Un bus est disponible ";
            } else {
                acceptable_bus.textContent = "Pas de bus disponible";
            }
        })

    // Creation d'un affichage pour indiquer si la reservation est acceptable

    var acceptable_driver = create("div", container, "");

    // Requête axios pour vérifier la disponibilité des bus


    let axiosUrl = `users/users.php?function=freeDrivers&beginning=${depart}&end=${fin}`;

    axios.get(axiosUrl)
        .then(function (response) {
            // Vérification si la réponse contient des données
            if (response.data.length > 0) {
                acceptable_driver.textContent = "Un conducteur est disponible ";
            } else {
                acceptable_driver.textContent = "Pas de conducteur disponible";
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


    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    const finAdjusted = new Date(fin.getTime() - timeZoneOffset);
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

        //notification au client
        let client = await axios.get(`users/users.php?function=user&id=` + props.id_client)
        client = client.data

        let arret = await axios.get("timeslots/timeslots.php?function=fetch_by_id_reservation&idReservation="+props.id_reserv)
        arret = arret.data

        let heure_debut = formatedHour(new Date(startDateTime).getHours())
        let min_debut = formatedHour(new Date(startDateTime).getMinutes())
        let heure_fin = formatedHour(new Date(endDateTime).getHours())
        let min_fin = formatedHour(new Date(endDateTime).getMinutes())

        let debut_jour = formatedHour(new Date(startDateTime).getDate())
        let debut_annee = formatedHour(new Date(startDateTime).getFullYear())
        let debut_mois = formatedHour(new Date(startDateTime).getMonth())
        let fin_jour = formatedHour(new Date(endDateTime).getDate())
        let fin_annee = formatedHour(new Date(endDateTime).getFullYear())
        let fin_mois = formatedHour(new Date(endDateTime).getMonth())

        let debut = heure_debut+":"+min_debut
        let fin = heure_fin+":"+min_fin
        let debutDate = debut_jour+"/"+debut_mois+"/"+debut_annee
        let finDate = fin_jour+"/"+fin_mois+"/"+fin_annee

        let titre = "Confirmation de votre réservation de bus pour " + arret.arretDepart + " - " + arret.arretArrive;
        let message = "Bonjour " + client.firstname +", "+"<br>"+"<br>"
        message += "Je suis ravi de vous informer que votre réservation de bus a été <strong>validée</strong> avec succès. Votre bus partira de l'arrêt <strong>"
            +arret.arretDepart+"</strong> à <strong>"+debut+"</strong> le <strong>"+debutDate+"</strong> et arrivera à l'arrêt <strong>"+arret.arretArrive+"</strong> à <strong>"+fin+"</strong> le <strong>"+finDate+"</strong><br>"+"<br>"
        message+="Nous avons affecté un chauffeur <strong>expérimenté</strong> à votre bus pour vous assurer un voyage <strong>sûr et agréable</strong>. Notre équipe de conducteurs est formée pour offrir un service de <strong>qualité</strong> et pour prendre <strong>soin de nos passagers</strong>."+"<br>"+"<br>"+
            "Veuillez vous assurer <strong>d'arriver à l'arrêt de départ à l'heure</strong> pour éviter tout retard pour vous. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous <strong>contacter</strong> et nous ferons tout notre possible pour vous aider."+"<br>"+"<br>"+
            "Nous sommes impatients de vous accueillir à bord de notre bus et de vous offrir une expérience de voyage agréable et sans tracas."+"<br>"+"<br>"+
            "Cordialement,"+"<br>"+"L'équipe de réservation de bus de <strong>GoBus</strong>."

        axios.get(`notifications/notifications.php?function=create&title=${addslashes(titre)}&message=${addslashes(message)}&recipient=` + client.id)
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