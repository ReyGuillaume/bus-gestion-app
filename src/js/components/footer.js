import { create } from "../utils/domManipulation";
import { redirect, redirectUser } from "../utils/redirection";

const createFooterItem = (container, titre, route) => {
    const li = create("li", container)
    const btn = create("button", li, titre, ['footerList__item', 'unstyled-button'])
    btn.title = titre
    btn.addEventListener("click", () => redirect(route))
}

const createFooter = () => {
    const f = document.querySelector("#footer")
    f.replaceChildren("")
    const list = create("ul", f, null, ['footerList'])
    
    createFooterItem(list, "Conditions générales", "/conditions-generales")
    createFooterItem(list, "Prendre un rendez-vous", "/reservations")

    return f;
}


const toggleConditionsGenerales = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("button", main, '<< Retour', ['return', "unstyled-button"])
    back.addEventListener("click", () => {

        const sessionData = JSON.parse(sessionStorage.getItem("userData"))
        if(sessionData){
            redirectUser(
                () => redirect("/espace-admin"), 
                () => redirect("/espace-admin"),
                () => redirect("/espace-utilisateur"),
                () => redirect("/espace-abonne")
            )
        }
        else{
            redirect("/")
        }
    })
    back.title = "Retour en arrière"

    create("h2", main, "Conditions générales d'utilisation de GoBus")

    const paragraphe1 = create("div", main, null, ["paragraphe"])
    create("h3", paragraphe1, "1. Accès au site")
    create("div", paragraphe1, "GoBus s'efforce de permettre l'accès au Site vingt-quatre (24) heures sur vingt-quatre (24), sept (7) jours sur sept (7), sauf en cas de force majeure ou d'un évènement hors de contrôle de GoBus et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du Site et des services.")
    create("div", paragraphe1, "La responsabilité de GoBus ne saurait être engagée en cas d'impossibilité d'accès à ce Site et d'utilisation des services.")

    const paragraphe2 = create("div", main, null, ["paragraphe"])
    create("h3", paragraphe2, "2. Compte utilisateur")
    create("div", paragraphe2, "Pour accéder à certaines fonctionnalités, tel que l'accès à votre espace personnel, la réception des informations liées à votre emploi du temps, vous devez vous connecter à votre compte Utilisateur, fourni par votre directeur ou responsable. A cette fin, il peut vous être demandé de créer votre mot de passe personnel. Vous recevrez alors un email confirmant la création de votre compte client.")
    create("div", paragraphe2, "Votre identifiant et mot de passe sont sous votre entière responsabilité. Il vous appartient donc de veiller à la confidentialité de ces informations.")

    const paragraphe3 = create("div", main, null, ["paragraphe"])
    create("h3", paragraphe3, "3. Propriété intellectuelle")
    create("div", paragraphe3, "Ce Site, sa présentation et chacun des éléments y compris les marques, logos et noms de domaine, apparaissant sur le présent site internet, sont protégés par les lois en vigueur sur la propriété intellectuelle, et appartiennent à GoBus.")
}

export {
    createFooter,
    toggleConditionsGenerales
}
