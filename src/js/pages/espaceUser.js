import { create } from "../main";

export const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, "Voici les action que vous pouvez réaliser ici : ")
    return main
}