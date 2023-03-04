import { create } from "../main";

const createNavBar = () => {
    const h = document.querySelector("#header")
    const nav = create("nav", h, null, ['navBar', 'hide'])

    create("a", nav, 'Accueil', ['navBar__item', 'focus']).href = "/"
    create("a", nav, 'Agenda', ['navBar__item']).href = "/agenda"

    // Get session of user
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    if (sessionData) {
        create("a", nav, 'Se déconnecter', ['navBar__item']).href = "/disconnect"
    }
    else{
        create("a", nav, 'Se connecter', ['navBar__item']).href = "/adminForm"
    }

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

    // contains the informations of the user (if authentified)
    let user_infos = create("p", container, "", null, "infosUser");

    // Collect the session's data
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    if (sessionData) {
        const {id, prenom, nom, role, idrole} = sessionData;                // Destructuration of session's data
        user_infos.textContent = `${prenom} ${nom.toUpperCase()}, ${role}`; // Display of user's session
    }

    const toggle = create("div", container, null, ['toggleNav'])
    toggle.addEventListener("click", toggleNavBar)
    create("i", toggle , null, ['fa-solid', 'fa-bars'])
    createNavBar()

    return h;
}