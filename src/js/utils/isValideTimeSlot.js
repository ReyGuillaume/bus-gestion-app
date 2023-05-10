import axios from "axios"

const isFreeEntity = async axiosRequest => {
    let res
    await axios
    .get(axiosRequest)
    .then(response => res = response.data.length === 1)
    return res
}

const isFreeUser = async (id, beginning, end) => await isFreeEntity(`timeslots/timeslots.php?function=timeslotbyuser&user=${id}&beginning=${beginning}&end=${end}`)

const isFreeBus = async (id, beginning, end) => await isFreeEntity(`timeslots/timeslots.php?function=timeslotbybus&bus=${id}&beginning=${beginning}&end=${end}`)

// Renvoie un array de strings correspondant aux erreurs dues aux indisponibilité des participants à un créneau
const areFreeEntities = async(beginning, end, elts, fun) => {
    let res = []

    for (const elt of elts) {
        if(await fun(elt.id, beginning, end))
            res.push(`${elt.firstname} ${elt.name} n'est pas disponible à ce moment.`)
    }

    return res
}

// vérifie la validité des informations pour un créneau de conduite
const conduite = async(beginning, end, users, buses, lines) => {
    let res = []

    if(users.length === 0)
        res.push("Il n'y a pas de conducteur affecté à ce créneau.")
    if(buses.length === 0)
        res.push("Il n'y a pas de bus affecté à ce créneau.") 
    if(lines.length === 0){
        res.push("Il n'y a pas de ligne affecté à ce créneau.")
    } else {
        if(lines[0].direction == "")
            res.push("Aucune direction n'a été renseignée pour la ligne de ce créneau.")
        if(lines[0].number == "")
            res.push("Aucune numéro de ligne n'a été renseignée pour cette ligne.")
    }
    
    res.concat(await areFreeEntities(beginning, end, users, isFreeUser))
    res.concat(await areFreeEntities(beginning, end, buses, isFreeBus))

    return res
}
// vérifie la validité des informations pour un créneau de réunion
const reunion = async(beginning, end, users) => {
    let res = []

    if(users.length === 0)
        res.push("Il n'y a personne qui soit affecté à ce créneau.")

    res.concat(await areFreeEntities(beginning, end, users, isFreeUser))
    return res
}

// vérifie la validité des informations pour un créneau d'indisponibilité
const indispo = async(beginning, end, users) => {
    let res = []

    if(users.length === 0)
        res.push("Il n'y a personne qui soit affecté à ce créneau.")

    res.concat(await areFreeEntities(beginning, end, users, isFreeUser))
    return res
}


// Renvoie un array de strings correspondant aux erreurs apparues sur le créneau en fonction de son type
const errorsOfTimeSlot = async(timeslot) => {
    switch (parseInt(timeslot.id_time_slot_type)) {
        case 1: return await conduite(timeslot.begining, timeslot.end, timeslot.users, timeslot.buses, timeslot.lines)
        case 2: return await reunion(timeslot.begining, timeslot.end, timeslot.users)
        case 3: return await indispo(timeslot.begining, timeslot.end, timeslot.users)
        case 4: return [];
        case 5: return [];
        default: return ["Le type de ce créneau est inconnu."]
    }
}

// Renvoie un booléen correspondant à si les deux créneaux passés en paramètres se chevauchent ou non
const seChevauchent = (ts1, ts2) => {
    return (
        ((ts1.begining < ts2.begining) && (ts1.end > ts2.begining)) || 
        ((ts1.end > ts2.end) && (ts1.begining < ts2.end)) ||
        ((ts1.begining > ts2.begining) && (ts1.end < ts2.end))
    )
}


// Renvoie la liste de créneaux passés en paramètre dans lequel on ajoute un champs errors (array)
const checkTimeSlots = async creneaux => {
    let res = [...creneaux]
    res.forEach(elt => elt.errors = [])
    
    // On vérifie si des créneaux se chevauchent
    if(res.length > 1) {
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (i != j) {
                    if(seChevauchent(res[i], res[j]))
                        res[i].errors.push("Ce créneau en chevauche un autre.")
                }
            }
        }
    }

    for (const elt of res) {
        elt.errors = elt.errors.concat(await errorsOfTimeSlot(elt))
    }

    return res
}

export { checkTimeSlots }
