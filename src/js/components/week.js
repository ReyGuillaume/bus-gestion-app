import { create } from "../main";
import '../../assets/style/calandar.css';
import { toggleDayOfWeek } from "../pages/day";
import axios from "axios"


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
    create('h2', centerDiv, getMonthToString(date.getMonth()) + " " + date.getFullYear(), ['year'])

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


// affiches les heures entre 6h et 22h (avec un interval de 2h entre chaque)
const drawHouresColumn = (container) => {

    let item = 0

    for (let h = 6; h <= 22; h ++) {

        let elt = create("p", container, `${h}:00`,['heure'])
        elt.style.setProperty('--item', item);

        let div = create("div", container, null, ['deux-heures', `${h}:00`])
        let min = 0

        let nb = 3
        for (let i = 0; i < nb; i++) {
            create("div",div,null,['trente-min', `${min >= 60 ? h+1 : h}:${min % 60}`, `${ i === Math.floor((nb -1) / 2) ? "mid" : null}`])
            min += 30
        }

        item++
    }

    return container
}


const handleDargEnter = e => {
    e.preventDefault()
    e.target.classList.toggle("dragover")
}

const handleDargOver = e => e.preventDefault()

const handleDargLeave = e => {
    e.target.classList.toggle("dragover")
}


const toggleModifValidation = async e => {
    // let timeslot = document.querySelector(".timeslots").querySelector(`#${e.dataTransfer.getData('text/plain')}`)
    
    // //on repalce le créneau dans la nouvelle colonne
    // e.target.appendChild(timeslot)

    let app = document.querySelector("#app")

    let overlay = create("div", app, null, ["overlay"])
    overlay.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        e.target.remove()
    }

    let modale = create("div", overlay, null, ['validation'])
    modale.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
    }

    const back = create("div", modale)
    create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])
    back.onclick = () => {
        modale.remove()
        overlay.remove()
    }

    let id = e.dataTransfer.getData('text/plain')
    id = id.substring(2, id.length)

    create("h1", modale, "Voulez vous effectuer cette action ?")

    let data;
    await axios.get(`timeslots/timeslots.php?function=timeslot&id=${id}`)
    .then(res => data = res.data)

    console.log(data)

    let types, type
    await axios.get(`timeslots/timeslots.php?function=types`)
    .then(res => types = res.data)

    types.forEach(t => {
        if(t.id == data.id_time_slot_type)
            type = t
    })

    let date = new Date(data.begining)
    let jour = getDayToString(date.getDay())
    let num = date.getDate()
    let mois = getMonthToString(date.getMonth())
    let annee = date.getFullYear()
    let h = date.getHours()
    let min = date.getMinutes()

    create("p", modale, `Déplacer le créneau de ${type.name} du ${jour} ${num} ${mois} ${annee} à ${h}h${min}`)
    
}


const handleDrop = e => {
    e.target.classList.toggle("dragover")

    //création d'une modale de validation
    toggleModifValidation(e)

}

// création des zones de drop
const addDragAndDrop = div => {
    div.ondragenter = handleDargEnter
    div.ondragover = handleDargOver
    div.ondragleave = handleDargLeave
    div.ondrop = handleDrop
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

    create("div", days, null, ['days__day'])
    const colonneHeures = create("div", timeslots, null, ['timeslots__day', 'col-heures'])

    drawHouresColumn(colonneHeures)

    // pour chaque jour de la semaine :
    for(let i=0 ; i<7 ; i++){
        let day = getDayToString(date_courante.getDay())
        let nb = date_courante.getDate()

        let div = create("div", days, day + " " + nb, ['days__day'])
        let timeslots_courant = create("div", timeslots, "", ['timeslots__day', 'drop'], day)
        toggleDayOfWeek(timeslots_courant, date_courante, user)

        addDragAndDrop(timeslots_courant)

        // On ajoute la classe 'today' si c'est la date d'aujourd'hui
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