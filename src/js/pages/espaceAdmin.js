import { create } from "../main";
import { toggleAgenda } from "../pages/agenda";
import { toggleAddCreneau } from "../pages/adminForms";


export const toggleEspaceAdmin = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    create("h2", main, "Bienvenue sur votre espace Admin")
    create("p", main, " Que souhaitez vous faire ? ")

    const nav = create("nav", main, null, ['navBar'])

    create("div", nav, 'Voir mon agenda', ['navBar__item']).addEventListener("click", toggleAgenda)
    create("div", nav, "Ajouter un creneau", ['navBar__item']).addEventListener("click", toggleAddCreneau)
    create("div", nav, "Ajouter des participants à un créneau", ['navBar__item']).addEventListener("click", null)
    create("div", nav, 'Gerer les utilisateurs', ['navBar__item']).addEventListener("click", null)
    create("div", nav, 'Gerer les bus', ['navBar__item']).addEventListener("click", null)
    
    create("div", nav, 'Se deconnecter', ['navBar__item']).addEventListener("click", null)


    return main
}
