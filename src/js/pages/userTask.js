import { create, createChamp, createChampRadio, createChampCheckbox, toggleAlert, toggleError } from "../utils/domManipulation"
import { getDayToString, getMonthToString, formatedHour } from "../utils/dates";
import {
    participantsTimeslot,
    busesTimeslot,
    lineTimeslot,
    lineDirectionTimeslot,
    selectedDrivers
} from "./gestionTimeslots"
import { toggleAgenda } from "./agenda";
import axios from "axios";


export const removeContainerAndRemoveCacheClass = container => {
    container.remove()
    document.querySelector("#app").classList.remove("cache")
}

// affiche le bouton pour supprimer un créneau dans une tâche
const supprimeCreneau = (container, props, bubble) => {
    axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
        if(response.data){
            toggleAlert("BRAVO", "Le créneau a bien été supprimé")
            bubble.remove()
            removeContainerAndRemoveCacheClass(container)
        }
        else{
            toggleError("ERREUR", "Le créneau n'a pas pu être supprimé")
        }
    })
}


const afficheEntites = (container, tabEntite, axiosRequest, checkBoxName) => {
    axios.get(axiosRequest).then(response => {
        for(var elem of response.data){
            var champ
            // user ou bus
            if(elem.id && elem.firstname){
                if(elem.id_user_type !== "4") {
                    champ = createChampCheckbox(container, "p" + elem.id, checkBoxName, elem.id,);
                }
            }
            else if(elem.id ){
                champ = createChampCheckbox(container, "bt"+elem.id, checkBoxName, elem.id, );
            }
            // ligne
            else{
                champ = createChampCheckbox(container, "l"+elem.number, checkBoxName, elem.number);
            }

            if(elem.id && tabEntite.includes(elem.id)){
                champ.checked = true;
            }
            else if(elem.number && tabEntite.includes(elem.number)){
                champ.checked = true;
            }

            var label
            // user
            if(elem.firstname){
                if(elem.id_user_type !== "4") {
                    label = create("label", container, elem.firstname.substr(0, 1) + "." + elem.name, null, "p" + elem.id);
                    label.setAttribute("for", "p" + elem.id);
                    create("br", container)
                }
            }
            // bus
            else if(elem.id_bus_type){
                label = create("label", container, elem.id, null, "bt"+elem.id);
                label.setAttribute("for", "bt"+elem.id);
            }
            // ligne
            else{
                label = create("label", container, elem.number, null, "l"+elem.number);
                label.setAttribute("for", "l"+elem.number);
            }
        }
    })
}

const afficheBuses = (container, tabBus) => afficheEntites(container, tabBus, `buses/buses.php?function=buses`, "selectionBus")

const afficheUsers = (container, tabUser) => afficheEntites(container, tabUser, `users/users.php?function=users`, "selectionParticipant")

const afficheDrivers = (container, tabUser) => afficheEntites(container, tabUser, `users/users.php?function=bytype&type=3`, "selectionConducteurs")

const afficheLines = (container, tabLine) => afficheEntites(container, tabLine, `lines/lines.php?function=lines`, "selectionLigne")

const executeAction = (container, url, startDateTime, user, successMessage, errorMessage, multi) => {
    axios.get(url).then(response => {
        removeContainerAndRemoveCacheClass(container)
        if(response.data){
            let newDate = new Date(startDateTime)
            toggleAgenda(user, newDate, multi)
            toggleAlert("BRAVO", successMessage)
        } else {
            toggleError("ERREUR", errorMessage)
        }
    })
}

// affiche le bouton pour modifier un créneau, puis son formulaire
const modifConduite = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{

        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("button", container, '<< Retour', ['return', "unstyled-button"])
        back.onclick = () => removeContainerAndRemoveCacheClass(container)
        back.title = "Retour en arrière"

        //titre
        create('p', container, props.name, ["task-name"])

        // Creation of each champ
        create("label", container, "Date de début : ", ["form-info"]);
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Date de fin : ", ["form-info"]);
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;

        //recup tous les bus 
        var tabBus= [];
        for (var bus of responseCreneau.data.buses){
            tabBus.push(bus.id);
        }

        // Creation of the checkbox to define the bus involved in the timeslot
        var divCheckboxBus = create("div", container);
        create("div", divCheckboxBus, "Bus affecté(s) :", ["form-info"]);
        afficheBuses(divCheckboxBus, tabBus)

        //recup tous les user 
        var tabUser= [];
        for (var response_user of responseCreneau.data.users){
            tabUser.push(response_user.id);
        }

        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Conducteur(s) :", ["form-info"]);
        afficheDrivers(divCheckboxUsers, tabUser)

        //recup ligne 
        var tabLine= [];
        for (var line of responseCreneau.data.lines){
            tabLine.push(line.number);
        }

        // Creation of the radio to define the line
        var divRadioLigne = create("div", container);
        create("div", divRadioLigne, "Ligne :", ["form-info"]);
        afficheLines(divRadioLigne, tabLine)

        //recup direction 
        var tabDirAller= true;
        for (var line of responseCreneau.data.lines){
            if (line.direction == 'retour'){
                tabDirAller = false;
            }
        }

        // Creation of the radio to define the direction
        var divRadioDirection = create("div", container);
        create("div", divRadioDirection, "Direction :", ["form-info"]);
        var champAller = createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");

        var label = create("label", divRadioDirection, "aller");
        label.setAttribute("for", "aller");
        create("br", divRadioDirection);
        var champRetour =createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
        var label = create("label", divRadioDirection, "retour");
        label.setAttribute("for", "retour");

        tabDirAller ? champAller.checked = true : champRetour.checked = true

        // Creation of submit button
        const bouton = create("button", container, "Modifier", ["modifButton", "unstyled-button"])
        bouton.title = "Modifier"
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            // selection of the type of timeslot, participants and buses
            let users = selectedDrivers();
            let buses = busesTimeslot();
            let line = lineTimeslot();
            let direction = lineDirectionTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            url += users ?  `&users=${users}` : `&users=`
            url += buses ? `&buses=${buses}` : `&buses=`
            url += line ? `&lines=${line}` : `&lines=`
            url += line && direction ? `&directions=${direction}` : `&directions=`

            executeAction(container, url, StartDateTime, user, "La conduite a bien été modifiée", "La conduite n'a pas pu être modifiée", multi)
        })
    });
}

// affiche le bouton pour modifier un créneau, puis son formulaire
const modifAstreinte = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{

        // Creation du formulaire pré remplie de modif de ligne
        container.replaceChildren("")

        create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

        //titre
        create('p', container, props.name, ["task-name"])

        // Creation of each champ
        create("label", container, "Date de début : ", ["form-info"]);
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Date de fin : ", ["form-info"]);
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;

        //recup tous les bus
        var tabBus = [];
        for (var bus of responseCreneau.data.buses) {
            tabBus.push(bus.id);
        }

        // Creation of the checkbox to define the bus involved in the timeslot
        var divCheckboxBus = create("div", container);
        create("div", divCheckboxBus, "Bus affecté(s) :", ["form-info"]);
        afficheBuses(divCheckboxBus, tabBus)

        //recup tous les user
        var tabUser = [];
        for (var response_user of responseCreneau.data.users) {
            tabUser.push(response_user.id);
        }


        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Conducteur(s) :", ["form-info"]);
        afficheDrivers(divCheckboxUsers, tabUser)


        // Creation of submit button
        const bouton = create("div", container, "Modifier", ["modifButton"])
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
            // selection of the type of timeslot, participants and buses
            let users = selectedDrivers();
            let buses = busesTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            url += users ?  `&users=${users}` : `&users=`
            url += buses ? `&buses=${buses}` : `&buses=`
            executeAction(container, url, StartDateTime, user, "La conduite a bien été modifiée", "La conduite n'a pas pu être modifiée", multi)
        })
    });
}


const modifReservation = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then(async (responseCreneau) => {

        // Creation du formulaire pré remplie de modif de ligne
        container.replaceChildren("")

        create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

        create('p', container, props.name, ["task-name"])

        // Creation of each champ
        create("label", container, "Date de départ : ", ["form-info"]);
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;
        document.querySelector("input[name='StartDateTime']").disabled = true;

        create("label", container, "Date d'arrivée : ", ["form-info"]);
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;

        let arret = await axios.get("timeslots/timeslots.php?function=fetch_by_id_timeslot&idTimeslot=" + props.id)
        arret = arret.data

        const arretDepart = create("div", container, "Arrêt de départ : ", ["form-info"])
        create("em", container, arret.arretDepart)

        const arretArrive = create("div", container, "Arrêt d'arrivée : ", ["form-info"])
        create("em", container, arret.arretArrive)

        //recup tous les bus
        var tabBus = [];
        for (var bus of responseCreneau.data.buses) {
            tabBus.push(bus.id);
        }

        // Creation of the checkbox to define the bus involved in the timeslot
        var divCheckboxBus = create("div", container);
        create("div", divCheckboxBus, "Bus affecté(s) :", ["form-info"]);
        afficheBuses(divCheckboxBus, tabBus)

        //recup tous les user
        var tabUser = [];
        for (var response_user of responseCreneau.data.users) {
            tabUser.push(response_user.id);
        }

        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Conducteur(s) :", ["form-info"]);
        afficheDrivers(divCheckboxUsers, tabUser)

        // Creation of submit button
        const bouton = create("div", container, "Modifier", ["modifButton"])
        bouton.addEventListener("click", function () {
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;
            // selection of the type of timeslot, participants and buses
            let users = selectedDrivers();
            let buses = busesTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            url += users ? `&users=${users}` : `&users=`
            url += buses ? `&buses=${buses}` : `&buses=`
            executeAction(container, url, StartDateTime, user, "La conduite a bien été modifiée", "La conduite n'a pas pu être modifiée", multi)
        })
    });
}


const modifReunion = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
    
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("button", container, '<< Retour', ['return', "unstyled-button"])
        back.onclick = () => removeContainerAndRemoveCacheClass(container)
        back.title = "Retour en arrière"

        //titre
        create('p', container, props.name, ["task-name"])

        //date de départ
        create("div", container, "Date de début : ", ["form-info"])
        createChamp(container, "datetime-local", "StartDateTime").value = props.begining;

        //date d'arrivée
        create("div", container, "Date de fin : ", ["form-info"])
        createChamp(container, "datetime-local", "EndDateTime").value = props.end;

        //recup tous les user 
        var tabUser= [];
        for (var response_user of responseCreneau.data.users){
            tabUser.push(response_user.id);
        }

        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Participant(s) :", ["form-info"]);
        afficheUsers(divCheckboxUsers, tabUser)
        
        // Creation of submit button
        const bouton = create("button", container, "Modifier", ["modifButton", "unstyled-button"])
        bouton.title = "Modifier"
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            // selection of the type of participants
            let users = participantsTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            url += users ? `&users=${users}` : "&users="
            url += "&buses=&lines=&directions="

            executeAction(container, url, StartDateTime, user, "La réunion a bien été modifiée", "La réunion n'a pas pu être modifiée", multi)
        })
    })
}

const modifIndispo = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`)
    .then(responseCreneau => {
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("button", container, '<< Retour', ['return', "unstyled-button"])
        back.onclick = () => removeContainerAndRemoveCacheClass(container)
        back.title = "Retour en arrière"

        //titre
        create('p', container, props.name, ["task-name"])
        create("div", container, "Noté comme indisponible", ["form-info"])

        // Creation of each champ
        //date de départ
        create("div", container, "Date de début : ", ["form-info"])
        createChamp(container, "datetime-local", "StartDateTime").value = props.begining;

        //date d'arrivée
        create("div", container, "Date de fin : ", ["form-info"])
        createChamp(container, "datetime-local", "EndDateTime").value = props.end;
        
        //recup tous les user 
        var users = "";
        for (var response_user of responseCreneau.data.users){
            users += response_user.id;
        }

        // Creation of submit button
        const bouton = create("button", container, "Modifier", ["modifButton", "unstyled-button"])
        bouton.title = "Modifier"
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}&users=${users}`;
            url += "&buses=&lines=&directions=";

            executeAction(container, url, StartDateTime, user, "L'indisponiblité a bien été modifiée", "L'indisponibilité n'a pas pu être modifiée", multi)
        })
    })
}

const reunion = (container, props, bubble, user_role, user=null, multi=false) => {
    //titre
    create('p', container, props.name, ["task-name"])

    //date de départ
    create("div", container, "Date de début : ", ["form-info"])
    createChamp(container, "datetime-local", "StartDateTime").value = props.begining;
    document.querySelector("input[name='StartDateTime']").disabled = true;

    //date d'arrivée
    create("div", container, "Date de fin : ", ["form-info"])
    createChamp(container, "datetime-local", "EndDateTime").value = props.end;
    document.querySelector("input[name='EndDateTime']").disabled = true;

    //Participants
    create("div", container, "Participant(s) : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name)
    });

    if(user_role == "Directeur"){
        const btns = create("div", container, null, ["btn-task"])

        const b1 = create("button", btns, "Modifier", ["modifButton", "unstyled-button"])
        b1.onclick = () => modifReunion(container, props, user, multi)
        b1.title = "Modifier"

        const b2 = create("button", btns, "Supprimer", ["delButton", "unstyled-button"])
        b2.onclick = () => supprimeCreneau(container, props, bubble)
        b2.title = "Supprimer"
    }

    return container
}


const conduite = (container, props, bubble, user_role, user=null, multi=false) => {

    //titre
    create('p', container, props.name, ["task-name"])

    //date de départ
    create("div", container, "Date de début : ", ["form-info"])
    createChamp(container, "datetime-local", "StartDateTime").value = props.begining;
    document.querySelector("input[name='StartDateTime']").disabled = true;

    //date d'arrivée
    create("div", container, "Date de fin : ", ["form-info"])
    createChamp(container, "datetime-local", "EndDateTime").value = props.end;
    document.querySelector("input[name='EndDateTime']").disabled = true;

    //bus
    create("div", container, "Bus affecté(s) : ", ["form-info"])
    props.buses.forEach(element => {
        create("em", container, element.id + " (" + element.nb_places + " places)")
    });

    //conducteurs
    create("div", container, "Conducteur(s) : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name)
    });

    create("div", container, "Ligne : ", ["form-info"])
    props.lines.forEach(element => {
        create("em", container, element.number + " (" + element.direction + ")")
    });

    if(["Responsable Logistique", "Directeur"].includes(user_role)){
        const btns = create("div", container, null, ["btn-task"])
        
        const b1 = create("button", btns, "Modifier", ["modifButton", "unstyled-button"])
        b1.onclick = () => modifConduite(container, props, user, multi)
        b1.title = "Modifier"

        const b2 = create("button", btns, "Supprimer", ["delButton", "unstyled-button"])
        b2.onclick = () => supprimeCreneau(container, props, bubble)
        b2.title = "Supprimer"
    }

    return container
}


const indispo = (container, props, bubble, user_role, user=null, multi=false) => {
    //titre
    create('p', container, props.name, ["task-name"])
    create("div", container, "Noté comme indisponible", ["form-info"])

    //date de départ
    create("div", container, "Date de début : ", ["form-info"])
    createChamp(container, "datetime-local", "StartDateTime").value = props.begining;
    document.querySelector("input[name='StartDateTime']").disabled = true;

    //date d'arrivée
    create("div", container, "Date de fin : ", ["form-info"])
    createChamp(container, "datetime-local", "EndDateTime").value = props.end;
    document.querySelector("input[name='EndDateTime']").disabled = true;

    if(user_role == "Conducteur"){
        const btns = create("div", container, null, ["btn-task"])
        
        const b1 = create("button", btns, "Modifier", ["modifButton", "unstyled-button"])
        b1.onclick = () => modifIndispo(container, props, user, multi)
        b1.title = "Modifier"

        const b2 = create("button", btns, "Supprimer", ["delButton", "unstyled-button"])
        b2.onclick = () => supprimeCreneau(container, props, bubble)
        b2.title = "Supprimer"
    }

    return container
}

const astreinte = (container, props, bubble, user_role, user=null, multi=false) => {
    //titre
    create('p', container, props.name, ["task-name"])

    //date de départ
    create("div", container, "Date de début : ", ["form-info"])
    createChamp(container, "datetime-local", "StartDateTime").value = props.begining;
    document.querySelector("input[name='StartDateTime']").disabled = true;

    //date d'arrivée
    create("div", container, "Date de fin : ", ["form-info"])
    createChamp(container, "datetime-local", "EndDateTime").value = props.end;
    document.querySelector("input[name='EndDateTime']").disabled = true;

    //bus
    create("div", container, "Bus affecté(s) : ", ["form-info"])
    props.buses.forEach(element => {
        create("em", container, element.id + " (" + element.nb_places + " places)")
    });

    //conducteurs
    create("div", container, "Conducteur(s) : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name)
    });


    if(["Responsable Logistique", "Directeur"].includes(user_role)){
        const btns = create("div", container, null, ["btn-task"])

        create("div", btns, "Modifier", ["modifButton"]).onclick = () => modifAstreinte(container, props, user, multi)
        create("div", btns, "Supprimer", ["delButton"]).onclick = () => supprimeCreneau(container, props, bubble)
    }

    return container
}


const reservation = async (container, props, bubble, user_role, user = null, multi = false) => {
    //titre
    create('p', container, props.name, ["task-name"])

    //date de départ
    create("div", container, "Date de départ : ", ["form-info"])
    createChamp(container, "datetime-local", "StartDateTime").value = props.begining;
    document.querySelector("input[name='StartDateTime']").disabled = true;

    //date d'arrivée
    create("div", container, "Date d'arrivée : ", ["form-info"])
    createChamp(container, "datetime-local", "EndDateTime").value = props.end;
    document.querySelector("input[name='EndDateTime']").disabled = true;

    //selection des informations de la réservation
    let arret = await axios.get("timeslots/timeslots.php?function=fetch_by_id_timeslot&idTimeslot="+props.id)
    arret = arret.data

    //arret de départ
    create("div", container, "Arrêt de départ : ", ["form-info"])
    create("em", container, arret.arretDepart)

    //arret d'arrivée
    create("div", container, "Arrêt d'arrivée : ", ["form-info"])
    create("em", container, arret.arretArrive)

    //bus
    create("div", container, "Bus affecté(s) : ", ["form-info"])
    props.buses.forEach(element => {
        create("em", container, element.id + " (" + element.nb_places + " places)")
    });

    //conducteurs
    create("div", container, "Conducteur(s) : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name)
    });

    if (["Responsable Logistique", "Directeur"].includes(user_role)) {
        const btns = create("div", container, null, ["btn-task"])

        create("div", btns, "Modifier", ["modifButton"]).onclick = () => modifReservation(container, props, user, multi)
        create("div", btns, "Supprimer", ["delButton"]).onclick = () => supprimeCreneau(container, props, bubble)
    }

    return container
}


// fonction qui permet d'afficher un créneau horaire affecté à l'utilisateur connecté
const toggleTask = (container, props, bubble, user=null, multi=false) => {

    const main = document.querySelector("#app")
    main.classList.add("cache")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const role = sessionData["role"]
    
    const ancienne_task = document.querySelector("#task")

    if(ancienne_task){
        ancienne_task.remove()
    }

    const task = create("div", container, null, null, "task")

    const back = create("button", task, '<< Retour', ['return', "unstyled-button"])
    back.onclick = () => removeContainerAndRemoveCacheClass(task)
    back.title = "Retour en arrière"

    switch (props.name) {
        case "Conduite": conduite(task, props, bubble, role, user, multi)
            break;
        case "Réunion": reunion(task, props, bubble, role, user, multi)
            break;
        case "Indisponibilité": indispo(task, props, bubble, role, user, multi)
            break;
        case "Astreinte": astreinte(task, props, bubble, role, user, multi)
            break;
        case "Réservation": reservation(task, props, bubble, role, user, multi)
            break;
        default: create("h2", task, "Une erreur est survenue")
            break;
    }
}


export { toggleTask }