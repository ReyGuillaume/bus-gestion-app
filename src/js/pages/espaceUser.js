import { create } from "../utils/domManipulation";
import { createMenuElement } from "../components/menuItem";
import { redirect, redirectUser, toggleAlertMessage } from "../utils/redirection";

const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    redirectUser(
        () => redirect("/"),
        () => redirect("/"),
        () => null,
        () => redirect("/")
    )

    // affiche le potentiel message d'alerte en stock
    toggleAlertMessage()
        
    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar_User'])

    // agenda
    createMenuElement(nav, () => redirect("/agenda"), "violet", "src/assets/images/nav_agenda.png", "Voir mon agenda", "Voir mon agenda")

    // signaler indispo
    createMenuElement(nav, () => redirect("/indisponibilite"), "bleu", "src/assets/images/nav_creneau.png", "Signaler un creneau d'indisponibilité", "Signaler un creneau d'indisponibilité")

    // notif
    createMenuElement(nav, () => redirect("/notification-center"), "vert_clair", "src/assets/images/nav_notif.png", "Afficher les notifications", "Afficher les notifications")

    // espace utilisateur
    createMenuElement(nav, () => redirect("/informations-utilisateur"), "rouge", "src/assets/images/nav_profil.png", "Afficher mes informations", "Afficher mes informations")
    
    return main
}

export { toggleEspaceUser }