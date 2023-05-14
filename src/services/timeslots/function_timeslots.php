<?php
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