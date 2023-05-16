import { create, createChamp, createChampCheckbox, createChampRadio, toggleAlert, toggleError } from "../utils/domManipulation";
import { toggleDayOfWeek, toggleDrivers, toggleMultiAgenda } from "../pages/day";
import { datePhp, formatedDatePhp } from "../utils/dates";
import { toggleAgenda } from "../pages/agenda";
import { getMonthToString, getIdOfDay, getDayToString, formatedHour, getFirstMonday, getNearestHour, getNearestMinute } from "../utils/dates"
import { participantsTimeslot, busesTimeslot, lineDirectionTimeslot, lineTimeslot } from "../pages/gestionTimeslots";
import axios from "axios"

import '../../assets/style/calandar.css'

// fonction qui crée le header du calendrier d'un mois entier (mois + année)
const createWeek = (container, date, user=null, multi=false, entites=null) => {
    const mainDiv = create("div", container, null, ['calandar__header'])

    // flèche gauche
    const leftDiv = create("button", mainDiv, null, ['left-button', "unstyled-button"])
    leftDiv.title = "Semaine précédente"
    create("i", leftDiv , null, ['fa-solid', 'fa-chevron-left'])

    // année
    const centerDiv = create('div', mainDiv, null, ['center-div'])
    create('h2', centerDiv, getMonthToString(date.getMonth()) + " " + date.getFullYear(), ['year'])

    // flèche droite
    const rightDiv = create("button", mainDiv, null, ['right-button', "unstyled-button"])
    rightDiv.title = "Semaine suivante"
    create("i", rightDiv , null, ['fa-solid', 'fa-chevron-right'])

    leftDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() - 7)), user, multi, entites))
    rightDiv.addEventListener("click", () => drawCalandar(container, new Date(new Date(date).setDate(date.getDate() + 7)), user, multi, entites))

    return mainDiv
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

// fonction qui s'exécute dès qu'on bouge un objet draggable
const handleDargEnter = e => {
    e.preventDefault()
    e.target.classList.toggle("dragover")
}

// fonction qui s'exécute à chaque milliseconde où l'objet est tenu par la souris
const handleDargOver = e => e.preventDefault()
// "e.preventDefault()" permet donc d'empêcher le déplacement de l'élément par le navigateur pendant le drag & drop, pour que le code JavaScript puisse gérer le déplacement de l'élément de manière personnalisée

// fonction qui s'exécute à chaque fois que l'objet tenu pointe vers une nouvelle cible
const handleDargLeave = e => e.target.classList.toggle("dragover")

// fonction qui s'exécute dès qu'on lâche l'objet
const handleDrop = (e, date, user, multi=false, entites=null) => {
    e.target.classList.toggle("dragover")

    if(e.dataTransfer.getData('text/plain').substring(0, 2) === "ts" && e.target.classList.contains("drop")){
        toggleModifValidation(e, date, user, multi, entites)    //création d'une modale de validation
    }
    else if(e.dataTransfer.getData('text/plain') == "actionreunion" && e.target.classList.contains("drop")){
        toggleNewTimeSlot("Réunion", e, date, user, multi, entites)
    }
    else if(e.dataTransfer.getData('text/plain') == "actionindispo" && e.target.classList.contains("drop")){
        toggleNewTimeSlot("Indisponibilité", e, date, user, multi, entites)
    }
    else if(e.dataTransfer.getData('text/plain') == "actionconduite" && e.target.classList.contains("drop")){
        toggleNewTimeSlot("Conduite", e, date, user, multi, entites)
    }
    else if(e.dataTransfer.getData('text/plain') == "actionastreinte" && e.target.classList.contains("drop")){
        toggleNewTimeSlot("Astreinte", e, date, user, multi, entites)
    }
}

// afficher une pop-up pour créer un créneau en drag & drop
const toggleNewTimeSlot = async (nom, e, dateOfMonday, user, multi=false, entites=null) => {
    const main = document.querySelector("#app")
    main.classList.add("cache")

    const container = document.querySelector("#footer")

    // la popup
    const popup = create("div", container, null, ["pageCreateTimeslot"])

    // retour en arrière
    const back = create("button", popup, '<< Retour', ['return', "unstyled-button"])
    back.onclick = () => {
        popup.remove()
        main.classList.remove("cache")
    }
    back.title = "Retour en arrière"

    // titre
    create("h3", popup, nom)

    //obtention de l'heure en fonction du drop
    let nbminutes =  Math.floor(((23 - 6) * 60) * e.offsetY / e.target.clientHeight)
    let nouvh = Math.floor(nbminutes / 60) + 6
    let nouvmin = Math.floor(nbminutes % 60)

    let heure_arrondie = getNearestHour(nouvh, nouvmin)
    let minute_arrondie = getNearestMinute(nouvmin)

    // horaires
    let date = new Date(dateOfMonday)
    while (date.getDay() != getIdOfDay(e.target.id)) {
        date = new Date(new Date(date).setDate(date.getDate() + 1))
    }
    date.setHours(heure_arrondie)
    date.setMinutes(minute_arrondie)

    let beginning = formatedDatePhp(date)

    create("label", popup, "Début :", ["form-info"])
    createChamp(popup, "datetime-local", "StartDateTime").value = beginning

    create("label", popup, "Fin :", ["form-info"])
    createChamp(popup, "datetime-local", "EndDateTime").value = beginning

    var users = null
    var buses = null
    var lines = null
    var type = 0

    if(nom == "Conduite"){
        type = 1
        await axios.get(`users/users.php?function=bytype&type=3`).then((res) => users = res.data)
        
        await axios.get(`buses/buses.php?function=buses`).then((res) => buses = res.data)

        await axios.get(`lines/lines.php?function=lines`).then((res) => lines = res.data)
    }
    else if(nom == "Réunion"){
        type = 2
        await axios.get(`users/users.php?function=users`).then((res) => users = res.data)
    }
    else if(nom == "Indisponibilité"){
        type = 3
        const sessionData = JSON.parse(sessionStorage.getItem("userData"))
        const id_user = sessionData['id']

        let user_indiso = createChampCheckbox(popup, id_user, "selectionParticipant", id_user)
        user_indiso.checked = true
        user_indiso.style.display = "none"
    }
    else{
        type = 5
        let div_user = create("div", popup)
        createChampCheckbox(div_user, `u${user.id}`, "selectionParticipant", user.id).checked = true
        create("label", div_user, user.firstname.substr(0,1) + "." + user.name.toUpperCase()).setAttribute("for", `u${user.id}`)
        await axios.get(`buses/buses.php?function=buses`).then((res) => buses = res.data)
    }
    
    if(users){
        create("div", popup, "Participants :", ["form-info"])
        for(let user_data of users){
            if(user_data.id_user_type != 4) {
                let div_user = create("div", popup)
                let c = createChampCheckbox(div_user, `u${user_data.id}`, "selectionParticipant", user_data.id)
                if (user.firstname && user.id == user_data.id) {
                    c.checked = true
                }
                var label = create("label", div_user, user_data.name + " " + user_data.firstname);
                label.setAttribute("for", `u${user_data.id}`);
                }
        }
    }

    if(buses){
        create("div", popup, "Bus :", ["form-info"])
        for(let bus of buses){
            let div_bus = create("div", popup)
            let c = createChampCheckbox(div_bus, `b${bus.id}`, "selectionBus", bus.id)
            if(user.nb_places && user.id == bus.id) {c.checked = true}
            create("label", div_bus, "Bus n°" + bus.id).setAttribute("for", `b${bus.id}`)
        }
    }

    if(lines){
        create("div", popup, "Ligne :", ["form-info"])
        for(let line of lines){
            let div_line = create("div", popup)
            let c = createChampRadio(div_line, `l${line.number}`, "selectionLigne", line.number)
            if(user.number && user.number == line.number) {c.checked = true}
            create("label", div_line, "Ligne " + line.number).setAttribute("for", `l${line.number}`)
        }

        create("div", popup, "Direction :", ["form-info"])

        let aller = create("div", popup, null, ["div-radio"])
        createChampRadio(aller, "aller", "selectionDirection", "aller").checked = true
        create("div", aller, "aller")

        let retour = create("div", popup, null, ["div-radio"])
        createChampRadio(retour, "retour", "selectionDirection", "retour")
        create("div", retour, "retour")
    }

    const btn = create("div", popup, "Valider", ["modifButton"])
    btn.addEventListener("click", function(){
        let StartDateTime = document.querySelector("input[name='StartDateTime']").value
        let EndDateTime = document.querySelector("input[name='EndDateTime']").value

        let participants = participantsTimeslot()
        let bus_affectes = busesTimeslot()
        let ligne_affectee = lineTimeslot()
        let direction_ligne = lineDirectionTimeslot()

        let url = `timeslots/timeslots.php?function=create&beginning=${StartDateTime}&end=${EndDateTime}&type=${type}`

        url += participants ?  `&users=${participants}` : `&users=`
        url += bus_affectes ? `&buses=${bus_affectes}` : `&buses=`
        url += ligne_affectee ? `&lines=${ligne_affectee}` : `&lines=`
        url += ligne_affectee && direction_ligne ? `&directions=${direction_ligne}` : `&directions=`

        axios.get(url).then(function(response){
            if(response.data){
                let newDate = new Date(StartDateTime)
                toggleAgenda(user, newDate, multi)
                toggleAlert("BRAVO", "Le créneau a bien été ajouté")
            }
            else{
                toggleError("ERREUR", "Le créneau n'a pas pu être ajouté")
            }
            popup.remove()
            main.classList.remove("cache")
        })
    })
}


const toggleModifValidation = async (e, dateOfMonday, user, multi=false, entites=null) => {

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
    const back = create("button", modale, '<< Retour', ['return', "unstyled-button"])
    back.title = "Retour en arrière"
    create("h1", modale, "Voulez vous effectuer cette action ?")
    const content = create("div", modale, null, ['content'])
    create("p", content, `Déplacer le créneau de type ${type.name} du :`)
    create("p", content, `${jour} ${formatedHour(num)} ${mois} ${annee} à ${formatedHour(h)}h${formatedHour(min)}`, ['important'])
    create("p", content, `Vers le :`)
    create("p", content, `${nouvjour} ${formatedHour(nouvnum)} ${nouvmois} ${nouvannee} à ${formatedHour(heure_arrondie)}h${formatedHour(minute_arrondie)}`, ['important'])
    const buttonDiv = create("div", modale, null, ["button-container"])
    const annuler = create("button", buttonDiv, "Annuler", ['second-button'])
    annuler.title = "Annuler"
    const valider = create("button", buttonDiv, "Valider", ['primary-button'])
    valider.title = "Valider"
    
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
        toggleAgenda(user, newDate, multi, entites)
        success ? toggleAlert("Bravo !", "Le créneau a bien été modifié") : toggleError("Erreur", "Le créneau n'a pas pu être modifié")
    }
}

// création des zones de drop
const addDragAndDrop = (div, date, user, multi=false, entites=null) => {
    div.ondragenter = handleDargEnter
    div.ondragover = handleDargOver
    div.ondragleave = handleDargLeave
    div.ondrop = e => handleDrop(e, date, user, multi, entites)
}


// fonction qui crée le corps du calendrier d'une semaine
const createCalandar = (container, date, user=null, multi=false, entites=null) => {
    const body = create("div", container, null, ['calandar__body'])
    const currentDate = new Date(Date.now())
    const sessionData = JSON.parse(sessionStorage.getItem("userData"))

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
        

        if(multi && entites == null){
            toggleDrivers(timeslots_courant, date_courante)
        }
        else if(multi && entites){
            toggleMultiAgenda(timeslots_courant, date_courante, entites)
        }
        else{
            toggleDayOfWeek(timeslots_courant, date_courante, user, multi, entites)
        }

        addDragAndDrop(timeslots_courant, firstDay, user, multi, entites)

        // On ajoute la classe 'today' si c'est la date d'aujourd'hui
        currentDate.getFullYear() == date_courante.getFullYear() &&
        currentDate.getMonth() == date_courante.getMonth() &&
        currentDate.getDate() == date_courante.getDate() ? 
        div.classList.add('today') : div

        date_courante = new Date(new Date(date_courante).setDate(date_courante.getDate() + 1))
    }

    if(!multi){
        const actions = create("div", container, null, ["actionsTimeslot", "actionsClosed"])

        const add = create("img", actions, null, ["addTimeslot"])
        add.src = "src/assets/images/agenda/ajouter.png"
        add.addEventListener("click", () => modifActions(actions, sessionData['idrole'], firstDay, user, multi, entites))
        add.title = "Ajouter un créneau"
    }
    return container
}


const modifActions = (action, id_role, firstDay, user, multi, entites) => {    
    if(action.classList.contains("actionsClosed")){
        toggleActionsMenu(action, id_role, firstDay, user, multi, entites)
    }
    else{
        removeActionsMenu(action)
    }
}

// fonction qui crée l'icône d'une action de drag & drop
const createActionItem = (container, nom_action, titre_action, class_name, firstDay, user, multi, entites) => {
    let action = create("img", container, null, [class_name])
    action.src = `src/assets/images/agenda/${nom_action}.png`
    action.title = titre_action
    action.ondragstart = (e) => e.dataTransfer.setData('text/plain', "action" + nom_action)
    addDragAndDrop(action, firstDay, user, multi, entites)
}

// afficher le menu des actions de drag & drop
const toggleActionsMenu = (action_menu, id_role, firstDay, user, multi, entites) => {
    action_menu.classList.remove("actionsClosed")
    action_menu.classList.add("actionsOpened")

    let add = action_menu.querySelector(".addTimeslot")
    add.style.transform = 'rotate(45deg)'

    let role = parseInt(id_role)

    // Réunion : Directeur -> Utilisateur ou lui-même
    if(role == 1 && (!user || (user.firstname || (!user.id && !user.number)))){
        createActionItem(action_menu, "reunion", "Réunion", "actionReunion", firstDay, user, multi, entites)
    }
    // Conduite : Directeur - Resp Log -> Bus - Chauffeur - Ligne
    if(((role == 1 || role == 2) && user) && (user.nb_places || user.id_user_type == 3 || user.number)){
        createActionItem(action_menu, "conduite", "Conduite", "actionConduite", firstDay, user, multi, entites)
    }
    // Indispo : Chauffeur
    if(role == 3){
        createActionItem(action_menu, "indispo", "Indisponibilité", "actionIndispo", firstDay, user, multi, entites)
    }
    // Astreinte : Directeur - Resp Log -> Chauffeur
    if(((role == 1 || role == 2) && user) && user.id_user_type == 3){
        createActionItem(action_menu, "astreinte", "Astreinte", "actionAstreinte", firstDay, user, multi, entites)
    }
}

// enlever le menu des actions de drag & drop
const removeActionsMenu = (action_menu) => {
    action_menu.classList.add("actionsClosed")
    action_menu.classList.remove("actionsOpened")

    
    let add = action_menu.querySelector(".addTimeslot")
    add.style.transform = 'rotate(0deg)'

    let reunion = document.querySelector(".actionReunion")
    let conduite = document.querySelector(".actionConduite")
    let indispo = document.querySelector(".actionIndispo")
    let astreinte = document.querySelector(".actionAstreinte")

    if(reunion){ reunion.remove() }
    if(conduite){ conduite.remove() }
    if(indispo){ indispo.remove() }
    if(astreinte){ astreinte.remove() }
}


// fonction qui affiche le header et le corps du calendrier d'un mois entier
const drawCalandar = (container, date, user=null, multi=false, entites=null) => {
    container.replaceChildren("")

    createWeek(container, date, user, multi, entites)
    createCalandar(container, date, user, multi, entites)

    return container
}



const calandar = (
    container,
    user=null,
    multi=false,
    entites=null,
    year = new Date().getFullYear(), 
    monthIndex = new Date().getMonth(), 
    day = new Date().getDate()
) => {
    let date = new Date(year, monthIndex, day)

    const cal = create("div", container, null, ['calandar'])

    drawCalandar(cal, date, user, multi, entites)

    return container
}


export { calandar }