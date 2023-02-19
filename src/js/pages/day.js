import { create } from "../main";
import { toggleAgenda } from "./agenda";

export const toggleDay = (date) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("div", main)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    back.addEventListener("click", toggleAgenda)

    create("h1", main, date)
}