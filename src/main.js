import './assets/style/main.css'
import { createHeader } from './js/components/header'
import { createFooter } from './js/components/footer'

import axios from 'axios'

import Navigo from 'navigo'
import { toggleAccueil } from './js/pages/accueil'
import { toggleAdminForm, toggleInscriptionForm } from './js/pages/adminForm'
import { disconnectUser } from './js/pages/disconnect'
import { toggle404 } from './js/pages/404'
import { toggleEspaceAdmin, toggleGestionBus, toggleGestionLigne, toggleGestionUsers, toggleReservation, toggleInscriptions } from './js/pages/espaceAdmin'
import { toggleEspaceUser } from './js/pages/espaceUser'
import {toggleEspaceAbonne, toggleInfoAbonne} from './js/pages/espaceAbonne'
import { toggleNotificationCenter } from './js/pages/notificationCenter'
import { toggleAddCreneau } from './js/pages/gestionTimeslots'
import { toggleAjoutUser, toggleModifyUser, toggleSupprimeUser } from './js/pages/gestionUsers'
import { AjoutBus, DisponibilityBus, ModifBus, SupprimerBus } from './js/pages/gestionBuses'
import { toggleAddLine, toggleAddLineType, toggleModifLine, toggleModifLineType, toggleRemplissageAutoConduiteSemaine, toggleSupprLine, toggleVerifCouvertureSemaine } from './js/pages/gestionLigne'

axios.defaults.baseURL = "http://localhost/projetL2S4/src/services"

// Exécute l'appel à la base de donnée pour créer toutes les tables si elle ne le sont pas déjà.
axios.get("createTables.php")

// Appel aux composants de la page principale
createHeader()
createFooter()

// Initialisation du router
const router = new Navigo('/')
router.on('/', toggleAccueil)
router.on('/espace-admin', toggleEspaceAdmin)
router.on('/espace-utilisateur', toggleEspaceUser)
router.on('/espace-abonne', toggleEspaceAbonne)
router.on('/espace-informations-abonne', toggleInfoAbonne)
router.on('/connexion', toggleAdminForm)
router.on('/inscription', toggleInscriptionForm)
router.on('/disconnect', disconnectUser)
router.on('/notification-center', toggleNotificationCenter)
router.on('/creneau', toggleAddCreneau)

router.on('/utilisateurs', toggleGestionUsers)
router.on('/utilisateurs/ajout', toggleAjoutUser)
router.on('/utilisateurs/modification', toggleModifyUser)
router.on('/utilisateurs/suppression', toggleSupprimeUser)

router.on('/bus', toggleGestionBus)
router.on('/bus/disponibilite', DisponibilityBus)
router.on('/bus/ajout', AjoutBus)
router.on('/bus/modification', ModifBus)
router.on('/bus/suppression', SupprimerBus)

router.on('/lignes', toggleGestionLigne)
router.on('/lignes/ajout', toggleAddLine)
router.on('/lignes/modification', toggleModifLine)
router.on('/lignes/suppression', toggleSupprLine)
router.on('/lignes/couverture-verification', toggleVerifCouvertureSemaine)
router.on('/lignes/remplissage', toggleRemplissageAutoConduiteSemaine)
router.on('/lignes/ajout-type', toggleAddLineType)
router.on('/lignes/modification-type', toggleModifLineType)
router.on('/lignes/suppression-type', toggleSupprLine)

router.on('/reservation', toggleReservation)
router.on('/inscriptions', toggleInscriptions)

router.on('*', toggle404)
router.resolve()
