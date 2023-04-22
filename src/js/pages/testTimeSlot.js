import axios from 'axios'

/**
 * @param {int} id du bus testé
 * @param {String} beginning début de la plage horaire testée
 * @param {String} end fin de la plage horaire testée
 * @returns 
 */
const isFreeEntity = async axiosRequest => {
    let res
    await axios
    .get(axiosRequest)
    .then(response => res = response.data.length == 0)
    return res
}

/**
 * 
 * @param {int} id de l'utilisateur testé
 * @param {String} beginning début de la plage horaire testée
 * @param {String} end fin de la plage horaire testée
 * @returns 
 */
const isFreeUser = async (id, beginning, end) => isFreeEntity(`timeslots/timeslots.php?function=timeslotbyuser&user=${id}&beginning=${beginning}&end=${end}`)

/**
 * @param {int} id du bus testé
 * @param {String} beginning début de la plage horaire testée
 * @param {String} end fin de la plage horaire testée
 * @returns 
 */
const isFreeBus = async (id, beginning, end) => isFreeEntity(`timeslots/timeslots.php?function=timeslotbybus&bus=${id}&beginning=${beginning}&end=${end}`)


const areFreeEntities = async(beginning, end, elts, fun) => {
    let res = true
    let size = elts.length
    let i = 0

    while (res === true && i < size ) {
        res = await fun(elts[i], beginning, end)
        i++
    }

    return res
}


/**
 * 
 * @param {String} beginning début du créneau
 * @param {String} end fin du créneau
 * @param {Array} users liste des utilisateurs qui seront affectés au créneau
 * @param {Array} buses liste des bus
 * @returns boolean si le créneau d'indisponibilité peut être ajouté
 */
const conduite = async(beginning, end, users, buses) => {
    let res = areFreeEntities(beginning, end, users, isFreeUser)
    if (res) {   
        areFreeEntities(beginning, end, buses, isFreeBus)
    }
    return res
}


/**
 * 
 * @param {String} beginning début du créneau
 * @param {String} end fin du créneau
 * @param {Array} users liste des utilisateurs qui seront affectés au créneau
 * @returns boolean si le créneau d'indisponibilité peut être ajouté
 */
const reunion = async(beginning, end, users) => await areFreeEntities(beginning, end, users, isFreeUser)


/**
 * 
 * @param {String} beginning début du créneau
 * @param {String} end fin du créneau
 * @param {Array} users liste des utilisateurs qui seront affectés au créneau
 * @returns boolean si le créneau d'indisponibilité peut être ajouté
 */
const indispo = async(beginning, end, users) => await areFreeEntities(beginning, end, users, isFreeUser)


/**
 * Vérifie si le créneau peut être posé ou non
 * 
 * @param {String} beginning : la date de début du créneau
 * @param {String} end : la date de fin du créneau
 * @param {int} type : le type du créneau
 * @param {Array} users : la liste des id des utilisateur affectés au créneau
 * @param {Array} buses : la liste des id des bus affectés au créneau
 * @returns boolean si le créneau peut être ou non posé
 */
export const timeSlotCanBeSubmit = async(beginning, end, type, users=null, buses=null) => {
    let t
    t = typeof(type) != "number" ? parseInt(type) : type

    switch (t) {
        case 1: return await conduite(beginning, end, users, buses)
        case 2: return await reunion(beginning, end, users)
        case 3: return await indispo(beginning, end, users)
        default: return false
    }
}
