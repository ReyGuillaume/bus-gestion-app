import './assets/style/main.css'
import {createTables, create} from './js/main'
import { createHeader } from './js/components/header'
import { createFooter } from './js/components/footer'

import axios from 'axios'

import Navigo from 'navigo'
import { toggleAccueil } from './js/pages/accueil'
import { toggleAgenda } from './js/pages/agenda'
import { toggle404 } from './js/pages/404'

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
router.on('*', toggle404)
router.resolve()