<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Bus ========================

/**
    Insert une ligne dans la table Bus.

    @param id_bus_type : le type du bus que l'on souhaite ajouter.

    @return boolean si l'ajout est un succès.
*/
function create_bus($id_bus_type) {
    if(bdd()->query("SELECT * FROM bustype WHERE id = {$id_bus_type}")->fetch()) {
        bdd()->query("INSERT INTO bus (`id_bus_type`) VALUE ({$id_bus_type})");
        return true;
    }
    return false;
}

/**
    Crée un type de bus si name et nb_places est un couple de valeur qui n'est pas déjà présent dans la table bustype.

    @param name : nom du nouveau type de bus.
    @param nb_places : Entier correspondant au nombre de places disponible dans le bus.

    @return boolean si l'ajout est un succès.
*/
function create_bus_type($name, $nb_places) {
    if(bdd()->query("SELECT * FROM bustype WHERE name = '{$name}' AND nb_places = {$nb_places}")->fetch()) {
        return false;
    }
    bdd()->query("INSERT INTO bustype (`name`, `nb_places`) VALUE ('{$name}', {$nb_places})");
    return true;
}

/**
Renvoie tous les bus existants.

@return liste des bus (id : Int, id_bus_type : Int).
 */
function fetch_buses() {
    $res = bdd()->query("SELECT * FROM bus");
    return $res->fetchAll();
}

/**
Renvoie tous les types de bus existants.

@return liste des types de bus (id : Int, name : String, nb_places : Int).
 */
function fetch_bus_type() {
    $res = bdd()->query("SELECT * FROM bustype");
    return $res->fetchAll();
}

/**
    Récupère les données d'un bus selon son id.

    @param id : id du bus.

    @return objet bus (id : Int, name_bus_type : String, nb_places : Int).
*/
function fetch_bus($id) {
    $res = bdd()->query("SELECT b.id, bt.name, bt.nb_places FROM `bus` b JOIN `bustype` bt ON b.id_bus_type = bt.id WHERE b.id={$id}");
    return $res->fetch();
}

/**
    Récupère les données de tous les bus ayant un type précis.

    @param id_bus_type : id du type des bus que l'on souhaite séléctionner.

    @return liste des bus (id : Int, name_bus_type : String, nb_places : Int)
*/
function fetch_bus_by_type($id_bus_type) {
    $res = bdd()->query("SELECT * FROM bus WHERE id_bus_type = {$id_bus_type}");
    return $res->fetchAll();
}

/**
    Indique si un bus est disponible de $begining à $end

    @param id : id du bus sélectionné.
    @param beginning : date de début de la plage horaire de recherche.
    @param end : date de fin de la plage horaire de recherche.

    @return boolean
*/
function is_available($id, $beginning, $end) {
    $res = bdd()->query("SELECT b.id FROM `bus` b JOIN `bus_timeslot` bt ON b.id=bt.id_bus WHERE bt.id_bus = {$id}");
    if(!$res->fetchAll()){
        return true;
    }
    else{
        $res2 = bdd()->query("SELECT bt.id_bus FROM `bus_timeslot` bt JOIN `timeslot` t ON bt.id_time_slot=t.id WHERE (bt.id_bus = {$id}) AND ((t.begining >= '{$beginning}' AND t.begining < '{$end}') OR (t.end > '{$beginning}' AND t.end < '{$end}'))");
        if($res2->fetchAll()){
            return false;
        }
        return true;
    }
}

/**
    Modifie les informations d'un bus donné.

    @param id : id du bus dont les modifications seront modifiées.
    @param id_bus_type : nouveau type de bus.

    @return boolean si la modification est un succès.
 */
function modify_bus($id, $id_bus_type) {
    if(bdd()->query("SELECT * FROM bustype WHERE id = {$id_bus_type}")->fetch()) {
        bdd()->query("UPDATE `bus` SET `id_bus_type`={$id_bus_type} WHERE id = {$id}");
        return true;
    }
    return false;
}

/**
    Modifie les informations d'un type de bus à savoir le nom et le nombre de places si le couple de valeurs (name, nb_places) n'est pas déjà présent dans la table.

    @param id : entier correspondant à l'id du type de bus à modifier.
    @param name : chaine de caractère correspondant au nouveau nom du type de bus.
    @param nb_places : entier correspondant au nouveau nombre de places du type de bus.

    @return boolean si la modification est un succès.
 */
function modify_bus_type($id, $name, $nb_places) {
    if(bdd()->query("SELECT * FROM bustype WHERE name = '{$name}' AND nb_places = {$nb_places}")->fetch()) {
        return false;
    } else if (bdd()->query("SELECT * FROM bustype WHERE id = {$id}")->fetch()) {
        bdd()->query("UPDATE `bustype` SET `name`='{$name}', `nb_places`={$nb_places} WHERE id = {$id}");
        return true;
    } else {
        return false;
    }
}

/**
    Supprime un bus selon son id.

    @param id : id du bus que l'on souhaite supprimer.

    @return boolean si la délétion est un succès.
*/
function delete_bus($id) {  //supprimer également tous les créneaux qui sont dépendants de ce bus
    if(bdd()->query("SELECT * FROM bus WHERE id = {$id}")->fetch()) {
        bdd()->query("DELETE FROM `bus_timeslot` WHERE id_bus = {$id}");
        bdd()->query("DELETE FROM bus WHERE id = {$id}");
        return true;
    }
    return false;
}

/**
    Supprime un type de bus selon son id.

    @param id : id du type de bus que l'on souhaite modifier.

    @return boolean si la délétion est un succès.
*/
function delete_bus_type($id) { // supprimer également tous les bus qui sont dépendants de ce type de bus
    if(bdd()->query("SELECT * FROM bustype WHERE id = {$id}")->fetch()) {
        $res = bdd()->query("SELECT id FROM bus WHERE id_bus_type = {$id}")->fetchAll();
        foreach($res as $row) {
            delete_bus($row['id']);
        }
        bdd()->query("DELETE FROM bustype WHERE id = {$id}");
        return true;
    }
    return false;
}



switch ($_GET['function']) {
    case 'create':      // type
        $res = create_bus($_GET['type']);
        break;
    case 'createtype':      // name, nb
        $res = create_bus_type($_GET['name'], $_GET['nb']);
        break;
    case 'bustypes':
        $res = fetch_bus_type();
        break;
    case 'buses':
        $res = fetch_buses();
        break;
    case 'bus':     // id
        $res = fetch_bus($_GET['id']);
        break;
    case 'bytype':     // type
        $res = fetch_bus_by_type($_GET['type']);
        break;
    case 'available':
        $res = is_available($_GET['id'], $_GET['beginning'], $_GET['end']);
        break;
    case 'updatebus':     // id, type
        $res = modify_bus($_GET['id'], $_GET['type']);
        break;
    case 'updatebustype':     // id, name, nb
        $res = modify_bus_type($_GET['id'], $_GET['name'], $_GET['nb']);
        break;
    case 'delete':     // id
        $res = delete_bus($_GET['id']);
        break;
    case 'deletetype':     // id
        $res = delete_bus_type($_GET['id']);
        break;
    case 'isFree' : 
        $res = is_free($_GET['id'], $_GET['beginning'], $_GET['end']);
        break;
    case 'freeBuses':
        $res = find_buses_free($_GET['beginning'], $_GET['end']);
        break;
    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=create&type=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=createtype&name=gros&nb=2048").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=bustypes").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=bus&id=5").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=bytype&type=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=updatebus&id=5&type=2").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=updatebustype&id=17&name=nouveau&nb=150").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=delete&id=5").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=deletetype&id=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=isFree&id=1&beginning=2023-02-27%2000:00:00&end=2023-02-27%2004:45:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/buses/buses.php?function=freeBuses&beginning=2023-04-27%2000:00:00&end=2023-04-27%2004:45:00").then(response => response.json()).then(response => console.log(response))

*/