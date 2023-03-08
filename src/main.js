import './assets/style/main.css'
import { createTables } from './js/main'
import { createHeader } from './js/components/header'
import { createFooter } from './js/components/footer'

import axios from 'axios'

import Navigo from 'navigo'
import { toggleAccueil } from './js/pages/accueil'
import { toggleAgenda } from './js/pages/agenda'
import { toggleAdminForm } from './js/pages/adminForm'
import { disconnectUser } from './js/pages/disconnect'
import { toggle404 } from './js/pages/404'
import { toggleEspaceAdmin } from './js/pages/espaceAdmin'
import {toggleEspaceUser} from './js/pages/espaceUser'

axios.defaults.baseURL = "http://localhost/projetL2S4/src/services"

// Appel à la création des tables
createTables()

// Appel aux composants de la page principale
createHeader()
createFooter()

// Initialisation du router
const router = new Navigo('/')
router.on('/', toggleAccueil)
router.on('/agenda', toggleAgenda)
router.on('/espaceAdmin', toggleEspaceAdmin)
router.on('/espaceUser', toggleEspaceUser)
router.on('/adminForm', toggleAdminForm)
router.on('/disconnect', disconnectUser)
router.on('*', toggle404)
router.resolve()