import { create, createChamp, createChampRadio, createChampCheckbox, toggleAlert, toggleError } from "../main"
import { getDayToString, getMonthToString, formatedHour } from "../utils/dates";
import { participantsTimeslot, busesTimeslot, lineTimeslot, lineDirectionTimeslot }  from "./gestionTimeslots"
import { toggleAgenda } from "./agenda";
import axios from "axios";


const removeContainerAndRemoveCacheClass = container => {
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
            var champ = createChampCheckbox(container, elem.id , checkBoxName, elem.id);
            
            if (tabEntite.includes(elem.id)){
                champ.checked = true;
            }

            var label = create("label", container, elem.id);
            label.setAttribute("for", elem.id);
        }
    })
}

const afficheBuses = (container, tabBus) => afficheEntites(container, tabBus, `buses/buses.php?function=buses`, "selectionBus")

const afficheUsers = (container, tabUser) => afficheEntites(container, tabUser, `users/users.php?function=users`, "selectionParticipant")

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

        create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

        // Creation of each champ
        create("label", container, "Début :", ["form-info"]);
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Fin :", ["form-info"]);
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
        
        //recup tous les bus 
        var tabBus= [];
        for (var bus of responseCreneau.data.buses){
            tabBus.push(bus.id);
        }
        
        // Creation of the checkbox to define the bus involved in the timeslot
        var divCheckboxBus = create("div", container);
        create("div", divCheckboxBus, "Bus :", ["form-info"]);
        afficheBuses(divCheckboxBus, tabBus)

        //recup tous les user 
        var tabUser= [];
        for (var response_user of responseCreneau.data.users){
            tabUser.push(response_user.id);
        }

        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Participants :", ["form-info"]);
        afficheUsers(divCheckboxUsers, tabUser)

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
            if (line.direction = 'retour'){
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
        const bouton = create("div", container, "Modifier", ["modifButton"])
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            // selection of the type of timeslot, participants and buses
            let users = participantsTimeslot();
            let buses = busesTimeslot();
            let line = lineTimeslot();
            let direction = lineDirectionTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            url += users ?  `&users=${users}` : `&users=`
            url += buses ? `&buses=${buses}` : `&buses=`
            url += line ? `&lines=${line}` : `&lines=`
            url += direction ? `&directions=${direction}` : `&directions=`

            executeAction(container, url, StartDateTime, user, "La conduite a bien été modifiée", "La conduite n'a pas pu être modifiée", multi)
        })
    });
}


const modifReunion = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
    
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

        // Creation of each champ
        create("label", container, "Début :");
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Fin :");
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;

        //recup tous les user 
        var tabUser= [];
        for (var response_user of responseCreneau.data.users){
            tabUser.push(response_user.id);
        }

        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Participants :");
        afficheUsers(divCheckboxUsers, tabUser)
        
        // Creation of submit button
        const bouton = create("div", container, "Modifier", ["modifButton"])
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

        create("div", container, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(container)

        // Creation of each champ
        create("label", container, "Début :");
        createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

        create("label", container, "Fin :");
        createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
        
        //recup tous les user 
        var users = "";
        for (var response_user of responseCreneau.data.users){
            users += response_user.id;
        }

        // Creation of submit button
        const bouton = create("div", container, "Modifier", ["modifButton"])
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

    let heure_debut = formatedHour(new Date(props.begining).getHours())
    let min_debut = formatedHour(new Date(props.begining).getMinutes())
    let heure_fin = formatedHour(new Date(props.end).getHours())
    let min_fin = formatedHour(new Date(props.end).getMinutes())

    create('p', container, props.name, ["task-name"])
    create("div", container, "Participants : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });
    const debut = create("div", container)
    create("span", debut, "Début : ", ["form-info"])
    debut.innerHTML += heure_debut + ":" + min_debut

    const fin = create("div", container)
    create("span", fin, "Fin : ", ["form-info"])
    fin.innerHTML += heure_fin + ":" + min_fin

    if(user_role == "Directeur"){
        const btns = create("div", container, null, ["btn-task"])

        create("div", btns, "Modifier", ["modifButton"]).onclick = () => modifReunion(container, props, user, multi)
        create("div", btns, "Supprimer", ["delButton"]).onclick = () => supprimeCreneau(container, props, bubble)
    }

    return container
}


const conduite = (container, props, bubble, user_role, user=null, multi=false) => {

    let heure_debut = formatedHour(new Date(props.begining).getHours())
    let min_debut = formatedHour(new Date(props.begining).getMinutes())
    let heure_fin = formatedHour(new Date(props.end).getHours())
    let min_fin = formatedHour(new Date(props.end).getMinutes())

    create('p', container, props.name, ["task-name"])
    create("div", container, "Conducteur : ", ["form-info"])
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });

    create("div", container, "Bus affectés : ", ["form-info"])
    props.buses.forEach(element => {
        create("em", container, element.id + " (" + element.nb_places + " places), ")
    });

    create("div", container, "Sur la ligne : ", ["form-info"])
    create("em", container, props.lines[0].number + " (" + props.lines[0].direction + ")")

    const debut = create("div", container)
    create("span", debut, "Début : ", ["form-info"])
    debut.innerHTML += heure_debut + ":" + min_debut

    const fin = create("div", container)
    create("span", fin, "Fin : ", ["form-info"])
    fin.innerHTML += heure_fin + ":" + min_fin

    if(["Responsable Logistique", "Directeur"].includes(user_role)){
        const btns = create("div", container, null, ["btn-task"])
        
        create("div", btns, "Modifier", ["modifButton"]).onclick = () => modifConduite(container, props, user, multi)
        create("div", btns, "Supprimer", ["delButton"]).onclick = () => supprimeCreneau(container, props, bubble)
    }

    return container
}


const indispo = (container, props, bubble, user_role, user=null, multi=false) => {

    

    let heure_debut = formatedHour(new Date(props.begining).getHours())
    let min_debut = formatedHour(new Date(props.begining).getMinutes())
    let heure_fin = formatedHour(new Date(props.end).getHours())
    let min_fin = formatedHour(new Date(props.end).getMinutes())

    let day = getDayToString(new Date(props.begining).getDay())
    let nb = new Date(props.begining).getDate()
    let month = getMonthToString(new Date(props.begining).getMonth())

    create('p', container, props.name, ["task-name"])
    create("p", container, "Noté comme indisponible le " + day + " " + nb + " " + month)
    create("p", container, "de " + heure_debut + ":" + min_debut + " à " + heure_fin + ":" + min_fin)

    if(user_role == "Conducteur"){
        const btns = create("div", container, null, ["btn-task"])
        
        create("div", btns, "Modifier", ["modifButton"]).onclick = () => modifIndispo(container, props, user, multi)
        create("div", btns, "Supprimer", ["delButton"]).onclick = () => supprimeCreneau(container, props, bubble)
    }

    return container
}


// fonction qui permet d'afficher un créneau horaire affecté à l'utilisateur connecté
export const toggleTask = (container, props, bubble, user=null, multi=false) => {

    const main = document.querySelector("#app")
    main.classList.add("cache")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const role = sessionData["role"]
    
    const ancienne_task = document.querySelector("#task")

    if(ancienne_task){
        ancienne_task.remove()
    }

    const task = create("div", container, null, null, "task")

    create("div", task, '<< Retour', ['return']).onclick = () => removeContainerAndRemoveCacheClass(task)

    switch (props.name) {
        case "Conduite": conduite(task, props, bubble, role, user, multi)
            break;
        case "Réunion": reunion(task, props, bubble, role, user, multi)
            break;
        case "Indisponibilité": indispo(task, props, bubble, role, user, multi)
            break;
        default: create("h2", task, "Une erreur est survenue")
            break;
    }
}