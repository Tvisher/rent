import axios from "axios";

export function getTilesData(params) {
    return axios.get("https://sutochno.ru/api/json/search/searchObjectsByTiles", {
        params,
    })
        .then(response => {
            console.log("Успех:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Ошибка:", error);
            throw error;
        });
}
