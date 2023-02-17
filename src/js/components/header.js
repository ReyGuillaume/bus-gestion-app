import { create } from "../main";
import { toggleAccueil } from "../pages/accueil";
import { toggleAgenda } from "../pages/agenda";

const createNavBar = () => {
    const h = document.querySelector("#header")
    const nav = create("nav", h, null, ['navBar', 'hide'])

    create("div", nav, 'Accueil', ['navBar__item', 'focus']).addEventListener("click", toggleAccueil)
    create("div", nav, 'Agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, 'Se connecter', ['navBar__item']).addEventListener("click", null)

    return nav
}


const toggleNavBar = () => {
    document.querySelector("#header .navBar").classList.toggle('hide')
    const i = document.querySelector("#header .toggleNav i")
    i.classList.toggle('fa-bars')
    i.classList.toggle('fa-close')
}


export const createHeader = () => {
    const h = document.querySelector("#header")
    h.replaceChildren("")

    const container = create("div", h, null, ['container'])
    create("img", container, null, ['logo'], null, "./src/assets/images/gobus-logo-color.png", "Gobus Logo")
    const toggle = create("div", container, null, ['toggleNav'])
    toggle.addEventListener("click", toggleNavBar)
    create("i", toggle , null, ['fa-solid', 'fa-bars'])
    createNavBar()

    return h;
}