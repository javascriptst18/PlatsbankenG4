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
    network.getLanSelectDropDown();
    const jobs = await network.fetchJson(URL.baseUrl);
    html.displayJSON(jobs.matchningslista.matchningdata);
  },

  async getLanSelectDropDown() {
    const Lan = await network.fetchJson(URL.lanUrl);
    for (let lan of Lan.soklista.sokdata)
      console.log("Län: " + lan.namn + " id: " + lan.id);
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
/*window.onload = function init() {
  network.getLatestJobs();
}*/