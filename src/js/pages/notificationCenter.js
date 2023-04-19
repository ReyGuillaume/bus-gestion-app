import {create, createChampCheckbox, createChampRadio} from "../main";
import axios from "axios";
import {toggleAgenda} from "./agenda.js";


// Fonction de recuperation du statut sélectionné
function statusSelected () {
    for(var status of document.querySelectorAll("input[name='selectionStatus']")){
        if (status.checked) {
            return status.value;
        }
    }
}

function readNotif (id){
    fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id);
}
function unreadNotif (id){
    fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id);
}
function archiveNotif (id){
    fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id);
}

function fetch_data (divAllNotif, id_user, mode){
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
        for(var notif of response.data){
            let divNotif = create("div", divAllNotif, null, ['divNotif', notif.status]);
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
            create("p", divInfoNotif, message);
            create("p", divInfoNotif, notif.date);


            let img = create("div", divNotif, null, ["notif_image"]);
            let id_notif = notif.id_notif;

            switch (mode) {
                case "unread" :
                    create("div", img, 'A').addEventListener("click", function(e) {
                        e.stopPropagation()
                        archiveNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    create("div", img, 'R').addEventListener("click", function(e) {
                        e.stopPropagation()
                        readNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    break;

                case "read" :
                    create("div", img, 'A').addEventListener("click", function(e) {
                        e.stopPropagation()
                        archiveNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    create("div", img, 'U').addEventListener("click", function(e) {
                        e.stopPropagation()
                        unreadNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    break;

                case "archive" :
                    create("div", img, 'R').addEventListener("click", function(e) {
                        e.stopPropagation()
                        readNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    create("div", img, 'U').addEventListener("click", function(e) {
                        e.stopPropagation()
                        unreadNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    break;

                default :
                    create("div", img, 'A').addEventListener("click", function(e) {
                        e.stopPropagation()
                        archiveNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    create("div", img, 'R').addEventListener("click", function(e) {
                        e.stopPropagation()
                        readNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    create("div", img, 'U').addEventListener("click", function(e) {
                        e.stopPropagation()
                        unreadNotif(id_notif)
                        toggleNotificationCenter()
                    } );
                    break;
            }
            //Listener pour afficher la notification sur l'entièreté de la page
            divNotif.addEventListener("click", function() {
                showNotification(notif, divAllNotif)
                readNotif(id_notif);
            })

        }
    });
}

function showNotification (notif, divAllNotif){
    let titleNotif = notif.title;
    let messageNotif = notif.message;
    let dateNotif = notif.date;
    divAllNotif.replaceChildren("");
    divAllNotif.className = "oneNotification";
    create("h3", divAllNotif, titleNotif);
    create("p", divAllNotif, messageNotif);
    create("p", divAllNotif, dateNotif);


    const img = create("div", divAllNotif, null, ["notif_image"]);
    const id_notif = notif.id_notif;
    create("div", img, 'Marquer comme non lu').addEventListener("click", function() {unreadNotif(id_notif); location.reload();} );
    create("div", img, 'Archiver').addEventListener("click", function() {archiveNotif(id_notif);location.reload();} );

}
export const toggleNotificationCenter = async () => {
    const main = document.querySelector("#app");
    const id_user = JSON.parse(sessionStorage.getItem("userData")).id;
    main.replaceChildren("");


    const nav = create("ul", main, null, ['navNotif']);
    let listeStatus = ["unread", "read", "archive", "all"];

    const divAllNotif = create("div", main);

        for(var status of listeStatus){
            
            /*--------------
            Au clic du choix de type de créneau on affiche les autres infos à choisir
            ---------------*/
            let li = create("li", nav, null, ['navNotif_item']);
            var radio = createChampRadio(li, status , "selectionStatus", status);
            radio.style.position = "fixed";
            radio.style.opacity = 0;
            
            radio.addEventListener('click', async function () {
                // Recuperation du type du créneau en création
                var statusToHandle = statusSelected();
                
                

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

                    case 'all' :
                        await fetch_data(divAllNotif, id_user, "all");
                        break;

                    default :
                        await fetch_data(divAllNotif, id_user, "all");
                        break;
                }
                ;

            });


            var label = create("label", li, status, ["navNotif_name"]);
            label.setAttribute("for", status);
        }


    divAllNotif.replaceChildren(await fetch_data(divAllNotif, id_user, "all"));


}