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
function modify_user_data($id, $email, $login) {
    $sql = "SELECT * FROM User u JOIN Code c ON u.login = c.login WHERE u.id = {$id}";
    $user = bdd()->query($sql);
    if ($user) {
        $user = $user->fetch();
        $old_login = $user['login'];
        $pwd = $user['password'];
        bdd()->query("UPDATE `user` SET `email`='{$email}' WHERE id = {$id}");
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



switch ($_GET['function']) {
    case 'create':      // login, password, confirm, date, name, firstname, email, type
        $res = user_registration($_GET['login'], $_GET['password'], $_GET['confirm'], $_GET['date'], $_GET['name'], $_GET['firstname'], $_GET['email'], $_GET['type']);
        break;
    case 'signin':      // login, password
        $res = user_log_in($_GET['login'], $_GET['password']);
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
        $res = modify_user_data($_GET['id'], $_GET['email'], $_GET['login']);
        break;
    case 'updatepwd':     // id, old, new, confirm
        $res = modify_user_password($_GET['id'], $_GET['old'], $_GET['new'], $_GET['confirm']);
        break;
    case 'delete':     // id
        $res = delete_user($_GET['id']);
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

*/