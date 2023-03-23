import { create, toggleAlert, toggleError } from "../main"
import { getDayToString, getMonthToString, formatedHour } from "../components/week";
import axios from "axios";

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
        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            container.replaceChildren("")
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
                if(response.data){
                    toggleAlert("BRAVO", "La réunion a bien été supprimée")
                    container.remove()
                    bubble.remove()
                }
                else{
                    toggleError("ERREUR", "La réunion n'a pas pu être supprimée")
                }
            })
        })
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
        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            container.replaceChildren("")
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
                if(response.data){
                    toggleAlert("BRAVO", "La conduite a bien été supprimée")
                    container.remove()
                    bubble.remove()
                }
                else{
                    toggleError("ERREUR", "La conduite n'a pas pu être supprimée")
                }
            })
        })
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
    create("p", container, "Vous êtes noté comme indisponible le " + day + " " + nb + " " + month)
    create("p", container, "de " + heure_debut + ":" + min_debut + " à " + heure_fin + ":" + min_fin)

    if(user_role == "Conducteur"){
        const btns = create("div", container, null, ["btn-task"])
        create("div", btns, "Modifier", ["modifButton"]).addEventListener("click", function(){
            container.replaceChildren("")
        })
        create("div", btns, "Supprimer", ["delButton"]).addEventListener("click", function(){
            axios.get("timeslots/timeslots.php?function=delete&id="+props.id).then(function(response){
                if(response.data){
                    toggleAlert("BRAVO", "L'indisponibilité a bien été supprimée")
                    container.remove()
                    bubble.remove()
                }
                else{
                    toggleError("ERREUR", "L'indisponiblité n'a pas pu être supprimée")
                }
            })
        })
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