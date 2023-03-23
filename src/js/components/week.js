import { create } from "../main";
import '../../assets/style/calandar.css';
import { toggleDayOfWeek } from "../pages/day";


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

// rajoute un "0" si l'horaire est inférieur à 10 (8 => 08)
export const formatedHour = (horaire) => {
    if(horaire < 10){
        return "0" + horaire
    }
    else{
        return horaire
    }
}

// fonction qui crée le header du calendrier d'un mois entier (mois + année)
const createWeek = (container, date, user=null) => {
    const mainDiv = create("div", container, null, ['calandar__header'])

    // flèche gauche
    const leftDiv = create("div", mainDiv, null, ['left-button'])
    create("i", leftDiv , null, ['fa-solid', 'fa-chevron-left'])

    // année
    const centerDiv = create('div', mainDiv, null, ['center-div'])
    create('h2', centerDiv, getMonthToString(date.getMonth()), ['year'])
    create('h2', centerDiv, date.getFullYear(), ['year'])

    // flèche droite
    const rightDiv = create("div", mainDiv, null, ['right-button'])
    create("i", rightDiv , null, ['fa-solid', 'fa-chevron-right'])

    leftDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() - 7)), user))
    rightDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() + 7)), user))

    return mainDiv
}

// fonction qui recupère le 1er Lundi de la semaine de la date
const getFirstMonday = (date) => {
    let initDate = new Date(date)

    let day = getDayToString(initDate.getDay())

    while(day != "Lundi"){
        initDate = new Date(new Date(initDate).setDate(initDate.getDate() - 1))
        day = getDayToString(initDate.getDay())
    }

    return initDate
}

// fonction qui crée le corps du calendrier d'une semaine
const createCalandar = (container, date, user=null) => {
    const body = create("div", container, null, ['calandar__body'])
    const currentDate = new Date(Date.now())

    let initDate = new Date(date)
    let firstDay = getFirstMonday(initDate)
    let date_courante = firstDay
    
    const days = create("div", body, null, ['days'])
    const timeslots = create("div", body, null, ['timeslots'])

    // pour chaque jour de la semaine :
    for(let i=0 ; i<7 ; i++){
        let day = getDayToString(date_courante.getDay())
        let nb = date_courante.getDate()

        let div = create("div", days, day + " " + nb, ['days__day'])
        let timeslots_courant = create("div", timeslots, "", ['timeslots__day'], day)
        toggleDayOfWeek(timeslots_courant, date_courante, user)

        currentDate.getFullYear() == date_courante.getFullYear() &&
        currentDate.getMonth() == date_courante.getMonth() &&
        currentDate.getDate() == date_courante.getDate() ? 
        div.classList.add('today') : div

        date_courante = new Date(new Date(date_courante).setDate(date_courante.getDate() + 1))
    }

    return container
}


// fonction qui affiche le header et le corps du calendrier d'un mois entier
const drawCalandar = (container, date, user=null) => {
    container.replaceChildren("")

    createWeek(container, date, user)
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