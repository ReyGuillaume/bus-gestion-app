import { create } from "../main";

const drawMainPage = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Agenda", ['mainTitle'])

    return main
}

export const toggleAgenda = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    drawMainPage()
    return main
}