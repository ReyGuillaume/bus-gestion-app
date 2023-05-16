import { create, createChamp, toggleError } from "../utils/domManipulation";
import { createHeader } from "../components/header";
import { redirectUser, redirect } from "../utils/redirection";
import { fetchUrlRedirectAndAlert } from "../utils/formGestion";
import axios from 'axios';

const toggleConnexion = () => {

    // redirection si user est connecté
    if(sessionStorage.getItem("userData"))
        redirect("/")

    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Formulaire d'authentification")

    // Creation of the form
    const form = create("div", main, null, null, "adminFormulaire")

    // Creation of each champ
    create("label", form, "Login :");
    createChamp(form, "text", "login");

    create("label", form, "Password :");
    createChamp(form, "password", "password");

    // Creation of the submit button
    const bouton = create("button", form, "Envoyer", null, "adminButton")
    bouton.title = "Envoyer"

    // Action of the submit button
    bouton.addEventListener("click", function(){

        // Get value of the fields entered by the user
        let login = document.querySelector("input[name='login']").value;
        let password = document.querySelector("input[name='password']").value;

        login = login.replace("'", "");
        password = password.replace("'", "");

        // Trying to find the user in the database
        axios.get("users/users.php?function=authentification&login="+login+"&password="+password).then(function(response){
            let user = response.data;

            if(user){
                let id = user.id;
                let nom = user.lastname;
                let prenom = user.firstname;
                let role = user.name;
                let idrole = user.idrole;
                let email = user.email;
                
                // Store the user's data in sessionStorage
                const userData = { id, prenom, nom, role, idrole, email };
                sessionStorage.setItem("userData", JSON.stringify(userData));

                // Refresh display of header (to show the user's session)
                createHeader();

                redirectUser(
                    () => redirect("/agenda"), 
                    () => redirect("/agenda"),
                    () => redirect("/agenda"),
                    () => redirect("/espace-abonne")
                )
            } else {
                toggleError("ATTENTION", "Formulaire invalide !")
            }
        })
    })
}


const toggleInscriptionForm = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Formulaire d'inscription")

    // Creation of the form
    const form = create("div", main, null, null, "adminFormulaire")

    // Creation of each champ
    const prenom = create("div", form)
    create("label", prenom, "Prénom :")
    createChamp(prenom, "text", "prenom")

    const nom = create("div", form)
    create("label", nom, "Nom :")
    createChamp(nom, "text", "nom")

    const email = create("div", form)
    create("label", email, "Email :")
    createChamp(email, "text", "email")

    const birth_date = create("div", form)
    create("label", birth_date, "Date de naissance :")
    createChamp(birth_date, "date", "birth_date")

    const login = create("div", form)
    create("label", login, "Login :")
    createChamp(login, "text", "login")

    const password = create("div", form)
    create("label", password, "Mot de passe :")
    createChamp(password, "password", "password")

    // Creation of the submit button
    const bouton = create("button", form, "Envoyer", null, "adminButton")
    bouton.title = "Envoyer"

    bouton.addEventListener("click", function(){
        let prenom = document.querySelector("input[name='prenom']").value
        let nom = document.querySelector("input[name='nom']").value
        let email = document.querySelector("input[name='email']").value
        let birth_date = document.querySelector("input[name='birth_date']").value
        let login = document.querySelector("input[name='login']").value
        let password = document.querySelector("input[name='password']").value

        let url = `users/users.php?function=inscription&prenom=${prenom}&nom=${nom}&email=${email}&birth_date=${birth_date}&login=${login}&password=${password}` 
        fetchUrlRedirectAndAlert(url, "/", "Demande d'inscription envoyée", "Demande d'inscription erronnée")
    })
}

export { toggleConnexion, toggleInscriptionForm }