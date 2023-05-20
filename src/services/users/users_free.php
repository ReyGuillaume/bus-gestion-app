
<?php

include_once '../timeslots/function_timeslots.php';

/**
    Indique si un utilisateur est libre sur une periode de temps.

    @param id_user : l'id de l'utilisateur dont on souhaite vérifier la disponibilité.
    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return boolean.
*/
function is_free_user($id_user, $begining, $end){
    $result = bdd()->
    query("SELECT id FROM `timeslot` ts
     JOIN user_timeslot uts ON ts.id = uts.id_time_slot 
     WHERE uts.id_user = '{$id_user}' 
     AND (ts.begining BETWEEN '{$begining}' AND '{$end}' 
     OR ts.end BETWEEN '{$begining}' AND '{$end}'
     OR (ts.begining < '{$begining}' AND ts.end > '{$end}'))");

   if ($result->rowCount() == 0) {
        return true;    
    } else {
        return false;
        }
}

/**
    Donne tous les conducteurs libres sur une periode donée.

    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return une liste des identifiant des conducteurs libres sur la periode.
*/
function find_drivers_free($begining, $end){
    
    //array with all the id of the free drivers
    $free_drivers = array(); 

    //array with all the id of the drivers
    $all_drivers = bdd()->
    query("SELECT id FROM `user`WHERE id_user_type = '3' ");

    // for each driver we check if he is if free on the periode 
    // if yes we add it to the free drivers array 
    foreach ($all_drivers as $driver) {
        if(is_free_user($driver['id'], $begining, $end)){
            $free_drivers[] = $driver['id']; // ajouter l'id du conducteur disponible au tableau
        }
    }

   return $free_drivers;
}

/**
    Donne tous les utilisateurs libres sur une periode donée.

    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return une liste des identifiant des utilisateurs libres sur la periode.
*/
function find_users_free($begining, $end){
    //array with all the id of the free users
    $free_users = array(); 

    //array with all the id of the users
    $all_users = bdd()->
    query("SELECT id FROM `user`");

    // for each user we check if he is if free on the periode 
    // if yes we add it to the free users array 
    foreach ($all_users as $user) {
        if(is_free_user($user['id'], $begining, $end)){
            $free_users[] = $user['id'];
        }
    }

   return $free_users;
}

/**
    Donne tous les utilisateurs libres sur une periode donée parmis certains donnés.

    @param begining : La date et heure du début du créneau de disponibilité recherché.
    @param end : La date et heure du début du créneau de disponibilité recherché.

    @return une liste des identifiant des utilisateurs libres sur la periode.
*/
function find_users_free_in_list($begining, $end, $all_users){
    //array with all the id of the free users
    $free_users = []; 


    // for each user we check if he is if free on the periode 
    // if yes we add it to the free users array 
    for ($i=0; $i<count($all_users); $i=$i+1){
        if(is_free_user($all_users[$i], $begining, $end)){
            $free_users[] =$all_users[$i];
        }
    }

   return $free_users;
}

/**
    Fonction qui ajoute un conducteur au creneau donné.

    @param idCreneau : L'id du créneau auquel on veut rajouter un conducteur.

    @return un booléen indiquant si l'opération s'est bien passée. 
*/
function add_a_driver_to_timeslot($idCreneau){
    //On initialise le res 
    $res = false; 
    
    // On recupere le timeslot en question
    $creneau = fetch_time_slot($idCreneau);

    // On regarde si un conducteur est libre pour ce timeslot 
    $free_drivers = find_drivers_free($creneau['begining'], $creneau['end']);
    
    // On regarde si un conducteur est libre et si oui on le relie
    if (count($free_drivers) > 0) {
        $random_index = rand(0, count($free_drivers) - 1);
        $res = bdd()->query("INSERT INTO `user_timeslot`(`id_user`, `id_time_slot`) VALUES({$free_drivers[$random_index]}, {$idCreneau})");
        } 

    //on indique si l'ajout c'est bien passé 
    return $res; 
    
}

/**
    Fonction qui renvoie le code sql nécessaire pour ajouter un conducteur au creneau donné.

    @param idCreneau : L'id du créneau auquel on veut rajouter un conducteur.

    @return le code sql. 
*/
function add_a_driver_to_timeslot_sql($idCreneau){
    
    // On recupere le timeslot en question
    $res = "";
    $creneau = fetch_time_slot($idCreneau);

    // On regarde si un conducteur est libre pour ce timeslot 
    $free_drivers = find_drivers_free($creneau['begining'], $creneau['end']);
    
    // On regarde si un conducteur est libre et si oui on le relie
    if (count($free_drivers) > 0) {
        $random_index = rand(0, count($free_drivers) - 1);
        $res = "INSERT INTO `user_timeslot`(`id_user`, `id_time_slot`) VALUES({$free_drivers[$random_index]}, {$idCreneau});";
        } 

    //on indique si l'ajout c'est bien passé 
    return $res; 
    
}