import { create } from "../utils/domManipulation";
import { toggleAgenda } from "./agenda";
import { toggleIndisponibilitiForm } from "../pages/indisponibilitiForm"
import { createMenuElement } from "../components/menuItem";
import { redirect, redirectUser } from "../utils/redirection";

const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    redirectUser(
        () => redirect("/"),
        () => redirect("/"),
        () => null
    )
        
    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar_User'])

    // agenda
    createMenuElement(nav, toggleAgenda, "rose", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // signaler indispo
    createMenuElement(nav, toggleIndisponibilitiForm, "jaune", "src/assets/images/nav_creneau.png", "Signaler un creneau d'indisponibilité", "Signaler un creneau d'indisponibilité")

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "orange", "src/assets/images/nav_notif.png", "Afficher les notifications", "Afficher les notifications")
    
    return main
}

export { toggleEspaceUser }