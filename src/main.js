import './assets/style/main.css'
import {createTables, create} from './js/main'
import { createHeader } from './js/components/header'
import { createFooter } from './js/components/footer'

import axios from 'axios'
import { toggleAccueil } from './js/pages/accueil'

axios.defaults.baseURL = "http://localhost/projetL2S4/src/services"

// Appel à la création des tables
createTables()

// Appel aux composants de la page principale
createHeader()
createFooter()

toggleAccueil()