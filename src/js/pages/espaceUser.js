import { create } from "../main";
import { toggleAgenda } from "./agenda";
import { toggleIndisponibilitiForm, toggleSupprIndispo } from "../pages/indisponibilitiForm"
import {toggleNotificationCenter} from "./notificationCenter.js";

export const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"));

    // si l'utilisateur n'est pas connecté
    if(!sessionData){
        window.location = "/"
    }
    // si l'utilisateur n'est pas un chauffeur
    else if(sessionData["role"] != "Conducteur"){
        window.location = "/"
    }

    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, "Que souhaitez-vous faire ?", ["presentation"])

    const nav = create("nav", main, null, ['navBar_User'])

    // agenda
    const div = create("div", nav, null, ["navBar_container"])
    div.addEventListener("click", toggleAgenda)
    const img = create("div", div, null, ["navBar_image", "rose"])
    create("img", img).src = "src/assets/images/nav_agenda.png"
    create("div", div, 'Voir mon agenda', ['navBar__item'])

    // signaler indispo
    const div2 = create("div", nav, null, ["navBar_container"])
    div2.addEventListener("click", toggleIndisponibilitiForm)
    const img2 = create("div", div2, null, ["navBar_image", "jaune"])
    create("img", img2).src = "src/assets/images/nav_creneau.png"
    create("div", div2, "Signaler un creneau d'indisponibilité", ['navBar__item'])
    
    // supprimer indispo
    const div3 = create("div", nav, null, ["navBar_container"])
    div3.addEventListener("click", toggleSupprIndispo)
    const img3 = create("div", div3, null, ["navBar_image", "rouge"])
    create("img", img3).src = "src/assets/images/nav_creneau.png"
    create("div", div3, "Supprimer un creneau d'indisponibilité", ['navBar__item'])

    // notif
    const div10 = create("div", nav, null, ["navBar_container"])
    div10.addEventListener("click", toggleNotificationCenter)
    const img10 = create("div", div10, null, ["navBar_image", "orange"])
    create("img", img10).src = "src/assets/images/nav_notif.png"
    create("div", div10, 'Afficher les notifications', ['navBar__item'])
    
    return main
}

