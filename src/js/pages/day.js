import { create, createChampCheckbox, toggleError } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleTask } from "./userTask";
import { getMonthToString , getDayToString, datePhp, formatedHour } from "../utils/dates";
import { redirect } from "../utils/redirection";
import axios from "axios";
import { checkTimeSlots } from "../utils/isValideTimeSlot";

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
    }
    // bus
    else if(user != null && user.nb_places){
        let idBus = user.id
        await axios.get(`timeslots/timeslots.php?function=timeslotbybus&bus=${idBus}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
    }
    // ligne
    else if(user != null && user.number){
        let idLine = user.number
        await axios.get(`timeslots/timeslots.php?function=timeslotbyline&line=${idLine}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
    }
    // personnel
    else{
        let idUser = sessionData['id']
        await axios.get(`timeslots/timeslots.php?function=timeslotbyuser&user=${idUser}&beginning=${d1}&end=${d2}`)
        .then(res => data = res.data)
    }
    return [...data]
}

const handlerDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.id)
}

// fonction qui renvoie un booléen indiquant si le user a un rôle qui lui permet de modifier tel créneau
const possibleDrag = (user_role, timeslot_name) => {
    if(user_role == "Conducteur"){
        return timeslot_name == "Indisponibilité"
    } else if (user_role == "Responsable Logistique"){
        return timeslot_name == "Conduite"
    } else {
        return timeslot_name == "Conduite" || timeslot_name == "Réunion"
    }
}

// affiche les initiales d'une entité sur l'agenda
const afficheInitiales = (entite) => {
    if(entite.firstname){
        return entite.firstname.substr(0,1) + entite.name.substr(0,1)
    }
    else if(entite.nb_places){
        return "Bus " + entite.id
    }
    else if(entite.number){
        return "L" + entite.number
    }
}

// fonction qui affiche tous les créneaux horaires récupérés, affectés à l'utilisateur connecté
const createTimeSlots = async (date, container, user=null, multi=false, entites=null, index=0) => {
    const main = document.querySelector("#app")
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const user_role = sessionData["role"]
    const footer = document.querySelector("#footer")
    let res = await fetchTimeSlots(date, user)
    
    // initiales des 6 chauffeurs
    if(multi && !entites){
        let initiales = create("div", container, afficheInitiales(user), ["initiales"])
        initiales.style.left = (25 * index) + "px"
        initiales.style.width = 25 + "px"
    }
    // initiales d'entités différentes
    else if(multi && entites){
        let initiales = create("div", container, afficheInitiales(entites[index]), ["initiales"])
        initiales.style.left = ((150 / entites.length) * index) + "px"
        initiales.style.width = (150 / entites.length) + "px"
    }
    if (res.length > 0) {
        res = await checkTimeSlots(res)
        res.forEach(async timeslot => {
            let div
            if(multi){
                div = create("div", container, null, ['timeslot','timeslot_multi_'+timeslot.name], [`ts${timeslot.id}`])
            }
            else{
                div = create("div", container, null, ['timeslot'], [`ts${timeslot.id}`])
            }
            div.setAttribute("tabindex", "0")
            div.addEventListener("click", () => toggleTask(footer, timeslot, div, user, multi))
            div.addEventListener("keydown", e => {
                if (e.code === "Enter") 
                    toggleTask(footer, timeslot, div, user, multi)
            })

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

            if(multi && entites){
                div.style.left = ((150 / entites.length) * index) + "px"
                div.style.width = (150 / entites.length) + "px"
            }
            else if(multi && !entites){
                div.style.left = (25 * index) + "px"
                div.style.width = 25 + "px"
            }
            else{
                const color = create("div", div, null, ["timeslot__color", timeslot.name])
                const div_color = create("div", color, null, ["div-color"])
                div_color.style.height = duree + "px"
            }

            //ajout du drag & drop
            if(div.getAttribute("draggable")){
                div.ondragstart = handlerDragStart
            }
            
            if(!multi){
                const houres = create("div", div, null, ["timeslot__houres"])
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
                    case "Astreinte": create("h3", body, "Astreinte")
                        break;
                    case "Réservation": create("h3", body, "Réservation")
                        break;
                    default: create("h3", body, "ERREUR")
                        break;
                }
            }
            else{
                const houres_multi = create("div", div, null, ["timeslot__houres_multi"])
                create("div", houres_multi, formatedHour(heure_debut) + ":" + formatedHour(min_debut), ['beginning_multi'])
                create("div", houres_multi, formatedHour(heure_fin) + ":" + formatedHour(min_fin), ['end_multi'])
            }

            if(!multi){
                const goto = create("div", div, null, ["timeslot__goto"])
                create("i", goto , null, ['fa-solid', 'fa-chevron-right'])
            }
            else{
                create("div", div, timeslot.name, ["multi-info"])
            }

            // Gestion des erreurs
            if(timeslot.errors.length > 0){
                const e = create("button", div, "!", ["timeslot__error", "unstyled-button"])
                e.title = "Des erreurs ont été détectées"
                e.onclick = e => {
                    e.stopPropagation()
                    openErrorModale(timeslot)
                }
                e.onkeydown = e => e.stopPropagation()
            }
        })
    }
    // erreur globale
    if (main.querySelectorAll(".timeslot__error").length > 0)
        create("button", main, "!", ["timeslot__error", "unstyled-button"]).title = "Certains créneaux ont des erreurs signalées"
}


const openErrorModale = (timeslot) => {
    const app = document.querySelector("#app")
    const overlay = create("div", app, null, ["overlay"])
    const modale = create("div", overlay, null, ["validation"])
    const back = create("button", modale, '<< Retour', ['return', "unstyled-button"])
    back.title = "Retour en arrière"

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

    if(timeslot.errors.length > 0){
        create("h2", modale, "Quelque chose cloche sur ce créneau...")
        timeslot.errors.forEach(err => create("p", modale, "/!\\ " + err))
    } else {
        create("p", modale, "Rien à signaler pour ce créneau ci.")
    }
}

const toggleDay = (date, user=null) => {
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

// afficher l'agenda d'un jour de la semaine
const toggleDayOfWeek = (container, date, user=null, multi=false, entites=null) => {

    createTimeSlots(date, container, user, multi, entites)
}

// afficher l'agenda des 6 chauffeurs (sur un jour)
const toggleDrivers = async (container, date) => {
    let users = []
    let i = 0

    await axios.get(`users/users.php?function=bytype&type=3`)
    .then(res => users = res.data)

    for(let user of users){
        createTimeSlots(date, container, user, true, null, i)
        i += 1
    }
}


// afficher 4 agendas (au choix)
const toggleMultiEntities = async () => {

    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => redirect("/espace-admin"))
    back.title = "Retour en arrière"

    create("h2", main, "Agenda multiple")
    create("p", main, "Sélectionnez au maximum 4 agendas que vous souhaitez afficher", ["presentation"])

    let users = []
    let buses = []
    let lines = []
    let entites = []

    await axios.get(`users/users.php?function=users`)
    .then(res => users = res.data)

    await axios.get(`buses/buses.php?function=buses`)
    .then(res => buses = res.data)

    await axios.get(`lines/lines.php?function=lines`)
    .then(res => lines = res.data)

    const multi_form = create("div", main, null, ["multi-form"])

    const multi_choix = create("div", multi_form, null, ["multi-choix"])

    // affichage des utilisateurs
    const div_users = create("div", multi_choix, null, ["choix", "choix_users"])
    create("div", div_users, "Utilisateurs", ["choix-titre"])

    for(let user of users){
        let div_user = create("div", div_users, null, ["selectMulti"])
        createChampCheckbox(div_user, `u${user.id}`, "selectionUser", user.id).onclick = async () => entites = await entitiesSelected()
        create("label", div_user, " " + user.firstname + " " + user.name.toUpperCase()).htmlFor = `u${user.id}`
    }

    // affichage des bus
    const div_buses = create("div", multi_choix, null, ["choix", "choix_bus"])
    create("div", div_buses, "Bus", ["choix-titre"])

    for(let bus of buses){
        let div_bus = create("div", div_buses, null, ["selectMulti"])
        createChampCheckbox(div_bus, `b${bus.id}`, "selectionBus", bus.id).onclick = async () => entites = await entitiesSelected()
        create("label", div_bus, " Bus n°" + bus.id).htmlFor = `b${bus.id}`
    }

    // affichage des lignes
    const div_lines = create("div", multi_choix, null, ["choix", "choix_lignes"])
    create("div", div_lines, "Lignes", ["choix-titre"])

    for(let line of lines){
        let div_line = create("div", div_lines, null, ["selectMulti"])
        createChampCheckbox(div_line, `l${line.number}`, "selectionLine", line.number).onclick = async () => entites = await entitiesSelected()
        create("label", div_line, " Ligne " + line.number).htmlFor = `l${line.number}`
    }

    const b = create("button", multi_form, "Afficher", ["choixButton", "unstyled-button"])
    b.title = "Afficher"
    b.addEventListener("click", function(){
        if(entites.length > 4){
            toggleError("ERREUR", "Vous ne pouvez sélectionner que 4 entités")
        }
        else if(entites.length < 1){
            toggleError("ERREUR", "Veuillez choisir au moins une entité")
        }
        else if(entites.length == 1){
            toggleAgenda(entites[0])
        }
        else{
            toggleAgenda(undefined, undefined, true, entites)
        }
    })
}

// renvoie la liste des agendas sélectionnés
const entitiesSelected = async () => {
    let selected = []
    for(let user of document.querySelectorAll("input[name='selectionUser']")){
        if (user.checked) {
            await axios.get("users/users.php?function=user&id="+user.id)
            .then(res => selected.push(res.data))
        }
    }

    for(let bus of document.querySelectorAll("input[name='selectionBus']")){
        if (bus.checked) {
            await axios.get("buses/buses.php?function=bus&id="+bus.id)
            .then(res => selected.push(res.data))
        }
    }

    for(let line of document.querySelectorAll("input[name='selectionLine']")){
        if (line.checked) {
            await axios.get("lines/lines.php?function=line&number="+line.id)
            .then(res => selected.push(res.data))
        }
    }
    return selected
}


const toggleMultiAgenda = async (container, date, entites) => {
    let i = 0
    let agendas = await entites

    for(let entite of agendas){
        createTimeSlots(date, container, entite, true, agendas, i)
        i += 1
    }
}

export {
    toggleDay,
    toggleDayOfWeek,
    toggleDrivers,
    toggleMultiEntities,
    toggleMultiAgenda
}