let response = await fetch("lrt_stations.json");
const stations = await response.json();

const stnSelector = document.getElementById("selectStn");

for (const [code, station] of Object.entries(stations)){
    const newOption = document.createElement("option");
    newOption.value = code;
    newOption.textContent = station["name"]["tc"] + " " + station["name"]["en"];
    stnSelector.appendChild(newOption);
}

const savedStation = localStorage.getItem("lrtstation");
if (savedStation && stations[savedStation]) {
    stnSelector.value = savedStation;
}
else{
    stnSelector.value = "1";
    localStorage.setItem("lrtstation", "1");
}

let platformObjs;

stnSelector.addEventListener("change", () => {
    localStorage.setItem("lrtstation", stnSelector.value);
    updateLists();
    //update
});

async function updateLists(){
    console.log("Updating lists...");

    platformObjs = [];
    const stationId = stnSelector.value;
    console.log("Updating station: " + stationId);

    const lrtData = await requestLRTData(stationId);
    console.log(`Got LRT Data in station ${stationId}`);
    console.log(lrtData);

    for (const {platform_id, route_list} of lrtData.platform_list){
        const lrts = getLRTs(route_list);
        if (Object.keys(lrts).length <= 0) {
            console.log(`Platform ${platform_id} has no more lrt.`);
            continue;
        }
        
        let platformObj = {
            id: platform_id,
            lrts: lrts
        }
        platformObjs.push(platformObj);
    }
    console.log(platformObjs);
}

function getLRTs(route_list){
    if (!route_list) return {};
    let lrts = {};
    for (const route of route_list){
        const route_no = route.special? route.additionalInfo1 : route.route_no;
        if (!([route_no, route.dest_en, route.dest_ch] in lrts)){
            lrts[[route_no, route.dest_en, route.dest_ch]] = [];
        }

        let time = route.time_en;
        if (time.includes("mins")){
            time = time.replace("mins", "").trim();
        } else if (time.includes("min")){
            time = time.replace("min", "").trim();
        } else if (time.toLowerCase() == "departing"){
            time = "Left";
        }
        else {
            time = "Arr";
        }
        lrts[[route_no, route.dest_en, route.dest_ch]].push(time);
    }
    return lrts;
}

async function requestLRTData(station){
    const response = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${station}`);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
}