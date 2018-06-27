
//Url to get a list of jobs with a specified amount of listings from the selected län
let baseUrl = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&yrkesomradeid=1&sida=1&antalrader=10";
//URL to get a list of different läns and their numeric value
let lanURL = "http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan";


function setDropDownContent(){
  let lanURL = "";
  var firstRow = document.createElement("option");
  firstRow.textContent = "Välj län";
  dropDownMenu.appendChild(firstRow);

  for(genre of input){
      var row = document.createElement("option");
      row.textContent = genre;
      row.value = genre;
      dropDownMenu.appendChild(row);
  }
}

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
          <p class="summary">Publicerades: ${formatDate(job.publiceraddatum)} Sista ansökningsdag: ${formatDate(job.sista_ansokningsdag)}</p>
          </div>
      </div>`;
      document.body.insertAdjacentHTML('afterBegin', jobListing);
  }
}



//Formats inputdate from json from UTC to 'en-gb'
function formatDate(input){
  //Converts input from string to Date and then formats date as 'en-gb' (dd/mm/yyyy)
  let formattedDate = new Date(input).toLocaleDateString('en-gb');
  //Return formatted date  
  return formattedDate;
}