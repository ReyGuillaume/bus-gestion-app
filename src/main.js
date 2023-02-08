import './assets/style/main.css'
import createTables from './js/main'

import axios from 'axios'

axios.defaults.baseURL = "http://localhost/livrable-gobus/src/services"

createTables()

// const app = document.querySelector('#app')
