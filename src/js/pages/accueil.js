import { create } from "../main";

export const toggleAccueil = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "GoBus, la solution pour vos trajets courte durée")
    create("p", main, "blablabla... Il fait beau aujourd'hui...")
    return main
}