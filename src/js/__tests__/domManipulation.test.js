/**
 * @jest-environment jsdom
 */

import {
  create,
  createChamp,
  createChampCheckbox,
  createChampRadio,
} from "../utils/domManipulation";

test("La fonction create() crée bien un élément button dans le DOM", () => {
  const button = create(
    "button",
    document.body,
    "text of button",
    ["button", "1"],
    "id"
  );

  expect(document.contains(button)).toBe(true);
  expect(button).toBeInstanceOf(HTMLButtonElement);
  expect(button.textContent).toBe("text of button");
  expect(button.classList[1]).toBe("1");
  expect(button.id).toBe("id");
});

test("La fonction create() crée bien un élément img dans le DOM avec src et alt", () => {
  const image = create(
    "img",
    document.body,
    null,
    null,
    null,
    "./image.png",
    "mon image"
  );

  expect(document.contains(image)).toBe(true);
  expect(image).toBeInstanceOf(HTMLImageElement);
  expect(image.textContent).toBe("");
  expect(image.classList).toMatchObject({});
  expect(image.id).toBe("");
  expect(image.src.endsWith("/image.png")).toEqual(true);
  expect(image.alt).toEqual("mon image");
});

test("La fonction createChamp crée un input dans le DOM contenant le type, le nom et le placeholder indiqué", () => {
  const input = createChamp(
    document.body,
    "email",
    "mon nom",
    "mon placeholder"
  );

  expect(document.contains(input)).toBe(true);
  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input.type).toEqual("email");
  expect(input.name).toEqual("mon nom");
  expect(input.placeholder).toEqual("mon placeholder");
});

test("Par défaut, le type d'input créé par createChamp est un type text", () => {
  const input = createChamp(document.body);
  expect(input.type).toEqual("text");
});

test("createChampCheckbox crée bien un input[type=checkbox] avec les paramètres renseignés.", () => {
  const checkbox = createChampCheckbox(document.body, "monId", "mon nom", 123);

  expect(document.body.contains(checkbox)).toBe(true);
  expect(checkbox).toBeInstanceOf(HTMLInputElement);
  expect(checkbox.type).toEqual("checkbox");
  expect(checkbox.id).toEqual("monId");
  expect(checkbox.name).toEqual("mon nom");
  expect(checkbox.value).toBe("123");
});

test("createChampRadio crée un input de type radio avec les paramètres renseignés", () => {
  const radio = createChampRadio(document.body, "monId", "mon nom", 123);

  expect(document.body.contains(radio)).toBe(true);
  expect(radio).toBeInstanceOf(HTMLInputElement);
  expect(radio.type).toEqual("radio");
  expect(radio.id).toEqual("monId");
  expect(radio.name).toEqual("mon nom");
  expect(radio.value).toBe("123");
});
