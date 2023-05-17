import { calandar } from "../components/week";
import { create, toggleError } from "../utils/domManipulation";
import { redirectUser, redirect } from "../utils/redirection";
import { createBuses, createLines, createUsers, drawBuses, drawLines, drawUsers, entitiesSelected } from "./agendaUsers";


const afficheEntites = (entites) => {
    let str = "("
    for(let entite of entites){
        if(entite.firstname){
            str += entite.firstname + " " + entite.name.toUpperCase()
        }
        else if(entite.nb_places){
            str += "Bus n°" + entite.id
        }
        else if(entite.number){
            str += "Ligne " + entite.number
        }
        str += ", "
    }
    str = str.slice(0, -2) + ")"
    return str
}

// fonction qui crée un item dans le menu de l'agenda
const createAgendaMenuItem = (container, nom, classe, fct) => {
    const item = create("div", container, null, ["agendaMenu_item"])

    const titre = create("div", item, null, ["agendaMenu_titre"])

    let img = create("img", titre, null, ["agendaMenu_triangle"])
    img.src = "src/assets/images/agenda/triangle.png"
    create("div", titre, nom, ["agendaMenu_nom"])

    titre.addEventListener("click", function(){
        pivoteTriangle(item.querySelector(".agendaMenu_triangle"))
        titre.classList.toggle(`agendaMenu_titre_${classe}`)
        fct()
    })

    return item
}

// fonction qui fait pivoter le triangle dans le sous-menu de l'agenda
const pivoteTriangle = (triangle) => {
    if(triangle.style.transform == 'rotate(90deg)'){
        triangle.style.transform = 'rotate(0deg)'
    }
    else{
        triangle.style.transform = 'rotate(90deg)'
    }
}

// fonction qui crée le menu de l'agenda
const createAgendaMenu = (container, id_role, user=null, date=null, multi=false, entites=null) => {
    const menu = create("div", container, null, ["agendaMenu_invisible"])

    // agenda personnel
    createAgendaMenuItem(menu, "Votre agenda", "perso", () => toggleAgenda())

    // agenda des chauffeurs
    let chauffeurs = createAgendaMenuItem(menu, "Chauffeurs", "chauffeurs", () => drawUsers(3))
    createUsers(chauffeurs, 3, date, multi, entites)

    if(id_role == 1){
        // agenda des responsables logistiques
        let resp = createAgendaMenuItem(menu, "Resp. Logistiques", "resp", () => drawUsers(2))
        createUsers(resp, 2, date, multi, entites)
    }

    // agenda des bus
    let buses = createAgendaMenuItem(menu, "Bus", "bus", () => drawBuses())
    createBuses(buses, date, multi, entites)

    // agenda des lignes de bus
    let lignes = createAgendaMenuItem(menu, "Lignes", "lignes", () => drawLines())
    createLines(lignes, date, multi, entites)

    create("div", menu, "Afficher", ["submitButton"]).addEventListener("click", async () => {
        let entites_choisies = await entitiesSelected()
        let nb_entites = entites_choisies.length

        if(nb_entites < 1){
            toggleError("ERREUR", "Veuillez choisir au moins une entité")
        }
        else if(nb_entites == 1){
            toggleAgenda(entites_choisies[0])
        }
        else if(nb_entites > 4){
            toggleError("ERREUR", "Vous ne pouvez choisir que 4 entités")
        }
        else{
            toggleAgenda(undefined, undefined, true, entites_choisies)
        }
    })
}


// fonction qui affiche la flèche qui permet d'ouvrir le menu de l'agenda
const showAgendaMenu = (container) => {
    const show_menu = create("div", container, null, ["showAgendaMenu"])
    let img = create("img", show_menu)
    img.src = "src/assets/images/agenda/triangle.png"

    show_menu.addEventListener("click", () => {
        pivoteTriangle(img)
        let menu = document.querySelector(".agendaMenu_invisible")
        if(menu){
            menu.classList.remove("agendaMenu_invisible")
            menu.classList.add("agendaMenu")
        }
        else{
            let menu_visible = document.querySelector(".agendaMenu")
            menu_visible.classList.add("agendaMenu_invisible")
            menu_visible.classList.remove("agendaMenu")
        }
    })
}


const drawAgenda = (user=null, date=null, multi=false, entites=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const sessionData = JSON.parse(sessionStorage.getItem("userData"))
    const id_role = sessionData["idrole"]

    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.title = "Retour en arrière"
    back.onclick = () => {
        redirectUser(
            () => redirect("/espace-admin"), 
            () => redirect("/espace-admin"), 
            () => redirect("/espace-utilisateur"),
            () => redirect("/espace-abonne")
        )
    }

    if(id_role == 1 || id_role == 2){
        showAgendaMenu(main)
        createAgendaMenu(main, id_role, user, date, multi, entites)
    }

    // agenda d'un utilisateur
    if(user && user.firstname && !multi){
        create("h2", main, "Agenda de " + user.firstname + " " + user.name.toUpperCase(), ['mainTitle'])
    }
    // agenda d'un bus
    else if(user && user.nb_places && !multi){
        create("h2", main, "Agenda du bus n°" + user.id, ['mainTitle'])
    }
    // agenda d'une ligne de bus
    else if(user && user.number && !multi){
        create("h2", main, "Agenda de la ligne " + user.number, ['mainTitle'])
    }
    // agenda des chauffeurs
    else if(multi && !entites){
        create("h2", main, "Agenda des chauffeurs", ['mainTitle'])
    }
    // agenda des chauffeurs
    else if(multi && entites){
        create("h2", main, "Agenda multiple " + afficheEntites(entites), ['mainTitle'])
    }
    else{
        create("h2", main, "Votre Agenda", ['mainTitle'])
    }
    if(date){
        calandar(main, user, multi, entites, date.getFullYear(), date.getMonth(), date.getDate())
    } else {
        calandar(main, user, multi, entites)
    }

    return main
}

const toggleAgenda = (user=null, date=null, multi=false, entites=null) => {

    const main = document.querySelector("#app")
    main.replaceChildren("")

    // redirection vers l'accueil si user n'est pas connecté
    redirectUser()
    
    drawAgenda(user, date, multi, entites)

    return main
}

export { toggleAgenda }