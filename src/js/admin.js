// bouton d'envoi du formulaire d'authentification
let btn = document.querySelector("#addUserForm #submitConnexion");

// afficher l'erreur en créant une fenêtre
function affichage_erreur(erreur){
    let affiche_erreur = document.querySelector(".fenetre_alerte");
    let affichage_phrase = document.querySelector(".fenetre_alerte p");
    let menu = document.querySelector(".side-nav");
    let marche = document.querySelector("main");
    let formulaire = document.querySelector("#addUserForm");

    menu.classList.add("cache");
    marche.classList.add("cache");
    formulaire.classList.add("cache");
    affiche_erreur.classList.remove("invisible");

    if (erreur == "connexion"){
        affichage_phrase.innerHTML = "Le formulaire est invalide !";
    }
}

// quand on envoie le formulaire :
btn.addEventListener("click", function(){
    let login = document.querySelector("#login").value;
    let password = document.querySelector("#password").value;

    // on récupère les identifiants de connexion
    axios.get("../../services/users/users.php?function=signin&login="+login+"&password="+password).then(function(response){
        let user = response.data;
        
        // si l'utilisateur a bien été trouvé :
        if(user){
            let nom = user.lastname;
            let prenom = user.firstname;
            let role = user.name;
            axios.get("../../services/users/connect_user.php?nom="+nom+"&prenom="+prenom+"&role="+role).then(function(response){
                window.location.href='presentation.php';
            })
        }
        else{
            //alert("Formulaire invalide");
            affichage_erreur("connexion");
        }
    });
});

let bouton_erreur = document.querySelector("#BoutonErreur");
let affiche_erreur = document.querySelector(".fenetre_alerte");


let menu = document.querySelector(".side-nav");
let marche = document.querySelector("main");
let formulaire = document.querySelector("#addUserForm");

bouton_erreur.addEventListener("click",function(){
    affiche_erreur.classList.add("invisible");
    menu.classList.remove("cache");
    marche.classList.remove("cache");
    formulaire.classList.remove("cache");
})