import { create, createChamp, createChampCheckbox, createChampRadio } from "../main";

import axios from 'axios';
//------------------------------------------------------- */
//   Gestion Bus 
//------------------------------------------------------- */

export const AjoutBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Ajout d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to add
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadio, bustype.name );
            label.setAttribute("for", bustype.id);
            

          }
    });
    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        for(var type of document.querySelectorAll("input[name='typeBus']")){
            if (type.checked) {
                axios.get(`buses/buses.php?function=create&type=`+type.value);
            }
        }
    })
    form.appendChild(bouton);

    return main

}

export const ModifBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Modification d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the radio to define the bus to modify
    var divRadio = create("div", form);
    create("label", divRadio, "Choisissez le bus à modifier :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        console.log(response);
        for(var bus of response.data){
            create("br", divRadio);
            createChampRadio(divRadio, bus.id , "idBus", bus.id);
            var label = create("label", divRadio, bus.id );
            label.setAttribute("for", bus.id);
          }
    });

    //Creation of the radio to choose the new type of the bus

    var divRadioType = create("div", form);
    create("label", divRadioType, "Choisissez le type de bus :");
    axios.get(`buses/buses.php?function=bustypes`).then((response)=>{
        console.log(response.data);
        for(var bustype of response.data){
            create("br", divRadioType);
            createChampRadio(divRadioType, bustype.id , "typeBus", bustype.id);
            var label = create("label", divRadioType, bustype.name );
            label.setAttribute("for", bustype.id);
          }
    });
    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){

        function idBusModify () {
            for (var bus of document.querySelectorAll("input[name='idBus']")) {
                if (bus.checked) {
                    return bus.value;
                }
            }
        }

        function typeBusModify () {
            for (var user of document.querySelectorAll("input[name='typeBus']")) {
                if (user.checked) {
                    return user.value;
                }
            }
        }

        let id = idBusModify();
        let type = typeBusModify();

        let url = `buses/buses.php?function=updatebus&id=${id}&type=${type}`
        axios.get(url);


    })
    form.appendChild(bouton);

    return main
}


export const SupprimerBus = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h2", main, "Suppression d'un bus ")
    create("p", main, " Rentrez les informations suivantes : ")

    // Creation of the form
    const form = create("form", main)

    // Creation of the checkbox to define the bus to add
    var divCheckboxBus = create("div", form);
    create("label", divCheckboxBus, "Choisissez le(s) bus à supprimer :");
    axios.get(`buses/buses.php?function=buses`).then((response)=>{
        console.log(response);
        for(var bus of response.data){
            create("br", divCheckboxBus);
            createChampCheckbox(divCheckboxBus, bus.id , "idBus", bus.id);
            var label = create("label", divCheckboxBus, bus.id );
            label.setAttribute("for", bus.id);
          }
    });
    // Creation of submit button
    const bouton = create("button", form, "Envoyer")
    bouton.addEventListener("click", function (event){
        for(var bus of document.querySelectorAll("input[name='idBus']")){
            let url = `buses/buses.php?function=delete&id=`;
            if (bus.checked) {
                url += bus.value;
                axios.get(url)
            }
        }
    })
    form.appendChild(bouton);

    return main
}