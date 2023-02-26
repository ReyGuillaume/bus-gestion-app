import { createHeader } from "../components/header";
import { toggleAccueil } from "./accueil";

export const disconnectUser = () => {
    // Delete the session variables "id", "prenom", "nom", "role", and "idrole"
    sessionStorage.removeItem("userData");
    createHeader();
    toggleAccueil();
}