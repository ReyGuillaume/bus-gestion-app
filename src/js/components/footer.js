import { create } from "../utils/domManipulation";

export const createFooter = () => {
    const f = document.querySelector("#footer")
    f.replaceChildren("")
    const list = create("ul", f, null, ['footerList'])
    const items = ["Conditions générales", "A propos", "Prendre rendez-vous"]
    items.forEach(item => create("li", list, item, ['footerList__item']))
    return f;
}