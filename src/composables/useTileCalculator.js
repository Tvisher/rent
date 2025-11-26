
function getTileCoords(lat, lon, Z) {
    if (Z === undefined || Z === null) {
        return { X: 0, Y: 0 };
    }

    // Перевод в радианы
    const lat_rad = lat * Math.PI / 180;
    const lon_rad = lon * Math.PI / 180;

    // Общий размер карты в пикселях (N = 256 * 2^Z)
    const mapSize = 256 * Math.pow(2, Z);

    // Пиксельные координаты X
    const Px = (lon_rad + Math.PI) * (mapSize / (2 * Math.PI));

    // Пиксельные координаты Y (сверху вниз)
    const Py = (Math.PI - Math.log(Math.tan(Math.PI / 4 + lat_rad / 2))) * (mapSize / (2 * Math.PI));

    // Номер тайла (деление на 256 и Math.floor)
    const Tile_X = Math.floor(Px / 256);
    const Tile_Y = Math.floor(Py / 256);

    return { X: Tile_X, Y: Tile_Y };
}



export function calculateVisibleTiles(Z, bounds, returnFullList) {
    const { lat_min, lon_min, lat_max, lon_max } = bounds;

    if (!lat_min || Z === undefined || Z === null) {
        return returnFullList ? [] : { X_min: 0, X_max: -1, Y_min: 0, Y_max: -1, Z: Z };
    }

    // 1. Вычисляем координаты тайлов для крайних точек

    // Точка, дающая МИНИМАЛЬНЫЕ X и Y: Северо-Западный угол
    // (Максимальная широта, Минимальная долгота)
    const NW_tile = getTileCoords(lat_max, lon_min, Z);

    // Точка, дающая МАКСИМАЛЬНЫЕ X и Y: Юго-Восточный угол
    // (Минимальная широта, Максимальная долгота)
    const SE_tile = getTileCoords(lat_min, lon_max, Z);

    // 2. Формируем диапазон
    const tileRange = {
        // X-координаты: просто берем из расчетов
        X_min: NW_tile.X,
        X_max: SE_tile.X,

        // Y-координаты: 
        // NW_tile (север) дает Y_min. SE_tile (юг) дает Y_max.
        Y_min: NW_tile.Y,
        Y_max: SE_tile.Y,
        Z: Z
    };

    if (!returnFullList) {
        // Возвращаем диапазон, если не требуется полный список
        return tileRange;
    }

    // 3. Генерация полного списка (для вашего запроса)
    const tilesList = [];

    // Дополнительная проверка на корректность диапазона перед итерацией
    if (tileRange.X_min > tileRange.X_max || tileRange.Y_min > tileRange.Y_max) {
        // Этот код не должен выполняться, если getTileCoords работает верно,
        // но оставим его для надежности
        return [];
    }

    for (let x = tileRange.X_min; x <= tileRange.X_max; x++) {
        for (let y = tileRange.Y_min; y <= tileRange.Y_max; y++) {
            tilesList.push({ x: x, y: y, z: Z });
        }
    }

    return tilesList;
}