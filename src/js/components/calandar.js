import { create } from "../main";
import '../../assets/style/calandar.css';
import { toggleDay } from "../pages/day";


export const getDayToString = (index) => {
    switch (index) {
        case 0: return "Dimanche"
        case 1: return "Lundi"
        case 2: return "Mardi"
        case 3: return "Mercredi"
        case 4: return "Jeudi"
        case 5: return "Vendredi"
        case 6: return "Samedi"
        default: return null
    }
}


export const getMonthToString = (index) => {
    switch (index) {
        case 0: return "Janvier"
        case 1: return "Février"
        case 2: return "Mars"
        case 3: return "Avril"
        case 4: return "Mai"
        case 5: return "Juin"
        case 6: return "Juillet"
        case 7: return "Août"
        case 8: return "Septembre"
        case 9: return "Octobre"
        case 10: return "Novembre"
        case 11: return "Décembre"
        default: return null
    }
}



const createMonth = (container, date) => {
    const mainDiv = create("div", container, null, ['calandar__header'])

    const leftDiv = create("div", mainDiv, null, ['left-button'])
    create("i", leftDiv , null, ['fa-solid', 'fa-chevron-left'])

    const centerDiv = create('div', mainDiv, null, ['center-div'])
    create('h2', centerDiv, date.getFullYear(), ['year'])
    create('h2', centerDiv, getMonthToString(date.getMonth()), ['month'])

    const rightDiv = create("div", mainDiv, null, ['right-button'])
    create("i", rightDiv , null, ['fa-solid', 'fa-chevron-right'])

    leftDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setMonth(date.getMonth() - 1))))
    rightDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setMonth(date.getMonth() + 1))))

    return mainDiv
}



const createCalandar = (container, date) => {
    const body = create("div", container, null, ['calandar__body'])

    
    const days = create("div", body, null, ['days'])
    const arr = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    arr.forEach(elt => create("div", days, elt, ['days__day']))
    
    const numbers = create("div", body, null, ['numbers'])
    
    // initDate prends la valeur du premier lundi avant le 1er du mois
    let initDate = new Date(new Date(date).setDate(1))
    while (initDate.getDay() != 1) {
        initDate = new Date(new Date(initDate).setDate(initDate.getDate() - 1))
    }

    const currentDate = new Date(Date.now())
    
    while (initDate.getMonth() != date.getMonth() + 1) {

        let row = create("div", numbers, null, ['numbers__row'])
        for (let col = 0; col < arr.length; col++) {

            const d = new Date(initDate)
            let day = create("div", row, null, ['numbers__num'])
            day.addEventListener("click", () => toggleDay(d))

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



const drawCalandar = (container, date) => {
    container.replaceChildren("")

    createMonth(container, date)
    createCalandar(container, date)

    return container
}



export const calandar = (
    container,
    year = new Date().getFullYear(), 
    monthIndex = new Date().getMonth(), 
    day = new Date().getDate()
) => {
    let date = new Date(year, monthIndex, day)

    const cal = create("div", container, null, ['calandar'])
    drawCalandar(cal, date)

    return container
}