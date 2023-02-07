import axios from 'axios'

export default function createTables() {
    axios.get("http://localhost/livrable-gobus/src/services/createTables.php")
}