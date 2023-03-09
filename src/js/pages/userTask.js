import { create } from "../main"
import { toggleDay } from "./day"

const reunion = (container, props) => {

    create('p', container, props.name)
    create("label", container, "Participants : ")
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });

    create("label", container, "Début : ")
    create("em", container, props.begining)

    create("label", container, "Fin prévue à : ")
    create("em", container, props.end)

    return container
}


const conduite = (container, props) => {

    create('p', container, props.name)
    create("label", container, "Conducteur : ")
    props.users.forEach(element => {
        create("em", container, element.firstname + " " + element.name + ", ")
    });

    create("label", container, "Bus affectés : ")
    props.buses.forEach(element => {
        create("em", container, element.id + "(" + element.nb_places + "places), ")
    });

    create("label", container, "Sur la ligne : ")
    create("em", container, props.lines[0].number + "(" + props.lines[0].direction + ")")

    create("label", container, "Début : ")
    create("em", container, props.begining)

    create("label", container, "Fin prévue à : ")
    create("em", container, props.end)

    return container
}


const indispo = (container, props) => {

    create('p', container, props.name)
    create("label", container, "Vous êtes noté comme indisponible du " + props.begining + " au " + props.end)

    return container
}

// fonction qui permet d'afficher un créneau horaire affecté à l'utilisateur connecté
export const toggleTask = (props, user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    const header = create("div", main, null, ['day__header'])

    const back = create("div", header)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    const date = new Date (new Date(props.begining).setHours(0))
    back.addEventListener("click", () => toggleDay(date, user))
    create("h2", main, "Retour")

    switch (props.name) {
        case "Conduite": conduite(main, props)
            break;
        case "Réunion": reunion(main, props)
            break;
        case "Indisponibilité": indispo(main, props)
            break;
        default: create("h2", main, "Une erreur est survenue")
            break;
    }
}