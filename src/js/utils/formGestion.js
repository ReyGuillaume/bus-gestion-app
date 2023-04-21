export function valueFirstElementChecked (selector) {
    for (var elem of document.querySelectorAll(selector)) {
        if (elem.checked) {
            return elem.value;
        }
    }
}