import { calandar } from "../components/calandar";
import { create } from "../main";

const drawAgenda = (user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    if(user.firstname){
        create("h2", main, "Agenda de " + user.firstname + " " + user.name.toUpperCase(), ['mainTitle'])
    }
    else{
        create("h2", main, "Votre Agenda", ['mainTitle'])
    }
    calandar(main, user)
    
    return main
}

export const toggleAgenda = (user=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    let isUserConnected = JSON.parse(sessionStorage.getItem("userData"));

    if(isUserConnected) {
        drawAgenda(user)
    } else {
        create("h4", main, "connectez-vous")
    }
    return main
}