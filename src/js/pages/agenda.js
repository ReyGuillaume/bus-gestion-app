import { calandar } from "../components/week";
import { create } from "../utils/domManipulation";
import { redirectUser, redirect } from "../utils/redirection";


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

const drawAgenda = (user=null, date=null, multi=false, entites=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

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
    // agenda d'un utilisateur
    if(user && user.firstname){
        create("h2", main, "Agenda de " + user.firstname + " " + user.name.toUpperCase(), ['mainTitle'])
    }
    // agenda d'un bus
    else if(user && user.nb_places){
        create("h2", main, "Agenda du bus n°" + user.id, ['mainTitle'])
    }
    // agenda d'une ligne de bus
    else if(user && user.number){
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