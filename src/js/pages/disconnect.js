import { createHeader } from "../components/header";

export const disconnectUser = () => {
    // Delete the session variables "id", "prenom", "nom", "role", and "idrole"
    sessionStorage.removeItem("userData");
    createHeader();
    window.location.href = "/";
}