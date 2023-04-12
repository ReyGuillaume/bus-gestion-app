import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleTask } from "./userTask";
import { getMonthToString , getDayToString, formatedHour } from "../components/week";
import axios from "axios";

// fonction qui crée tous les jours d'un mois
const createDaysBar = (date, container, user=null) => {

    let dateInt = new Date(date)
    const line = create("div", container, null, ['days'])

    for (let i = 0; i < 7; i++) {
        const day = create("div", line, null, ['day'])
        create("p", day, getDayToString(dateInt.getDay()).substring(0, 3), ['day__name'])
        create("p", day, dateInt.getDate(), ['day__number'])

        const d = new Date(dateInt)
        day.addEventListener("click", () => toggleDay(d, user))

        dateInt = new Date(new Date(dateInt).setDate(dateInt.getDate() + 1))
    }

    return container
}


// renvoie une date JS sous forme 2023-02-16 00:00:00
export const datePhp = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()


// fonction qui récupère tous les créneaux horaires affectés à l'utilisateur connecté, à une certaine date
const fetchTimeSlots = async (date, user=null) => {
    let data = []
    let d1 = datePhp(date)
    let d2 = datePhp(new Date(new Date(date).setDate(date.getDate() + 1)))
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))

    // utilisateur
    if(user != null && user.firstname){
        let idUser = user.id
        await axios.get(`timeslots/timeslots.php?function=timeslotbyuser&user=${idUser}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
        return [...data]
    }
    // bus
    else if(user != null && user.id_bus_type){
        let idBus = user.id
        await axios.get(`timeslots/timeslots.php?function=timeslotbybus&bus=${idBus}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
        return [...data]
    }
    // ligne
    else if(user != null && user.number){
        let idLine = user.number
        await axios.get(`timeslots/timeslots.php?function=timeslotbyline&line=${idLine}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
        return [...data]
    }
    // personnel
    else{
        let idUser = sessionData['id']
        await axios.get(`timeslots/timeslots.php?function=timeslotbyuser&user=${idUser}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
        return [...data]
    }
}

const handlerDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.id)
}

// fonction qui renvoie un booléen indiquant si le user a un rôle qui lui permet de modifier tel créneau
const possibleDrag = (user_role, timeslot_name) => {
    if(user_role == "Conducteur"){
        if(timeslot_name == "Indisponibilité"){
            return true;
        }
        return false;
    }
    else if(user_role == "Responsable Logistique"){
        if(timeslot_name == "Conduite"){
            return true;
        }
        return false;
    }
    else{
        if(timeslot_name == "Conduite" || timeslot_name == "Réunion"){
            return true;
        }
        return false;
    }
}

// fonction qui affiche tous les créneaux horaires récupérés, affectés à l'utilisateur connecté
const createTimeSlots = async (date, container, user=null) => {
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const user_role = sessionData["role"]
    const footer = document.querySelector("#footer")
    const res = await fetchTimeSlots(date, user)
    if (res.length > 0) {
        res.forEach(timeslot => {
            const div = create("div", container, null, ['timeslot'], [`ts${timeslot.id}`])
            div.addEventListener("click", () => toggleTask(footer, timeslot, div))
            
            if(possibleDrag(user_role, timeslot.name)){
                div.setAttribute('draggable', true);
            }
            // Positionnement en fonction du début et de la fin
            let heure_debut = new Date(timeslot.begining).getHours()
            let min_debut = new Date(timeslot.begining).getMinutes()
            let heure_fin = new Date(timeslot.end).getHours()
            let min_fin = new Date(timeslot.end).getMinutes()
            
            let duree = ((heure_fin - heure_debut) * 60) + (min_fin - min_debut)

            let top = container.clientHeight * ((heure_debut * 60 + min_debut) - 6*60) / ((23 - 6) * 60)
            let height = duree * container.clientHeight / ((23 - 6) * 60)
            
            div.style.top = `${top}px`
            div.style.height = `${height}px`

            const color = create("div", div, null, ["timeslot__color", timeslot.name])
            const div_color = create("div", color, null, ["div-color"])
            div_color.style.height = duree + "px"

            const houres = create("div", div, null, ["timeslot__houres"])

            //ajout du drag & drop
            if(possibleDrag(user_role, timeslot.name)){
                div.ondragstart = handlerDragStart
            }

            create("h2", houres, formatedHour(heure_debut) + ":" + formatedHour(min_debut), ['beginning'])
            create("h2", houres, formatedHour(heure_fin) + ":" + formatedHour(min_fin), ['end'])

            const body = create("div", div, null, ["timeslot__body"])
            
            switch(timeslot.name){
                case "Conduite": create("h3", body, "Conduite")
                    break;
                case "Réunion": create("h3", body, "Réunion")
                    break;
                case "Indisponibilité": create("h3", body, "Indisponible")
                    break;
                default: create("h3", body, "ERREUR")
                    break;
            }

            const goto = create("div", div, null, ["timeslot__goto"])
            create("i", goto , null, ['fa-solid', 'fa-chevron-right'])
        })
    }
}

export const toggleDay = (date, user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const header = create("div", main, null, ['day__header'])

    const back = create("div", header)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    back.addEventListener("click", () => toggleAgenda(user))

    let dateToString = getDayToString(date.getDay()) + " " + date.getDate() + " " + getMonthToString(date.getMonth())
    create("h2", header, dateToString)

    const body = create("div", main, null, ['day__body'])

    createDaysBar(date, body, user)

    createTimeSlots(date, body, user)
}


export const toggleDayOfWeek = (container, date, user=null) => {

    createTimeSlots(date, container, user)
}