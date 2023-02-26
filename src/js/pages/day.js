import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleTask } from "./userTask";
import { getMonthToString , getDayToString } from "../components/calandar";
import axios from "axios";


const createDaysBar = (date, container) => {

    let dateInt = new Date(date)
    const line = create("div", container, null, ['days'])

    for (let i = 0; i < 7; i++) {
        const day = create("div", line, null, ['day'])
        create("p", day, getDayToString(dateInt.getDay()).substring(0, 3), ['day__name'])
        create("p", day, dateInt.getDate(), ['day__number'])

        const d = new Date(dateInt)
        day.addEventListener("click", () => toggleDay(d))

        dateInt = new Date(new Date(dateInt).setDate(dateInt.getDate() + 1))
    }

    return container
}


// renvoie une date JS sous forme 2023-02-16 00:00:00
const datePhp = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()


const fetchTimeSlots = async date => {
    let data = []
    let d1 = datePhp(date)
    let d2 = datePhp(new Date(new Date(date).setDate(date.getDate() + 1)))
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    let idUser = sessionData['id']
    await axios.get(`timeslots/timeslots.php?function=timeslotbyuser&user=${idUser}&beginning=${d1}&end=${d2}`)
    .then(res => data = res.data)
    return [...data]
}


const createTimeSlots = async (date, container) => {
    const res = await fetchTimeSlots(date)
    if (res.length > 0) {
        res.forEach(timeslot => {
            const div = create("div", container, null, ['timeslot'])
            div.addEventListener("click", () => toggleTask(timeslot))

            const color = create("div", div, null, ["timeslot__color"])
            create("div", color, null, ["div-color"])

            const houres = create("div", div, null, ["timeslot__houres"])
            create("h2", houres, timeslot.begining, ['beginning'])
            create("h2", houres, timeslot.end, ['end'])

            const body = create("div", div, null, ["timeslot__body"])
            create("h2", body, timeslot.type_name)

            const goto = create("div", div, null, ["timeslot__goto"])
            create("i", goto , null, ['fa-solid', 'fa-chevron-right'])
        })
    } else {
        create("h2", container, "Vous n'avez pas encore de taches définies aujourd'hui", ['timeslot--unfound'])
    }
}


export const toggleDay = (date) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const header = create("div", main, null, ['day__header'])

    const back = create("div", header)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    back.addEventListener("click", () => toggleAgenda())

    let dateToString = getDayToString(date.getDay()) + " " + date.getDate() + " " + getMonthToString(date.getMonth())
    create("h2", header, dateToString)

    const body = create("div", main, null, ['day__body'])

    createDaysBar(date, body)

    createTimeSlots(date, body)
}