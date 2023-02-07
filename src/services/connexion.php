<?php

$dsn = "mysql:host=localhost;dbname=gobus;charset=UTF8";
$user = 'gobus';
$password = 'xV7';

$db = new PDO($dsn, $user, $password);

function bdd() {
    global $db;
    return $db;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");