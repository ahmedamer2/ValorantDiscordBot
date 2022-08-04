import valorantApi from "unofficial-valorant-api";

const VAPI = new valorantApi();

VAPI.getMMR({
    version: "v2",
    region: "na",
    name: "SandBoiSupreme",
    "tag": "NA1",
}).then(data => {
    console.log(data.data.current_data)
});

VAPI.getMMR({
    version: "v2",
    region: "na",
    name: "Õrang",
    "tag": "NA1",
}).then(data => {
    console.log(data.data.current_data)
});

