import axios from 'axios';
import { create, toggleAlert, toggleError, createChampCheckbox } from './domManipulation';
import { redirectWithAlert } from './redirection';

function valueFirstElementChecked (selector) {
    for (var elem of document.querySelectorAll(selector)) {
        if (elem.checked) {
            return elem.value
        }
    }
}

const idOfAllElementChecked = (selector) => {
    let res = ""
    for(let elem of document.querySelectorAll(selector)){
        if (elem.checked) {
            res += res != "" ? "," : ""   // ajout ',' si res non vide
            res += elem.value
        }
    }
    return res
}

const fetchUrlRedirectAndAlert = (url, route, successMessage, failurMessage) => {
    axios.get(url).then(response => {
        if(response.data){
            redirectWithAlert(route, "success", successMessage)
        }
        else{
            redirectWithAlert(route, "failure", failurMessage)
        }
    })
}


const createCheckboxOfElement = (container, elt, checkboxName, letter) => {
    createChampCheckbox(container, letter+elt.id , checkboxName, elt.id);
    var label = create("label", container, elt.id );
    label.setAttribute("for", letter+elt.id);
}


const createCheckBoxOfElements = (axiosRequet, axiosRequestFetchchElement, container, checkBoxName, labelTextFunction, letter) => {
    axios.get(axiosRequet).then(response => {
        for(var elt_id of response.data){
            axios.get(axiosRequestFetchchElement + elt_id).then(res => {
                let elt = res.data;
                createChampCheckbox(container, letter+elt.id , checkBoxName, elt.id);
                var label = create("label", container, labelTextFunction(elt));
                label.setAttribute("for", letter+elt.id);
            })
        }
    })
}

const countElementChecked = (nom_selection) => {
    let nb = 0
    for(var type of document.querySelectorAll("input[name="+nom_selection+"]")){
        if(type.checked){
            nb += 1
        }
    }
    return nb
}


function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}


export {
    valueFirstElementChecked,
    idOfAllElementChecked,
    fetchUrlRedirectAndAlert,
    createCheckboxOfElement,
    createCheckBoxOfElements,
    countElementChecked,
    addslashes
}