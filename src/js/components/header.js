import { create } from "../main";

export const createHeader = () => {
    const h = document.querySelector("#header")
    h.replaceChildren("")
    create("h1", h, "GoBus", ['title'])
    const nav = create("nav", h, null, ['navBar'])
    const items = ['accueil', 'agenda', 'se connecter']
    items.forEach(item => create("div", nav, item, ['navBar__item']))
    return h;
}