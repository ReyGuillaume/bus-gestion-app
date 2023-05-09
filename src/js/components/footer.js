import { create } from "../utils/domManipulation";

const createFooter = () => {
    const f = document.querySelector("#footer")
    f.replaceChildren("")
    const list = create("ul", f, null, ['footerList'])
    const items = ["Conditions générales", "A propos", "Prendre rendez-vous"]
    items.forEach(item => {
        const li = create("li", list)
        create("button", li, item, ['footerList__item', 'unstyled-button']).title = item
    })
    return f;
}

export {
    createFooter
}