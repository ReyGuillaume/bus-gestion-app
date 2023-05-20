import { create, createChamp, toggleError} from "../utils/domManipulation";
import { fetchUrlRedirectAndAlert, addslashes } from "../utils/formGestion";
import { toggleEspaceUser } from "./espaceUser";
import axios from 'axios';

const toggleIndisponibilitiForm = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData"))
        redirect("/")

    create("h2", main, "Ajout de créneaux d'indisponibilité")
    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", toggleEspaceUser)
    back.title = "Retour en arrière"

    create("p", main, "Renseignez la plage horaire de votre indisponibilité :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of each champ
    create("label", form, "Début :", ["label-info"]);
    createChamp(form, "datetime-local", "StartDateTime");
    create("label", form, "Fin :", ["label-info"]);
    createChamp(form, "datetime-local", "EndDateTime");

    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){

        let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
        let user = JSON.parse(sessionStorage.getItem("userData")).id;
        if (![StartDateTime, EndDateTime].includes("")) {
            let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=3&users=${user}`
            fetchUrlRedirectAndAlert(url, "espace-utilisateur", "Votre indisponibilité a bien été ajoutée", "Votre indisponibilité n'a pas pu être ajoutée")
        } else {
            toggleError("ERREUR", "L'un des champs du formulaire n'a pas été renseigné")
        }
    })
}

export {
    toggleIndisponibilitiForm
}