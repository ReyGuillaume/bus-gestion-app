import { create } from "../utils/domManipulation"

const createMenuElement = (container, redirectFunction, backgroundColor, imgSrc, imgAlt, elementText) => {
    const div = create("div", container, null, ["navBar_container"])
    div.onclick = redirectFunction
    const logo = create("div", div, null, ["navBar_image", backgroundColor])
    create("img", logo, null, null, null, imgSrc, imgAlt)
    create("div", div, elementText, ['navBar__item'])
}

export {
    createMenuElement
}