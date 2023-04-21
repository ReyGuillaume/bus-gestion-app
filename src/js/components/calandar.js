import { create } from "../main";
import { toggleDay } from "../pages/day";
import { getMonthToString } from "../utils/dates"

import '../../assets/style/calandar.css';

// fonction qui crée le header du calendrier d'un mois entier (mois + année)
const createMonth = (container, date, user=null) => {
    const mainDiv = create("div", container, null, ['calandar__header'])

    // flèche gauche
    const leftDiv = create("div", mainDiv, null, ['left-button'])
    create("i", leftDiv , null, ['fa-solid', 'fa-chevron-left'])

    // mois + année
    const centerDiv = create('div', mainDiv, null, ['center-div'])
    create('h2', centerDiv, date.getFullYear(), ['year'])
    create('h2', centerDiv, getMonthToString(date.getMonth()), ['month'])

    // flèche droite
    const rightDiv = create("div", mainDiv, null, ['right-button'])
    create("i", rightDiv , null, ['fa-solid', 'fa-chevron-right'])

    leftDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setUTCMonth(date.getUTCMonth() - 1)), user))
    rightDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setUTCMonth(date.getUTCMonth() + 1)), user))

    return mainDiv
}


// fonction qui crée le corps du calendrier d'un mois entier
const createCalandar = (container, date, user=null) => {
    const body = create("div", container, null, ['calandar__body'])

    
    const days = create("div", body, null, ['days'])
    const arr = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    arr.forEach(elt => create("div", days, elt, ['days__letter']))
    
    const numbers = create("div", body, null, ['numbers'])
    
    // initDate prend la valeur du premier lundi avant le 1er du mois
    let initDate = new Date(new Date(date).setDate(1))
    while (initDate.getDay() != 1) {
        initDate = new Date(new Date(initDate).setDate(initDate.getDate() - 1))
    }

    const currentDate = new Date(Date.now())

    // si on passe à décembre, date.getMonth() + 1 = 12 (donc il faut faire modulo 12)
    while (initDate.getMonth() != ((date.getMonth() + 1)%12)) {

        let row = create("div", numbers, null, ['numbers__row'])
        for (let col = 0; col < arr.length; col++) {

            const d = new Date(initDate)
            let day = create("div", row, null, ['numbers__num'])
            day.addEventListener("click", () => toggleDay(d, user))

            d.getMonth() != date.getMonth() ? day.classList.add('opacity') : day

            currentDate.getFullYear() == initDate.getFullYear() &&
            currentDate.getMonth() == initDate.getMonth() &&
            currentDate.getDate() == initDate.getDate() ? 
            day.classList.add('today') : day

            create("h3", day, d.getDate())

            initDate = new Date(new Date(initDate).setDate(initDate.getDate() + 1))
        }
    }

    return container
}


// fonction qui affiche le header et le corps du calendrier d'un mois entier
const drawCalandar = (container, date, user=null) => {
    container.replaceChildren("")

    createMonth(container, date, user)
    createCalandar(container, date, user)

    return container
}



export const calandar = (
    container,
    user=null,
    year = new Date().getFullYear(), 
    monthIndex = new Date().getMonth(), 
    day = new Date().getDate()
) => {
    let date = new Date(year, monthIndex, day)

    const cal = create("div", container, null, ['calandar'])

    drawCalandar(cal, date, user)

    return container
}