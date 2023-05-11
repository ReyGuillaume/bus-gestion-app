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

const showLoading = () => {
    // Sélectionne l'élément qui contiendra le message de chargement
    const loadingElement = document.getElementById('loading');

    // Affiche le message de chargement
    loadingElement.innerText = 'Chargement en cours...';
    loadingElement.style.display = 'block';
};


const hideLoading = () => {
    const loading = document.getElementById("loading");
    if (loading) {
        loading.style.display = "none";
    }
}
  
const fetchUrlWithLoading = (url, route, successMessage, failureMessage) => {
    let isLoading = true;
    showLoading(); // Affiche la loading

    axios.get(url).then(response => {
        isLoading = false;
        hideLoading(); // Cache la loading
        var type = "failure";
        var alerte = { type, failureMessage }

        if (response.data) {
            var type = "success";
            alerte = { type, successMessage }
        }

        sessionStorage.setItem("alerte", JSON.stringify(alerte))

        var alerte_msg = JSON.parse(sessionStorage.getItem("alerte"))

        if(alerte_msg){
            const { type, message } = alerte_msg

            if(type == "success"){
                toggleAlert("BRAVO", message)
            }
            else{
                toggleError("ERREUR", message)
            }

            sessionStorage.removeItem("alerte")
        }



    }).catch(error => {
        isLoading = false;
        hideLoading(); // Cache la loading

        // Traitez l'erreur ici
        console.error(error);
    });
}

const createCheckboxOfElement = (container, text, checkboxName, letter) => {
    createChampCheckbox(container, letter+text , checkboxName, text);
    var label = create("label", container, text );
    label.setAttribute("for", letter+text);
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
    addslashes,
    fetchUrlWithLoading
}