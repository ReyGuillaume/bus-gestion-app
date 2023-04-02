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
const datePhp = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()


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

// fonction qui affiche tous les créneaux horaires récupérés, affectés à l'utilisateur connecté
const createTimeSlots = async (date, container, user=null) => {
    const footer = document.querySelector("#footer")
    const res = await fetchTimeSlots(date, user)
    if (res.length > 0) {
        res.forEach(timeslot => {
            const div = create("div", container, null, ['timeslot'])
            div.addEventListener("click", () => toggleTask(footer, timeslot, div))

            const color = create("div", div, null, ["timeslot__color", timeslot.name])
            create("div", color, null, ["div-color"])

            const houres = create("div", div, null, ["timeslot__houres"])

            let heure_debut = formatedHour(new Date(timeslot.begining).getHours())
            let min_debut = formatedHour(new Date(timeslot.begining).getMinutes())
            let heure_fin = formatedHour(new Date(timeslot.end).getHours())
            let min_fin = formatedHour(new Date(timeslot.end).getMinutes())

            create("h2", houres, heure_debut + ":" + min_debut, ['beginning'])
            create("h2", houres, heure_fin + ":" + min_fin, ['end'])

            const body = create("div", div, null, ["timeslot__body"])
            create("h3", body, timeslot.name)

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