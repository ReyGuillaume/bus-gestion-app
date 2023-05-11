import { create, createChamp, toggleError } from "../utils/domManipulation";
import { createHeader } from "../components/header";
import { redirectUser, redirect } from "../utils/redirection";
import axios from 'axios';

const toggleAdminForm = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Formulaire d'authentification",["titleonplace"])

    // Creation of the form
    const form = create("div", main, null, null, "adminFormulaire")

    create("img", form, null, ["usericon"], null, "src/assets/images/icon _users_.png", "image")


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
                    () => redirect("/espace-admin"), 
                    () => redirect("/espace-admin"),
                    () => redirect("/espace-utilisateur"),
                    () => redirect("/espace-abonne")
                )
            } else {
                toggleError("ATTENTION", "Formulaire invalide !")
            }
        })
    })
}

export { toggleAdminForm }