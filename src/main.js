import './assets/style/main.css'
import { createHeader } from './js/components/header'
import { createFooter } from './js/components/footer'
import { router } from './js/router/router'

import axios from 'axios'

axios.defaults.baseURL = "http://localhost/projetL2S4/src/services"

// Exécute l'appel à la base de donnée pour créer toutes les tables si elle ne le sont pas déjà.
axios.get("createTables.php")

router.resolve()

// Appel aux composants de la page principale
createHeader()
createFooter()