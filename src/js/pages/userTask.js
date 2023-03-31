import { create, createChamp, createChampRadio, createChampCheckbox, toggleAlert, toggleError } from "../main"
import { getDayToString, getMonthToString, formatedHour } from "../components/week";
import { participantsTimeslot, busesTimeslot, lineTimeslot, lineDirectionTimeslot, typeTimeslot } from "./adminForms";
import axios from "axios";

// affiche le bouton pour supprimer un créneau dans une tâche
const supprimeCreneau = (container, btns, props, bubble) => {
    create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
        axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
            if(response.data){
                toggleAlert("BRAVO", "Le créneau a bien été supprimé")
                container.remove()
                bubble.remove()
            }
            else{
                toggleError("ERREUR", "Le créneau n'a pas pu être supprimé")
            }
        })
    })
}

// affiche le bouton pour modifier un créneau, puis son formulaire
const modifConduite = (container, btns, props, bubble) => {
    create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){

        axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
    
            // Creation du formulaire pré remplie de modif de ligne 
            container.replaceChildren("")
    
            const back = create("div", container)
            create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
            back.addEventListener("click", () => container.remove())
    
             // Creation of each champ
            create("label", container, "Début :");
            createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;
    
            create("label", container, "Fin :");
            createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
            
            //recup tous les bus 
            var tabBus= [];
            for (var bus of responseCreneau.data.buses){
                tabBus.push(bus.id);
            }
           
            // Creation of the checkbox to define the bus involved in the timeslot
            var divCheckboxBus = create("div", container);
            create("label", divCheckboxBus, "Bus :");
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
            for (var user of responseCreneau.data.users){
                tabUser.push(user.id);
            }
            // Creation of the checkbox to define the users involved in the timeslot
            var divCheckboxUsers = create("div", container);
            create("label", divCheckboxUsers, "Participants :");
            axios.get(`users/users.php?function=users`).then((response)=>{
                for(var user of response.data){
                    var champUser = createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);
    
                    if (tabUser.includes(user.id)){
                        champUser.checked = true;
                    }
    
                    var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
                    label.setAttribute("for", user.id);
                }
            });
    
            //recup ligne 
            var tabLine= [];
            for (var line of responseCreneau.data.lines){
                tabLine.push(line.number);
            }
    
    
            // Creation of the radio to define the line
            var divRadioLigne = create("div", container);
            create("label", divRadioLigne, "Ligne :");
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
            create("label", divRadioDirection, "Direction :");
            create("br", divRadioDirection);
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
                if (buses){
                    url += `&buses=${buses}`;
                }
                if (line){
                    url += `&lines=${line}`;
                }
                if (direction){
                    url += `&directions=${direction}`;
                }
    
                axios.get(url).then(function(response){
                    container.remove();
    
                    if(response.data){
    
                        let heure_debut = formatedHour(new Date(StartDateTime).getHours())
                        let min_debut = formatedHour(new Date(StartDateTime).getMinutes())
                        let heure_fin = formatedHour(new Date(EndDateTime).getHours())
                        let min_fin = formatedHour(new Date(EndDateTime).getMinutes())
    
                        for(let e of bubble.childNodes){
                            if(e.classList.contains("timeslot__houres")){
                                for(let h of e.childNodes){
                                    if(h.classList.contains("beginning")){
                                        h.innerText = heure_debut + ":" + min_debut
                                    }
                                    else{
                                        h.innerText = heure_fin + ":" + min_fin
                                    }
                                }
                            }
                        }
                        toggleAlert("BRAVO", "La conduite a bien été modifiée");
                    }
                    else{
                        toggleError("ERREUR", "La conduite n'a pas pu être modifiée");
                    }
                })
            })
        });
    })
}


const modifReunion = (container, btns, props, bubble) => {
    create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
        axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
        
            // Creation du formulaire pré remplie de modif de ligne 
            container.replaceChildren("")

            const back = create("div", container)
            create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
            back.addEventListener("click", () => container.remove())

            // Creation of each champ
            create("label", container, "Début :");
            createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

            create("label", container, "Fin :");
            createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;

            //recup tous les user 
            var tabUser= [];
            for (var user of responseCreneau.data.users){
                tabUser.push(user.id);
            }
            // Creation of the checkbox to define the users involved in the timeslot
            var divCheckboxUsers = create("div", container);
            create("label", divCheckboxUsers, "Les participants :");
            axios.get(`users/users.php?function=users`).then((response)=>{
                for(var user of response.data){
                    var champUser = createChampCheckbox(divCheckboxUsers, user.id , "selectionParticipant", user.id);

                    if (tabUser.includes(user.id)){
                        champUser.checked = true;
                    }

                    var label = create("label", divCheckboxUsers, user.name + " "+ user.firstname);
                    label.setAttribute("for", user.id);
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
    
                    if(response.data){
    
                        let heure_debut = formatedHour(new Date(StartDateTime).getHours())
                        let min_debut = formatedHour(new Date(StartDateTime).getMinutes())
                        let heure_fin = formatedHour(new Date(EndDateTime).getHours())
                        let min_fin = formatedHour(new Date(EndDateTime).getMinutes())
    
                        for(let e of bubble.childNodes){
                            if(e.classList.contains("timeslot__houres")){
                                for(let h of e.childNodes){
                                    if(h.classList.contains("beginning")){
                                        h.innerText = heure_debut + ":" + min_debut
                                    }
                                    else{
                                        h.innerText = heure_fin + ":" + min_fin
                                    }
                                }
                            }
                        }
                        toggleAlert("BRAVO", "La réunion a bien été modifiée");
                    }
                    else{
                        toggleError("ERREUR", "La réunion n'a pas pu être modifiée");
                    }
                })
            })
        });
    })
}

const modifIndispo = (container, btns, props, bubble) => {
    create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
        axios.get(`timeslots/timeslots.php?function=timeslot&id=${props.id}`).then((responseCreneau) =>{
        
            // Creation du formulaire pré remplie de modif de ligne 
            container.replaceChildren("")

            const back = create("div", container)
            create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
            back.addEventListener("click", () => container.remove())

            // Creation of each champ
            create("label", container, "Début :");
            createChamp(container, "datetime-local", "StartDateTime").value = responseCreneau.data.begining;

            create("label", container, "Fin :");
            createChamp(container, "datetime-local", "EndDateTime").value = responseCreneau.data.end;
            
            //recup tous les user 
            var users = "";
            for (var user of responseCreneau.data.users){
                users += user.id;
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

                    if(response.data){

                        let heure_debut = formatedHour(new Date(StartDateTime).getHours())
                        let min_debut = formatedHour(new Date(StartDateTime).getMinutes())
                        let heure_fin = formatedHour(new Date(EndDateTime).getHours())
                        let min_fin = formatedHour(new Date(EndDateTime).getMinutes())

                        for(let e of bubble.childNodes){
                            if(e.classList.contains("timeslot__houres")){
                                for(let h of e.childNodes){
                                    if(h.classList.contains("beginning")){
                                        h.innerText = heure_debut + ":" + min_debut
                                    }
                                    else{
                                        h.innerText = heure_fin + ":" + min_fin
                                    }
                                }
                            }
                        }
                        toggleAlert("BRAVO", "L'indisponiblité a bien été modifiée");
                    }
                    else{
                        toggleError("ERREUR", "L'indisponibilité n'a pas pu être modifiée");
                    }
                })
            })
        });
    })
}

const reunion = (container, props, bubble, user_role) => {

    let heure_debut = formatedHour(new Date(props.begining).getHours())
    let min_debut = formatedHour(new Date(props.begining).getMinutes())
    let heure_fin = formatedHour(new Date(props.end).getHours())
    let min_fin = formatedHour(new Date(props.end).getMinutes())

    create('p', container, props.name, ["task-name"])
    create("label", container, "Participants : ")
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });

    create("label", container, "Début : " + heure_debut + ":" + min_debut)
    create("label", container, "Fin prévue à : " + heure_fin + ":" + min_fin)

    if(user_role == "Directeur"){
        const btns = create("div", container, null, ["btn-task"])
        modifReunion(container, btns, props, bubble)
        supprimeCreneau(container, btns, props, bubble)
    }

    return container
}


const conduite = (container, props, bubble, user_role) => {

    let heure_debut = formatedHour(new Date(props.begining).getHours())
    let min_debut = formatedHour(new Date(props.begining).getMinutes())
    let heure_fin = formatedHour(new Date(props.end).getHours())
    let min_fin = formatedHour(new Date(props.end).getMinutes())

    create('p', container, props.name, ["task-name"])
    create("label", container, "Conducteur : ")
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });

    create("label", container, "Bus affectés : ")
    props.buses.forEach(element => {
        create("em", container, element.id + " (" + element.nb_places + " places), ")
    });

    create("label", container, "Sur la ligne : ")
    create("em", container, props.lines[0].number + " (" + props.lines[0].direction + ")")

    create("label", container, "Début : " + heure_debut + ":" + min_debut)
    create("label", container, "Fin prévue à : " + heure_fin + ":" + min_fin)

    if(user_role == "Directeur" || user_role == "Responsable Logistique"){
        const btns = create("div", container, null, ["btn-task"])
        modifConduite(container, btns, props, bubble)
        supprimeCreneau(container, btns, props, bubble)
    }

    return container
}


const indispo = (container, props, bubble, user_role) => {

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
        modifIndispo(container, btns, props, bubble)
        supprimeCreneau(container, btns, props, bubble)
    }

    return container
}


// fonction qui permet d'afficher un créneau horaire affecté à l'utilisateur connecté
export const toggleTask = (container, props, bubble) => {

    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const role = sessionData["role"]
    
    const ancienne_task = document.querySelector("#task")

    if(ancienne_task){
        ancienne_task.remove()
    }

    const task = create("div", container, null, null, "task")

    const back = create("div", task)
    create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
    back.addEventListener("click", () => task.remove())

    switch (props.name) {
        case "Conduite": conduite(task, props, bubble, role)
            break;
        case "Réunion": reunion(task, props, bubble, role)
            break;
        case "Indisponibilité": indispo(task, props, bubble, role)
            break;
        default: create("h2", task, "Une erreur est survenue")
            break;
    }
}