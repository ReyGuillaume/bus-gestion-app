import { calandar } from "../components/calandar";
import { create } from "../main";

const drawAgenda = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Agenda", ['mainTitle'])
    calandar(main)
    
    return main
}

export const toggleAgenda = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    let isUserConnected = true      // tomporaire
    if(isUserConnected) {
        drawAgenda()
    } else {
        create("h4", main, "connectez-vous")
    }
    return main
}