import Navigo from 'navigo'

import { toggleAccueil } from '../pages/accueil'
import { toggleConnexion, toggleInscriptionForm } from '../pages/connect'
import { disconnectUser } from '../pages/disconnect'
import { toggle404 } from '../pages/404'
import { toggleEspaceAdmin, toggleGestionBus, toggleGestionLigne,toggleGestionArrets, toggleGestionUsers, toggleReservation, toggleInscriptions } from '../pages/espaceAdmin'
import { toggleEspaceUser } from '../pages/espaceUser'
import { toggleAddReservation, toggleDeleteReservation, toggleEspaceAbonne, toggleInfoAbonne, toggleSeeReservation, toggleUpdateReservation, toogleReservAbonne } from '../pages/espaceAbonne'
import {toggleAddArrets, toggleDeleteArret, toggleModifyArrets} from '../pages/gestionArrets'
import { toggleNotificationCenter } from '../pages/notificationCenter'
import { toggleAddCreneau } from '../pages/gestionTimeslots'
import { toggleAjoutUser, toggleModifyUser, toggleSupprimeUser } from '../pages/gestionUsers'
import { AjoutBus, DisponibilityBus, ModifBus, SupprimerBus } from '../pages/gestionBuses'
import { toggleAddLine, toggleAddLineType, toggleModifLine, toggleModifLineType, toggleRemplissageAutoConduiteSemaine, toggleSupprLine, toggleVerifCouvertureSemaine } from '../pages/gestionLigne'
import { toggleAgenda } from '../pages/agenda'
import { toggleIndisponibilitiForm } from '../pages/indisponibilitiForm'
import { changerInfoAbonne, changerMdpAbonne } from '../pages/gestionAbonne'
import { toggleConditionsGenerales } from '../components/footer'


// Initialisation du router
const router = new Navigo('/')

router.on('/', toggleAccueil)
router.on('/espace-admin', toggleEspaceAdmin)
router.on('/espace-utilisateur', toggleEspaceUser)
router.on('/espace-abonne', toggleEspaceAbonne)
router.on('/connexion', toggleConnexion)
router.on('/inscription', toggleInscriptionForm)
router.on('/disconnect', disconnectUser)
router.on('/notification-center', toggleNotificationCenter)

router.on('/conditions-generales', toggleConditionsGenerales)

router.on('/informations-utilisateur', toggleInfoAbonne)
router.on('/informations-utilisateur/informations', changerInfoAbonne)
router.on('/informations-utilisateur/mot-de-passe', changerMdpAbonne)

router.on('/agenda', toggleAgenda)

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
router.on('/indisponibilite', toggleIndisponibilitiForm)

router.on('/reservations', toogleReservAbonne)
router.on('/reservations/ajout', toggleAddReservation)
router.on('/reservations/modification', toggleUpdateReservation)
router.on('/reservations/suppression', toggleDeleteReservation)
router.on('/reservations/liste', toggleSeeReservation)

router.on('/reservation-abonne', toogleReservAbonne)
router.on('/reservation-abonne/ajout', toggleAddReservation)
router.on('/reservation-abonne/visualisation', toggleSeeReservation)

router.on('/arrets', toggleGestionArrets)
router.on('/arrets/ajout', toggleAddArrets)
router.on('/arrets/modification', toggleModifyArrets)
router.on('/arrets/suppression', toggleDeleteArret)

router.on('/inscriptions', toggleInscriptions)
router.on('*', toggle404)

export {router}