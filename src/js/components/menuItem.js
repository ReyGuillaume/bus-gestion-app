import { create } from "../utils/domManipulation"

const createMenuElement = (container, redirectFunction, backgroundColor, imgSrc, imgAlt, elementText) => {
    const div = create("button", container, null, ["navBar_container", "unstyled-button"])
    div.onclick = redirectFunction
    div.title = elementText
    const logo = create("div", div, null, ["navBar_image", backgroundColor])
    create("img", logo, null, null, null, imgSrc, imgAlt)
    create("div", div, elementText, ['navBar__item'])
}

export {
    createMenuElement
}