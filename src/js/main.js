import axios from 'axios'

export default function createTables() {
    axios.get("createTables.php")
}