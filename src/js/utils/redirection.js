const redirect = (path) => {
    window.location = path
}

// Redirection to the user page according to his role
const redirectUser = (redirectGerant=()=>null, redirectReponsable=()=>null, redirectConducteur=()=>null, redirectOthers=()=>null) => {
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
        else{
            redirectOthers();
        }
        
    } else {        // utilisateur non connecté
        window.location = "/connexion"
    }
}


export {redirectUser, redirect}