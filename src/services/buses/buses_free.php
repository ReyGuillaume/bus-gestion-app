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
    $all_buses = bdd()->
    query("SELECT id FROM `bus`");

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
    
    // On recupere le timeslot en question
    $creneau = fetch_time_slot($idCreneau);

    // On regarde si un bus est libre pour ce timeslot 
    $free_buses = find_buses_free($creneau['begining'], $creneau['end']);
    
    // On regarde si un bus est libre et si oui on le relie
    if (count($free_buses) > 0) {
        $random_index = rand(0, count($free_buses) - 1);
        $res = bdd()->query("INSERT INTO `bus_timeslot`(`id_bus`, `id_time_slot`) VALUES ({$free_buses[$random_index]}, {$idCreneau})");
        } 

    //on indique si l'ajout c'est bien passé 
    return $res; 
    
}