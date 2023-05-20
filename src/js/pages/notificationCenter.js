import {create, createChampRadio} from "../utils/domManipulation";
import { valueFirstElementChecked } from "../utils/formGestion";
import { redirect, redirectUser } from "../utils/redirection";
import axios from "axios";

async function readNotif (id){
    await fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id)
}
async function unreadNotif (id){
    await fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id)
}
async function archiveNotif (id){
    await fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id)
}

const createActionButton = (container, letter, title, action, id_notif) => {
    const b = create("button", container, letter, ["unstyled-button"])
    b.title = title
    b.onkeydown = e => e.stopPropagation()
    b.addEventListener("click", async function(e) {
        e.stopPropagation()
        await action(id_notif)
        toggleNotificationCenter()
    })
}

const createArchiveButton = (container, id_notif) => createActionButton(container, 'A', "Archiver", archiveNotif, id_notif)

const createReadButton = (container, id_notif) => createActionButton(container, 'R', "Marquer comme lu", readNotif, id_notif)

const createUnreadButton = (container, id_notif) => createActionButton(container, 'U', "Marquer comme non lu", unreadNotif, id_notif)


const displayActionButtons = (mode, container, id_notif) => {
    switch (mode) {
        case "unread" :
            createArchiveButton(container, id_notif)
            createReadButton(container, id_notif)
            break

        case "read" :
            createArchiveButton(container, id_notif)
            createUnreadButton(container, id_notif)
            break;

        case "archive" :
            createReadButton(container, id_notif)
            createUnreadButton(container, id_notif)
            break;

        default :
            createArchiveButton(container, id_notif)
            createReadButton(container, id_notif)
            createUnreadButton(container, id_notif)
            break;
    }
}

const displayNotifs = (container, data, mode) => {
    for(let notif of data){
        let divNotif = create("div", container, null, ['divNotif', notif.status]);
        divNotif.setAttribute('tabindex', '0')

        let title = notif.title;
        let message = notif.message;
        if (notif.title.length > 18){
            title = (notif.title).slice(0,18)+'.';
        }
        if (notif.message.length > 38){
            message = (notif.message).slice(0,38)+'...';
        }
        let divInfoNotif = create("div", divNotif, null ,["divInfoNotif"]);
        create("h3", divInfoNotif, title);
        let m = create("p", divInfoNotif);
        m.innerHTML = message;
        create("p", divInfoNotif, notif.date);

        let img = create("div", divNotif, null, ["notif_image"]);
        let id_notif = notif.id_notif;

        displayActionButtons(mode, img, id_notif)

        //Listener pour afficher la notification sur l'entièreté de la page
        divNotif.addEventListener("click", function() {
            showNotification(notif, container)
            readNotif(id_notif);
        })
        divNotif.addEventListener("keydown", e => {
            if (e.code === "Enter") {
                showNotification(notif, container)
                readNotif(id_notif);
            }
        })
        
    }
}

async function fetch_data (divAllNotif, id_user, mode){
    axios.get(`notifications/notifications.php?function=fetch_`+mode+`&id=`+id_user).then((response)=>{
        divAllNotif.replaceChildren("");
        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
        create("p", divTitres, "Titres");
        create("hr", divTitres);
        create("p", divTitres, "Messages");
        create("hr", divTitres);
        create("p", divTitres, "Dates de reception");
        create("hr", divTitres);
        create("p", divTitres, "Actions");
        displayNotifs(divAllNotif, response.data, mode)
    });
}

function showNotification (notif, divAllNotif){
    let titleNotif = notif.title;
    let messageNotif = notif.message;
    let dateNotif = notif.date;
    divAllNotif.replaceChildren("");
    divAllNotif.className = "oneNotification";
    create("h3", divAllNotif, titleNotif);
    let m = create("p", divAllNotif, messageNotif);
    m.innerHTML = messageNotif.replace(/\n/g, '<br>');
    create("p", divAllNotif, dateNotif);

    const img = create("div", divAllNotif, null, ["notif_image"]);
    const id_notif = notif.id_notif;
    const b1 = create("button", img, 'Marquer comme non lu')
    b1.title = 'Marquer comme non lu'
    b1.addEventListener("click", function() {
        unreadNotif(id_notif)
        toggleNotificationCenter()
    })

    const b2 = create("button", img, 'Archiver')
    b2.title = 'Archiver'
    b2.addEventListener("click", function() {
        archiveNotif(id_notif)
        toggleNotificationCenter()
    })
}
   

const toggleNotificationCenter = () => {
    const main = document.querySelector("#app");
    main.replaceChildren("");

    let sessionData = sessionStorage.getItem("userData")
    // redirection si user est connecté
    if(!sessionData){
        redirect("/")
    } else {

    const id_user = JSON.parse(sessionData).id;

    const back = create("button", main, "<< Retour", ["return", "unstyled-button"])
    back.title = "Retour en arrière"
    back.onclick = () => {
        redirectUser(
            () => redirect("/espace-admin"), 
            () => redirect("/espace-admin"), 
            () => redirect("/espace-utilisateur"),
            () => redirect("/espace-abonne")
        )
    }

    const nav = create("ul", main, null, ['navNotif']);
    let listeStatus = ["unread", "read", "archive", "all"];

    const divAllNotif = create("div", main);

    for(var status of listeStatus){
        
        // Au clic du choix de type de créneau on affiche les autres infos à choisir
        let li = create("li", nav, null, ['navNotif_item']);
        var radio = createChampRadio(li, status , "selectionStatus", status);
        radio.style.position = "fixed";
        radio.style.opacity = 0;
            
        radio.addEventListener('click', async function () {
            // Recuperation du type du créneau en création
            var statusToHandle = valueFirstElementChecked("input[name='selectionStatus']");

            switch (statusToHandle) {
                case 'unread' :
                    await fetch_data(divAllNotif, id_user, "unread");
                    break;

                case 'read' :
                    await fetch_data(divAllNotif, id_user, "read");
                    break;

                case 'archive' :
                    await fetch_data(divAllNotif, id_user, "archive");
                    break;

                default :
                    await fetch_data(divAllNotif, id_user, "all");
                    break;
            }
        })

        var label = create("label", li, status, ["navNotif_name"]);
        label.setAttribute("for", status);
    }

    fetch_data(divAllNotif, id_user, "all")
}}

export { toggleNotificationCenter }