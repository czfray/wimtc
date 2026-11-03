let response = await fetch("lrt_stations.json");
const stations = await response.json();

const stnSelector = document.getElementById("selectStn");
const timeShower = document.getElementById("time");

const lrtList = document.getElementById("lrtList");
const platformTemplate = document.getElementById("platformTemplate");
const lrtTemplate = document.getElementById("lrtTemplate");
const failureTemplate = document.getElementById("failureTemplate");

let time;

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

update();

stnSelector.addEventListener("change", () => {
    localStorage.setItem("lrtstation", stnSelector.value);
    update();
});

setInterval(update, 5000);

async function update(){
    await updateLists();
    updateVisuals();
}

function updateVisuals(){
    lrtList.replaceChildren();
    for (const platformObj of platformObjs){
        const platformVisual = platformTemplate.content.cloneNode(true);
        platformVisual.querySelector(".platformName").textContent = platformObj.id + "號月台 Platform " + platformObj.id; 
        
        const lrtContainer = platformVisual.querySelector(".lrts");
        for (const [route, mins] of Object.entries(platformObj["lrts"])){
            const lrtVisual = lrtTemplate.content.cloneNode(true);
            
            const routeInfo = route.split(",");
            lrtVisual.querySelector(".lrtNo").textContent = routeInfo[0];
            lrtVisual.querySelector(".lrtDest").textContent = routeInfo[2] + " " + routeInfo[1];


            for (let i = 0; i < 2; i++) {
                let minText;
                if (i < mins.length){
                    minText = mins[i];
                } else {
                    minText = "-";
                }
                lrtVisual.querySelector(".lrtMin" + i).textContent = minText;
            }
            lrtContainer.appendChild(lrtVisual);
        }
        platformVisual.appendChild(lrtContainer);
        lrtList.appendChild(platformVisual);
    }

    if (platformObjs.length <= 0){
        const noLrtVisual = failureTemplate.content.cloneNode(true);
        noLrtVisual.querySelector(".failtc").textContent = "呢個站依家冇車，或者個app壞咗";
        noLrtVisual.querySelector(".failen").textContent = "Stopped service or connection failure";
        lrtList.appendChild(noLrtVisual);
    }

    timeShower.textContent = "最後更新 Last Update: " + time;
}

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
    time = lrtData.system_time;
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
            time = "Lft";
        }
        else {
            time = "Arr";
        }
        lrts[[route_no, route.dest_en, route.dest_ch]].push(time);
    }

    return Object.fromEntries(
        Object.entries(lrts).sort((a, b) =>
            a[0].split(",")[0].localeCompare(b[0].split(",")[0])
        )
    );
}

async function requestLRTData(station){
    const response = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${station}`);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
}