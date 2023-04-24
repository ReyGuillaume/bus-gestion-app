const getDayToString = (index) => {
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


const getMonthToString = (index) => {
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

const getIdOfDay = day => {
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

// renvoie une date JS sous forme 2023-02-16 00:00:00
const datePhp = date => date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()


// rajoute un "0" si l'horaire est inférieur à 10 (8 => 08)
const formatedHour = (horaire) => {
    if(horaire < 10){
        return "0" + horaire
    }
    else{
        return horaire
    }
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

// fonction qui prend en paramètres un nombre de minutes (int) et renvoie le temps en heures (string)
const convertMinutesToTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;
  
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (remainingMinutes < 10) {
      remainingMinutes = "0" + remainingMinutes;
    }
    return hours + "h" + remainingMinutes;
}

export {
    getDayToString,
    getMonthToString,
    getIdOfDay,
    datePhp,
    formatedHour,
    getFirstMonday,
    getNearestHour,
    getNearestMinute,
    convertMinutesToTime
}