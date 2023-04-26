const redirect = (path) => {
    window.location = path
}

// Redirection to the user page according to his role
const redirectUser = (redirectGerant=()=>null, redirectReponsable=()=>null, redirectConducteur=()=>null, redirectOthers=()=>null) => {
    let userSession = JSON.parse(sessionStorage.getItem("userData"));
    if(userSession) {
        switch (userSession.idrole) {
            case "1": redirectGerant(); break;
            case "2": redirectReponsable(); break;
            case "3": redirectConducteur(); break;
            default: redirectOthers(); break;
        }
    } else {        // utilisateur non connecté
        window.location = "/connexion"
    }
}


export {redirectUser, redirect}