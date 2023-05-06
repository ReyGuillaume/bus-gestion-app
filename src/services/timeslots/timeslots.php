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
    @param num_lines : chaine de caractère avec "," comme séparateur correspondant à la liste des numéros de lignes qui sont affectés au créneau.
    @param directions : chaine de caractère avec "," comme séparateur correspondant à la liste des directions des lignes de bus affectées au créneau.

    @return boolean si l'ajout est un succès.
*/
function create_time_slot($beginning, $end, $id_time_slot_type, $id_users, $id_buses, $num_lines, $directions) { // ajout des lignes dans User_TimeSlot et dans Bus_TimeSlot
    $tz = timezone_open('Europe/Paris');
    $d1 = date_create($beginning, $tz);
    $d2 = date_create($end, $tz);
    if ($d1 < $d2) {
        if (strlen($num_lines) > 0 || strlen($directions) > 0) {
            $lines = explode(',', $num_lines);
            $dir = explode(',', $directions);
            if(count($lines) != count($dir)){
                return false;
            }
        }
        $res = bdd()->query("INSERT INTO `timeslot`(`begining`, `end`, `id_time_slot_type`) VALUES ('{$beginning}', '{$end}', {$id_time_slot_type})");

        if ($res == true) {
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

            if (strlen($num_lines) > 0 && strlen($directions) > 0) {
                for($i=0 ; $i<count($lines) ; $i++){
                    $num_line = $lines[$i];
                    $direction = $dir[$i];
                    bdd()->query("INSERT INTO `line_timeslot`(`num_line`, `id_time_slot`, `direction`) VALUES ({$num_line}, {$id_time_slot}, '{$direction}')");
                }
            }
            return true;
        }
        return false;
    }
    return false;
}

/**
Retourne tous les types de créneau existants.

@return liste des types de créneaux (id : Int, name : String)
 */
function fetch_time_slot_type() {
    $res = bdd()->query("SELECT * FROM TimeSlotType WHERE `id` != 3");
    return $res->fetchAll();
}

/**
Retourne tous les créneaux existants.

@return liste des créneaux (id : Int, name : String)
 */
function fetch_timeslots() {
    $res = bdd()->query("SELECT * FROM TimeSlot");
    return $res->fetchAll();
}

/**
    Retourne le créneau selon son id.

    @param id : id du créneau que l'on souhaite récupérer.

    @return objet créneau (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int)) , lines (liste des lignes (number : Int, direction : String)))
*/
function fetch_time_slot($id) {
    $res = bdd()->query("SELECT * FROM TimeSlot ts JOIN TimeSlotType tst ON tst.id = ts.id_time_slot_type WHERE ts.id = {$id}");
    $res = bdd()->query("SELECT ts.*, tst.name FROM TimeSlot ts LEFT JOIN TimeSlotType tst ON tst.id = ts.id_time_slot_type WHERE ts.id = {$id}");
    $res = $res->fetch();
    $users = bdd()->query("SELECT u.id , u.login , u.name , u.firstname , u.birth_date , u.email , ut.name AS user_type FROM User u JOIN user_timeslot uts ON uts.id_user = u.id JOIN usertype ut ON u.id_user_type = ut.id  WHERE uts.id_time_slot = {$id}");
    $res['users'] = $users->fetchAll();
    $buses = bdd()->query("SELECT b.id , bt.nb_places , bt.name FROM Bus b JOIN bus_timeslot bts ON bts.id_bus = b.id JOIN bustype bt ON b.id_bus_type = bt.id  WHERE bts.id_time_slot = {$id}");
    $res['buses'] = $buses->fetchAll();
    $lines = bdd()->query("SELECT `number`, direction FROM `Line` l JOIN line_timeslot lts ON l.number = lts.num_line WHERE lts.id_time_slot = {$id}");
    $res['lines'] = $lines->fetchAll();
    return $res;
}

/**
    Retourne la liste des créneaux dans une plage horaire définie ayant $id_time_slot_type pour id de type de créneau.

    @param id_time_slot_type : id du type de créneau des créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int, direction : String)))
*/
function fetch_time_slots_by_type($id_time_slot_type, $beginning, $end) {
    $result = bdd()->query("SELECT id FROM `timeslot` WHERE id_time_slot_type = {$id_time_slot_type} AND begining >= '{$beginning}' AND end <= '{$end}'");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}

/**
Retourne la liste des créneaux dans une plage horaire définie auxquels participe un utilisateur selon son id.

@param id_user : id de l'utilisateur participant aux créneaux que l'on recherche.
@param beginning : string correspondant à la date du début de la plage de recherche.
@param end : string correspondant à la date de la fin de la plage de recherche.

@return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int, direction : String)))
 */
function fetch_time_slots_by_user($id_user, $beginning, $end) {
    $result = bdd()->query("SELECT id FROM `timeslot` ts JOIN user_timeslot uts ON ts.id = uts.id_time_slot WHERE uts.id_user = {$id_user} AND begining >= '{$beginning}' AND end <= '{$end}'");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}

/**
Retourne la liste des créneaux d'indisponibilité auxquels participe un utilisateur selon son id.

@param id_user : id de l'utilisateur participant aux créneaux que l'on recherche.

@return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int, direction : String)))
 */
function fetch_indispo_time_slots_driver($id_user) {
    $result = bdd()->query("SELECT id FROM `timeslot` ts JOIN user_timeslot uts ON ts.id = uts.id_time_slot WHERE uts.id_user = {$id_user} AND ts.id_time_slot_type = 3");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}

/**
    Retourne la liste des créneaux dans une plage horaire définie auxquels est affecté un bus selon son id.

    @param id_user : id du bus affecté aux créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int, direction : String)))
*/
function fetch_time_slots_by_bus($id_bus, $beginning, $end) {
    $result = bdd()->query("SELECT id FROM `timeslot` ts JOIN bus_timeslot bts ON ts.id = bts.id_time_slot WHERE bts.id_bus = {$id_bus} AND begining >= '{$beginning}' AND end <= '{$end}'");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}

/**
    Retourne la liste des créneaux dans une plage horaire définie auxquels est affectée une ligne de bus selon son numéro.

    @param number : numéro de la ligne affectée aux créneaux que l'on recherche.
    @param beginning : string correspondant à la date du début de la plage de recherche.
    @param end : string correspondant à la date de la fin de la plage de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int, direction : String)))
*/
function fetch_time_slots_by_line($number, $beginning, $end) {
    $result = bdd()->query("SELECT id FROM `timeslot` ts JOIN line_timeslot lts ON ts.id = lts.id_time_slot WHERE lts.num_line = {$number} AND begining >= '{$beginning}' AND end <= '{$end}'");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}

/**
    Retourne la liste des créneaux qui on une date de début et une date de fin comprises entre $beginning et $end

    @param beginning : date de début de la plage horaire de recherche.
    @param end : date de fin de la plage horaire de recherche.

    @return liste de créneaux (id : Int, beginning : String, end : String, time_slot_type : Int, users (liste d'utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : String)), buses (liste des bus (id : Int, name : String, nb_places : Int))), lines (liste des lignes (number : Int : direction : String)))
*/
function fetch_time_slots_between($beginning, $end) {
    $result = bdd()->query("SELECT id FROM `timeslot` WHERE begining >= '{$beginning}' AND end <= '{$end}'");
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = fetch_time_slot($row['id']);
    }
    return $res;
}


/**
    Met à jour les informations d'un créneau (sa date de début et de fin, les utilisateurs impactés et les bus affectés).
    La modification du type de créneau n'est pas autorisée pour éviter des complications. Dans ce cas, supprimer puis recréer.

    @param id_time_slot : id du créneau à modifier.
    @param beginning : string correspondant à la nouvelle date de début de créneau.
    @param end : string correspondant à la nouvelle date de fin de créneau.
    @param id_users : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'id des utilisateurs à affecter au créneau.
    @param id_buses : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'id des bus à affecter au créneau.
    @param num_lines : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste de lignes de bus à affecter au créneau.
    @param directions : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste de directions des lignes à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_time_slot($id_time_slot, $beginning, $end, $id_users, $id_buses, $num_lines, $directions) {  //appel à update_users_of_time_slot, update_buses_of_time_slot et update_lines_of_time_slot
    $tz = timezone_open('Europe/Paris');
    $d1 = date_create($beginning, $tz);
    $d2 = date_create($end, $tz);
    if ($d1 < $d2) {
        if (bdd()->query("UPDATE `timeslot` SET `begining`='{$beginning}', `end`='{$end}' WHERE id = {$id_time_slot}")) {
            update_users_of_time_slot($id_time_slot, $id_users);
            update_buses_of_time_slot($id_time_slot, $id_buses);
            update_lines_of_time_slot($id_time_slot, $num_lines, $directions);
            return true;
        }
    }
    return false;
}

/**
    Supprime toutes les lignes de User_TimeSlot correspondant à $id_time_slot et les remplace par une nouvelle liste d'utilisateurs.

    @param id_time_slot : entier correspondant à l'id du créneau à modifier.
    @param id_users : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste d'utilisateurs à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_users_of_time_slot($id_time_slot, $id_users) {
    if(bdd()->query("SELECT * FROM TimeSlot WHERE id = {$id_time_slot}")->fetch()) {
        bdd()->query("DELETE FROM User_TimeSlot WHERE id_time_slot = {$id_time_slot}");
        $users = explode(',', $id_users);
        foreach ($users as $id_user) {
            bdd()->query("INSERT INTO `user_timeslot`(`id_user`, `id_time_slot`) VALUES ({$id_user}, {$id_time_slot})");
        }
        return true;
    } else {
        return false;
    }
}

/**
    Supprime toutes les lignes de Bus_TimeSlot correspondant à $id_time_slot et les remplace par une nouvelle liste de bus.

    @param id_time_slot : entier correspondant à l'id du créneau à modifier.
    @param id_buses : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste des id des bus à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_buses_of_time_slot($id_time_slot, $id_buses) {
    if(bdd()->query("SELECT * FROM TimeSlot WHERE id = {$id_time_slot}")->fetch()) {
        bdd()->query("DELETE FROM Bus_TimeSlot WHERE id_time_slot = {$id_time_slot}");
        $buses = explode(',', $id_buses);
        foreach ($buses as $id_bus) {
            bdd()->query("INSERT INTO `bus_timeslot`(`id_bus`, `id_time_slot`) VALUES ({$id_bus}, {$id_time_slot})");
        }
        return true;
    } else {
        return false;
    }
}

/**
    Supprime toutes les lignes de Line_TimeSlot correspondant à $id_time_slot et les remplace par une nouvelle liste de lignes.

    @param id_time_slot : entier correspondant à l'id du créneau à modifier.
    @param num_lines : chaine de caractère avec "," comme séparateur correspondant à la nouvelle liste des numéros de ligne à affecter au créneau.

    @return boolean si la modification est un succès.
 */
function update_lines_of_time_slot($id_time_slot, $num_lines, $directions) {
    if(bdd()->query("SELECT * FROM TimeSlot WHERE id = {$id_time_slot}")->fetch()) {
        bdd()->query("DELETE FROM Line_TimeSlot WHERE id_time_slot = {$id_time_slot}");
        if(strlen($num_lines) > 0 && strlen($directions) > 0){
            $lines = explode(',', $num_lines);
            $dir = explode(',', $directions);
            for($i=0 ; $i<count($lines) ; $i++) {
                $num_line = $lines[$i];
                $direction = $dir[$i];
                bdd()->query("INSERT INTO `line_timeslot`(`num_line`, `id_time_slot`, `direction`) VALUES ({$num_line}, {$id_time_slot}, '{$direction}')");
            }
        }
        return true;
    } else {
        return false;
    }
}

/**
    Supprime un créneau selon son id.

    @param id_time_slot : id du créneau que l'on souhaite supprimer.

    @return boolean si la délétion est un succès.
*/
function delete_time_slot($id_time_slot) { // délétion des lignes dans User_TimeSlot, Bus_TimeSlot et Line_TimeSlot
    bdd()->query("DELETE FROM User_TimeSlot WHERE id_time_slot = {$id_time_slot}");
    bdd()->query("DELETE FROM Bus_TimeSlot WHERE id_time_slot = {$id_time_slot}");
    bdd()->query("DELETE FROM Line_TimeSlot WHERE id_time_slot = {$id_time_slot}");
    bdd()->query("DELETE FROM reservation_timeslot WHERE id_timeslot = {$id_time_slot}");
    $res = bdd()->query("DELETE FROM TimeSlot WHERE id = {$id_time_slot}");
    return $res == true;
}


/**
 * Fonction qui créer une réservation en attente
 * @param $arretDepart  string  l'arret de départ
 * @param $arretArrive string  l'arret d'arrivé
 * @param $dateDepart string  la date et heure de depart
 * @param $idClient int  l'id du client
 * @return bool revoie si la réservation a été ajouté ou non
 */
function create_reservation ($arretDepart, $arretArrive, $dateDepart, $idClient){
    $res = bdd()->query(
        "INSERT INTO `reservation` (`arretDepart`, `arretArrive`, `dateDepart`, `id_client`, `etat`) 
        VALUES ('{$arretDepart}', '{$arretArrive}', '{$dateDepart}', '{$idClient}', 'attente')");
    return $res == true;
}

/**
 * Fonction qui refuse une réservation en attente
 * @param $idReservation int  l'id de la réservation
 * @return bool revoie si la réservation a été refusé ou non
 */
function refuse_reservation ($idReservation){
    $res = bdd()->query(
        "UPDATE `reservation` SET `etat` = 'refuse' WHERE `id_reserv` ='{$idReservation}'");
    return $res == true;
}


/**
 * Fonction qui valide une réservation en attente
 * @param $idReservation int l'id de la réservation
 * @param $beginning string l'heure et la date du départ
 * @param $end string l'heure et la date de l'arrivé
 * @param $id_users l'id des conducteurs
 * @param $id_buses l'id de bus
 * @return bool renvoie si le créneau a été ajouté ou non
 */
function valide_reservation ($idReservation, $beginning, $end, $id_users, $id_buses){
    bdd()->query("UPDATE `reservation` SET `etat` = 'valide' WHERE `id_reserv` = '{$idReservation}'");
    create_time_slot($beginning, $end, 4, $id_users, $id_buses, "","" );
    $id_time_slot = bdd()->query("SELECT id FROM `timeslot` ORDER BY id DESC LIMIT 1")->fetch();
    $id_time_slot = $id_time_slot['id'];

    $res = bdd()->query("INSERT INTO `reservation_timeslot` (`id_reservation`, `id_timeslot`) VALUES ('{$idReservation}', '{$id_time_slot}')");
    return $res == true;
}


/**
 * Fonction qui supprime une réservation
 * @param $idReservation int  l'id de la réservation
 * @return bool renvoie si la réservation a été supprimé ou non
 */
function delete_reservation ($idReservation){
    $id_time_slot = bdd()->query("SELECT id_timeslot FROM `reservation_timeslot` WHERE id_reservation = '{$idReservation}'")->fetch();
    $id_time_slot = $id_time_slot['id_timeslot'];
    delete_time_slot($id_time_slot);
    $res = bdd()->query(
        "DELETE FROM `reservation` WHERE `id_reserv` ='{$idReservation}'");
    return $res == true;
}

/**
 * Fonction qui permet de modifier une réservation en attente
 * @param $idReservation int l'id de la réservation
 * @param $arretDepart  string  l'arret de départ
 * @param $arretArrive string  l'arret d'arrivé
 * @param $dateDepart string  la date et heure de depart
 * @return bool renvoie si la réservation a été modifié ou non
 */
function update_reservation ($idReservation, $arretDepart, $arretArrive, $dateDepart){
    $res = bdd()->query(
        "UPDATE `reservation` 
        SET `arretDepart` = '$arretDepart', `arretArrive` = '{$arretArrive}', `dateDepart` = '{$dateDepart}' 
        WHERE `reservation`.`id_reserv` = '{$idReservation}'");
    return $res == true;
}

/**
 * Fonction qui renvoie toutes les informations sur une réservation
 * @param $idReservation int l'id de la réservation
 * @return array|false un tableau des informations ou faux
 */
function fetch_by_id_reservation ($idReservation) {
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `id_reserv` =  '{$idReservation}'");
    return $result -> fetchAll();
}

/**
 * Fonction qui renvoie toutes les réservations d'un client en fonction de son id
 * @param $idClient int l'id du client
 * @return array|false un tableau des réservations ou faux
 */
function fetch_by_id_client ($idClient) {
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `id_client` =  '{$idClient}'");
    return $result -> fetchAll();
}


/**
 * Fonction qui renvoie toutes les réservations en attente
 * @return array|false un tableau des réservations ou faux
 */
function fetch_all_reservation_attente (){
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `etat` =  'attente'");
    return $result -> fetchAll();
}

/**
 * Fonction qui renvoie toutes les réservations validées
 * @return array|false un tableau des réservations ou faux
 */
function fetch_all_reservation_valide (){
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `etat` =  'valide'");
    return $result -> fetchAll();
}

/**
 * Fonction qui renvoie toutes les réservations refusées
 * @return array|false un tableau des réservations ou faux
 */
function fetch_all_reservation_refuse (){
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `etat` =  'refuse'");
    return $result -> fetchAll();
}


/**
 * Fonction qui renvoie, selon l'id du client et de l'état des réservations, les réservations
 * @param $idClient int l'id du client
 * @param $etat string l'état des notifications demandées
 * @return array|false un tableau des réservations ou faux
 */
function fetch_by_id_client_and_etat ($idClient, $etat) {
    $result = bdd()->query("SELECT * FROM `reservation` WHERE `id_client` =  '{$idClient}' AND `etat` = '{$etat}'");
    return $result -> fetchAll();
}



switch ($_GET['function']) {
    case 'create':      // beginning, end, type, users, buses, lines
        $res = create_time_slot($_GET['beginning'], $_GET['end'], $_GET['type'], $_GET['users'], $_GET['buses'], $_GET['lines'], $_GET['directions']);
        break;
    case 'types':
        $res = fetch_time_slot_type();
        break;
    case 'timeslot':       // id
        $res = fetch_time_slot($_GET['id']);
        break;
    case 'timeslots':
        $res = fetch_timeslots();
        break;
    case 'indispoDriver':
        $res = fetch_indispo_time_slots_driver($_GET['id']);
        break;
    case 'timeslotbytype':       // type, beginning, end
        $res = fetch_time_slots_by_type($_GET['type'], $_GET['beginning'], $_GET['end']);
        break;
    case 'timeslotbyuser':       // user, beginning, end
        $res = fetch_time_slots_by_user($_GET['user'], $_GET['beginning'], $_GET['end']);
        break;
    case 'timeslotbybus':       // bus, beginning, end
        $res = fetch_time_slots_by_bus($_GET['bus'], $_GET['beginning'], $_GET['end']);
        break;
    case 'timeslotbyline':       // line, beginning, end
        $res = fetch_time_slots_by_line($_GET['line'], $_GET['beginning'], $_GET['end']);
        break;
    case 'timeslotbetween':       // beginning, end
        $res = fetch_time_slots_between($_GET['beginning'], $_GET['end']);
        break;
    case 'update':       // id, beginning, end, users, buses
        $res = update_time_slot($_GET['id'], $_GET['beginning'], $_GET['end'], $_GET['users'], $_GET['buses'], $_GET['lines'], $_GET['directions']);
        break;
    case 'updateusers':       // id, users
        $res = update_users_of_time_slot($_GET['id'], $_GET['users']);
        break;
    case 'updatebuses':       // id, buses
        $res = update_buses_of_time_slot($_GET['id'], $_GET['buses']);
        break;
    case 'updatelines':       // id, lines
        $res = update_lines_of_time_slot($_GET['id'], $_GET['lines'], $_GET['directions']);
        break;
    case 'delete':       // id
        $res = delete_time_slot($_GET['id']);
        break;
    case 'create_reservation' :     // arretDepart, arretArrive, dateDepart, idClient
        $res = create_reservation ($_GET['arretDepart'], $_GET['arretArrive'], $_GET['dateDepart'], $_GET['idClient']);
        break;
    case 'refuse_reservation' :     // idReservation
        $res = refuse_reservation ($_GET['idReservation']);
        break;
    case 'valide_reservation' :     // idReservation, beginning, end, id_users, id_buses
        $res = valide_reservation ($_GET['idReservation'], $_GET['beginning'], $_GET['end'], $_GET['id_users'], $_GET['id_buses']);
        break;
    case 'delete_reservation' :     // idReservation
        $res =delete_reservation ($_GET['idReservation']);
        break;
    case 'update_reservation' :     // idReservation, arretDepart, arretArrive, dateDepart
        $res = update_reservation ($_GET['idReservation'], $_GET['arretDepart'], $_GET['arretArrive'], $_GET['dateDepart']);
        break;
    case 'fetch_by_id_reservation' :     // idReservation
        $res = fetch_by_id_reservation ($_GET['idReservation']);
        break;
    case 'fetch_by_id_client' :     // idClient
        $res = fetch_by_id_client ($_GET['idClient']);
        break;
    case 'fetch_all_reservation_attente' :
        $res = fetch_all_reservation_attente ();
        break;
    case 'fetch_all_reservation_valide' :
        $res = fetch_all_reservation_valide ();
        break;
    case 'fetch_all_reservation_refuse' :
        $res = fetch_all_reservation_refuse ();
        break;
    case 'fetch_by_id_client_and_etat' : // idClient, etat
        $res = fetch_by_id_client_and_etat ($_GET['idClient'], $_GET['etat']);
        break;
    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=create&beginning=2023-02-16 00:00:00&end=2023-02-16 04:45:00&type=1&users=1,2&buses=1&lines=1&directions=retour").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=types").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslot&id=41").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslotbytype&type=1&beginning=2023-02-16 00:00:00&end=2023-02-26 00:00:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslotbyuser&user=2&beginning=2023-02-16 00:00:00&end=2023-02-26 00:00:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslotbybus&bus=1&beginning=2023-02-27 00:00:00&end=2023-02-27 04:45:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslotbyline&line=1&beginning=2023-02-27 00:00:00&end=2023-02-27 04:45:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=timeslotbetween&beginning=2023-02-16 00:00:00&end=2023-02-26 00:00:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=update&id=21&beginning=2023-02-16 00:00:00&end=2023-02-26 00:00:00&users=1,2&buses=1&lines=1,2,3&directions=aller,retour,retour").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=updateusers&id=21&users=1,2,3").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=updatebuses&id=21&buses=1,2,3").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=updatelines&id=21&lines=1,2,3&directions=retour,aller,aller").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/timeslots/timeslots.php?function=delete&id=20").then(response => response.json()).then(response => console.log(response))

*/