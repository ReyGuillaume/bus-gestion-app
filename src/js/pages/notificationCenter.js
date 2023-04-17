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
    create("div", img, 'Archiver').addEventListener("click", function() {archiveNotif(id_notif)} );
    create("div", img, 'Marquer comme non lu').addEventListener("click", function() {unreadNotif(id_notif)} );

}

export const toggleNotificationCenter = () => {
    const main = document.querySelector("#app");
    const id_user = JSON.parse(sessionStorage.getItem("userData")).id;
    main.replaceChildren("");


    const nav = create("ul", main, null, ['navNotif']);
    axios.get(`notifications/notifications.php?function=fetch_status`).then((response)=>{


        for(var status of response.data){

            /*--------------
             Au clic du choix de type de créneau on affiche les autres infos à choisir
             ---------------*/
            let li = create("li", nav, null, ['navNotif_item']);
            var radio = createChampRadio(li, status.name , "selectionStatus", status.name);
            radio.style.position = "fixed";
            radio.style.opacity = 0;
            radio.addEventListener('click', function(){


                // Recuperation du type du créneau en création
                var statusToHandle = statusSelected();
                console.log(statusToHandle);

                switch (statusToHandle){
                    case 'unread' :
                        divAllNotif.replaceChildren("");
                        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
                        create("p", divTitres, "Titres");
                        create("p", divTitres, "Messages");
                        create("p", divTitres, "Dates de reception");
                        create("p", divTitres, "Actions");
                        axios.get(`notifications/notifications.php?function=fetch_unread&id=`+id_user).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                divNotif.addEventListener("click", function() {showNotification(notif, divAllNotif)});
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 38){
                                    message = (notif.message).slice(0,38)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id_notif = notif.id_notif;
                                create("div", img, 'A').addEventListener("click", function() {archiveNotif(id_notif)} );
                                create("div", img, 'R').addEventListener("click", function() {readNotif(id_notif)} );

                                //Affiche la notification en grand
                                divNotif.addEventListener("click", (function(notif, divAllNotif,id) {return function (){
                                    showNotification(notif, divAllNotif)
                                    readNotif(id);

                                };})(notif, divAllNotif,id_notif),false);

                            }
                        });
                        break;

                    case 'read' :
                        divAllNotif.replaceChildren("");
                        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
                        create("p", divTitres, "Titres");
                        create("p", divTitres, "Messages");
                        create("p", divTitres, "Dates de reception");
                        create("p", divTitres, "Actions");
                        axios.get(`notifications/notifications.php?function=fetch_read&id=`+id_user).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                divNotif.addEventListener("click", function() {showNotification(notif, divAllNotif)});
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 38){
                                    message = (notif.message).slice(0,38)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);

                                const id_notif = notif.id_notif;
                                const img = create("div", divNotif, null, ["notif_image"]);
                                create("div", img, 'A').addEventListener("click", function() {archiveNotif(id_notif)} );
                                create("div", img, 'U').addEventListener("click", function() {unreadNotif(id_notif)} );

                                //Affiche la notification en grand
                                divNotif.addEventListener("click", (function(notif, divAllNotif,id) {return function (){
                                    showNotification(notif, divAllNotif)
                                    readNotif(id);

                                };})(notif, divAllNotif,id_notif),false);

                            }
                        });
                        break;

                    case 'archive' :
                        divAllNotif.replaceChildren("");
                        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
                        create("p", divTitres, "Titres");
                        create("p", divTitres, "Messages");
                        create("p", divTitres, "Dates de reception");
                        create("p", divTitres, "Actions");
                        axios.get(`notifications/notifications.php?function=fetch_archive&id=`+id_user).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                divNotif.addEventListener("click", function() {showNotification(notif, divAllNotif)});
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 38){
                                    message = (notif.message).slice(0,38)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id_notif = notif.id_notif;
                                create("div", img, 'R').addEventListener("click", function() {readNotif(id_notif)} );
                                create("div", img, 'U').addEventListener("click", function() {unreadNotif(id_notif)} );

                                //Affiche la notification en grand
                                divNotif.addEventListener("click", (function(notif, divAllNotif,id) {return function (){
                                    showNotification(notif, divAllNotif)
                                    readNotif(id);

                                };})(notif, divAllNotif,id_notif),false);

                            }
                        });
                        break;

                    default :
                        divAllNotif.replaceChildren("");
                        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
                        create("p", divTitres, "Titres");
                        create("p", divTitres, "Messages");
                        create("p", divTitres, "Dates de reception");
                        create("p", divTitres, "Actions");
                        axios.get(`notifications/notifications.php?function=fetch_all&id=`+id_user).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                divNotif.addEventListener("click", function() {showNotification(notif, divAllNotif)});
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 38){
                                    message = (notif.message).slice(0,38)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id_notif = notif.id_notif;
                                create("div", img, 'A').addEventListener("click", function() {archiveNotif(id_notif)} );
                                create("div", img, 'R').addEventListener("click", function() {readNotif(id_notif)} );
                                create("div", img, 'U').addEventListener("click", function() {unreadNotif(id_notif)} );

                                //Affiche la notification en grand
                                divNotif.addEventListener("click", (function(notif, divAllNotif,id) {return function (){
                                    showNotification(notif, divAllNotif)
                                    readNotif(id);

                                };})(notif, divAllNotif,id_notif),false);

                            }
                        });
                        break;
                };

            });


            var label = create("label", li, status.name, ["navNotif_name"]);
            label.setAttribute("for", status.name);
        }
    });

    const divAllNotif = create("div", main);
    divAllNotif.replaceChildren(axios.get(`notifications/notifications.php?function=fetch_all&id=`+id_user).then((response)=>{
        divAllNotif.replaceChildren("");
        var divTitres = create("div", divAllNotif, null, ['divTitresNotif']);
        create("p", divTitres, "Titres");
        create("p", divTitres, "Messages");
        create("p", divTitres, "Dates de reception");
        create("p", divTitres, "Actions");
        for(var notif of response.data){
            let divNotif = create("div", divAllNotif, null, ['divNotif']);
            let title = notif.title;
            let message = notif.message;
            if (notif.title.length > 18){
                title = (notif.title).slice(0,18)+'.';
            }
            if (notif.message.length > 38){
                message = (notif.message).slice(0,38)+'...';
            }

            create("h3", divNotif, title);
            create("p", divNotif, message);
            create("p", divNotif, notif.date);


            let img = create("div", divNotif, null, ["notif_image"]);
            let id_notif = notif.id_notif;
            create("div", img, 'A').addEventListener("click", function() {archiveNotif(id_notif)} );
            create("div", img, 'R').addEventListener("click", function() {readNotif(id_notif)} );
            create("div", img, 'U').addEventListener("click", function() {unreadNotif(id_notif)} );
            //Affiche la notification en grand
            divNotif.addEventListener("click", (function(notif, divAllNotif,id) {return function (){
                showNotification(notif, divAllNotif)
                readNotif(id);

            };})(notif, divAllNotif,id_notif),false);

        }
    }));


}