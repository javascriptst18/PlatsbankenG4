
let page = 1;
let numberOfRows = 100;

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

  async getJobs(countyID, searchWord, workArea) {
    let queryString = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=" + searchWord + "&yrkesomradeid=" + workArea + "&sida=" + page + "&antalrader=" + numberOfRows;
    if (countyID != 1000) {
      queryString += "&lanid=" + countyID;
    }
    console.log("querystring: ", queryString);
    network.getLan();
    const jobs = await network.fetchJson(queryString);
    html.displayJSON(jobs.matchningslista.matchningdata);
  },

  async getLan() {
    const result = await network.fetchJson("http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan");
    return result;
  },

  async getYrkesOmraden() {
    const result = await network.fetchJson("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden");
    return result;
  }
}

/*
* HTML manipulation
*/
let html = {
  //Displays job json in html dom
  displayJSON(input) {
    document.querySelector("#inputContainer").innerHTML = "";
    for (job of input) {
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
      document.querySelector("#inputContainer").insertAdjacentHTML('afterBegin', jobListing);
    }
  },
  //Fills the county select dropdown menu with items
  async populateCountySelectDropDown() {
    const dropDownMenu = document.querySelector('#dropDownMenu');
    var row = document.createElement("option");
    row.textContent = "Alla län";
    row.value = 1000;
    dropDownMenu.appendChild(row);
    let listOfLan = await network.getLan();
    for (let lan of listOfLan.soklista.sokdata) {
      var row = document.createElement("option");
      row.textContent = lan.namn;
      row.value = lan.id;
      dropDownMenu.appendChild(row);
    }
    dropDownMenu.value = 1000;
  },

  async populateWorkAreaDropDown() {
    const dropDownMenu = document.querySelector('#dropDownYrkesOmraden');
    let listOfWorkAreas = await network.getYrkesOmraden()
    for (let workArea of listOfWorkAreas.soklista.sokdata) {
      var row = document.createElement("option");
      row.textContent = workArea.namn;
      row.value = workArea.id;
      dropDownMenu.appendChild(row);
    }
  }
}

/*
* Event listeners
*/
const searchButton = document.querySelector("#getLink");
searchButton.addEventListener('submit', function (event) {
  event.preventDefault();
  network.getJobs(this.dropDownMenu.value, this.linkUrl.value, this.dropDownYrkesOmraden.value);
});

/*
* Utility functions (formatting etc)
*/
let utility = {
  //Formats inputdate from json from UTC to 'en-gb'
  formatDate(input) {
    //Converts input from string to Date and then formats date as 'en-gb' (dd/mm/yyyy)
    let formattedDate = new Date(input).toLocaleDateString('en-gb');
    //Return the formatted date
    return formattedDate;
  }
}

window.onload = init();

function init() {
  html.populateCountySelectDropDown();
  html.populateWorkAreaDropDown();
};