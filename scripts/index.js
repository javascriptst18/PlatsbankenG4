/*
* Variables
*/
URL = {
  baseUrl: "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&yrkesomradeid=1&sida=1&antalrader=10",
  lanUrl: "http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan"
};

/*
* Network calls
*/
network = {
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

  async getLatestJobs() {
    network.getLan();
    const jobs = await network.fetchJson(URL.baseUrl);
    html.displayJSON(jobs.matchningslista.matchningdata);
  },

  async getLan() {
    const result = await network.fetchJson(URL.lanUrl);
    return result;
  }
}

/*
* HTML manipulation
*/
html = {
  displayJSON(input) {
    for (job of input) {
      let jobListing = `
      <div class="jobRow">
          <h3 class="jobRowTitle">${job.annonsrubrik}</h3>
          <p class="jobRowWorkPlace">${job.arbetsplatsnamn}</p>
          <p class="jobRowProfession">${job.yrkesbenamning}</p>
            <div class="jobRowFooter">
              <p class="jobRowCounty">${job.kommunnamn}</p>
              <p class="jobRowPublished">Publicerades: ${utility.formatDate(job.publiceraddatum)}</p> 
              <p class="jobRowLastApply">Sista ansökningsdag: ${utility.formatDate(job.sista_ansokningsdag)}</p>
            </div>
          </div>
      </div>`;
      document.body.insertAdjacentHTML('afterBegin', jobListing);
    }
  },

  createCountySelectDropDown(){
    const dropDownMenu = document.querySelector('#dropDown');
    let listOfLan = network.getLan();
    console.log(listOfLan.soklista.sokdata.length); 
    for(let lan of listOfLan.soklista.sokdata){
      var row = document.createElement("option");
      row.textContent = lan.namn;
      row.value = lan.id;
      dropDownMenu.appendChild(row);
  }
  }
}


/*
* Utility functions (formatting etc)
*/
utility = {
  //Formats inputdate from json from UTC to 'en-gb'
  formatDate(input) {
    //Converts input from string to Date and then formats date as 'en-gb' (dd/mm/yyyy)
    let formattedDate = new Date(input).toLocaleDateString('en-gb');
    //Return the formatted date
    return formattedDate;
  }
}

/*
* Initialize page
*/
window.onload = function init() {
  network.getLatestJobs();
  html.createCountySelectDropDown();
}