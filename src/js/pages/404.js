import { create } from "../utils/domManipulation";

const toggle404 = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    create("h1", main, "404 not found")
    create("h3", main, "Vous êtes perdus ?")
    const l1 = create("a", main, "Retour à l'accueil")
    l1.href = "/"
    l1.setAttribute("data-navigo", "true")
    return main
}


export { toggle404 }