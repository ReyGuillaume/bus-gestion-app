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

/**
 * Change le status de la notification à non lue si elle existe.
 * @param $id   l'id de la notification.
 * @return false|PDOStatement   boolean si le changement est un succès.
 */
function unread_notification($id) {
    if(bdd()->query("SELECT * FROM notification WHERE id_notif = '{$id}'")->fetch()) {
        return bdd()->query("UPDATE `notification` SET `status` = 'unread' WHERE `notification`.`id_notif` = '{$id}'");
    }
    return false;
}

/**
 * Renvoie le tableau de tous les status possibles de la notification.
 * @return array|false  Le tableau de tous les status possibles de la notification, ou false si erreur.
 */
function fetch_notification_status() {
    $res = bdd()->query("SELECT * FROM status_notification ORDER BY name DESC");
    return $res->fetchAll();
}

/**
 * @param $id   L'id de l'utilisateur dont on veut voir les notifs lues.
 * @return array|false  Le tableau de toutes les notifications lues de l'utilisateur, ou false si erreur.
 */
function fetch_read_notification_by_user($id) {
    $res = bdd()->query("SELECT * FROM `notification` WHERE recipient ='{$id}'AND status = 'read'");
    return $res->fetchAll();
}

/**
 * @param $id   L'id de l'utilisateur dont on veut voir les notifs non lues.
 * @return array|false  Le tableau de toutes les notifications non lues de l'utilisateur, ou false si erreur.
 */
function fetch_unread_notification_by_user($id) {
    $res = bdd()->query("SELECT * FROM `notification` WHERE recipient ='{$id}'AND status = 'unread'");
    return $res->fetchAll();
}

/**
 * @param $id   L'id de l'utilisateur dont on veut voir les notifs archivées.
 * @return array|false  Le tableau de toutes les notifications archivées de l'utilisateur, ou false si erreur.
 */
function fetch_archive_notification_by_user($id) {
    $res = bdd()->query("SELECT * FROM `notification` WHERE recipient ='{$id}'AND status = 'archive'");
    return $res->fetchAll();
}

/**
 * @param $id   L'id de l'utilisateur dont on veut voir les notifs.
 * @return array|false  Le tableau de toutes les notifications de l'utilisateur, ou false si erreur.
 */
function fetch_all_notification_by_user($id) {
    $res = bdd()->query("SELECT * FROM `notification` WHERE recipient ='{$id}'");
    return $res->fetchAll();
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

    case 'unread':       // id
        $res = unread_notification($_GET['id']);
        break;

    case 'fetch_read':       // id
        $res = fetch_read_notification_by_user($_GET['id']);
        break;

    case 'fetch_unread':       // id
        $res = fetch_unread_notification_by_user($_GET['id']);
        break;

    case 'fetch_archive':       // id
        $res = fetch_archive_notification_by_user($_GET['id']);
        break;

    case 'fetch_all':       // id
        $res = fetch_all_notification_by_user($_GET['id']);
        break;

    case 'fetch_status':
        $res = fetch_notification_status();
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
fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=fetch_status").then(response => response.json()).then(response => console.log(response));

 */
