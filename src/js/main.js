import axios from 'axios'



/**
 * Exécute l'appel à la base de donnée pour créer toutes les tables si elle ne le sont pas déjà.
 */
export const createTables = () => {
    axios.get("createTables.php")
}



/**
 * Crée un élément Html avec les propriétés passées en paramètres contenu dans le container parent.
 * 
 * @param {string} tagName : nom l'élément html à ajouter.
 * @param {Element} container : Element html parent.
 * @param {string} text : Texte a ajouter au composant. Null par défaut.
 * @param {Array} classNames : liste de classes a ajouter à l'élément. Null par défaut.
 * @param {string} id : Id à ajouter à l'élément. Null par défaut.
 * @param {string} src : url ou chemin d'accès de l'image. Null par défaut.
 * @param {string} alt : déscription de l'image ajoutée. Null par défaut.
 * @returns l'élément html nouvellement construit.
 */
export const create = (tagName, container, text=null, classNames=null, id=null, src=null, alt=null) => {
    let elt = container.appendChild(document.createElement(tagName))
    text ? elt.appendChild(document.createTextNode(text)) : elt
    classNames ? classNames.forEach(className => elt.classList.add(className)) : elt
    id ? elt.id = id : elt
    src ? elt.src = src : elt
    alt ? elt.alt = alt : elt
    return elt
}


/**
 * Crée un élément Html INPUT avec les propriétés passées en paramètres contenu dans le container parent.
 *

 * @param {Element} container : Element html parent ( le formulaire ).
 * @param {string} type : Type de l'input. text par défaut.
 * @param {string} name : Nom de l'input. Null par défaut.
 * @param {string} placeholder : Placeholder de l'input. Null par défaut.
 * @returns l'élément html nouvellement construit.
 */
export const createChamp = ( container, type="text", name= null, placeholder=null) => {

    let champ = container.appendChild(document.createElement("input"))

    type ? champ.setAttribute("type", type) : champ
    name ? champ.setAttribute("name", name) : champ
    placeholder ? champ.setAttribute("placeholder", placeholder) : champ

    return champ
}

/**
 * Crée un élément Html INPUT  radio avec les propriétés passées en paramètres contenu dans le container parent.
 * 

 * @param {Element} container : Element html parent ( le formulaire ).
 * @param {string} id : id de l'input radio. Null par défaut.
 * @param {string} name : Nom de l'input radio. Null par défaut.
 * @param {string} value : Valeur de l'input. Null par défaut.
 * @returns l'élément html nouvellement construit.
 */
export const createChampRadio = ( container, id=null, name= null, value=null) => {

    let champ = container.appendChild(document.createElement("input"))
    champ.setAttribute("type", "radio") 

    id ? champ.setAttribute("id", id) : champ
    name ? champ.setAttribute("name", name) : champ
    value ? champ.setAttribute("value", value) : champ

    return champ
}

/**
 * Crée un élément Html INPUT  checkbox avec les propriétés passées en paramètres contenu dans le container parent.
 * 

 * @param {Element} container : Element html parent ( le formulaire ).
 * @param {string} id : id de l'input checkbox. Null par défaut.
 * @param {string} name : Nom de l'input checkbox. Null par défaut.
 * @returns l'élément html nouvellement construit.
 */
export const createChampCheckbox = ( container, id=null, name= null, value=null) => {

    let champ = container.appendChild(document.createElement("input"))
    champ.setAttribute("type", "checkbox") 

    id ? champ.setAttribute("id", id) : champ
    name ? champ.setAttribute("name", name) : champ
    value ? champ.setAttribute("value", value) : champ
    return champ
}


/**
 * Crée une petite fenêtre d'alerte, qui notifie l'utilisateur d'une action qu'il a effectuée
 * 

 * @param {Element} container : Element html parent.
 * @param {string} titre : titre du message d'erreur à afficher (Bravo, Attention...).
 * @param {string} message : message d'erreur à afficher.
 * @returns l'élément html nouvellement construit.
 */
export const toggleError = (container, titre, message) => {

    const ancienne_div = document.querySelector("#fenetreAlerte")
    if(ancienne_div){
        ancienne_div.remove()
    }
    const div = create("div", container, null, null, "fenetreAlerte")
    create("h1", div, titre)
    create("p", div, message)

    const btn = create("div", div, "Fermer", null, "boutonAlerte")
    btn.addEventListener("click", function(){
        div.remove()
    })

    return div
}