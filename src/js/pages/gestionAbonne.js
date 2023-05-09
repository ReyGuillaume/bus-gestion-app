import {create, createChamp} from "../utils/domManipulation.js";
import axios from "axios";
import {fetchUrlRedirectAndAlert, idOfAllElementChecked} from "../utils/formGestion.js";
import {toggleInfoAbonne} from "./espaceAbonne.js";
import {removeContainerAndRemoveCacheClass} from "./userTask.js";
import {toogleBusChoices, toogleDriversChoices }from "./gestionTimeslots.js";
import { createHeader } from "../components/header.js";

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


function displayReserv (container, data) {

    // recuperation des infos de l'utilisateur
    const roleUser = JSON.parse(sessionStorage.getItem("userData")).role;

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
            let footer = document.querySelector("#footer")
            let task = create("div", footer, null, null, "task")
            create("div", divResp, "Valider", ['gestion_users']).addEventListener("click", () => toggleValideReservation(task, reserv))
            create("div", divResp, "Refuser", ['gestion_users']).addEventListener("click", () => toggleRefuseReservation(reserv.id_reserv, container, data))

        }
    }
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
    const main = document.querySelector("#app")
    main.classList.add("cache")
    container.classList.remove("cache")

    // Creation du formulaire pré remplie de modif de ligne
    container.replaceChildren("")

    create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

    // Creation of each champ
    //create("label", container, "Début : " + props.dateDepart, ["form-info"]);

    create("label", container, "Début :", ["form-info"]);
    let champ =createChamp(container, "datetime-local", "StartDateTime");
    champ.value = props.dateDepart
    champ.disabled = true;
    
    create("label", container, "Fin :", ["form-info"]);
    createChamp(container, "datetime-local", "EndDateTime").value = props.dateDepart;

    toogleBusChoices(container)
    toogleDriversChoices(container)


    // Creation of submit button

    const bouton = create("div", container, "Valider", ["submitButton"])
    bouton.addEventListener("click", function(){
        // On recupere le debut et la fin du creneau
        let startDateTime = props.dateDepart;
        let endDateTime = document.querySelector("input[name='EndDateTime']").value;

        // select the types of participants and return those who are checked in a string : 1,2,...
        const selectedDrivers = () => idOfAllElementChecked("input[name='selectionConducteurs']")
        console.log(selectedDrivers())
// select the types of buses and return those who are checked in a string : 1,2,...
        const busesTimeslot = () => idOfAllElementChecked("input[name='selectionBus']")

        fetchUrlRedirectAndAlert(`timeslots/timeslots.php?function=valide_reservation&idReservation=`+props.id_reserv+`&beginning=`+startDateTime+`&end=`+endDateTime+`&id_users=`+selectedDrivers()+`&id_buses=`+busesTimeslot(), "/espace-admin", "La réservation a bien été validée", "La réservation n'a pas pu être validée")
    })

    return container;
}

export {
    changerInfoAbonne,
    changerMdpAbonne,
    displayReserv,
    toggleRefuseReservation,
    toggleValideReservation
}