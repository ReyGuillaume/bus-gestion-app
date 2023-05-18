<?php

include_once '../timeslots/function_timeslots.php';

/**
    Indique si un bus est libre sur une periode de temps.

    @param id_user : l'id du bus dont on souhaite vérifier la disponibilité.
    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return boolean.
*/
function is_free($id_bus, $begining, $end){
    $result = bdd()->
    query("SELECT id FROM `timeslot` ts
     JOIN bus_timeslot bts ON ts.id = bts.id_time_slot 
     WHERE bts.id_bus = '{$id_bus}' 
     AND (ts.begining BETWEEN '{$begining}' AND '{$end}' 
     OR ts.end BETWEEN '{$begining}' AND '{$end}'
     OR (ts.begining < '{$begining}' AND ts.begining > '{$end}'))");


   if ($result->rowCount() == 0) {
        return true;    
    } else {
        return false;
        }
}

/**
    Donne tous les bus libres sur une periode donée.

    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return une liste des identifiant des bus libres sur la periode.
*/
function find_buses_free($begining, $end){
    //array with all the id of the free buses
    $free_buses = array(); 

    //array with all the id of the buses
    $all_buses = bdd()-> query("SELECT id FROM `bus`");

    // for each bus we check if he is if free on the periode 
    // if yes we add it to the free buses array 
    foreach ($all_buses as $bus) {
        if(is_free($bus['id'], $begining, $end)){
            $free_buses[] = $bus['id'];
        }
    }

   return $free_buses;
}
/**
    Fonction qui ajoute un bus au creneau donné.

    @param idCreneau : L'id du créneau auquel on veut rajouter un bus.

    @return un booléen indiquant si l'opération s'est bien passée. 
*/
function add_a_bus_to_timeslot($idCreneau){
    $res = false;
    echo($idCreneau) ;
    $idCreneau = $idCreneau +1;
    echo($idCreneau) ;
    // On recupere le timeslot en question
    $creneau = fetch_time_slot($idCreneau);

    // On regarde si un bus est libre pour ce timeslot 
    $free_buses = find_buses_free($creneau["begining"], $creneau["end"]);
    //$free_buses = $free_buses->fetchAll();
    echo json_encode($free_buses);
    // On regarde si un bus est libre et si oui on le relie
    if (count($free_buses) > 0) {
        $random_index = rand(0, count($free_buses) - 1);
        $res = bdd()->query("INSERT INTO `bus_timeslot`(`id_bus`, `id_time_slot`) VALUES ({$free_buses[$random_index]}, {$idCreneau})");
        } 

    //on indique si l'ajout c'est bien passé 
    return $res; 
    
}

/**
    Fonction qui ajoute un bus au creneau donné.

    @param idCreneau : L'id du créneau auquel on veut rajouter un bus.

    @return un booléen indiquant si l'opération s'est bien passée. 
*/
function add_a_bus_to_timeslot_sql($idCreneau){
     
    
    // On recupere le timeslot en question
    $creneau = fetch_time_slot($idCreneau);

    // On regarde si un bus est libre pour ce timeslot 
    $free_buses = find_buses_free($creneau['begining'], $creneau['end']);
    
    // On regarde si un bus est libre et si oui on le relie
    if (count($free_buses) > 0) {
        $random_index = rand(0, count($free_buses) - 1);
        $res = "INSERT INTO `bus_timeslot`(`id_bus`, `id_time_slot`) VALUES ({$free_buses[$random_index]}, {$idCreneau});";
        } 

    
    return $res; 
    
}

function is_free_for_week($id_bus, $week_id) {
   
    // Obtention de la date du premier jour de la semaine
    $year = substr($week_id, 0, 4); // Année
    $week_number = substr($week_id, 6); // Numéro de la semaine
    
    $date = new DateTime();
    $date->setISODate($year, $week_number, 1); // Premier jour de la semaine (lundi)
    $start_week = $date->format('Y-m-d 00:00:00');
    
    // Obtention de la date du dernier jour de la semaine
    $date->modify('+6 days'); // Passage au dimanche
    $end_week = $date->format('Y-m-d 23:59:59');
    


    return is_free($id_bus, $start_week, $end_week);
}

function find_a_bus_id_free_for_the_week($id_week){
    //array with all the id of the free buses
    $free_buses = array(); 

    //array with all the id of the buses
    $all_buses = bdd()->
    query("SELECT id FROM `bus`");

    // for each bus we check if he is if free on the periode 
    // if yes we add it to the free buses array 
    foreach ($all_buses as $bus) {
        if(is_free_for_week($bus['id'],  $id_week)){
            $free_buses[] = $bus['id'];
        }
    }

    echo("FIND A BUS FREE FOR THE WEEK ");
    var_dump($free_buses );


    if (count($free_buses) > 0) {
        $random_index = rand(0, count($free_buses) - 1);
        $res = $free_buses[$random_index];
    }else{
        $res = -1;
    }

   return $res;
}

function is_free_for_day($id_bus, $date) {
    $begining = date("Y-m-d H:i:s", strtotime($date));
    $end = date("Y-m-d H:i:s", strtotime("+1 day", strtotime($date)));

    return is_free($id_bus, $begining, $end);
}

function find_a_bus_id_free_for_the_day($date) {
    //array with all the id of the free buses
    $free_buses = array(); 

    //array with all the id of the buses
    $all_buses = bdd()->
    query("SELECT id FROM `bus`");

    // for each bus we check if he is if free on the periode 
    // if yes we add it to the free buses array 
    foreach ($all_buses as $bus) {
        if(is_free_for_day($bus['id'], $date)){
            $free_buses[] = $bus['id'];
        }
    }
    
    if (count($free_buses) > 0) {
        $random_index = rand(0, count($free_buses) - 1);
        $res = $free_buses[$random_index];
    } else {
        $res = -1;
    }

   return $res;
}

