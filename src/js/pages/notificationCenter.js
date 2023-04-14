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
export const toggleNotificationCenter = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")


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
                        axios.get(`notifications/notifications.php?function=fetch_unread&id=1`).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 68){
                                    message = (notif.message).slice(0,68)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id = notif.id_notif;
                                create("div", img, 'A').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id)} );
                                create("div", img, 'R').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id)} );
                            }
                        });
                        break;

                    case 'read' :
                        divAllNotif.replaceChildren("");
                        axios.get(`notifications/notifications.php?function=fetch_read&id=1`).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 68){
                                    message = (notif.message).slice(0,68)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id = notif.id_notif;
                                create("div", img, 'A').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id)} );
                                create("div", img, 'U').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id)} );
                            }
                        });
                        break;

                    case 'archive' :
                        divAllNotif.replaceChildren("");
                        axios.get(`notifications/notifications.php?function=fetch_archive&id=1`).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 68){
                                    message = (notif.message).slice(0,68)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id = notif.id_notif;
                                create("div", img, 'R').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id)} );
                                create("div", img, 'U').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id)} );
                            }
                        });
                        break;

                    default :
                        divAllNotif.replaceChildren("");
                        axios.get(`notifications/notifications.php?function=fetch_all&id=1`).then((response)=>{
                            for(var notif of response.data){
                                var divNotif = create("div", divAllNotif, null, ['divNotif']);
                                var title = notif.title;
                                var message = notif.message;
                                if (notif.title.length > 18){
                                    title = (notif.title).slice(0,18)+'.';
                                }
                                if (notif.message.length > 68){
                                    message = (notif.message).slice(0,68)+'...';
                                }

                                create("h3", divNotif, title);
                                create("p", divNotif, message);
                                create("p", divNotif, notif.date);


                                const img = create("div", divNotif, null, ["notif_image"]);
                                const id = notif.id_notif;
                                create("div", img, 'A').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id)} );
                                create("div", img, 'R').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id)} );
                                create("div", img, 'U').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id)} );
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
    divAllNotif.replaceChildren(axios.get(`notifications/notifications.php?function=fetch_all&id=1`).then((response)=>{
        divAllNotif.replaceChildren("");
        for(var notif of response.data){
            var divNotif = create("div", divAllNotif, null, ['divNotif']);
            var title = notif.title;
            var message = notif.message;
            if (notif.title.length > 18){
                title = (notif.title).slice(0,18)+'.';
            }
            if (notif.message.length > 68){
                message = (notif.message).slice(0,68)+'...';
            }

            create("h3", divNotif, title);
            create("p", divNotif, message);
            create("p", divNotif, notif.date);


            const img = create("div", divNotif, null, ["notif_image"]);
            const id = notif.id_notif;
            create("div", img, 'A').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id="+id)} );
            create("div", img, 'R').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id="+id)} );
            create("div", img, 'U').addEventListener("click", function() {fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=unread&id="+id)} );
        }
    }));


}