import { create } from "../utils/domManipulation";
import { redirect } from "../utils/redirection";

const createNavBar = () => {
    const h = document.querySelector("#header")
    const nav = create("nav", h, null, ['navBar', 'hide'])

    const l1 = create("button", nav, 'Accueil', ['navBar__item', 'focus', "unstyled-button"])
    l1.onclick = () => redirect("/")
    l1.title = "Retour à l'acceuil"

    // Récupérer la session utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    if (sessionData) {
        // si l'utilisateur est un responsable logistique ou le gérant
        if(["Responsable Logistique", "Directeur", "Conducteur"].includes(sessionData["role"])){
            const agendaButton = create("button", nav, 'Voir mon agenda', ['navBar__item', "unstyled-button"])
            agendaButton.onclick = () => redirect("/agenda")
            agendaButton.title = "Agenda"
        }

        if(["Responsable Logistique", "Directeur"].includes(sessionData["role"])){
            const l2 = create("button", nav, 'Espace administrateur', ['navBar__item', "unstyled-button"])
            l2.onclick = () => redirect("/espace-admin")
            l2.title = "Espace administrateur"
        }
        // si l'utilisateur est un abonné
        else {
            if (["Abonné"].includes(sessionData["role"])) {
                const l3 = create("button", nav, 'Espace utilisateur', ['navBar__item', "unstyled-button"])
                l3.onclick = () => redirect("/espace-abonne")
                l3.title = 'Espace utilisateur'
            } else {
                // si l'utilisateur est un chauffeur
                const l4 = create("button", nav, 'Espace utilisateur', ['navBar__item', "unstyled-button"])
                l4.onclick = () => redirect("/espace-utilisateur")
                l4.title = 'Espace utilisateur'
            }
        }
        const l5 = create("button", nav, 'Se déconnecter', ['navBar__item', "unstyled-button"])
        l5.onclick = () => redirect("/disconnect")
        l5.title = 'Se déconnecter'
    }
    else{

        const l6 = create("button", nav, 'Se connecter', ['navBar__item', "unstyled-button"])
        l6.onclick = () => redirect("/connexion")
        l6.title = 'Se connecter'

        const l7 = create("button", nav, "S'inscrire", ['navBar__item', "unstyled-button"])
        l7.onclick = () => redirect("/inscription")
        l7.title = "S'inscrire"
    }

    nav.onclick = toggleNavBar

    return nav
}

const toggleNavBar = () => {
    document.querySelector("#header .navBar").classList.toggle('hide')
    const i = document.querySelector("#header .toggleNav i")
    i.classList.toggle('fa-bars')
    i.classList.toggle('fa-close')
}

const createHeader = () => {
    const h = document.querySelector("#header")
    h.replaceChildren("")

    const container = create("div", h, null, ['container'])
    const logo = create("img", container, null, ['logo'], "Gobus_Logo", "/src/assets/images/gobus-logo-color.png", "Gobus Logo")
    logo.addEventListener("click", () => redirect("/"))
    logo.title = "Retour à l'accueil"

    // contains the informations of the user (if authentified)
    let user_infos = create("p", container, "", null, "infosUser");

    // Collect the session's data
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    if (sessionData) {
        const {id, prenom, nom, role, idrole} = sessionData;                // Destructuration of session's data
        user_infos.textContent = `${prenom} ${nom.toUpperCase()}, ${role}`; // Display of user's session
    }

    const toggle = create("button", container, null, ['toggleNav', "unstyled-button"])
    toggle.title = "Menu"
    toggle.addEventListener("click", toggleNavBar)
    create("i", toggle , null, ['fa-solid', 'fa-bars'])
    createNavBar()

    return h;
}

export {
    createHeader
}