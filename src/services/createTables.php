<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include "./connexion.php";

/**
 * Execute la requête SQL qui crée la table BusType
 */
function create_table_bus_type() {
    $sql = "CREATE TABLE IF NOT EXISTS bustype (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50),
        `nb_places` int NOT NULL,
        CONSTRAINT pk_bustype PRIMARY KEY (id),
        CONSTRAINT uq_bustype_nameplaces UNIQUE (name, nb_places)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Bus
 */
function create_table_bus() {
    $sql = "CREATE TABLE IF NOT EXISTS bus (
        `id` INT NOT NULL AUTO_INCREMENT,
        `id_bus_type` INT NOT NULL, 
        CONSTRAINT pk_bus PRIMARY KEY (id),
        CONSTRAINT fk_bus_typ FOREIGN KEY (id_bus_type) REFERENCES bustype (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Line
 */
function create_table_line() {
    $sql = "CREATE TABLE IF NOT EXISTS `line` (
        `number` INT NOT NULL,
        `travel_time` INT NOT NULL,
        CONSTRAINT pk_line PRIMARY KEY (`number`),
        CONSTRAINT uq_line_traveltime UNIQUE (`number`, travel_time)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table TimeSlotType
 */
function create_table_time_slot_type() {
    $sql = "CREATE TABLE IF NOT EXISTS timeslottype (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        CONSTRAINT pk_timeslottype PRIMARY KEY (id),
        CONSTRAINT uq_timeslottype_name UNIQUE (name)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table TimeSlot
 */
function create_table_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS timeslot (
        `id` INT NOT NULL AUTO_INCREMENT,
        `begining` DATETIME NOT NULL,
        `end` DATETIME NOT NULL,
        `id_time_slot_type` INT NOT NULL,
        CONSTRAINT pk_timeslot PRIMARY KEY (id),
        CONSTRAINT fk_timeslot FOREIGN KEY (id_time_slot_type) REFERENCES timeslottype (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table UserType
 */
function create_table_user_type() {
    $sql = "CREATE TABLE IF NOT EXISTS usertype (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        CONSTRAINT pk_usertype PRIMARY KEY (id),
        CONSTRAINT uq_usertype_name UNIQUE (name)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Code
 */
function create_table_code() {
    $sql = "CREATE TABLE IF NOT EXISTS code (
        `login` VARCHAR(50) NOT NULL,
        `password` VARCHAR(64) NOT NULL,
        CONSTRAINT pk_code PRIMARY KEY (login),
        CONSTRAINT uq_code_logpwd UNIQUE (login, password)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table User
 */
function create_table_user() {
    $sql = "CREATE TABLE IF NOT EXISTS `user` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `birth_date` DATE,
        `email` VARCHAR(50) NOT NULL,
        `id_user_type` INT NOT NULL,
        `login` VARCHAR(50) NOT NULL,
        CONSTRAINT pk_user PRIMARY KEY (id),
        CONSTRAINT fk_user_usertype FOREIGN KEY (id_user_type) REFERENCES usertype (id),
        CONSTRAINT fk_user_log FOREIGN KEY (login) REFERENCES code (login),
        CONSTRAINT uq_user_email UNIQUE (email)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Bus_TimeSlot
 */
function create_table_bus_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS bus_timeslot (
        `id_bus` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        CONSTRAINT pk_bustimeslot PRIMARY KEY (id_bus, id_time_slot),
        CONSTRAINT fk_bustimeslot_bus FOREIGN KEY (id_bus) REFERENCES bus (id),
        CONSTRAINT fk_bustimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES timeslot (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table User_TimeSlot
 */
function create_table_user_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS user_timeslot (
        `id_user` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        CONSTRAINT pk_usertimeslot PRIMARY KEY (id_user, id_time_slot),
        CONSTRAINT fk_usertimeslot_user FOREIGN KEY (id_user) REFERENCES user (id),
        CONSTRAINT fk_usertimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES timeslot (id)
    )";
    $stm = bdd()->query($sql);
}


/**
 * Execute la requête SQL qui crée la table Line_TimeSlot
 */
function create_table_line_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS line_timeslot (
        `num_line` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        `direction` ENUM('aller','retour'),
        CONSTRAINT pk_linetimeslot PRIMARY KEY (num_line, id_time_slot),
        CONSTRAINT fk_linetimeslot_numline FOREIGN KEY (num_line) REFERENCES `line` (`number`),
        CONSTRAINT fk_linetimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES timeslot (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table LineType
 */
function create_table_line_type() {
    $sql = "CREATE TABLE IF NOT EXISTS linetype (
        `id_type` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL UNIQUE,
        CONSTRAINT pk_lineType PRIMARY KEY (id_type)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table LineType_Line
 */
function create_table_lineType_line() {
    $sql = "CREATE TABLE IF NOT EXISTS linetype_line (
        `id_type` INT NOT NULL,
        `num_line` INT NOT NULL,
        CONSTRAINT pk_lineType PRIMARY KEY (num_line),
        CONSTRAINT fk_linetypeline_numline FOREIGN KEY (num_line) REFERENCES `line` (`number`),
        CONSTRAINT fk_linetypeline_idtype FOREIGN KEY (id_type) REFERENCES `linetype` (`id_type`)
    )";
    $stm = bdd()->query($sql);
}

function create_table_creneau_couverture(){
    $sql = "CREATE TABLE IF NOT EXISTS linetypeconditions (
        `id_type` INT NOT NULL,
        `begin` TIME NOT NULL,
        `end` TIME NOT NULL,
        `intervalle` INT NOT NULL,
        CONSTRAINT pk_LineTypeConditions PRIMARY KEY (id_type, begin, end ),
        CONSTRAINT fk_LineTypeConditions_idtype FOREIGN KEY (id_type) REFERENCES `linetype` (`id_type`)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table de notification
 * recipient = l'id du destinataire
 * date = la date d'envoi
 */
function create_table_notification() {
    $sql = "CREATE TABLE IF NOT EXISTS notification (
        `id_notif` INT NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(200) NOT NULL,
        `message` VARCHAR(500) NOT NULL,
        `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `recipient` INT NOT NULL,
        `status` ENUM('read','unread', 'archive'),
        CONSTRAINT pk_notification PRIMARY KEY (id_notif),
        CONSTRAINT fk_notification_user FOREIGN KEY (recipient) REFERENCES `user` (`id`)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table de reservation
 */
function create_table_reservation() {
    $sql = "CREATE TABLE IF NOT EXISTS reservation (
        `id_reserv` INT NOT NULL AUTO_INCREMENT,
        `arretDepart` VARCHAR(200) NOT NULL,
        `arretArrive` VARCHAR(500) NOT NULL,
        `dateDepart` DATETIME NOT NULL,
        `id_client` INT NOT NULL,
        `etat` ENUM('attente','valide', 'refuse') DEFAULT 'attente',
        CONSTRAINT pk_reservation PRIMARY KEY (id_reserv),
        CONSTRAINT fk_reservation_user FOREIGN KEY (id_client) REFERENCES `user` (`id`)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table reservation_timeslot
 */
function create_table_reservation_timeslot() {
    $sql = "CREATE TABLE IF NOT EXISTS reservation_timeslot (
        `id_reservation` INT NOT NULL,
        `id_timeslot` INT NOT NULL,
        CONSTRAINT pk_reservation_timeslot PRIMARY KEY (id_reservation, id_timeslot),
        CONSTRAINT fk_reservationtimesolt_reservation FOREIGN KEY (id_reservation) REFERENCES `reservation` (`id_reserv`),
        CONSTRAINT fk_reservationtimesolt_timeslot FOREIGN KEY (id_timeslot) REFERENCES `timeslot` (`id`)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table inscription
 */
function create_table_inscription() {
    $sql = "CREATE TABLE IF NOT EXISTS inscription (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `birth_date` DATE,
        `email` VARCHAR(255) NOT NULL,
        `login` VARCHAR(50) NOT NULL,
        `password` VARCHAR(64) NOT NULL,
        CONSTRAINT pk_inscr PRIMARY KEY (id)
    )";
    $stm = bdd()->query($sql);
}


/**
 * Execute la requête SQL qui crée la table arrets
 */

 function create_table_arret() {
    $sql = "CREATE TABLE IF NOT EXISTS arret (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(200) NOT NULL UNIQUE,
        CONSTRAINT pk_arret PRIMARY KEY (id)
    )";
    $stm = bdd()->query($sql);
}

// ==================== Création des tables de la base ====================
create_table_bus_type();
create_table_bus();
create_table_line();
create_table_time_slot_type();
create_table_time_slot();
create_table_user_type();
create_table_code();
create_table_user();
create_table_arret();
create_table_bus_time_slot();
create_table_user_time_slot();
create_table_line_time_slot();
create_table_line_type();
create_table_lineType_line();
create_table_creneau_couverture();
create_table_notification();
create_table_reservation();
create_table_reservation_timeslot();
// ==================== Instanciation des types de créneaux ====================
$timeSlotTypes = array('Conduite', 'Réunion', 'Indisponibilité', 'Réservation', 'Astreinte');

foreach ($timeSlotTypes as $type) {
    $sql = "INSERT INTO timeslottype (`name`) VALUE ('{$type}')";
    bdd()->query($sql);
}


// ==================== Instanciation des types d'utilisateurs ====================
$userTypes = array('Directeur', 'Responsable Logistique', 'Conducteur', 'Abonné');

foreach ($userTypes as $type) {
    $sql = "INSERT INTO usertype (`name`) VALUE ('{$type}')";
    bdd()->query($sql);
}

// ==================== Instanciation du compte directeur ====================
$pwd = hash("sha256", "01goBus!");
$sql = "INSERT INTO `code`(`login`, `password`) VALUES ('WaintalD', '{$pwd}')";
bdd()->query($sql);

$sql = "INSERT INTO `user`(`name`, `firstname`, `birth_date`, `email`, `id_user_type`, `login`) VALUES ('David', 'Waintal', '1980-01-01', 'gerant@gmail.com', 1, 'WaintalD')";
bdd()->query($sql);

// ==================== Instanciation des types de bus ====================
$busTypes = array(
    "grand" => 50,
    "petit" => 20
);

foreach ($busTypes as $name => $nbPlaces) {
    $sql = "INSERT INTO bustype (`name`, `nb_places`) VALUE ('{$name}', {$nbPlaces})";
    bdd()->query($sql);
}

// ==================== Instanciation des lignes de bus ====================
$busLines = array(
    1 => 60,
    2 => 60,
    3 => 60,
    4 => 60
);

foreach ($busLines as $num => $time) {
    $sql = "INSERT INTO `line` (`number`, `travel_time`) VALUE ({$num}, {$time})";
    bdd()->query($sql);
}

// ==================== Instanciation des types de ligne ====================

$lineType = array(
    1 => "principale",
    2 => "secondaire"
);

foreach ($lineType as $id => $name) {
    $sql = "INSERT INTO `linetype` (`id_type`, `name`) VALUE ({$id}, '{$name}')";
    bdd()->query($sql);
}

// ==================== Association des types de ligne de base ====================

$line_lineType = array(
   1 => 1,
   2 => 1, 
   3 => 2,
   4 => 2,
);

foreach ($line_lineType as $id_line => $id_type) {
    $sql = "INSERT INTO `linetype_line` (`id_type`, `num_line`) VALUE ({$id_type}, {$id_line})";
    bdd()->query($sql);
}
// ==================== Remplissage des creneau de couverture des types de ligne de base ====================

$sql = "INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE (1, '06:30:00', '20:30:00', 60)";
bdd()->query($sql);

$sql = "INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE (2, '07:00:00', '09:00:00', 60)";
bdd()->query($sql);

$sql = "INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE (2, '11:00:00', '13:30:00', 60)";
bdd()->query($sql);

$sql = "INSERT INTO `linetypeconditions` (`id_type`, `begin`, `end`, `intervalle`) VALUE (2, '17:00:00', '18:45:00', 60)";
bdd()->query($sql);
