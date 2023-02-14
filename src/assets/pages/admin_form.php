<?php

include("../entete/entete.php");

if(isset($_GET["action"])){
    $action=$_GET["action"] ;
    if($action=="disconnect"){ /* déconnexion */
        unset($_SESSION["nom"]);
        unset($_SESSION["prenom"]);
        unset($_SESSION["role"]);
        header("Location: ../../assets/pages/presentation.php");
    }
    else if($action=="erreur"){
        echo "<p class='erreur'>Veuillez saisir des informations valides !</p>";
    }
}

?>

<main>

<div id="addUserForm">
		<p>
			<label>Login</label>
			<input type="text" id="login">
		</p>
        <p>
			<label>Password</label>
			<input type="text" id="password">
		</p>
		<p>
			<button id="submitConnexion">Connexion</button>
		</p>
</div>

</main>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="../../js/admin.js"></script>
</html>