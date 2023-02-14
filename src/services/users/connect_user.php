<?php

session_start();

$nom = $_GET["nom"];
$prenom = $_GET["prenom"];
$role = $_GET["role"];

$_SESSION["nom"] = $nom;
$_SESSION["prenom"] = $prenom;
$_SESSION["role"] = $role;

?>