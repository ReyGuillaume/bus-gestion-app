<?php

function bdd() {
    $dsn = "mysql:host=localhost;dbname=gobus;charset=UTF8";
    $user = 'gobus';
    $password = 'xV7';
    
    return new PDO($dsn, $user, $password);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");