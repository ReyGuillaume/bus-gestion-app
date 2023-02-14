<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Gobus</title>
    <link rel="stylesheet" href="../../styles/style.css"/>
</head>

<body>


<?php
session_start();
?>


<nav class="side-nav">
      <div class="wrapper">

      <div class="nav-bloc">

            <div class="sub-nav">

            <?php 
            if(isset($_SESSION["nom"])){
              echo "<p class='utilisateur'>Nom : ".$_SESSION["nom"]."</p>";
              echo "<p class='utilisateur' id='thune'>Prénom : ".$_SESSION["prenom"]."</p>";
              echo "<p class='utilisateur' id='thune'>Rôle : ".$_SESSION["role"]."</p>";
              echo "</div>";
              echo "</div>";

              echo "<div class='nav-bloc'>";
              echo "<div class='sub-nav'>";
              echo "<a href='../pages/admin_form.php?action=disconnect'>Déconnexion</a>";
              echo "</div>";
          }
          else{
            echo "<a href='../pages/admin_form.php'>Connexion</a>";
            echo "</div>";
          }
          ?>
            </div>
        

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/presentation.php">Présentation</a>
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/marche.php">???</a>
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/compo_hand.php">???</a>
        
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/compo_tennis.php">???</a>
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/compo_volley.php">???</a>
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/compo_judo.php">???</a>
          </div>
        </div>

        <div class="nav-bloc">
          <div class="sub-nav">
          <a href="../pages/classement.php">???</a>
          </div>
        </div>

      </div>
</nav>

<div class="fenetre_alerte invisible">
  <h1>ATTENTION</h1>
  <p></p>
  <button id="BoutonErreur">Fermer</button>
</div>