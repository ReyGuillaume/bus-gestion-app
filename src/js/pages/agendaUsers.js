import { create, createChampCheckbox } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import axios from 'axios';

const createListeItem = (container, elem, itemText, classe) => {
    let div = create("div", container, null, [classe, "item_invisible"])
    div.title = itemText
    if(elem.firstname){
        createChampCheckbox(div, `user${elem.id}`, "selectionUser", elem.id)
        create("label", div, elem.firstname + " " + elem.name.toUpperCase()).setAttribute("for", `user${elem.id}`)
    }
    else if(elem.nb_places){
        createChampCheckbox(div, `bus${elem.id}`, "selectionBus", elem.id)
        create("label", div, `Bus n°${elem.id}`).setAttribute("for", `bus${elem.id}`)
    }
    else{
        createChampCheckbox(div, `ligne${elem.number}`, "selectionLine", elem.number)
        create("label", div, `Ligne ${elem.number}`).setAttribute("for", `ligne${elem.number}`)
    }
}

// créer la liste des users de type idtype
const createUsers = (container, idtype, date=null, multi=false, entites=null) => {
    
    // on récupère tous les users de la base de données, du type renseigné
    axios.get("users/users.php?function=bytype&type="+idtype).then(function(response){
        let users = response.data

        users.forEach(user => createListeItem(container, user, `${user.firstname} ${user.name.toUpperCase()}`, "agendaMenu_user_"+idtype))

        if(idtype == 3){
            const b = create("div", container, "Vision globale", ["agendaMenu_user_3", "item_invisible"])
            b.onclick = () => toggleAgenda(undefined, undefined, true)
            b.title = "Vision globale"
        }
    })
    
    return container
}

// rendre visible la liste des users de type idtype
const drawUsers = (idtype) => {
    let users = document.querySelectorAll(".agendaMenu_user_"+idtype)

    for(let user of users){
        user.classList.toggle("item_invisible")
        user.classList.toggle("item_visible")
    }
}


// créer la liste des bus
const createBuses = (container, date=null, multi=false, entites=null) => {
    
    // on récupère tous les users de la base de données, du type renseigné
    axios.get("buses/buses.php?function=buses").then(async function(response){
        let buses = response.data
        
        for(let bus of buses){
            await axios.get("buses/buses.php?function=bus&id="+bus.id).then(function(responseBus){

                let bus = responseBus.data
                createListeItem(container, bus, `Bus n°${bus.id}`, "agendaMenu_bus")
            })
        }
    })
    
    return container
}


// rendre visible la liste des bus
const drawBuses = () => {
    let buses = document.querySelectorAll(".agendaMenu_bus")

    for(let bus of buses){
        bus.classList.toggle("item_invisible")
        bus.classList.toggle("item_visible")
    }
}


// créer la liste des lignes de bus
const createLines = (container, date=null, multi=false, entites=null) => {
    axios.get("lines/lines.php?function=lines").then(function(response){
        let lines = response.data
        lines.forEach(line => createListeItem(container, line, `Ligne ${line.number}`, "agendaMenu_ligne"))
    })
}

// rendre visible la liste des lignes de bus
const drawLines = () => {
    let lines = document.querySelectorAll(".agendaMenu_ligne")

    for(let line of lines){
        line.classList.toggle("item_invisible")
        line.classList.toggle("item_visible")
    }
}

// renvoie la liste des agendas sélectionnés
const entitiesSelected = async () => {
    let selected = []
    for(let user of document.querySelectorAll("input[name='selectionUser']")){
        if (user.checked) {
            await axios.get("users/users.php?function=user&id="+user.value)
            .then(res => selected.push(res.data))
        }
    }

    for(let bus of document.querySelectorAll("input[name='selectionBus']")){
        if (bus.checked) {
            await axios.get("buses/buses.php?function=bus&id="+bus.value)
            .then(res => selected.push(res.data))
        }
    }

    for(let line of document.querySelectorAll("input[name='selectionLine']")){
        if (line.checked) {
            await axios.get("lines/lines.php?function=line&number="+line.value)
            .then(res => selected.push(res.data))
        }
    }
    return selected
}



export {
    createUsers,
    drawUsers,
    createBuses,
    drawBuses,
    createLines,
    drawLines,
    entitiesSelected
}