let siffra = 5;
let lanid = 2;
let baseUrl = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&yrkesomradeid="+lanid+"&sida=1&antalrader="+siffra;

async function getLatestJobs(){
  try{    
      const jobs = await (await fetch(baseUrl)).json();
      displayJSON(jobs.matchningslista.matchningdata);
  }
  catch(e){
    console.log(e);
  }
}

getLatestJobs();

/* display items */
function displayJSON(input = "") {
  for (job of input) {
      let jobListing = `
      <div class="cards" id="card">
          <h3 class="card-title">${job.annonsrubrik}</h3>
          <p class="summary">${job.yrkesbenamning}</p>
          <p class="summary">${job.arbetsplatsnamn}</p>
          <p class="summary">${job.kommunnamn}</p>
          <p class="summary">Publicerades: ${job.publiceraddatum} Sista ansökningsdag: ${job.sista_ansokningsdag}</p>
          </div>
      </div>`;
      document.body.insertAdjacentHTML('afterBegin', jobListing);
  }
}