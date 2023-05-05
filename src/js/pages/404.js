import { create } from "../utils/domManipulation";

const toggle404 = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h1", main, "404 not found")
    create("h3", main, "Vous êtes perdus ?")
    create("a", main, "Retour à l'accueil").href = "/"
    return main
}


export { toggle404 }