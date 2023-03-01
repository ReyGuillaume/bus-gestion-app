<?php
// accès à une fonction bdd() qui renvoie une instance de PDO
include "./connexion.php";

/**
 * Execute la requête SQL qui crée la table BusType
 */
function create_table_bus_type() {
    $sql = "CREATE TABLE IF NOT EXISTS BusType (
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
    $sql = "CREATE TABLE IF NOT EXISTS Bus (
        `id` INT NOT NULL AUTO_INCREMENT,
        `id_bus_type` INT NOT NULL, 
        CONSTRAINT pk_bus PRIMARY KEY (id),
        CONSTRAINT fk_bus_typ FOREIGN KEY (id_bus_type) REFERENCES BusType (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Line
 */
function create_table_line() {
    $sql = "CREATE TABLE IF NOT EXISTS `Line` (
        `number` INT NOT NULL AUTO_INCREMENT,
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
    $sql = "CREATE TABLE IF NOT EXISTS TimeSlotType (
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
    $sql = "CREATE TABLE IF NOT EXISTS TimeSlot (
        `id` INT NOT NULL AUTO_INCREMENT,
        `begining` DATETIME NOT NULL,
        `end` DATETIME NOT NULL,
        `id_time_slot_type` INT NOT NULL,
        CONSTRAINT pk_timeslot PRIMARY KEY (id),
        CONSTRAINT fk_timeslot FOREIGN KEY (id_time_slot_type) REFERENCES TimeSlotType (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table UserType
 */
function create_table_user_type() {
    $sql = "CREATE TABLE IF NOT EXISTS UserType (
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
    $sql = "CREATE TABLE IF NOT EXISTS Code (
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
    $sql = "CREATE TABLE IF NOT EXISTS User (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `birth_date` DATE,
        `email` VARCHAR(255) NOT NULL,
        `id_user_type` INT NOT NULL,
        `login` VARCHAR(50) NOT NULL,
        CONSTRAINT pk_user PRIMARY KEY (id),
        CONSTRAINT fk_user_usertype FOREIGN KEY (id_user_type) REFERENCES UserType (id),
        CONSTRAINT fk_user_log FOREIGN KEY (login) REFERENCES Code (login),
        CONSTRAINT uq_user_email UNIQUE (email)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table Bus_TimeSlot
 */
function create_table_bus_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS Bus_TimeSlot (
        `id_bus` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        CONSTRAINT pk_bustimeslot PRIMARY KEY (id_bus, id_time_slot),
        CONSTRAINT fk_bustimeslot_bus FOREIGN KEY (id_bus) REFERENCES Bus (id),
        CONSTRAINT fk_bustimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES TimeSlot (id)
    )";
    $stm = bdd()->query($sql);
}

/**
 * Execute la requête SQL qui crée la table User_TimeSlot
 */
function create_table_user_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS User_TimeSlot (
        `id_user` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        CONSTRAINT pk_usertimeslot PRIMARY KEY (id_user, id_time_slot),
        CONSTRAINT fk_usertimeslot_user FOREIGN KEY (id_user) REFERENCES User (id),
        CONSTRAINT fk_usertimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES TimeSlot (id)
    )";
    $stm = bdd()->query($sql);
}


/**
 * Execute la requête SQL qui crée la table Line_TimeSlot
 */
function create_table_line_time_slot() {
    $sql = "CREATE TABLE IF NOT EXISTS Line_TimeSlot (
        `num_line` INT NOT NULL,
        `id_time_slot` INT NOT NULL,
        `direction` ENUM('aller','retour'),
        CONSTRAINT pk_linetimeslot PRIMARY KEY (num_line, id_time_slot),
        CONSTRAINT fk_linetimeslot_numline FOREIGN KEY (num_line) REFERENCES `Line` (`number`),
        CONSTRAINT fk_linetimeslot_timeslot FOREIGN KEY (id_time_slot) REFERENCES TimeSlot (id)
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
create_table_bus_time_slot();
create_table_user_time_slot();
create_table_line_time_slot();


// ==================== Instanciation des types de créneaux ====================
$timeSlotTypes = array('Conduite', 'Réunion', 'Indisponibilité');

foreach ($timeSlotTypes as $type) {
    $sql = "INSERT INTO TimeSlotType (`name`) VALUE ('{$type}')";
    bdd()->query($sql);
}


// ==================== Instanciation des types d'utilisateurs ====================
$userTypes = array('Directeur', 'Responsable Logistique', 'Conducteur');

foreach ($userTypes as $type) {
    $sql = "INSERT INTO UserType (`name`) VALUE ('{$type}')";
    bdd()->query($sql);
}


// ==================== Instanciation des types de bus ====================
$busTypes = array(
    "grand" => 50,
    "petit" => 20
);

foreach ($busTypes as $name => $nbPlaces) {
    $sql = "INSERT INTO BusType (`name`, `nb_places`) VALUE ('{$name}', {$nbPlaces})";
    bdd()->query($sql);
}

// ==================== Instanciation des lignes de bus ====================
$busLines = array(60, 60, 60, 60);

foreach ($busLines as $time) {
    $sql = "INSERT INTO `Line` (`travel_time`) VALUE ({$time})";
    bdd()->query($sql);
}