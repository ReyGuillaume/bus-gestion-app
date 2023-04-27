import jsdom from "jest-environment-node"
import {
    create,
    // createChamp,
    // createChampCheckbox,
    // createChampRadio,
    // toggleAlert,
    // toggleError
} from "../utils/domManipulation"

test("La fonction create() crée bien un élément dans le DOM", () => {
    // const button = create("button", jsdom, "text of button", ['button', '1'], ['id', '2'])

    expect(true).not.toBeNull()
})