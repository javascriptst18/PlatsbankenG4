let page = 1;
let numberOfRows = 10;
let totalNumberOfRows = 0;

/*
* Network calls
*/
let network = {
  //Fetches json data from input URL
  async fetchJson(url) {
    try {
      const result = await (await fetch(url)).json();
      return result;
    }
    catch (e) {
      console.log(e);
    }
  },
  //Gets job ads based on input paramteres
  async findAds(countyID, searchWord, workArea) {
    let queryString = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=" + searchWord + "&yrkesomradeid=" + workArea + "&sida=" + page + "&antalrader=" + numberOfRows;
    if (countyID != 1000) {
      queryString += "&lanid=" + countyID;
    };
    network.getCounty();
    const jobs = await network.fetchJson(queryString);
    totalNumberOfRows = jobs.matchningslista.antal_sidor;
    console.log(totalNumberOfRows);
    html.displayJSON(jobs.matchningslista.matchningdata);
  },
  //Gets a list of countys from arbetsförmedlingens api
  async getCounty() {
    const result = await network.fetchJson("http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan");
    return result;
  },
  //Gets a list of work areas (eg data/it = 3 etc) from arbetsförmedlingens api
  async getWorkArea() {
    const result = await network.fetchJson("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden");
    return result;
  }
}

/*
* HTML manipulation
*/
let html = {
  //Displays job json in html dom
  displayJSON(jsonObjectList) {
    document.querySelector("#inputContainer").innerHTML = "";
    for (let job of jsonObjectList) {
      let jobListing = `
      <div class="jobRow">
          <h3 class="jobRowTitle"><a target="_blank" href="${job.annonsurl}">${job.annonsrubrik}</a></h3>
          <p class="jobRowWorkPlace"><span class="jobRowLabel">Företag:</span> ${job.arbetsplatsnamn}</p>
          <p class="jobRowProfession"><span class="jobRowLabel">Yrke:</span> ${job.yrkesbenamning}</p>
            <div class="jobRowFooter">
              <p class="jobRowCounty"><span class="jobRowLabel">Kommun:</span> ${job.kommunnamn}</p>
              <p class="jobRowPublished"><span class="jobRowLabel">Publicerades:</span> ${utility.formatDate(job.publiceraddatum)}</p> 
              <p class="jobRowLastApply"><span class="jobRowLabel">Sista ansökningsdag:</span> ${utility.formatDate(job.sista_ansokningsdag)}</p>
            </div>
          </div>
      </div>`;
      document.querySelector("#inputContainer").insertAdjacentHTML("afterBegin", jobListing);
    }
  },
  //Fills the county select dropdown menu with items
  async populateCountySelectDropDown() {
    const dropDownArea = document.querySelector("#dropDownArea");
    let row = document.createElement("option");
    row.textContent = "Alla län";
    row.value = 1000;
    dropDownArea.appendChild(row);
    let listOfCountys = await network.getCounty();
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
    let listOfWorkAreas = await network.getWorkArea()
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
  network.findAds(this.dropDownArea.value, this.linkUrl.value, this.dropDownWorkArea.value);
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