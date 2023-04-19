import { create, createChamp, createChampCheckbox, createChampRadio } from "../main";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Utilisateurs
//------------------------------------------------------- */

export const toggleAjoutUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'Utilisateur")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)
    create("br", form);

    create("label", form, "Entrez le prénom de l'utilisateur :");
    createChamp(form, "text", "nameUser");
    create("br", form);

    create("label", form, "Entrez le nom de l'utilisateur :");
    createChamp(form, "text", "lastNameUser");
    create("br", form);

    create("label", form, "Entrez le login de l'utilisateur :");
    createChamp(form, "text", "loginUser");
    create("br", form);

    create("label", form, "Entrez son email :");
    createChamp(form, "email", "mailUser");
    create("br", form);

    create("label", form, "Entrez la date de naissance de l'utilisateur :");
    createChamp(form, "date", "birthDate");
    create("br", form);

    // creation of a radio to choose the role of the user created
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de l'utilisateur :");
    axios.get(`users/users.php?function=usertypes`).then((response)=>{
        console.log(response);
        for(var type of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, type.id , "typeUser", type.id);
            var label = create("label", divRadio, type.name );
            label.setAttribute("for", type.id);
          }
    });


    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        // return the type of the user checked
        function typeUser () {
            let res = null;
            for(var type of document.querySelectorAll("input[name='typeUser']")){
                if (type.checked) {
                    res = type.value;
                }
            }return res;
        }
        // selection the infos
        let login = document.querySelector("input[name='loginUser']").value;
        let date = document.querySelector("input[name='birthDate']").value;
        let name = document.querySelector("input[name='lastNameUser']").value;
        let firstname = document.querySelector("input[name='nameUser']").value;
        let email = document.querySelector("input[name='mailUser']").value;
        let type = typeUser();

        //creation of the url
        let url = `users/users.php?function=create&login=${login}&password=gobus123&confirm=gobus123&date=${date}&name=${name}&firstname=${firstname}&email=${email}&type=${type}`

        axios.get(url)

    })
    form.appendChild(bouton);

    return main
   

}

export const toggleModifyUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'Utilisateur")
    create("p", main, " Choisissez l'utilisateur à modifier : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to select the user to modify
    var divRadioUser = create("div", form);

    // Recuperation de tous les utilisateurs
    axios.get(`users/users.php?function=users`).then((response)=>{

        for(var user of response.data){
            create("br", divRadioUser);

            //Ajout d'un evenement au clic d'un radio
           createChampRadio(divRadioUser, user.id , "selectionUser", user.id).addEventListener('click', function(){
                
                // Fonction de recuperation de l'user selectionnée
                function userSelected () {
                    for(var user of document.querySelectorAll("input[name='selectionUser']")){
                        if (user.checked) {
                            return user.value;
                        }
                    }
                }


            // Recuperation de l'utilisateur a modifier
            var idUserToModify = userSelected ();
            axios.get(`users/users.php?function=user&id=${idUserToModify}`).then((responseUser) =>{
                   
                // Creation du formulaire pré remplie de modif de user
                main.replaceChildren("")
                const form = create("form", main)
                create("br", form);

                create("label", form, "Le prénom de l'utilisateur :");
                createChamp(form, "text", "nameUser").value = responseUser.data.firstname;
                create("br", form);

                create("label", form, "Le nom de l'utilisateur :");
                createChamp(form, "text", "lastNameUser").value = responseUser.data.name;
                create("br", form);

                create("label", form, "Le login de l'utilisateur :");
                createChamp(form, "text", "loginUser").value = responseUser.data.login;
                create("br", form);

                create("label", form, "L'email de l'utilisateur :");
                createChamp(form, "email", "mailUser").value = responseUser.data.email;
                create("br", form);

                create("label", form, "La date de naissance de l'utilisateur :");
                createChamp(form, "date", "birthDate").value = responseUser.data.birth_date;
                create("br", form);

                const bouton = create("button", form, "Envoyer")
                bouton.addEventListener("click", function (event){
                    // return the type of the user checked
                    function typeUser () {
                        let res = null;
                        for(var type of document.querySelectorAll("input[name='typeUser']")){
                            if (type.checked) {
                                res = type.value;
                            }
                        }return res;
                    }
                    // selection the infos
                    let login = document.querySelector("input[name='loginUser']").value;
                    let date = document.querySelector("input[name='birthDate']").value;
                    let name = document.querySelector("input[name='lastNameUser']").value;
                    let firstname = document.querySelector("input[name='nameUser']").value;
                    let email = document.querySelector("input[name='mailUser']").value;
                    let type = typeUser();

                    //creation of the url
                    let url = `users/users.php?function=update&id=${idUserToModify}&email=${email}&login=${login}`;
                    axios.get(url)

                })
                form.appendChild(bouton);

            });
        });

            var label = create("label", divRadioUser, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of submit button
    return main
}

export const toggleSupprimeUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'Utilisateur")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the user to delete
    var divCheckboxUsers = create("div", form);
    create("label", divCheckboxUsers, "Choisissez le(s) utilisateur(s) à supprimer :");
    axios.get(`users/users.php?function=users`).then((response)=>{
        console.log(response);
        for(var user of response.data){
            create("br", divCheckboxUsers);
            createChampCheckbox(divCheckboxUsers, user.id , "selectionUSer", user.id);
            var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
            label.setAttribute("for", user.id);
          }
    });

    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        // delete the user who are checked
        for(var user of document.querySelectorAll("input[name='selectionUSer']")){
            let url = `users/users.php?function=delete&id=`;
            if (user.checked) {
                url += user.value;
                axios.get(url)
            }
        }
    })
    form.appendChild(bouton);

    return main

}