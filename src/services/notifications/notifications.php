<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Notification ========================

function create_notification($title, $message, $recipient) {
    return bdd()->query("INSERT INTO `notification`(`title`, `message`, `recipient`, `status`) VALUES ('{$title}', '{$message}', '{$recipient}', 'unread')");
}
