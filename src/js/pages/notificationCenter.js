import {create, createChampRadio} from "../main";
import axios from "axios";

export const toggleNotificationCenter = () => {
    const main = document.querySelector("#app")
    main.replaceChildren("")


    const nav = create("nav", main, null, ['navNotif'])



}