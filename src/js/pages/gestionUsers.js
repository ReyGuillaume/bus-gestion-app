import { create, createChamp, createChampCheckbox, createChampRadio } from "../utils/domManipulation";
import { fetchUrlRedirectAndAlert, valueFirstElementChecked } from "../utils/formGestion";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { redirect } from "../utils/redirection";

import axios from 'axios';

//------------------------------------------------------- */
//   Gestion Utilisateurs
//------------------------------------------------------- */

const toggleAjoutUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/utilisateurs"))
    back.title = "Retour en arrière"

    create("h2", main, "Ajout d'Utilisateur")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    const div_prenom = create("div", form, null, ["form-div"])
    create("label", div_prenom, "Entrez le prénom de l'utilisateur :", ["label-info"]);
    createChamp(div_prenom, "text", "nameUser");

    const div_nom = create("div", form, null, ["form-div"])
    create("label", div_nom, "Entrez le nom de l'utilisateur :", ["label-info"]);
    createChamp(div_nom, "text", "lastNameUser");

    const div_login = create("div", form, null, ["form-div"])
    create("label", div_login, "Entrez le login de l'utilisateur :", ["label-info"]);
    createChamp(div_login, "text", "loginUser");

    const div_email = create("div", form, null, ["form-div"])
    create("label", div_email, "Entrez son email :", ["label-info"]);
    createChamp(div_email, "email", "mailUser");

    const div_naiss = create("div", form, null, ["form-div"])
    create("label", div_naiss, "Entrez la date de naissance de l'utilisateur :", ["label-info"]);
    createChamp(div_naiss, "date", "birthDate");

    // creation of a radio to choose the role of the user created
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de l'utilisateur :", ["label-info"]);
    axios.get(`users/users.php?function=usertypes`).then((response)=>{
        for(var type of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, "ut"+type.id , "typeUser", type.id);
            var label = create("label", divRadio, type.name );
            label.setAttribute("for", "ut"+type.id);
          }
    });


    const bouton = create("button", form, "Envoyer", ["submitButton", "unstyled-button"])
    bouton.title = "Envoyer"
    bouton.addEventListener("click", function (){
        // return the type of the user checked
        
        // selection the infos
        let login = document.querySelector("input[name='loginUser']").value;
        let date = document.querySelector("input[name='birthDate']").value;
        let name = document.querySelector("input[name='lastNameUser']").value;
        let firstname = document.querySelector("input[name='nameUser']").value;
        let email = document.querySelector("input[name='mailUser']").value;
        let type = valueFirstElementChecked("input[name='typeUser']");

        //creation of the url
        let url = `users/users.php?function=create&login=${login}&password=gobus123&confirm=gobus123&date=${date}&name=${name}&firstname=${firstname}&email=${email}&type=${type}`
        fetchUrlRedirectAndAlert(url, "/espace-admin", "L'utilisateur a bien été ajouté", "L'utilisateur n'a pas pu être ajouté")
    })
}

const toggleModifyUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/utilisateurs"))
    back.title = "Retour en arrière"

    create("h2", main, "Modification d'Utilisateur")
    create("p", main, "Choisissez l'utilisateur à modifier :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Recuperation de tous les utilisateurs
    axios.get(`users/users.php?function=users`).then(response => {

        for(var user of response.data){
            var div_user = create("div", form, null, ["form-div-radio"])

            //Ajout d'un evenement au clic d'un radio
            createChampRadio(div_user, "u"+user.id , "selectionUser", user.id).addEventListener('click', function(){

            // Recuperation de l'utilisateur a modifier
            var idUserToModify = valueFirstElementChecked("input[name='selectionUser']");
            axios.get(`users/users.php?function=user&id=${idUserToModify}`).then((responseUser) =>{
                   
                // Creation du formulaire pré remplie de modif de user
                main.replaceChildren("")
                const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
                back.addEventListener("click", toggleEspaceAdmin)
                back.title = "Retour en arrière"

                const form = create("div", main, null, ["app-form"])

                create("label", form, "Le prénom de l'utilisateur :", ["label-info"]);
                createChamp(form, "text", "nameUser").value = responseUser.data.firstname;

                create("label", form, "Le nom de l'utilisateur :", ["label-info"]);
                createChamp(form, "text", "lastNameUser").value = responseUser.data.name;

                create("label", form, "Le login de l'utilisateur :", ["label-info"]);
                createChamp(form, "text", "loginUser").value = responseUser.data.login;

                create("label", form, "L'email de l'utilisateur :", ["label-info"]);
                createChamp(form, "email", "mailUser").value = responseUser.data.email;

                create("label", form, "La date de naissance de l'utilisateur :", ["label-info"]);
                createChamp(form, "date", "birthDate").value = responseUser.data.birth_date;

                const bouton = create("button", form, "Modifier", ["submitButton", "unstyled-button"])
                bouton.title = "Modifier"
                bouton.addEventListener("click", function (){
                    
                    // selection the infos
                    let login = document.querySelector("input[name='loginUser']").value;
                    let email = document.querySelector("input[name='mailUser']").value;

                    //creation of the url
                    let url = `users/users.php?function=update&id=${idUserToModify}&email=${email}&login=${login}`
                    fetchUrlRedirectAndAlert(url, "/espace-admin", "L'utilisateur a bien été modifié", "L'utilisateur n'a pas pu être modifié")
                })
            });
        });

        var label = create("label", div_user, user.name + " "+ user.firstname);
        label.setAttribute("for", "u"+user.id);
    }})
}

// delete the user who are checked
const deleteUsersChecked = () => {
    for(var user of document.querySelectorAll("input[name='selectionUSer']")){
        if (user.checked) {
            let url = `users/users.php?function=delete&id=${user.value}`;
            fetchUrlRedirectAndAlert(url, "/espace-admin", "L'utilisateur a bien été supprimé", "L'utilisateur n'a pas pu être supprimé")
        }
    }
}

const toggleSupprimeUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/utilisateurs"))
    back.title = "Retour en arrière"

    create("h2", main, "Suppression d'Utilisateur")
    create("p", main, "Rentrez les informations suivantes :", ["presentation"])

    // Creation of the form
    const form = create("div", main, null, ["app-form"])

    // Creation of the checkbox to define the user to delete
    create("label", form, "Choisissez le(s) utilisateur(s) à supprimer :", ["label-info"]);
    axios.get(`users/users.php?function=users`).then((response)=>{
        for(var user of response.data){
            var div_user = create("div", form, null, ["form-div-radio"])
            create("br", div_user);
            createChampCheckbox(div_user, "u"+user.id , "selectionUSer", user.id);
            var label = create("label", div_user, user.name + " "+ user.firstname);
            label.setAttribute("for", "u"+user.id);
        }
        // Creation of submit button
        const bouton = create("button", form, "Supprimer", ["submitButton", "unstyled-button"])
        bouton.title = "Supprimer"
        bouton.onclick = () => deleteUsersChecked()
    });
}


export {
    toggleAjoutUser,
    toggleModifyUser,
    toggleSupprimeUser
}