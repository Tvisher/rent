import axios from "axios";

export function getTilesData(params) {
    return axios.post("/ajax/sutdatatitle.php", params)
}



export function getMapData(params) {
    return axios.post("/ajax/sutdata.php", params)
}




