import { create } from "../main";
import { toggleAccueil } from "../pages/accueil";
import { toggleAgenda } from "../pages/agenda";

export const createHeader = () => {
    const h = document.querySelector("#header")
    h.replaceChildren("")
    create("h1", h, "GoBus", ['title'])

    const nav = create("nav", h, null, ['navBar'])

    create("div", nav, 'accueil', ['navBar__item']).addEventListener("click", toggleAccueil)
    create("div", nav, 'Agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, 'Se connecter', ['navBar__item']).addEventListener("click", null)

    return h;
}