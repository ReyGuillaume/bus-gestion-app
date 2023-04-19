import { create, createChamp, createChampCheckbox, toggleAlert, addslashes} from "../main";
import { toggleEspaceUser } from "./espaceUser";
import axios from 'axios';

export const toggleIndisponibilitiForm = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Ajout de créneaux d'indisponibilité")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceUser)
    create("p", main, "Renseignez la plage horaire de votre indisponibilité :", ["presentation"])

    // Creation of the form
    const form = create("form", main)
    

    // Creation of each champ
    create("label", form, "Début :");
    createChamp(form, "datetime-local", "StartDateTime");
    create("label", form, "Fin :");
    createChamp(form, "datetime-local", "EndDateTime");

    // Creation of submit button
    const bouton = create("div", form, "Envoyer", ["submitButton"])
    bouton.addEventListener("click", function(){

        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
        let user = JSON.parse(sessionStorage.getItem("userData")).id;

        let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=3&users=${user}`
        axios.get(url).then(function(){
            toggleEspaceUser();
            toggleAlert("BRAVO", "Votre indisponibilité a bien été ajoutée");
        });

        let messageDebut = addslashes ("Votre créneau d'indisponibilité du ");
        let messageFin = addslashes(" a bien été ajouté.");
        axios.get(`notifications/notifications.php?function=create&title=Attention&message=`+messageDebut+ StartDateTime +` au `+ EndDateTime +messageFin+`&recipient=`+JSON.parse(sessionStorage.getItem("userData")).id);


    });

    return main
}

export const toggleSupprIndispo = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Supprimer un créneau d'indisponibilité")
    create("div", main, "<< Retour", ["return"]).addEventListener("click", toggleEspaceUser)
    create("p", main, "Choisissez le(s) créneau(x) à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("form", main)

   // Creation of the checkbox to define the user to delete
   let user = JSON.parse(sessionStorage.getItem("userData")).id;

   axios.get(`timeslots/timeslots.php?function=indispoDriver&id=${user}`).then((response)=>{
       for(var timeslot of response.data){
        create("br", divCheckboxCreneau);
        createChampCheckbox(divCheckboxCreneau, timeslot.id , "selectionTimeslot", timeslot.id);
        var label = create("label", divCheckboxCreneau, timeslot.begining + " "+ timeslot.end+ " ");
        label.setAttribute("for", timeslot.id);
      }
   });

    // Creation of submit button
    const bouton = create("div", form, "Envoyer")
    bouton.addEventListener("click", function(){
        for(var date of document.querySelectorAll("input[name='selectionTimeslot']")){
            if (date.checked){
                axios.get(`timeslots/timeslots.php?function=delete&id=${date.value}`).then(function(){
                    toggleEspaceUser();
                    toggleAlert("BRAVO", "Votre indisponibilité a bien été supprimée");
                });

                axios.get(`timeslots/timeslots.php?function=timeslot&id=${date.value}`).then((response)=>{
                    let messageDebut = addslashes ("Votre créneau d'indisponibilité du ");
                    let messageFin = addslashes(" a bien été supprimé.");
                    axios.get(`notifications/notifications.php?function=create&title=Attention&message=`+messageDebut+ response.data.begining +` au `+ response.data.end +messageFin+`&recipient=`+JSON.parse(sessionStorage.getItem("userData")).id);
                })
            }

        // Creation of submit button
        const bouton = create("div", form, "Supprimer", ["submitButton"])
        bouton.addEventListener("click", function(){
            for(var date of document.querySelectorAll("input[name='selectionTimeslot']")){
                if (date.checked){
                    axios.get(`timeslots/timeslots.php?function=delete&id=${date.value}`).then(function(){
                        toggleEspaceUser();
                        toggleAlert("BRAVO", "Votre indisponibilité a bien été supprimée");
                    })
                }
            }
        })
    }
   });

    return main
    
}