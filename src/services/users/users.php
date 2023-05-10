<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include_once "../connexion.php";

// ======================== Utilisateur ========================

/**
Enregistre un utilisateur si $password == $confirmation, si $login n'est pas déjà utilisé, si $birth_date est valide et si $email n'est pas déjà utilisé.

@param login : le login de l'utilisateur. String de taille inférieure ou égale à 50.
@param password : le mot de pass de l'utilisateur. String de taille variable avec caractères spéciaux. A hacher en sha256 (return String de taille 64).
@param confirmation : la confirmation du mot de passe de l'utilisateur. String égale à $password.
@param birth_date : date de naissance de l'utilisateur. Devrait être comprise entre la date courante et la date courante - 150 ans.
@param name : nom de l'utilisateur. String de taille inférieure ou égale à 50.
@param firstname : prénom de l'utilisateur. String de taille inférieure ou égale à 50.
@param email : email de l'utilisateur. String de taille inférieure ou égale à 255 contenant des caractères spéciaux.
@param id_user_type : id du type d'utilisateur. Entier non null.

@return boolean si l'ajout a réussi ou non.
 */
function user_registration($login, $password, $confirmation, $birth_date, $name, $firstname, $email, $id_user_type) {
    if ($password == $confirmation) {
        if(bdd()->query("SELECT * FROM UserType WHERE id = {$id_user_type}")->fetch()) {
            $pwd = hash("sha256", $password);
            bdd()->query("INSERT INTO Code (`login`, `password`) VALUE ('{$login}', '{$pwd}')");
            $sql = "INSERT INTO User (`name`, `firstname`, `birth_date`, `email`, `id_user_type`, `login`) VALUE ('{$name}', '{$firstname}', '{$birth_date}', '{$email}', {$id_user_type},'{$login}')";
            bdd()->query($sql);
            return true;
        }
    }
    return false;
}

/**
Enregistre un utilisateur si $password == $confirmation, si $login n'est pas déjà utilisé, si $birth_date est valide et si $email n'est pas déjà utilisé.

@param login : le login de l'utilisateur. String de taille inférieure ou égale à 50.
@param password : le mot de pass de l'utilisateur. String de taille variable avec caractères spéciaux. A hacher en sha256 (return String de taille 64).
@param confirmation : la confirmation du mot de passe de l'utilisateur. String égale à $password.
@param birth_date : date de naissance de l'utilisateur. Devrait être comprise entre la date courante et la date courante - 150 ans.
@param name : nom de l'utilisateur. String de taille inférieure ou égale à 50.
@param firstname : prénom de l'utilisateur. String de taille inférieure ou égale à 50.
@param email : email de l'utilisateur. String de taille inférieure ou égale à 255 contenant des caractères spéciaux.
@param id_user_type : id du type d'utilisateur. Entier non null.

@return boolean si l'ajout a réussi ou non.
 */
function employe_registration($login, $birth_date, $name, $firstname, $email, $id_user_type) {
    if(bdd()->query("SELECT * FROM UserType WHERE id = {$id_user_type}")->fetch()) {
        $sql = "INSERT INTO User (`name`, `firstname`, `birth_date`, `email`, `id_user_type`, `login`) VALUE ('{$name}', '{$firstname}', '{$birth_date}', '{$email}', {$id_user_type},'{$login}')";
        bdd()->query($sql);
        return true;
    }
    return false;
}

/**
    Vérifie l'existence de l'utilisateur ayant comme login et mot de passe $login et $password.

    @param login : le login de l'utilisateur. String de taille inférieure ou égale à 50.
    @param password : le mot de pass de l'utilisateur. String de taille fixe = 64.

    @return objet utilisateur (id : Int, login : String, id_user_type : Int)
*/
function user_log_in($login, $password) {
    $pwd = hash("sha256", $password);
    $sql = "SELECT u.id, u.login, u.id_user_type FROM Code c RIGHT JOIN User u ON c.login = u.login WHERE c.login = '{$login}' AND c.password = '{$pwd}'";
    $res = bdd()->query($sql);
    if($res){
        return $res->fetch();
    } else {
        return null;
    }
}


/**
    Affiche les infos de l'utilisateur ayant comme login et mot de passe $login et $password.

    @param login : le login de l'utilisateur. String de taille inférieure ou égale à 50.
    @param password : le mot de pass de l'utilisateur. String de taille fixe = 64.

    @return objet utilisateur (lastname : String, firstname : String, name : String)
*/
function user_infos($login, $password) {
    $pwd = hash("sha256", $password);
    $sql = "SELECT u.id, u.name AS lastname, u.firstname, ut.name, u.email, ut.id AS idrole FROM Code c JOIN User u ON c.login = u.login JOIN UserType ut ON u.id_user_type = ut.id WHERE c.login = '{$login}' AND c.password = '{$pwd}'";
    $res = bdd()->query($sql);
    if($res){
        return $res->fetch();
    } else {
        return null;
    }
}


/**
Récupère tous les types d'utilisateur.

@return liste des types d'utilisateur (id : Int, name : String)
 */
function fetch_user_types() {
    $res = bdd()->query("SELECT * FROM UserType");
    return $res->fetchAll();
}

/**
Récupère tous les utilisateurs.

@return liste des utilisateurs (id : Int, name : String, firstname : String, birth_date : String, email : String, user_type : Int, login : String)
 */
function fetch_users() {
    $res = bdd()->query("SELECT * FROM User");
    return $res->fetchAll();
}

/**
    Récupère les informations d'un utilisateur selon son id.

    @param id : id de l'utilisateur.

    @return objet utilisateur (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : Int)
*/
function fetch_user($id) {
    $res = bdd()->query("SELECT * FROM User WHERE id = {$id}");
    return $res->fetch();
}

/**
    Récupère la liste des utilisateurs selon son leur type.

    @param id_user_type : id du type d'utilisateur.

    @return liste des utilisateurs (id : Int, login : String, name : String, firstname : String, birth_date : String, email : String, user_type : Int)
*/
function fetch_users_by_type($id_user_type) {
    $sql = "SELECT * FROM User WHERE id_user_type = {$id_user_type}";
    $result = bdd()->query($sql);
    $res = array();
    while ($row = $result->fetch()) {
        $res[] = $row;
    }
    return $res;
}

/**
    Modifie l'email et le login d'un utilisateur.

    @param id : id de l'utilisateur.
    @param email : nouvel email de l'utilisateur.
    @param login : nouveau login de l'utilisateur

    @return boolean si la modification est un succès.
*/
function modify_user_data($id, $email, $login, $name, $firstname, $date) {
    $sql = "SELECT * FROM User u JOIN Code c ON u.login = c.login WHERE u.id = {$id}";
    $user = bdd()->query($sql);
    if ($user) {
        $user = $user->fetch();
        $old_login = $user['login'];
        $pwd = $user['password'];
        bdd()->query("UPDATE `user` SET `email`='{$email}',`name`='{$name}',`firstname`='{$firstname}',`birth_date`='{$date}' WHERE id = {$id}");
        if ($old_login != $login) {
            bdd()->query("INSERT INTO Code (login, password) VALUE ('{$login}', '{$pwd}')");
            bdd()->query("UPDATE `user` SET `login`='{$login}' WHERE id = {$id}");
            bdd()->query("DELETE FROM `code` WHERE login = '{$old_login}'");
        }
        return true;
    }
    return false;
}

/**
    Modifie le mot de passe d'un utilisateur si $old_password est effectivement le mot de passe actuel de l'utilisateur et si $new_password est égal à $confirmation.

    @param id : id de l'utilisateur.
    @param old_password : ancien mot de passe de l'utilisateur.
    @param new_password : nouveau mot de passe de l'utilisateur.
    @param confirmation : confirmation du nouveau mot de passe de l'utilisateur.

    @return boolean si la modification est un succès.
*/
function modify_user_password($id, $old_password, $new_password, $confirmation) {
    if ($new_password == $confirmation) {
        $old_pwd = hash("sha256", $old_password);
        $res = bdd()->query("SELECT * FROM User u JOIN Code c ON u.login = c.login WHERE u.id = {$id} AND c.password = '{$old_pwd}'");
        $user = $res->fetch();
        if ($user) {
            $login = $user['login'];
            $new_pwd = hash("sha256", $new_password);
            bdd()->query("UPDATE `code` SET `password`='{$new_pwd}' WHERE login = '{$login}'");
            return true;
        }
    }
    return false;
}

/**
    Supprime un utilisateur selon son id.

    @param id : l'id de l'utilisateur que l'on souhaite supprimer.

    @return boolean si la délétion est un succès.
*/
function delete_user($id) { //supprime également les lignes de Code et de User_TimeSlot qui ont pour id_utilisateur $id
    $res = bdd()->query("SELECT * FROM User WHERE id = {$id}");
    bdd()->query("DELETE FROM `user_timeslot` WHERE id_user = {$id}");
    bdd()->query("DELETE FROM User WHERE id = {$id}");
    if ($res) {
        $user = $res->fetch();
        if ($user) {
            $login = $user['login'];
            bdd()->query("DELETE FROM Code WHERE login = '{$login}'");
            return true;
        }
    }
    return false;
}

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
     OR (ts.begining < '{$begining}' AND ts.begining > '{$end}'))");

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
    Fonction qui ajoute un conducteur au creneau donné.

    @param idCreneau : L'id du créneau auquel on veut rajouter un conducteur.

    @return un booléen indiquant si l'opération s'est bien passée. 
*/
function add_a_driver_to_timeslot($idCreneau){
    //On initialise le res 
    $res = false; 
    
    // On recupere le timeslot en question
    require_once '../timeslots/timeslots.php';
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
    Fonction qui ajoute une demande d'inscription d'abonné.

    @param prenom : prénom de l'abonné.
    @param nom : nom de l'abonné.
    @param email : email de l'abonné.
    @param birth_date : birth_date de l'abonné.
    @param login : login de l'abonné.
    @param password : mot de passe de l'abonné.

    @return un booléen indiquant si l'opération s'est bien passée. 
*/
function abonne_inscription($prenom, $nom, $email, $birth_date, $login, $password){
    if(!bdd()->query("SELECT * FROM `Code` WHERE `login`='{$login}'")->fetch()){
        bdd()->query("INSERT INTO `inscription` (`name`, `firstname`, `birth_date`, `email`, `login`, `password`) VALUE('{$nom}', '{$prenom}', '{$birth_date}', '{$email}', '{$login}', '{$password}')");
        return true;
    }
    return false;
}

/**
    Fonction qui affiche toutes les demandes d'inscription.

    @return la liste des users qui demandent une inscription en tant qu'abonné.
*/
function fetch_inscriptions(){
    $res = bdd()->query("SELECT * FROM `inscription`");
    return $res->fetchAll();
}

/**
    Fonction qui valide une demande d'inscription.

    @param id : id de l'abonné.

    @return un booléen indiquant si tout s'est bien passé.
*/
function valide_inscription($id){
    $res = bdd()->query("SELECT * FROM `inscription` WHERE `id`={$id}");
    
    $infos = $res->fetch();
    if($infos){
        $prenom = $infos['firstname'];
        $nom = $infos['name'];
        $birth_date = $infos['birth_date'];
        $email = $infos['email'];
        $login = $infos['login'];
        $password = $infos['password'];
        user_registration($login, $password, $password, $birth_date, $nom, $prenom, $email, 4);
        supprime_inscription($id);
        return true;
    }
    return false;
}

/**
    Fonction qui supprime une demande d'inscription.

    @param id : id de l'abonné.

    @return un booléen indiquant si tout s'est bien passé.
*/
function supprime_inscription($id){
    if(bdd()->query("DELETE FROM `inscription` WHERE `id`={$id}")){
        return true;
    }
    return false;
}

switch ($_GET['function']) {
    case 'create':      // login, password, confirm, date, name, firstname, email, type
        $res = user_registration($_GET['login'], $_GET['password'], $_GET['confirm'], $_GET['date'], $_GET['name'], $_GET['firstname'], $_GET['email'], $_GET['type']);
        break;
        case 'createEmploye':      // login, date, name, firstname, email, type
        $res = employe_registration($_GET['login'], $_GET['date'], $_GET['name'], $_GET['firstname'], $_GET['email'], $_GET['type']);
        break;
    case 'signin':      // login, password
        $res = user_log_in($_GET['login'], $_GET['password']);
        break;
    case 'authentification':      // login, password
        $res = user_infos($_GET['login'], $_GET['password']);
        break;
    case 'usertypes':
        $res = fetch_user_types();
        break;
    case 'users':
        $res = fetch_users();
        break;
    case 'user':     // id
        $res = fetch_user($_GET['id']);
        break;
    case 'bytype':     // type
        $res = fetch_users_by_type($_GET['type']);
        break;
    case 'update':     // id, email, login
        $res = modify_user_data($_GET['id'], $_GET['email'], $_GET['login'], $_GET['name'], $_GET['firstname'], $_GET['date']);
        break;
    case 'updatepwd':     // id, old, new, confirm
        $res = modify_user_password($_GET['id'], $_GET['old'], $_GET['new'], $_GET['confirm']);
        break;
    case 'delete':     // id
        $res = delete_user($_GET['id']);
        break;
    case 'isFree':     //++++
        $res = is_free_user($_GET['id'], $_GET['beginning'], $_GET['end']);
        break;
    case 'freeDrivers':
        $res = find_drivers_free($_GET['beginning'], $_GET['end']);
        break;
    case 'freeUsers':
        $res = find_users_free($_GET['beginning'], $_GET['end']);
        break;
    case 'inscription':
        $res = abonne_inscription($_GET['prenom'], $_GET['nom'], $_GET['email'], $_GET['birth_date'], $_GET['login'], $_GET['password']);
        break;
    case 'fetch_inscriptions':
        $res = fetch_inscriptions();
        break;
    case 'valide_inscription':
        $res = valide_inscription($_GET['id']);
        break;
    case 'refuse_inscription':
        $res = supprime_inscription($_GET['id']);
        break;
    default:
        $res = "invalid function";
        break;
}


echo json_encode($res);

/* ======================== Tests ========================

fetch("http://localhost/projetL2S4/src/services/users/users.php?function=create&login=Guigui&password=1234&confirm=1234&date=2002-11-30&name=Rey&firstname=Guillaume&email=grey02@orange.fr&type=2").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=signin&login=Guigui&password=1234").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=usertypes").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=user&id=4").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=bytype&type=2").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=update&id=4&email=grey02@orange.fr&login=Moi").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=updatepwd&id=4&old=1234&new=12345&confirm=12345").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=delete&id=4").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=isFree&id=4&beginning=2023-04-27%2000:00:00&end=2023-04-27%2004:45:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=freeUsers&beginning=2023-02-27%2000:00:00&end=2023-02-27%2004:45:00").then(response => response.json()).then(response => console.log(response))
fetch("http://localhost/projetL2S4/src/services/users/users.php?function=freeDrivers&beginning=2023-02-27%2000:00:00&end=2023-02-27%2004:45:00").then(response => response.json()).then(response => console.log(response))

*/