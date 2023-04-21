import { create, createChamp, createChampRadio, createChampCheckbox, toggleAlert, toggleError } from "../main"
import { getDayToString, getMonthToString, formatedHour } from "../utils/dates";
import { participantsTimeslot, busesTimeslot, lineTimeslot, lineDirectionTimeslot }  from "./gestionTimeslots"
import { toggleAgenda } from "./agenda";
import axios from "axios";

// affiche le bouton pour supprimer un créneau dans une tâche
const supprimeCreneau = (container, props, bubble) => {
    axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
        if(response.data){
            toggleAlert("BRAVO", "Le créneau a bien été supprimé")
            container.remove()
            bubble.remove()
            document.querySelector("#app").classList.remove("cache")
        }
        else{
            toggleError("ERREUR", "Le créneau n'a pas pu être supprimé")
        }
    })
}

// affiche le bouton pour modifier un créneau, puis son formulaire
const modifConduite = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{

        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("div", container)
        create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
        back.addEventListener("click", function(){
            container.remove()
            document.querySelector("#app").classList.remove("cache")
        })

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
        axios.get(`buses/buses.php?function=buses`).then((response)=>{
            for(var bus of response.data){
                var champBus = createChampCheckbox(divCheckboxBus, bus.id , "selectionBus", bus.id);
                
                if (tabBus.includes(bus.id)){
                    champBus.checked = true;
                }

                var label = create("label", divCheckboxBus, bus.id);
                label.setAttribute("for", bus.id);
            }
        });


        //recup tous les user 
        var tabUser= [];
        for (var response_user of responseCreneau.data.users){
            tabUser.push(response_user.id);
        }
        // Creation of the checkbox to define the users involved in the timeslot
        var divCheckboxUsers = create("div", container);
        create("div", divCheckboxUsers, "Participants :", ["form-info"]);
        axios.get(`users/users.php?function=users`).then((response)=>{
            for(var response_user of response.data){
                var champUser = createChampCheckbox(divCheckboxUsers, response_user.id , "selectionParticipant", response_user.id);

                if (tabUser.includes(response_user.id)){
                    champUser.checked = true;
                }

                var label = create("label", divCheckboxUsers, response_user.name + " "+ response_user.firstname);
                label.setAttribute("for", response_user.id);
            }
        });

        //recup ligne 
        var tabLine= [];
        for (var line of responseCreneau.data.lines){
            tabLine.push(line.number);
        }


        // Creation of the radio to define the line
        var divRadioLigne = create("div", container);
        create("div", divRadioLigne, "Ligne :", ["form-info"]);
        axios.get(`lines/lines.php?function=lines`).then((response)=>{
            for(var line of response.data){
                var champLine = createChampRadio(divRadioLigne, line.number , "selectionLigne", line.number);

                if (tabLine.includes(line.number)){
                    champLine.checked = true;
                }

                var label = create("label", divRadioLigne, "Ligne " + line.number);
                label.setAttribute("for", line.number);
            }
        });

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
        // create("br", divRadioDirection);
        var champAller = createChampRadio(divRadioDirection, "aller" , "selectionDirection", "aller");

        var label = create("label", divRadioDirection, "aller");
        label.setAttribute("for", "aller");
        create("br", divRadioDirection);
        var champRetour =createChampRadio(divRadioDirection, "retour" , "selectionDirection", "retour");
        var label = create("label", divRadioDirection, "retour");
        label.setAttribute("for", "retour");    
        
        if(tabDirAller){
            champAller.checked = true;
        }else{
            champRetour.checked = true;
        }
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

            if (users){
                url += `&users=${users}`;
            }
            else{
                url += `&users=`;
            }
            if (buses){
                url += `&buses=${buses}`;
            }
            else{
                url += `&buses=`;
            }
            if (line){
                url += `&lines=${line}`;
            }
            else{
                url += `&lines=`;
            }
            if (direction){
                url += `&directions=${direction}`;
            }
            else{
                url += `&directions=`;
            }

            axios.get(url).then(function(response){
                container.remove();
                document.querySelector("#app").classList.remove("cache");

                if(response.data){
                    let newDate = new Date(StartDateTime)
                    toggleAgenda(user, newDate, multi)
                    toggleAlert("BRAVO", "La conduite a bien été modifiée");
                }
                else{
                    toggleError("ERREUR", "La conduite n'a pas pu être modifiée");
                }
            })
        })
    });
}


const modifReunion = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
    
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("div", container)
        create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
        back.addEventListener("click", function(){
            container.remove()
            document.querySelector("#app").classList.remove("cache")
        })

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
        axios.get(`users/users.php?function=users`).then((response)=>{
            for(var response_user of response.data){
                var champUser = createChampCheckbox(divCheckboxUsers, response_user.id , "selectionParticipant", response_user.id);

                if (tabUser.includes(response_user.id)){
                    champUser.checked = true;
                }

                var label = create("label", divCheckboxUsers, response_user.name + " "+ response_user.firstname);
                label.setAttribute("for", response_user.id);
            }
        });

        
        // Creation of submit button
        const bouton = create("div", container, "Modifier", ["modifButton"])
        bouton.addEventListener("click", function (){
            // selection of the start and end time
            let StartDateTime = document.querySelector("input[name='StartDateTime']").value;
            let EndDateTime = document.querySelector("input[name='EndDateTime']").value;

            // selection of the type of participants
            let users = participantsTimeslot();

            let url = `timeslots/timeslots.php?function=update&id=${props.id}&beginning=${StartDateTime}&end=${EndDateTime}`;

            if (users){
                url += `&users=${users}`;
            }
            else{
                url += "&users=";
            }

            url += "&buses=&lines=&directions=";

            axios.get(url).then(function(response){
                container.remove();
                document.querySelector("#app").classList.remove("cache");

                if(response.data){

                    let newDate = new Date(StartDateTime)
                    toggleAgenda(user, newDate, multi)
                    toggleAlert("BRAVO", "La réunion a bien été modifiée");
                }
                else{
                    toggleError("ERREUR", "La réunion n'a pas pu être modifiée");
                }
            })
        })
    });
}

const modifIndispo = (container, props, user=null, multi=false) => {
    axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
    
        // Creation du formulaire pré remplie de modif de ligne 
        container.replaceChildren("")

        const back = create("div", container)
        create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
        back.addEventListener("click", function(){
            container.remove()
            document.querySelector("#app").classList.remove("cache")
        })

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

            axios.get(url).then(function(response){
                container.remove();
                document.querySelector("#app").classList.remove("cache");

                if(response.data){

                    let newDate = new Date(StartDateTime)
                    toggleAgenda(user, newDate, multi)
                    toggleAlert("BRAVO", "L'indisponiblité a bien été modifiée");
                }
                else{
                    toggleError("ERREUR", "L'indisponibilité n'a pas pu être modifiée");
                }
            })
        })
    });
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

        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            modifReunion(container, props, user, multi)
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            supprimeCreneau(container, props, bubble)
        })
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

    if(user_role == "Directeur" || user_role == "Responsable Logistique"){
        const btns = create("div", container, null, ["btn-task"])
        
        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            modifConduite(container, props, user, multi)
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            supprimeCreneau(container, props, bubble)
        })
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
    create("p", container, "Est noté comme indisponible le " + day + " " + nb + " " + month)
    create("p", container, "de " + heure_debut + ":" + min_debut + " à " + heure_fin + ":" + min_fin)

    if(user_role == "Conducteur"){
        const btns = create("div", container, null, ["btn-task"])
        
        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            modifIndispo(container, props, user, multi)
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            supprimeCreneau(container, props, bubble)
        })
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

    const back = create("div", task)
    create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
    back.addEventListener("click", function(){
        task.remove()
        main.classList.remove("cache")
    })

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