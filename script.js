const response = await fetch("stations.json");
const stations = await response.json();
const stnSelector = document.getElementById("selectStn");

for (const [code, station] of Object.entries(stations)){
    const newOption = document.createElement("option");
    newOption.value = code;
    newOption.textContent = station["name"]["tc"] + " " + station["name"]["en"];
    stnSelector.appendChild(newOption);
}