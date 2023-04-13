<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Notification ========================


/**
 * Création d'une notification qui n'est pas encore lue.
 * @param $title le titre de la notification.
 * @param $message le message de la notification.
 * @param $recipient le destinataire de la notification.
 * @return false|PDOStatement boolean si l'ajout est un succès.
 */
function create_notification($title, $message, $recipient) {
    return bdd()->query("INSERT INTO `notification` (`title`, `message`, `recipient`, `status`) VALUES ('{$title}', '{$message}', '{$recipient}', 'unread')");
}

/**
 * Change le status de la notification a lu si elle existe.
 * @param $id l'id de la notification.
 * @return false|PDOStatement boolean si le changement est un succès.
 */
function read_notification($id) {
    if(bdd()->query("SELECT * FROM notification WHERE id_notif = '{$id}'")->fetch()) {
        return bdd()->query("UPDATE `notification` SET `status` = 'read' WHERE `notification`.`id_notif` = '{$id}'");
    }
     return false;
}

/**
 * Change le status de la notification a archivé si elle existe.
 * @param $id   l'id de la notification.
 * @return false|PDOStatement   boolean si le changement est un succès.
 */
function archive_notification($id) {
    if(bdd()->query("SELECT * FROM notification WHERE id_notif = '{$id}'")->fetch()) {
        return bdd()->query("UPDATE `notification` SET `status` = 'archive' WHERE `notification`.`id_notif` = '{$id}'");
    }
    return false;
}


switch ($_GET['function']) {
    case 'create':       // title, message, recipient
        $res = create_notification($_GET['title'],$_GET['message'],$_GET['recipient']);
        break;

    case 'read':       // id
        $res = read_notification($_GET['id']);
        break;

    case 'archive':       // id
        $res = archive_notification($_GET['id']);
        break;

    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);


/**======================== Tests ========================
fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=create&title=Creation&message=Wow&recipient=1").then(response => response.json()).then(response => console.log(response));
fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=read&id=2").then(response => response.json()).then(response => console.log(response));
fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=archive&id=1").then(response => response.json()).then(response => console.log(response));

 */
