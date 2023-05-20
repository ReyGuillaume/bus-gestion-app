
import { create, createChamp, createChampCheckbox, createChampRadio, toggleError } from "../utils/domManipulation";
import {
    fetchUrlRedirectAndAlert,
    fetchUrlWithLoading,
    valueFirstElementChecked,
    countElementChecked,
    addslashes
} from "../utils/formGestion";
import {redirect, toggleAlertMessage} from "../utils/redirection";
import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Arrets
//------------------------------------------------------- */
const toggleAddArrets =() =>{
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData"))
        redirect("/")

    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.addEventListener("click", () => redirect("/arrets"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajout d'un arrêt ")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the champ
    const div_name = create("div", form, null, ["form-div"])
    create("label", div_name, "Entrez le nom de l'arrêt à ajouter :", ["label-info"]);
    createChamp(div_name, "text", "name");


    // Creation of submit button
    const bouton = create("button", form, "Envoyer", ["submitButton"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function(){
        let name = document.querySelector("input[name='name']").value;

        fetchUrlRedirectAndAlert(`arrets/arrets.php?function=create&nom_arret=${name}`, "/arrets", "L'arret a bien été ajoutée", "L'arret n'a pas pu être ajoutée")
    })
}

const createArretRadio = (form, container, arret, type) => {
    //Ajout d'un evenement au clic d'un radio
    createChampRadio(container, "a"+arret.id , "selectionArret", arret.id)
    .addEventListener('click', function() {
        // Recuperation de la ligne a modifier
        var idArret = valueFirstElementChecked("input[name='selectionArret']");

        axios.get(`arrets/arrets.php?function=arret_by_id&id=${idArret}`).then((responseArret) => {
            // Creation du formulaire pré remplie de modif de ligne
            form.replaceChildren("")

            const div_name = create("div", form, null, ["form-div"])
            create("label", div_name, "Nom de l'arrêt :", ["form-info"]);
            createChamp(div_name, "text", "name").value = responseArret.data.name;


            // Creation of submit button
            if (type === "modify") {
                const bouton = create("div", form, "Modifier", ["submitButton"])
                bouton.title = "Modifier"
                bouton.addEventListener("click", function () {
                    let name = document.querySelector("input[name='name']").value;
                    fetchUrlRedirectAndAlert(`arrets/arrets.php?function=modify_arret&id=` + idArret + `&newName=` + addslashes(name), "/arrets", "L'arrêt a bien été modifié", "L'arrêt n'a pas pu être modifié")
                })
            } else if (type === "delete") {
                fetchUrlRedirectAndAlert(`arrets/arrets.php?function=delete_arret&id=` + idArret, "/arrets", "L'arrêt a bien été supprimé", "L'arrêt n'a pas pu être supprimé")
            }
        })
    })
    var label = create("label", container, arret.name);
    label.setAttribute("for", "a" + arret.id);
}


const toggleModifyArrets =()=>{
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData"))
        redirect("/")
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/arrets"))
    back.title = "Retour en arrière"

    create("h2", main, "Modification d'un arret ")
    create("p", main, "Choisir l'arret à modifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])
    
    // Recuperation de toutes les lignes 
   axios.get(`arrets/arrets.php?function=arrets`).then(response => {
    for(var arret of response.data){
        var div_arret = create("div", form, null, ["form-div-radio"])
        createArretRadio(form, div_arret, arret, "modify")
    }
})
}


const toggleDeleteArret = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection si user n'est pas connecté
    if(!sessionStorage.getItem("userData"))
        redirect("/")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/arrets"))
    back.title = "Retour en arrière"

    create("h2", main, "Suppression d'un arret ")
    create("p", main, "Choisir l'arret à supprimer :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Recuperation de toutes les lignes
    axios.get(`arrets/arrets.php?function=arrets`).then(response => {
        for(var arret of response.data){
            var div_arret = create("div", form, null, ["form-div-radio"])
            createArretRadio(form, div_arret, arret, "delete")
        }
    })

}

export {
    toggleAddArrets,
    toggleModifyArrets,
    toggleDeleteArret
    

}