import { create } from "../main";

export const createHeader = () => {
    const h = document.querySelector("#header")
    h.replaceChildren("")
    create("h1", h, "GoBus", ['title'])

    const nav = create("nav", h, null, ['navBar'])
    const items = ['accueil', 'agenda', 'se connecter']
    items.forEach(item => create("div", nav, item, ['navBar__item']))

    create("div", nav, 'accueil', ['navBar__item']).addEventListener("click", toggleAccueil)
    create("div", nav, 'Agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, 'Se connecter', ['navBar__item']).addEventListener("click", null)
    
    return h;
}