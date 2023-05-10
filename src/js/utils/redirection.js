import { toggleAlert, toggleError } from "./domManipulation"
import { router } from "../router/router"

const redirect = (path) => {
    router.navigate(path)
}


const redirectWithAlert = (route, type, message) => {
    // stocke le message d'alerte
    const alerte = { type, message }
    sessionStorage.setItem("alerte", JSON.stringify(alerte))

    // Effectue la redirection vers la route spécifiée
    window.location = route
}

const toggleAlertMessage = () => {
    // Récupère l'URL précédente à partir de la requête
    var alerte_msg = JSON.parse(sessionStorage.getItem("alerte"))

    if(alerte_msg){
        const { type, message } = alerte_msg

        if(type == "success"){
            toggleAlert("BRAVO", message)
        }
        else{
            toggleError("ERREUR", message)
        }

        sessionStorage.removeItem("alerte")
    }
}

// Redirection to the user page according to his role
const redirectUser = (redirectGerant=()=>null, redirectReponsable=()=>null, redirectConducteur=()=>null, redirectAbonne=()=>null , redirectOthers=()=>null) => {
    let userSession = JSON.parse(sessionStorage.getItem("userData"));
    if(userSession) {
        if(userSession.idrole == "1"){
            redirectGerant();
        }
        else if(userSession.idrole == "2"){
            redirectReponsable();
        }
        else if(userSession.idrole == "3"){
            redirectConducteur();
        }
        else if(userSession.idrole == "4"){
            redirectAbonne();
        }
        else{
            redirectOthers();
        }
        
    } else {        // utilisateur non connecté
        window.location = "/connexion"
    }
}


export {
    redirectUser, 
    redirect, 
    redirectWithAlert, 
    toggleAlertMessage
}