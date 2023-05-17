import { create } from "../utils/domManipulation";
import {sendMail} from "../utils/sendMail.js";

const toggle404 = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    sendMail("ConfirmReserv",
        {firstname : "Amélie", mail:"ameliehacque@gmail.com", login:"hacquea", arretDepart:"Les Ducs", arretArrive:"Technolac", finDate:"17/05/2023", debutDate:"17/05/2023", debut:"10:30", fin:"11:30"})

    create("h1", main, "404 not found")
    create("h3", main, "Vous êtes perdus ?")
    const l1 = create("a", main, "Retour à l'accueil")
    l1.href = "/"
    l1.setAttribute("data-navigo", "true")
    return main
}


export { toggle404 }