import { create } from "../main"
import { toggleDay } from "./day"

export const toggleTask = ({begining, buses, end, id, id_time_slot_type}) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const header = create("div", main, null, ['day__header'])

    const back = create("div", header)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    const date = new Date (new Date(begining).setHours(0).setMinutes(1))
    back.addEventListener("click", () => toggleDay(date))

    create("h2", header, date)
}