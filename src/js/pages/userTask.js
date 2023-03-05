import { create } from "../main"
import { toggleDay } from "./day"

// fonction qui permet d'afficher un créneau horaire affecté à l'utilisateur connecté
export const toggleTask = ({begining, buses, end, id, id_time_slot_type}, user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const header = create("div", main, null, ['day__header'])

    const back = create("div", header)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    const date = new Date (new Date(begining).setHours(0))
    back.addEventListener("click", () => toggleDay(date, user))

    console.log({begining, buses, end, id, id_time_slot_type})

    create("h2", header, date)
}