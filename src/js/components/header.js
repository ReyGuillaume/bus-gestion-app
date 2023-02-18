import { create } from "../main";

const createNavBar = () => {
    const h = document.querySelector("#header")
    const nav = create("nav", h, null, ['navBar', 'hide'])

    create("a", nav, 'Accueil', ['navBar__item', 'focus']).href = "/"
    create("a", nav, 'Agenda', ['navBar__item']).href = "/agenda"
    create("a", nav, 'Se connecter', ['navBar__item']).href = "/signin"

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