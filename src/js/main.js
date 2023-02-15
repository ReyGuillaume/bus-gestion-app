import axios from 'axios'

// Import des icons de fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars)



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