<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

include_once "../buses/buses_free.php";
include_once "../users/users_free.php";

// ======================== Line ========================

/**
    Insert une ligne dans la table Line.

    @param number : le numéro de la ligne à créer.
    @param travel_time : le temps de trajet de la ligne.

    @return boolean si l'ajout est un succès.
*/
function create_line($number, $travel_time, $id_type_line) {
    if(!bdd()->query("SELECT * FROM `line`  WHERE `number` = '{$number}'")->fetch()){
        bdd()->query("INSERT INTO `line` (`number`, `travel_time`) VALUE ('{$number}', '{$travel_time}')");
        bdd()->query("INSERT INTO `linetype_line`(`id_type`, `num_line`) VALUE ('{$id_type_line}', '{$number}')");
        $res = true;  
        
    }
    else{
        $res = false;
    }
    return $res;
}

/**
    Renvoie toutes les lignes existantes.
    
    @return liste des lignes (number : Int, travel_time : Int).
*/
function fetch_lines() {
    $res = bdd()->query("SELECT * FROM `line`");
    return $res->fetchAll();
}

/**
    Renvoie tous les types de ligne existant.
    
    @return liste des lignes (id_type : Int, name : String).
*/
function fetch_linetypes() {
    $res = bdd()->query("SELECT * FROM `linetype`");
    return $res->fetchAll();
}

/**
    Récupère les données d'une ligne selon son numéro.

    @param number : numéro de la ligne.

    @return objet line (number : Int, travel_time : Int).
*/
function fetch_line($number) {
    $res = bdd()->query("SELECT * FROM `line` WHERE `number` = {$number}");
    return $res->fetch();
}

/**
    Récupère les données d'un type de ligne selon son id.

    @param id : id du type de la ligne.

    @return objet linetype (id_type : Int, begin : String, end : String, intervalle : Int).
*/
function fetch_linetype($id) {
    $res = bdd()->query("SELECT * FROM `linetypeconditions` WHERE `id_type` = {$id}");
    return $res->fetchAll();
}

/**
    Récupère les données de tous les créneaux d'une ligne de bus.

    @param number : numéro de la ligne que l'on souhaite séléctionner.

    @return liste des créneaux (num_line : Int, id_time_slot : Int, direction : String)
*/
function fetch_timeslots_of_line($number) {
    $res = bdd()->query("SELECT * FROM line_timeslot WHERE num_line = {$number}");
    return $res->fetchAll();
}

/**
    Modifie le temps de trajet d'une ligne donnée.

    @param number : numéro de la ligne dont les modifications seront modifiées.
    @param travel_time : nouvelle durée de trajet à affecter.

    @return boolean si la modification est un succès.
 */
function modify_traveltime_line($number, $travel_time) {
    if(bdd()->query("SELECT * FROM `line`  WHERE `number` = {$number}")->fetch()) {
        bdd()->query("UPDATE `line` SET `travel_time`={$travel_time} WHERE `number` = {$number}");
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
    $res = bdd()->query("SELECT * FROM `line_timeslot` WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
    $row = $res->fetch(PDO::FETCH_ASSOC);
    if($row != null) {
        $direction = $row['direction'];
        if($direction == "aller"){
            bdd()->query("UPDATE `line_timeslot` SET `direction` = 'retour' WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
        }
        else{
            bdd()->query("UPDATE `line_timeslot` SET `direction` = 'aller' WHERE `num_line` = {$number} AND `id_time_slot` = {$id_creneau}");
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
    if(bdd()->query("SELECT * FROM `line` WHERE `number` = {$number}")->fetch()) {
        bdd()->query("DELETE FROM `line_timeslot` WHERE num_line = {$number}");
        bdd()->query("DELETE FROM `line` WHERE `number` = {$number}");
        return true;
    }
    return false;
}

/**
  Fonction qui indique si toutes les lignes sont bien couvertes pendant la semaine donée
  
  @param semaine : La semaine à vérifier format 2023-W15
 
  @return un booléen qui indique si la semaine est couverte 
   
*/
function semaine_lignes_couvertes ($semaine) { 
    $toute_ligne = bdd()->query("SELECT `number` FROM `line`");
    // Boucle pour parcourir tous les numéros de ligne et les afficher
    $res= true; 
    
    while ($ligne = $toute_ligne->fetch(PDO::FETCH_ASSOC)) {
        if (!semaine_ligne_couverte ($semaine, $ligne['number'])){
            $res=false;
        }
    }
    return $res;
}

/**
  Fonction qui indique si une ligne est bien couverte pendant la semaine donée
  
  @param week : La semaine à vérifier format 2023-W15
  @param id_line : L'id de la ligne que l'on veut vérifiée
  
  @return un booléen qui indique si la ligne est couverte pendant la semaine 
   
*/
function semaine_ligne_couverte ($week, $id_line) {  

  // On isole l'année et le numéro de la semaine
  $year = substr($week, 0, 4);
  $weekNumber = substr($week, 6, 2);

  // On creer le jour de depart ( 1 pour lundi )
  $startDate = new DateTime();
  $startDate->setISODate($year, $weekNumber, 1);

  // On initialise le resultat à retourner 
  $res = true; 

  // On parcours chaque jour de la semaine et on verifie qu'il est couvert
  for ($i = 0; $i < 7; $i++) {
    $date = $startDate->format('Y-m-d');
    if (!jour_ligne_couverte ($date, $id_line)){
        $res=false;
        //echo("Attention : la ligne {$id_line} n'est pas bien couverte à la date du {$date}");
    }
    //On passe au jour suivant 
    $startDate->add(new DateInterval('P1D'));
  }

  //retourne le resultat
    return $res;
}


/**
  Fonction qui indique si une ligne est bien couverte pendant un jour donné
  
  @param jour : La jour à vérifier 
  @param id_line : L'id de la ligne que l'on veut vérifiée
  
  @return un booléen qui indique si la ligne est couverte pendant le jour donné
    
*/
function jour_ligne_couverte ($jour, $id_line) {  

    //Je récupere les "crénaux de couverture obligatoire"
    $id_type_query= bdd()->query("SELECT `id_type` FROM `linetype_line` WHERE `num_line`={$id_line}");
    $id_type = $id_type_query->fetch();
    $tous_creneaux = bdd()->query("SELECT * FROM `linetypeconditions` WHERE `id_type` = {$id_type['id_type']}");

    $res = true; 

    // Pour chaque crénaux de couverture obligatoire on vérifie si il est couvert
    while ($crenau = $tous_creneaux->fetch(PDO::FETCH_ASSOC)) {
        if (!creneau_couvert ($crenau,$jour, $id_line)){
            $res=false;
        }
    }
    
    return $res;
}

/**
  Fonction qui indique si une ligne est bien couverte pendant un créneau de couverture obligatoire 
  
  @param creneau : La creneau de couverture obligatoire en question
  @param jour : La jour à vérifier 
  @param id_line : L'id de la ligne que l'on veut vérifiée
  
  @return un booléen qui indique si la ligne est couverte pendant le jour donné
    
*/
function creneau_couvert ($crenau,$jour, $id_line){
    /*echo "<br>";
    
    echo "Ligne : {$id_line}    ";
    echo "Info creneau :   {$crenau['begin']}    ";
    echo "{$crenau['end']}     ";
    echo  "Jour :    {$jour} \n ";*/
    
    // On sélctionne toutes les conduites de ce créneau pour cette ligne
    $sql = "SELECT `begining` 
        FROM `timeslot` t 
        JOIN `line_timeslot` l ON l.id_time_slot = t.id
        WHERE l.num_line= {$id_line}
        AND TIME(`begining`) <= '{$crenau['end']}'
        AND TIME(`begining`) >= '{$crenau['begin']}'
        AND DATE(`begining`) = '{$jour}'
        ORDER BY `begining`";

    
    // Récupération des données de la requête précédente
    $tous_trajets_query = bdd()->query($sql);
    $tous_trajets = $tous_trajets_query->fetchAll();

    $intervalle = $crenau['intervalle'];

    if (!empty($tous_trajets)){

        // Vérification que le premier trajet commence bien à l'heure de début du créneau
        $heure = substr($tous_trajets[0]['begining'], 11, 8);
        $diff_depart = strtotime($heure) - strtotime($crenau['begin']);

        if ($diff_depart > 0) {
            //echo "Il n'y a pas de trajet au début du créneau.";
            return false;
        }

        // Vérification que chaque trajet commence moins de 10 minutes après la fin du précédent
        for ($i = 1; $i < count($tous_trajets); $i++) {
            $diff = strtotime($tous_trajets[$i]['begining']) - strtotime($tous_trajets[$i-1]['begining']);
            if ($diff > ($intervalle*60)) {
                //echo "Il y a plus de 10 minutes entre le trajet ".$i." et le précédent.";
                return false;
            }
        }

        // Vérification que le dernier trajet finit bien à l'heure de fin du créneau
        $heure = substr(end($tous_trajets)['begining'], 11, 8);
        $diff_fin = strtotime($heure) - strtotime($crenau['end']);

        if ($diff_fin > 0) {
            //echo "Il n'y a pas de trajet à la fin du créneau.";
            return false;
        }
    }else{
        //echo "Aucun trajet pour la date du {$jour} \n ";

        return false;
    }
    //echo "Tous les créneaux sont couverts par au moins un trajet toutes les dix minutes.";

    return true;
}

/**
  Fonction qui creer tout les crénaux de conduite nécessaires pour que la semaine donnée soit bien couverte 
  
  @param week : La semaine à couvrir
  
  @return un booléen qui indique si tout c'est bien passé
    
*/
function  cover_a_week($week){
    // Recupere toutes les lignes 
    $toute_ligne = bdd()->query("SELECT `number` FROM `line`");
    
    // Pour chaque ligne verifie qu'elle est bien couverte pour la semaine 
    $res = true;
    while ($ligne = $toute_ligne->fetch(PDO::FETCH_ASSOC)) {
        if (!cover_a_line_for_a_week($week, $ligne['number'])){
            $res=false;
        }
    }
    return $res;
}

/**
  Fonction qui creer tout les crénaux de conduite nécessaires pour qu'une ligne soit bien couverte pour une semaine donnée 
  
  @param week : La semaine à couvrir
  @param id_line : la ligne à remplir 
  
  @return un booléen qui indique si tout c'est bien passé
    
*/
function cover_a_line_for_a_week($week, $id_line){
// On isole l'année et le numéro de la semaine
  $year = substr($week, 0, 4);
  $weekNumber = substr($week, 6, 2);

  // On creer le jour de depart ( 1 pour lundi )
  $startDate = new DateTime();
  $startDate->setISODate($year, $weekNumber, 1);

  // On parcours chaque jour de la semaine et on le couvre
  $res = true;
  for ($i = 0; $i < 7; $i++) {
    $date = $startDate->format('Y-m-d');
    if (!couvre_a_line_for_a_day ($date, $id_line)){
        $res=false;
    }
    $startDate->add(new DateInterval('P1D'));
  }
    return $res;
}

/**
  Fonction qui creer tout les crénaux de conduite nécessaires pour qu'une ligne soit bien couverte pour un jour donné 
  
  @param jour : Le jour à couvrir
  @param id_line : la ligne à remplir 
  
  @return un booléen qui indique si tout c'est bien passé
    
*/
function couvre_a_line_for_a_day ($jour, $id_line){
    // On récupère tous les créneaux à couvrir pour cette ligne la en fonction de son type 
    $id_type_query= bdd()->query("SELECT `id_type` FROM `linetype_line` WHERE `num_line`={$id_line}");
    $id_type = $id_type_query->fetch();
    $tous_creneaux = bdd()->query("SELECT * FROM `linetypeconditions` WHERE `id_type` = {$id_type['id_type']}");

    $res = true; 
    // On remplit chaque creneau de couverture obligatoire 
    while ($crenau = $tous_creneaux->fetch(PDO::FETCH_ASSOC)) {
        if (!couvrire_creneau ($crenau,$jour, $id_line)){
            $res=false;
        }
    }
    return $res;
}

/**
  Fonction qui creer tout les crénaux de conduite nécessaires pour qu'une ligne soit bien couverte pour un créneau de couverture obligatoire donné 
  
  @param creneau : Le créneau à couvrire
  @param jour : Le jour à couvrir
  @param id_line : la ligne à remplir 
  
  @return un booléen qui indique si tout c'est bien passé
    
*/
function couvrire_creneau ($crenau, $jour, $id_line){
    
    // On recupere toutes les variables nécessaire 
    $temps_creneau = 60; //++++ A améliorer car pas très maniable 
    $heure_courante = $crenau['begin'];
    $intervalle = $crenau['intervalle'];
    $res = true;

    $bdd = bdd();

    while ($heure_courante <= $crenau['end'] ){

        //echo "{$heure_courante}";
        // creation des datetime de debut et de fin 
        $date_complete_debut = DateTime::createFromFormat('Y-m-d H:i:s', $jour . ' ' . $heure_courante);
        $date_complete_debut_str = $date_complete_debut->format('Y-m-d H:i:s');

        $datetime_debut = DateTime::createFromFormat('H:i:s', $heure_courante);
        $datetime_debut->add(new DateInterval('PT60M'));
        $heure_fin_courante =  $datetime_debut->format('H:i:s');

        $date_complete_fin = DateTime::createFromFormat('Y-m-d H:i:s', $jour . ' ' . $heure_fin_courante);
        $date_complete_fin_str = $date_complete_fin->format('Y-m-d H:i:s');

      
        // On entre un creneau dans la base de donnée
        $nv = $bdd->query("INSERT INTO `timeslot`(`begining`, `end`, `id_time_slot_type`) VALUES ('{$date_complete_debut_str}', '{$date_complete_fin_str}', 1)");
        if ($nv===false){
            $res = false;
        }

        // récupérer l'ID généré automatiquement pour le nouveau timeslot
        $id_timeslot = $bdd->lastInsertId();
        $liaison = $bdd->query("INSERT INTO `line_timeslot`(`num_line`, `id_time_slot`, `direction`) VALUES ('{$id_line}','{$id_timeslot}','aller')");
        
     
        // On y ajoute un bus si possible 
        $bus_relie =  add_a_bus_to_timeslot($id_timeslot);
        
        // On y ajoute un conducteur si possible
        $driver_relie =  add_a_driver_to_timeslot($id_timeslot);

        /*if (($bus_relie==false )||( $driver_relie==false )){
            $res = false;
        }*/

     
        // On avance 
        $datetime_courante = DateTime::createFromFormat('H:i:s', $heure_courante);
        $datetime_courante->add(new DateInterval("PT{$intervalle}M"));
        $heure_courante =  $datetime_courante->format('H:i:s');
    } 
    //echo("{$res}");
    return $res ; 
}

/**
  Fonction qui crée une nouvelle plage horaire pour un type de ligne
  
  @param name : nom du type de ligne
  @param begin : heure de début d'une journée de conduite
  @param end : heure de fin d'une journée de conduite
  @param intervalle : intervalle de temps entre chaque conduite
  
  @return un booléen qui indique si tout s'est bien passé
    
*/
function create_line_type_condition($name, $begin, $end, $intervalle){
    $res = bdd()->query("SELECT * FROM `linetype` WHERE `name`='{$name}'")->fetch(PDO::FETCH_ASSOC);
    $id_type = $res['id_type'];

    $lst_conditions = bdd()->query("SELECT * FROM `linetypeconditions` WHERE `id_type`={$id_type}");

    while($condition = $lst_conditions->fetch(PDO::FETCH_ASSOC)){
        $begin_condition = $condition['begin'];
        $end_condition = $condition['end'];

        if(($begin < $begin_condition && $end > $end_condition) || ($begin > $begin_condition && $begin < $end_condition) || ($end > $begin_condition && $end < $end_condition)){
            return false;
        }
    }
    bdd()->query("INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE ({$id_type}, '{$begin}', '{$end}', {$intervalle})");
    return true;
}


/**
  Fonction qui crée une nouvelle plage horaire pour un type de ligne
  
  @param name : nom du type de ligne
  @param begin : heure de début d'une journée de conduite
  @param end : heure de fin d'une journée de conduite
  @param intervalle : intervalle de temps entre chaque conduite
  
  @return un booléen qui indique si tout s'est bien passé
    
*/
function update_line_condition($id_type, $begin, $end, $intervalle){
    $lst_conditions = bdd()->query("SELECT * FROM `linetypeconditions` WHERE `id_type`={$id_type}");

    while($condition = $lst_conditions->fetch(PDO::FETCH_ASSOC)){
        $begin_condition = $condition['begin'];
        $end_condition = $condition['end'];

        if(($begin < $begin_condition && $end > $end_condition) || ($begin > $begin_condition && $begin < $end_condition) || ($end > $begin_condition && $end < $end_condition)){
            return false;
        }
    }
    bdd()->query("INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE ({$id_type}, '{$begin}', '{$end}', {$intervalle})");
    return true;
}

/**
  Fonction qui crée un nouveau type de ligne
  
  @param name : nom du type de ligne
  
  @return un booléen qui indique si tout s'est bien passé
    
*/
function create_line_type($name){
    if(!bdd()->query("SELECT * FROM `linetype` WHERE `name`='{$name}'")->fetch()){
        bdd()->query("INSERT INTO `linetype` (`name`) VALUE ('{$name}')");
        return true;
    }
    return false;
}

/**
  Fonction qui supprimer les plages horaire d'un type de ligne
  
  @param id : id du type de ligne
  
  @return un booléen qui indique si tout s'est bien passé
    
*/
function delete_type_conditions($id){
    if(bdd()->query("SELECT * FROM `linetype` WHERE `id_type`={$id}")->fetch()){
        bdd()->query("DELETE FROM `linetypeconditions` WHERE `id_type`={$id}");
        return true;
    }
    return false;
}

/**
  Fonction qui supprimer un type de ligne
  
  @param id : id du type de ligne
  
  @return un booléen qui indique si tout s'est bien passé
    
*/
function delete_type_line($id){
    if(bdd()->query("SELECT * FROM `linetype` WHERE `id_type`={$id}")->fetch()){
        bdd()->query("DELETE FROM `linetypeconditions` WHERE `id_type`={$id}");
        bdd()->query("DELETE FROM `linetype` WHERE `id_type`={$id}");
        return true;
    }
    return false;
}

switch ($_GET['function']) {
    case 'create':      // number, temps de trajet
        $res = create_line($_GET['number'], $_GET['travel_time'],$_GET['id_type'] );
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
    case 'WeekCovered': //week
        $res =semaine_lignes_couvertes ($_GET['week']);
        break;
    case 'coverWeek': // week
        $res = cover_a_week ($_GET['week']);
        break;
    case 'coverLineWeek': //week line
        $res = cover_a_line_for_a_week ($_GET['week'], $_GET['idline']);
        break;
    case 'typesline':
        $res =fetch_linetypes();
        break;
    case 'type':
        $res = fetch_linetype($_GET['id']);
        break;
    case 'createtype':
        $res = create_line_type($_GET['name']);
        break;
    case 'createcondition':
        $res = create_line_type_condition($_GET['name'], $_GET['begin'], $_GET['end'], $_GET['intervalle']);
        break;
    case 'updatecondition':
        $res = update_line_condition($_GET['id'], $_GET['begin'], $_GET['end'], $_GET['intervalle']);
        break;
    case 'deleteconditions':
        $res = delete_type_conditions($_GET['id']);
        break;
    case 'deletetype':
        $res = delete_type_line($_GET['id']);
        break;
    default:
        $res = "invalid function";
        break;
}

echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=create&number=5&travel_time=60").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=lines").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=line&number=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=linecalendar&number=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=updateline&number=1&travel_time=45").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=updatedirection&number=1&id_creneau=1").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=delete&number=4").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=WeekCovered&week=2018-W18").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/lines/lines.php?function=coverWeek&week=2023-W15").then(response => response.json()).then(response => console.log(response))

*/

