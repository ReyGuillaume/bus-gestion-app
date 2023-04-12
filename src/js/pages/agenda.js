import { calandar } from "../components/week";
import { toggleEspaceUser } from "./espaceUser";
import { toggleEspaceAdmin } from "./espaceAdmin";
import { create } from "../main";

const drawAgenda = (user=null, date=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")

    const back = create("div", main)
    create("i", back , null, ['fa-solid', 'fa-chevron-left', 'back-button'])

    back.addEventListener("click", function(){
        const sessionData = JSON.parse(sessionStorage.getItem("userData"))
        if(sessionData["role"] == "Conducteur"){
            toggleEspaceUser()
        }
        else if(sessionData["role"] == "Responsable Logistique" || sessionData["role"] == "Directeur"){
            toggleEspaceAdmin()
        }
    })

    if(user.firstname){
        create("h2", main, "Agenda de " + user.firstname + " " + user.name.toUpperCase(), ['mainTitle'])
    }
    else{
        create("h2", main, "Votre Agenda", ['mainTitle'])
    }
    if(date){
        calandar(main, user, date.getFullYear(), date.getMonth(), date.getDate())
    } else {
        calandar(main, user)
    }

    return main
}

export const toggleAgenda = (user=null, date=null) => {
    const main = document.querySelector("#app")
    main.replaceChildren("")
    
    let isUserConnected = JSON.parse(sessionStorage.getItem("userData"));

    if(isUserConnected) {
        drawAgenda(user, date)
    } else {
        create("h4", main, "connectez-vous")
    }
    return main
}