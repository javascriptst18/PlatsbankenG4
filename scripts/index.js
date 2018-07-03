import "babel-polyfill";
import '../scss/normalize.scss';
import '../scss/style.scss';

import { displayJSON } from '../scripts/network';
import { test } from '../scripts/network';

test();

let page = 1;
let numberOfRows = 10;
let totalNumberOfRows = 0;

  async function fetchJson(url) {
    try {
      const result = await (await fetch(url)).json();
      return result;
    }
    catch (e) {
      console.log(e);
    }
  }
  //Gets job ads based on input paramteres
  async function findAds(countyID, searchWord, workArea) {
    let queryString = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=" + searchWord + "&yrkesomradeid=" + workArea + "&sida=" + page + "&antalrader=" + numberOfRows;
    if (countyID != 1000) {
      queryString += "&lanid=" + countyID;
    };
    getCounty();
    const jobs = await fetchJson(queryString);
    totalNumberOfRows = jobs.matchningslista.antal_sidor;
    console.log(totalNumberOfRows);
    displayJSON(jobs.matchningslista.matchningdata);
  }
  //Gets a list of countys from arbetsförmedlingens api
  async function getCounty() {
    const result = await fetchJson("http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan");
    return result;
  }
  //Gets a list of work areas (eg data/it = 3 etc) from arbetsförmedlingens api
  async function getWorkArea() {
    const result = await fetchJson("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden");
    return result;
  }


/*
* HTML manipulation
*/
let html = {
  //Displays job json in html dom
  
  //Fills the county select dropdown menu with items
  async populateCountySelectDropDown() {
    const dropDownArea = document.querySelector("#dropDownArea");
    let row = document.createElement("option");
    row.textContent = "Alla län";
    row.value = 1000;
    dropDownArea.appendChild(row);
    let listOfCountys = await getCounty();
    for (let county of listOfCountys.soklista.sokdata) {
      let row = document.createElement("option");
      row.textContent = county.namn;
      row.value = county.id;
      dropDownArea.appendChild(row);
    }
    dropDownArea.value = 1000;
  },

  async populateWorkAreaDropDown() {
    const dropDownArea = document.querySelector("#dropDownWorkArea");
    let listOfWorkAreas = await getWorkArea()
    for (let workArea of listOfWorkAreas.soklista.sokdata) {
      let row = document.createElement("option");
      row.textContent = workArea.namn;
      row.value = workArea.id;
      dropDownArea.appendChild(row);
    }
  }
}

/*
* Event listeners
*/
const searchButton = document.querySelector("#getLink");
searchButton.addEventListener("submit", function (event) {
  event.preventDefault();
  findAds(this.dropDownArea.value, this.linkUrl.value, this.dropDownWorkArea.value);
  document.querySelector(".nextPageButton")
});

/*
* Utility functions (formatting etc)
*/
let utility = {
  //Formats inputdate from json from UTC to "en-gb"
  formatDate(input) {
    //Converts input from string to Date and then formats date as "en-gb" (dd/mm/yyyy)
    let formattedDate = new Date(input).toLocaleDateString("en-gb");
    //Return the formatted date
    return formattedDate;
  }
}

window.onload = init();

function init() {
  html.populateCountySelectDropDown();
  html.populateWorkAreaDropDown();
};