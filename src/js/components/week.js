import { create, toggleAlert, toggleError } from "../main";
import '../../assets/style/calandar.css';
import { toggleDayOfWeek, datePhp, toggleMultiDay } from "../pages/day";
import axios from "axios"
import { toggleAgenda } from "../pages/agenda";


export const getIdOfDay = day => {
    switch (day) {
        case "Dimanche": return 0
        case "Lundi": return 1
        case "Mardi": return 2
        case "Mercredi": return 3
        case "Jeudi": return 4
        case "Vendredi": return 5
        case "Samedi": return 6
        default: return null
    }
}


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
const createWeek = (container, date, user=null, multi=false) => {
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

    leftDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() - 7)), user, multi))
    rightDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() + 7)), user, multi))

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

        let elt = create("p", container, `${formatedHour(h)}:00`,['heure'])
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

const handleDrop = (e, date, user, multi=false) => {
    e.target.classList.toggle("dragover")
    if(e.dataTransfer.getData('text/plain').substring(0, 2) === "ts" && e.target.classList.contains("drop")){
        toggleModifValidation(e, date, user, multi)    //création d'une modale de validation
    }
}

// Fonction pour obtenir l'heure la plus proche à la demi-heure près
const getNearestHour = (hour, minute) => {
    if(minute <= 15){
        return hour;
    }
    else if(minute <= 45){
        return hour;
    }
    else{
        return (hour + 1) % 24;
    }
  }
  
// Fonction pour obtenir la minute la plus proche à la demi-heure près
const getNearestMinute = (minute) => {
if(minute >= 45 || minute < 15){
    return 0;
} 
else{
    return 30;
}
}

const toggleModifValidation = async (e, dateOfMonday, user, multi=false) => {

    let app = document.querySelector("#app")
    let id = e.dataTransfer.getData('text/plain')
    id = id.substring(2, id.length)

    let data, types, type
    await axios.get(`timeslots/timeslots.php?function=timeslot&id=${id}`)
    .then(res => data = res.data)
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

    //obtention de l'heure en fonction du drop
    let nbminutes =  Math.floor(((23 - 6) * 60) * e.offsetY / e.target.clientHeight)
    let nouvh = Math.floor(nbminutes / 60) + 6
    let nouvmin = Math.floor(nbminutes % 60)

    let heure_arrondie = getNearestHour(nouvh, nouvmin)
    let minute_arrondie = getNearestMinute(nouvmin)

    //on crée une date positionnée au jour recevant le créneau
    let newDate = new Date(dateOfMonday)
    while (newDate.getDay() != getIdOfDay(e.target.id)) {
        newDate = new Date(new Date(newDate).setDate(newDate.getDate() + 1))
    }
    newDate.setHours(heure_arrondie)
    newDate.setMinutes(minute_arrondie)

    let nouvjour = getDayToString(newDate.getDay())
    let nouvnum = newDate.getDate()
    let nouvmois = getMonthToString(newDate.getMonth())
    let nouvannee = newDate.getFullYear()
    let dateFin = new Date(data.end)
    let offsetH = dateFin.getHours() - h
    let offsetMin = dateFin.getMinutes() - min
    let newDateFin = new Date(newDate)
    newDateFin.setHours(heure_arrondie + offsetH)
    newDateFin.setMinutes(minute_arrondie + offsetMin)
    
    // création des composants
    const overlay = create("div", app, null, ["overlay"])
    const modale = create("div", overlay, null, ['validation'])
    const back = create("div", modale, '<< Retour', ['return'])
    create("h1", modale, "Voulez vous effectuer cette action ?")
    const content = create("div", modale, null, ['content'])
    create("p", content, `Déplacer le créneau de type ${type.name} du :`)
    create("p", content, `${jour} ${formatedHour(num)} ${mois} ${annee} à ${formatedHour(h)}h${formatedHour(min)}`, ['important'])
    create("p", content, `Vers le :`)
    create("p", content, `${nouvjour} ${formatedHour(nouvnum)} ${nouvmois} ${nouvannee} à ${formatedHour(heure_arrondie)}h${formatedHour(minute_arrondie)}`, ['important'])
    const buttonDiv = create("div", modale, null, ["button-container"])
    const annuler = create("button", buttonDiv, "Annuler", ['second-button'])
    const valider = create("button", buttonDiv, "Valider", ['primary-button'])
    
    // ajout des actions au clic
    overlay.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        e.target.remove()
    }
    modale.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
    }
    back.onclick = () => {
        modale.remove()
        overlay.remove()
    }
    annuler.onclick = () => {
        modale.remove()
        overlay.remove()
    }
    valider.onclick = async() => {
        let success
        let id = data.id
        let beginning = datePhp(newDate)
        let end = datePhp(newDateFin)
        let users = "", buses = "", lines = "", directions = ""
        data.users.forEach(user => users += `${user.id},`)
        data.buses.forEach(bus => buses += `${bus.id},`)
        data.lines.forEach(line => {
            lines += `${line.number},`
            directions += `${line.direction},`
        })
        await axios.get(`timeslots/timeslots.php?function=update&id=${id}&beginning=${beginning}&end=${end}&users=${users}&buses=${buses}&lines=${lines}&directions=${directions}`)
        .then(res => success = res.data)
        toggleAgenda(user, newDate, multi)
        success ? toggleAlert("Bravo !", "Le créneau a bien été modifié") : toggleError("Erreur", "Le créneau n'a pas pu être modifié")
    }
}

// création des zones de drop
const addDragAndDrop = (div, date, user, multi=false) => {
    div.ondragenter = handleDargEnter
    div.ondragover = handleDargOver
    div.ondragleave = handleDargLeave
    div.ondrop = e => handleDrop(e, date, user, multi)
}


// fonction qui crée le corps du calendrier d'une semaine
const createCalandar = (container, date, user=null, multi=false) => {
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
        let timeslots_courant
        if(multi){
            timeslots_courant = create("div", timeslots, "", ['timeslots__day_multi', 'drop'], day)
        }
        else{
            timeslots_courant = create("div", timeslots, "", ['timeslots__day', 'drop'], day)
        }
        

        if(multi){
            toggleMultiDay(timeslots_courant, date_courante)
        }
        else{
            toggleDayOfWeek(timeslots_courant, date_courante, user, multi)
        }

        addDragAndDrop(timeslots_courant, firstDay, user, multi)

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
const drawCalandar = (container, date, user=null, multi=false) => {
    container.replaceChildren("")

    createWeek(container, date, user, multi)
    createCalandar(container, date, user, multi)

    return container
}



export const calandar = (
    container,
    user=null,
    multi=false,
    year = new Date().getFullYear(), 
    monthIndex = new Date().getMonth(), 
    day = new Date().getDate()
) => {
    let date = new Date(year, monthIndex, day)

    const cal = create("div", container, null, ['calandar'])

    drawCalandar(cal, date, user, multi)

    return container
}