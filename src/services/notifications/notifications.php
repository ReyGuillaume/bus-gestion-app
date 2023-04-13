<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Notification ========================

function create_notification($title, $message, $recipient) {
    return bdd()->query("INSERT INTO `notification` (`title`, `message`, `recipient`, `status`) VALUES ('{$title}', '{$message}', '{$recipient}', 'unread')");
}


switch ($_GET['function']) {
    case 'create':       // title, message, recipient
    $res = create_notification($_GET['title'],$_GET['message'],$_GET['recipient'] );
    break;

    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);


/**======================== Tests ========================
fetch("http://localhost/projetL2S4/src/services/notifications/notifications.php?function=create&title=Creation&message=Wow&recipient=1").then(response => response.json()).then(response => console.log(response));
 */
