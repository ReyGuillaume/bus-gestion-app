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

const areFreeEntities = async(beginning, end, elts, fun) => {
    let res = true
    let size = elts.length
    let i = 0

    while (res === true && i < size ) {
        res = await fun(elts[i].id, beginning, end)
        i++
    }
    return res
}

// vérifie la validité des informations pour un créneau de conduite
const conduite = async(beginning, end, users, buses, lines) => {
    return users.length > 0 && buses.length > 0 && lines.length > 0 &&
        lines[0].direction != "" &&
        lines[0].number != "" &&
        await areFreeEntities(beginning, end, users, isFreeUser) &&
        await areFreeEntities(beginning, end, buses, isFreeBus)
}
// vérifie la validité des informations pour un créneau de réunion
const reunion = async(beginning, end, users) => await areFreeEntities(beginning, end, users, isFreeUser)

// vérifie la validité des informations pour un créneau d'indisponibilité
const indispo = async(beginning, end, users) => await areFreeEntities(beginning, end, users, isFreeUser)

const fetchTimeslotData = async id => {
    let res
    await axios
    .get(`timeslots/timeslots.php?function=timeslot&id=${id}`)
    .then(response => res = response.data)
    return res
}

const isValideTimeSlot = async(idTilmeSlot) => {
    let data = await fetchTimeslotData(idTilmeSlot)
    switch (data.id_time_slot_type) {
        case "1": return await conduite(data.begining, data.end, data.users, data.buses, data.lines)
        case "2": return await reunion(data.begining, data.end, data.users)
        case "3": return await indispo(data.begining, data.end, data.users)
        default: return false
    }
}


const seChevauchent = (ts1, ts2) => {
    return ((ts1.begining < ts2.begining) && (ts1.end > ts2.begining)) || ((ts1.end > ts2.end) && (ts1.begining < ts2.end))
}

// renvoie un array contenant les id des créneaux qui sont mal positionnés
const creneauxMalPositionnes = (creneaux) => {
    let nb = creneaux.length
    let res = []
    if(nb > 1) {
        for (let i = 0; i < creneaux.length; i++) {
            for (let j = 0; j < creneaux.length; j++) {
                if (i != j) {
                    if(seChevauchent(creneaux[i], creneaux[j]))
                        res.push(creneaux[i].id)
                }
            }
        }
    }
    return res
}


export { isValideTimeSlot, creneauxMalPositionnes }
