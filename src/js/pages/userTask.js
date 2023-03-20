import { create } from "../main"

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
export const toggleTask = (container, props, user=null) => {
    
    const ancienne_task = document.querySelector("#task")

    if(ancienne_task){
        ancienne_task.remove()
    }

    const task = create("div", container, null, null, "task")

    const back = create("div", task)
    create("i", back , null, ['fa-solid', 'fa-chevron-left'])
    back.addEventListener("click", () => task.remove())

    switch (props.name) {
        case "Conduite": conduite(task, props)
            break;
        case "Réunion": reunion(task, props)
            break;
        case "Indisponibilité": indispo(task, props)
            break;
        default: create("h2", task, "Une erreur est survenue")
            break;
    }
}