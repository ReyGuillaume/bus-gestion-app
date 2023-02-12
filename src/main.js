import './assets/style/main.css'
import {createTables, create} from './js/main'

import axios from 'axios'

axios.defaults.baseURL = "http://localhost/projetL2S4/src/services"

createTables()