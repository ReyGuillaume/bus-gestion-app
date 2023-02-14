<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== TimeSlot ========================

/**
    Crée un créneau si $beginning est inférieur à $end et sont tous les deux suppérieur à la date courante.

    @param beginning : date de début du créneau au format yyyy-MM-dd hh:mm:ss.
    @param end : date de fin du créneau au format yyyy-MM-dd hh:mm:ss.
    @param id_time_slot_type : id du type de créneau.
    @param id_users : chaine de caractère avec "," comme séparateur correspondant à la liste des id des utilisateur qui interviennent lors de ce créneau. 
    @param id_buses : chaine de caractère avec "," comme séparateur correspondant à la liste des id des bus qui sont affectés au créneau.

    @return boolean si l'ajout est un succès.
*/
function create_time_slot($beginning, $end, $id_time_slot_type, $id_users, $id_buses) { // ajout des lignes dans User_TimeSlot et dans Bus_TimeSlot
    $tz = timezone_open('Europe/Paris');
    $d1 = date_create($beginning, $tz);
    $d2 = date_create($end, $tz);
    if ($d1 < $d2) {
        $res = bdd()->query("INSERT INTO `timeslot`(`begining`, `end`, `id_time_slot_type`) VALUES ('{$beginning}', '{$end}', {$id_time_slot_type})");

        if ($res == true) {
            // $id_time_slot = bdd()->lastInsertId();                                                                               //TODO renvoie toujours 0...
            $id_time_slot = bdd()->query("SELECT id FROM `timeslot` ORDER BY id DESC LIMIT 1")->fetch();
            $id_time_slot = $id_time_slot['id'];

            if (strlen($id_users) > 0) {
                $users = explode(',', $id_users);
                foreach ($users as $id_user) {
                    bdd()->query("INSERT INTO `user_timeslot`(`id_user`, `id_time_slot`) VALUES ({$id_user}, {$id_time_slot})");
                }
            }

            if (strlen($id_buses) > 0) {
                $buses = explode(',', $id_buses);
                foreach ($buses as $id_bus) {
                    bdd()->query("INSERT INTO `bus_timeslot`(`id_bus`, `id_time_slot`) VALUES ({$id_bus}, {$id_time_slot})");
                }
            }
            return true;
        }
    }
    return false;
}

/**
    Retourne tous les types de créneau existants.

    @return liste des types de créneaux (id : Int, name : String)
*/
function fetch_time_slot_type() {
    $res = bdd()->query("SELECT * FROM TimeSlotType");
    return $res->fetchAll();
}

/**
    Retourne le créneau selon son id.

    @param id : id du créneau que l'on souhaite récupérer.

    @return objet créneau (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)))
*/
function fetch_time_slot($id) {
    $res = bdd()->query("SELECT * FROM TimeSlot WHERE id = {$id}");
    $res = $res->fetch();
    $users = bdd()->query("SELECT u.id , u.login , u.name , u.firstname , u.birth_date , u.email , ut.name AS user_type FROM User u JOIN user_timeslot uts ON uts.id_user = u.id JOIN usertype ut ON u.id_user_type = ut.id  WHERE uts.id_time_slot = {$id}");
    $res['users'] = $users->fetchAll();
    $buses = bdd()->query("SELECT b.id , bt.nb_places , bt.name FROM Bus b JOIN bus_timeslot bts ON bts.id_bus = b.id JOIN bustype bt ON b.id_bus_type = bt.id  WHERE bts.id_time_slot = {$id}");
    $res['buses'] = $buses->fetchAll();
    return $res;
}

/**
    Retourne la liste des créneaux dans une plage horaire définie ayant $id_time_slot_type pour id de type de créneau.

    @param id_time_slot_type : id du type de créneau des créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)))
*/
function fetch_time_slots_by_type($id_time_slot_type, $beginning, $end) {

}

/**
    Retourne la liste des créneaux dans une plage horaire définie auxquels participe un utilisateur selon son id.

    @param id_user : id de l'utilisateur participant aux créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)))
*/
function fetch_time_slots_by_user($id_user, $beginning, $end) {

}

/**
    Retourne la liste des créneaux dans une plage horaire définie auxquels est affecté un bus selon son id.

    @param id_user : id du bus affecté aux créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)))
*/
function fetch_time_slots_by_bus($id_bus, $beginning, $end) {

}

/**
    Retourne la liste des créneaux qui on une date de début et une date de fin comprises entre $beginning et $end

    @param beginning : date de début de la plage horaire de recherche.
    @param end : date de fin de la plage horaire de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)))
*/
function fetch_time_slots_between($beginning, $end) {

}


/**
    Met à jour les informations d'un créneau (sa date de début et de fin, les utilisateurs impactés et les bus affectés).
    La modification du type de créneau n'est pas autorisée pour éviter des complications. Dans ce cas, supprimer puis recréer.

    @param id_time_slot : id du créneau à modifier.
    @param beginning : string correspondant à la nouvelle date de début de créneau.
    @param end : string correspondant à la nouvelle date de fin de créneau.
    @param id_users : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'id des utilisateurs à affecter au créneau.
    @param id_buses : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'id des bus à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_time_slot($id_time_slot, $beginning, $end, $id_users, $id_buses) {  //appel à update_users_of_time_slot et à update_buses_of_time_slot

}

/**
    Supprime toutes les lignes de User_TimeSlot correspondant à $id_time_slot et les remplace par une nouvelle liste d'utilisateurs.

    @param id_time_slot : entier correspondant à l'id du créneau à modifier.
    @param id_users : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'utilisateurs à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_users_of_time_slot($id_time_slot, $id_users) {

}

/**
    Supprime toutes les lignes de Bus_TimeSlot correspondant à $id_time_slot et les remplace par une nouvelle liste de bus.

    @param id_time_slot : entier correspondant à l'id du créneau à modifier.
    @param id_buses : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste des id des bus à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_buses_of_time_slot($id_time_slot, $id_buses) {
    
}

/**
    Supprime un créneau selon son id.

    @param id_time_slot : id du créneau que l'on souhaite supprimer.

    @return boolean si la délétion est un succès.
*/
function delete_time_slot($id_time_slot) { // délétion des lignes dans User_TimeSlot et dans Bus_TimeSlot

}



switch ($_GET['function']) {
    case 'create':      // beginning, end, type, users, buses
        $res = create_time_slot($_GET['beginning'], $_GET['end'], $_GET['type'], $_GET['users'], $_GET['buses']);
        break;
    case 'types':
        $res = fetch_time_slot_type();
        break;
    case 'timeslot':       // id
        $res = fetch_time_slot($_GET['id']);
        break;
    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=create&beginning=2023-02-16 00:00:00&end=2023-02-16 04:45:00&type=1&users=2,3&buses=").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=types").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslot&id=41").then(response => response.json()).then(response => console.log(response))

*/