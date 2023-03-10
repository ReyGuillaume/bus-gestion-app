import { create, createChamp, toggleAlert } from "../main";
import { createHeader } from "../components/header";
import axios from 'axios';

export const toggleAdminForm = () => {
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
                
                // Store the user's data in sessionStorage
                const userData = { id, prenom, nom, role, idrole };
                sessionStorage.setItem("userData", JSON.stringify(userData));

                // Refresh display of header (to show the user's session)
                createHeader();

                // Redirection to the user page according to his role
                if (idrole == 1 || idrole == 2){
                    window.location = "/espaceAdmin"
                }
                else{
                    window.location = "/espaceUser"
                }        
            }
            else{
                toggleAlert(main, "ATTENTION", "Formulaire invalide !")
            }
        })
    });

    return main
    
}