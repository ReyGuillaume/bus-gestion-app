<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Line ========================

/**
    Insert une ligne dans la table Line.

    @param travel_time : le temps de trajet de la ligne.

    @return boolean si l'ajout est un succès.
*/
function create_line($travel_time) {
    $res = bdd()->query("INSERT INTO `Line` (`travel_time`) VALUE ({$travel_time})");
    if($res){
        return true;
    }
    else{
        return false;
    }
}

/**
    Renvoie toutes les lignes existantes.
    
    @return liste des lignes (number : Int, travel_time : Int).
*/
function fetch_lines() {
    $res = bdd()->query("SELECT * FROM `Line`");
    return $res->fetchAll();
}

/**
    Récupère les données d'une ligne selon son numéro.

    @param number : numéro de la ligne.

    @return objet line (number : Int, travel_time : Int).
*/
function fetch_line($number) {
    $res = bdd()->query("SELECT * FROM `Line` WHERE `number` = {$number}");
    return $res->fetch();
}

/**
    Récupère les données de tous les créneaux d'une ligne de bus.

    @param number : numéro de la ligne que l'on souhaite séléctionner.

    @return liste des créneaux (num_line : Int, id_time_slot : Int, direction : String)
*/
function fetch_timeslots_of_line($number) {
    $res = bdd()->query("SELECT * FROM Line_TimeSlot WHERE num_line = {$number}");
    return $res->fetchAll();
}

/**
    Modifie le temps de trajet d'une ligne donnée.

    @param number : numéro de la ligne dont les modifications seront modifiées.
    @param travel_time : nouvelle durée de trajet à affecter.

    @return boolean si la modification est un succès.
 */
function modify_traveltime_line($number, $travel_time) {
    if(bdd()->query("SELECT * FROM `Line`  WHERE `number` = {$number}")->fetch()) {
        bdd()->query("UPDATE `Line` SET `travel_time`={$travel_time} WHERE `number` = {$number}");
        return true;
    }
    return false;
}

/**
    Modifie la direction d'une ligne de bus dans un créneau horaire.

    @param number : entier correspondant au numéro de ligne à modifier.
    @param id_creneau : entier correspondant à l'id du créneau à affecter.

    @return boolean si la modification est un succès.
 */
function modify_line_direction($number, $id_creneau) {
    $res = bdd()->query("SELECT * FROM `Line_TimeSlot` WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
    $row = $res->fetch(PDO::FETCH_ASSOC);
    if($row != null) {
        $direction = $row['direction'];
        if($direction == "aller"){
            bdd()->query("UPDATE `Line_TimeSlot` SET `direction` = 'retour' WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
        }
        else{
            bdd()->query("UPDATE `Line_TimeSlot` SET `direction` = 'aller' WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
        }
        return true;
    } else {
        return false;
    }
}

/**
    Supprime une ligne selon son numéro.

    @param number : numéro de la ligne que l'on souhaite supprimer.

    @return boolean si la délétion est un succès.
*/
function delete_line($number) {  //supprimer également tous les créneaux qui sont dépendants de ce bus
    if(bdd()->query("SELECT * FROM `Line` WHERE `number` = {$number}")->fetch()) {
        bdd()->query("DELETE FROM `Line_TimeSlot` WHERE num_line = {$number}");
        bdd()->query("DELETE FROM `Line` WHERE `number` = {$number}");
        return true;
    }
    return false;
}



switch ($_GET['function']) {
    case 'create':      // temps de trajet
        $res = create_line($_GET['travel_time']);
        break;
    case 'lines':
        $res = fetch_lines();
        break;
    case 'line':     // number
        $res = fetch_line($_GET['number']);
        break;
    case 'linecalendar':     // number
        $res = fetch_timeslots_of_line($_GET['number']);
        break;
    case 'updateline':     // number, travel_time
        $res = modify_traveltime_line($_GET['number'], $_GET['travel_time']);
        break;
    case 'updatedirection':     // number, id_creneau
        $res = modify_line_direction($_GET['number'], $_GET['id_creneau']);
        break;
    case 'delete':     // number
        $res = delete_line($_GET['number']);
        break;
    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=create&travel_time=60").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=lines").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=line&number=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=linecalendar&number=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=updateline&number=1&travel_time=45").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=updatedirection&number=1&id_creneau=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=delete&number=4").then(response => response.json()).then(response => console.log(response))

*/