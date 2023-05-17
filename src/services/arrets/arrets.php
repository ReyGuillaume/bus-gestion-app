<?php
header("Content-Type: application/json");
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

/**
    Insert une ligne dans la table Arret.

    @param nom_arret : le nom de l'arret que l'on souhaite ajouter.

    @return boolean si l'ajout est un succès.
*/
function create_arret($nom_arret) {
    if(!bdd()->query("SELECT * FROM `arret`  WHERE `name` = '{$nom_arret}'")->fetch()){
        bdd()->query("INSERT INTO `arret`(`name`) VALUES ('{$nom_arret}')");
        return true;
    }else{
        return false;
    }
}

/**
Renvoie tous les arrets existants.

@return liste des arret (id : Int, name : varchar(200)).
 */
function fetch_arrets() {
    $res = bdd()->query("SELECT * FROM arret");
    return $res->fetchAll();
}

function get_arrets() {
    $sql = "SELECT id, name FROM arret";
    $stm = bdd()->query($sql);
    return $stm->fetchAll(PDO::FETCH_ASSOC);
}

function modify_arret($id, $newName) {
    $res = bdd()->query("UPDATE `arret` SET `name`='{$newName}' WHERE id = '{$id}'");
    return $res == true;
}

function arret_by_id($id){
    $sql = "SELECT * FROM arret WHERE id = {$id}";
    $stm = bdd()->query($sql);
    return $stm->fetch();
}

function delete_arret($id){
    $res = bdd()->query("DELETE FROM arret WHERE id = '{$id}'");
    return $res == true;
}

switch ($_GET['function']) {
    case 'create':      // nom_arret
        $res = create_arret($_GET['nom_arret']);
        break;
    case 'all_arret':      
        $res = get_arrets();
        break;
    case 'arrets':      
        $res = fetch_arrets();
        break;
    case 'modify_arret' :
        $res = modify_arret($_GET['id'], $_GET['newName'] );
        break;
    case "arret_by_id" :
        $res = arret_by_id($_GET['id']);
        break;
    case "delete_arret" :
        $res = delete_arret($_GET['id']);
        break;
    default:
        $res = "invalid function";
        break;
    
}

echo json_encode($res);


/* Test 
http://localhost/projetL2S4/src/services/arrets/arrets.php?function=create&nom_arret=Jacob
http://localhost/projetL2S4/src/services/arrets/arrets.php?function=all_arret

*/