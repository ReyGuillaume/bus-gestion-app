import { create, createChamp, createChampCheckbox, createChampRadio, toggleAlert } from "../main";
import { toggleEspaceAdmin } from "./espaceAdmin";
import axios from 'axios';


//------------------------------------------------------- */
//   Gestion Lignes
//------------------------------------------------------- */

export const toggleAddLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'une Ligne ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the champ
    create("label", form, "Entrez le numero de la ligne à rentrer :");
    createChamp(form, "integer", "number");

    create("label", form, "Entrez la durée d'un trajet sur cette ligne en minutes :");
    createChamp(form, "integer", "travel_time");


    // Creation of submit button
    const bouton = create("div", form, "Envoyer")
    bouton.addEventListener("click", function(){

        let number = document.querySelector("input[name='number']").value;
        let travel_time = document.querySelector("input[name='travel_time']").value;

        axios.get (`lines/lines.php?function=create&number=${number}&travel_time=${travel_time}`).then(function(){
            toggleEspaceAdmin();
            toggleAlert("BRAVO", "La ligne a bien été ajoutée");
        })

    })

    return main
}

export const toggleSupprLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'une Ligne ")
    create("p", main, "Choisir la(les) ligne(s) à supprimer :")

    // Creation of the form
    const form = create("form", main)

   // Creation of the checkbox to define the user to delete
   var divCheckboxLines = create("div", form);
   axios.get(`lines/lines.php?function=lines`).then((response)=>{
       for(var line of response.data){
           create("br", divCheckboxLines);
           createChampCheckbox(divCheckboxLines, line.number , "selectionLigne", line.number);
           var label = create("label", divCheckboxLines, "Ligne " + line.number);
           label.setAttribute("for", line.number);
         }
   });

    // Creation of submit button
    const bouton = create("div", form, "Envoyer")
    bouton.addEventListener("click", function(){

        for(var line of document.querySelectorAll("input[name='selectionLigne']")){
            if (line.checked) {
                axios.get (`lines/lines.php?function=delete&number=${line.value}`).then(function(){
                    toggleEspaceAdmin();
                    toggleAlert("BRAVO", "La ligne a bien été supprimée");
                })
            }
        }
    })

    return main
}

export const toggleModifLine = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'une Ligne ")
    create("p", main, "Choisir la ligne à modifier:")

    // Creation of the form
    const form = create("form", main)

   // Creation of the radio to select the line to modify
   var divRadioLines = create("div", form);

   // Recuperation de toutes les lignes 
   axios.get(`lines/lines.php?function=lines`).then((response)=>{
       
       for(var line of response.data){
           create("br", divRadioLines);

           //Ajout d'un evenement au clic d'un radio
           createChampRadio(divRadioLines, line.number , "selectionLigne", line.number).addEventListener('click', function(){

                // Fonction de recuperation de la ligne selectionnée
                function lineSelected () {
                    for(var ligne of document.querySelectorAll("input[name='selectionLigne']")){
                        if (ligne.checked) {
                            return ligne.value;
                        }
                    }
                }
            
                // Recuperation de la ligne a modifier
                var numberligneToModify = lineSelected ();
                
                axios.get(`lines/lines.php?function=line&number=${numberligneToModify}`).then((responseLine) =>{
                   
                    // Creation du formulaire pré remplie de modif de ligne 
                    form.replaceChildren("")
                    create("h2", form, "Modifier les champs que vous voulez modifier");
                    create("label", form, "Numero de la ligne :");
                    createChamp(form, "integer", "number").value = responseLine.data.number;

                    create("label", form, "Durée d'un trajet sur cette ligne en minute:");
                    createChamp(form, "integer", "travel_time").value = responseLine.data.travel_time;

                    // Creation of submit button
                    const bouton = create("div", form, "Envoyer")
                    bouton.addEventListener("click", function(){

                        let travel_time = document.querySelector("input[name='travel_time']").value;
                        let number = document.querySelector("input[name='number']").value;

                        axios.get (`lines/lines.php?function=updateline&number=${number}&travel_time=${travel_time}`).then(function(){
                            toggleEspaceAdmin();
                            toggleAlert("BRAVO", "La ligne a bien été modifiée");
                        })

                    })

                });
            });

                
            var label = create("label", divRadioLines, "Ligne " + line.number);
            label.setAttribute("for", line.number);
            
        }
   }
   );

    return main

}