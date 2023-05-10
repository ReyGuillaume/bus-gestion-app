import { create } from "../utils/domManipulation";
import { redirect } from "../utils/redirection";

const createNavBar = () => {
    const h = document.querySelector("#header")
    const nav = create("nav", h, null, ['navBar', 'hide'])

    create("a", nav, 'Accueil', ['navBar__item', 'focus']).href = "/"

    // Récupérer la session utilisateur
    const sessionData = JSON.parse(sessionStorage.getItem("userData"));
    if (sessionData) {
        // si l'utilisateur est un responsable logistique ou le gérant
        if(["Responsable Logistique", "Directeur"].includes(sessionData["role"])){
            create("a", nav, 'Espace administrateur', ['navBar__item']).href = "/espace-admin"
        }
        // si l'utilisateur est un abonné
        else {
            if (["Abonné"].includes(sessionData["role"])) {
                create("a", nav, 'Espace utilisateur', ['navBar__item']).href = "/espace-abonne"
            } else {
                // si l'utilisateur est un chauffeur
                create("a", nav, 'Espace utilisateur', ['navBar__item']).href = "/espace-utilisateur"
            }
        }
        create("a", nav, 'Se déconnecter', ['navBar__item']).href = "/disconnect"
    }
    else{
        create("a", nav, 'Se connecter', ['navBar__item']).href = "/connexion"
    }

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