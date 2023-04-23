import axios from 'axios';
import { create, toggleAlert, toggleError, createChampCheckbox } from '../main';

export function valueFirstElementChecked (selector) {
    for (var elem of document.querySelectorAll(selector)) {
        if (elem.checked) {
            return elem.value
        }
    }
}

export const idOfAllElementChecked = (selector) => {
    let res = ""
    for(let elem of document.querySelectorAll(selector)){
        if (elem.checked) {
            res += res != "" ? "," : ""   // ajout ',' si res non vide
            res += elem.value
        }
    }
    return res
}

export const fetchUrlRedirectAndAlert = (url, redirectFunction, successMessage, failurMessage) => {
    axios.get(url).then(response => {
        redirectFunction()
        response.data ? toggleAlert("BRAVO", successMessage) : toggleError("ERREUR", failurMessage)
    })
}


export const createCheckboxOfElement = (container, elt, checkboxName) => {
    createChampCheckbox(container, elt.id , checkboxName, elt.id);
    var label = create("label", container, elt.id );
    label.setAttribute("for", elt.id);
}


export const createCheckBoxOfElements = (axiosRequet, axiosRequestFetchchElement, container, checkBoxName, labelTextFunction) => {
    axios.get(axiosRequet).then(response => {
        for(var elt_id of response.data){
            axios.get(axiosRequestFetchchElement + elt_id).then(res => {
                let elt = res.data;
                createChampCheckbox(container, elt.id , checkBoxName, elt.id);
                var label = create("label", container, labelTextFunction(elt));
                label.setAttribute("for", elt.id);
            })
        }
    })
}