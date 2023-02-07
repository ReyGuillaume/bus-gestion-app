<?php
// accès à une variable $db instance de PDO
// accès à une fonction bdd() qui renvoie cette instance de PDO
include "./connexion.php";

function create_table_code() {
    $sql = "CREATE TABLE IF NOT EXISTS Code (
        `id` INT NOT NULL AUTO_INCREMENT,
        `login` VARCHAR(50) NOT NULL,
        `password` VARCHAR(64) NOT NULL,
        CONSTRAINT pk_cod PRIMARY KEY (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_director() {
    $sql = "CREATE TABLE IF NOT EXISTS Director (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `id_code` INT NOT NULL,
        CONSTRAINT pk_dir PRIMARY KEY (id),
        CONSTRAINT fk_dir_code FOREIGN KEY (id_code) REFERENCES Code (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_manager() {
    $sql = "CREATE TABLE IF NOT EXISTS Manager (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `id_code` INT NOT NULL,
        CONSTRAINT pk_mana PRIMARY KEY (id),
        CONSTRAINT fk_mana_code FOREIGN KEY (id_code) REFERENCES Code (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_driver() {
    $sql = "CREATE TABLE IF NOT EXISTS Driver (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `firstname` VARCHAR(50) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `id_code` INT NOT NULL,
        CONSTRAINT pk_dri PRIMARY KEY (id),
        CONSTRAINT fk_dri_code FOREIGN KEY (id_code) REFERENCES Code (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_bus_type() {
    $sql = "CREATE TABLE IF NOT EXISTS BusType (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50),
        `nb_places` int NOT NULL,
        CONSTRAINT pk_bustype PRIMARY KEY (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_bus() {
    $sql = "CREATE TABLE IF NOT EXISTS Bus (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(50),
        `id_bus_type` INT NOT NULL, 
        CONSTRAINT pk_bus PRIMARY KEY (id),
        CONSTRAINT fk_bus_typ FOREIGN KEY (id_bus_type) REFERENCES BusType (id)
    )";
    $stm = bdd()->query($sql);
}


// function create_table_time_slot_type() {
//     $sql = "CREATE TABLE IF NOT EXISTS TimeSlotType (
//         `id` INT NOT NULL AUTO_INCREMENT,
//         `name` VARCHAR(50) NOT NULL,
//         CONSTRAINT pk_timeslottype PRIMARY KEY (id)
//     )";
//     $stm = bdd()->query($sql);
// }


// function create_table_time_slot() {
//     $sql = "CREATE TABLE IF NOT EXISTS TimeSlot (
//         `id` INT NOT NULL AUTO_INCREMENT,
//         `begining` DATETIME NOT NULL,
//         `end` DATETIME NOT NULL,
//         `id_time_slot_type` INT NOT NULL,
//         `id_driver` INT NOT NULL,
//         `id_bus` INT NOT NULL,
//         CONSTRAINT pk_timeslot PRIMARY KEY (id),
//         CONSTRAINT fk_timeslot_typ FOREIGN KEY (id_time_slot_type) REFERENCES TimeSlotType (id),
//         CONSTRAINT fk_timeslot_dri FOREIGN KEY (id_driver) REFERENCES Driver (id),
//         CONSTRAINT fk_timeslot_bus FOREIGN KEY (id_bus) REFERENCES Bus (id)
//     )";
//     $stm = bdd()->query($sql);
// }


function create_table_unavailability() {
    $sql = "CREATE TABLE IF NOT EXISTS Unavailability (
        `id` INT NOT NULL AUTO_INCREMENT,
        `begining` DATETIME NOT NULL,
        `end` DATETIME NOT NULL,
        `id_driver` INT NOT NULL,
        CONSTRAINT pk_unav PRIMARY KEY (id),
        CONSTRAINT fk_unav_dri FOREIGN KEY (id_driver) REFERENCES Driver (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_meeting() {
    $sql = "CREATE TABLE IF NOT EXISTS Meeting (
        `id` INT NOT NULL AUTO_INCREMENT,
        `begining` DATETIME NOT NULL,
        `end` DATETIME NOT NULL,
        `id_director` INT NOT NULL,
        CONSTRAINT pk_meet PRIMARY KEY (id),
        CONSTRAINT fk_meet_dir FOREIGN KEY (id_director) REFERENCES Director (id)
    )";
    $stm = bdd()->query($sql);
}


function create_table_driving() {
    $sql = "CREATE TABLE IF NOT EXISTS Driving (
        `id` INT NOT NULL AUTO_INCREMENT,
        `begining` DATETIME NOT NULL,
        `end` DATETIME NOT NULL,
        `id_driver` INT NOT NULL,
        `id_bus` INT NOT NULL,
        CONSTRAINT pk_driving PRIMARY KEY (id),
        CONSTRAINT fk_driving_dri FOREIGN KEY (id_driver) REFERENCES Driver (id),
        CONSTRAINT fk_driving_bus FOREIGN KEY (id_bus) REFERENCES Bus (id)
    )";
    $stm = bdd()->query($sql);
}

create_table_code();

create_table_director();
create_table_manager();
create_table_driver();

create_table_bus_type();
create_table_bus();

create_table_unavailability();
create_table_driving();
create_table_meeting();