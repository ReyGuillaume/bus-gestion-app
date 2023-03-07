import { create } from "../main";
import { toggleAgenda } from "../pages/agenda";

import { toggleIndisponibilitiForm, toggleSupprIndispo } from "../pages/indisponibilitiForm"

export const toggleEspaceUser = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Bienvenue sur votre espace personnel")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir mon agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, "Signaler un creneau d'indisponibilité", ['navBar__item']).addEventListener("click", toggleIndisponibilitiForm)
    create("div", nav, "Supprimer un creneau d'indisponibilité", ['navBar__item']).addEventListener("click", toggleSupprIndispo)
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)
    
    return main
}

