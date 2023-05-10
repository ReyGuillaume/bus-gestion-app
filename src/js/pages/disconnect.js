import { createHeader } from "../components/header";
import { redirect } from "../utils/redirection";

const disconnectUser = () => {
    // Delete the session variables "id", "prenom", "nom", "role", and "idrole"
    sessionStorage.removeItem("userData");
    createHeader();
    redirect("/")
}

export { disconnectUser }