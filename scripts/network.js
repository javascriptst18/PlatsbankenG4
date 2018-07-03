
export function displayJSON(jsonObjectList) {
    document.querySelector("#inputContainer").innerHTML = "";
    for (let job of jsonObjectList) {
      let jobListing = `
      <div class="jobRow">
          <h3 class="jobRowTitle"><a target="_blank" href="${job.annonsurl}">${job.annonsrubrik}</a></h3>
          <p class="jobRowWorkPlace"><span class="jobRowLabel">Företag:</span> ${job.arbetsplatsnamn}</p>
          <p class="jobRowProfession"><span class="jobRowLabel">Yrke:</span> ${job.yrkesbenamning}</p>
            <div class="jobRowFooter">
              <p class="jobRowCounty"><span class="jobRowLabel">Kommun:</span> ${job.kommunnamn}</p>
              <p class="jobRowPublished"><span class="jobRowLabel">Publicerades:</span> ${formatDate(job.publiceraddatum)}</p> 
              <p class="jobRowLastApply"><span class="jobRowLabel">Sista ansökningsdag:</span> ${formatDate(job.sista_ansokningsdag)}</p>
            </div>
          </div>
      </div>`;
      document.querySelector("#inputContainer").insertAdjacentHTML("afterBegin", jobListing);
    }
  }

  function formatDate(input) {
    //Converts input from string to Date and then formats date as "en-gb" (dd/mm/yyyy)
    let formattedDate = new Date(input).toLocaleDateString("en-gb");
    //Return the formatted date
    return formattedDate;
  }

  export function test(){
    alert("test");
  }