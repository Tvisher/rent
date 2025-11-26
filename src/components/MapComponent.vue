<script setup>
import { ref, shallowRef } from 'vue';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapListener,
  YandexMapMarker,
} from 'vue-yandex-maps';

import { getTilesData } from '@/services/api.js';

import { calculateVisibleTiles } from '@/composables/useTileCalculator.js'; // Путь к вашему файлу

const mapInstance = shallowRef(null);
const currentBounds = ref(null);

const mapDefaultSettings = ref({
  theme: getSystemTheme(),
  location: {
    center: [37.617644, 55.755819],
    zoom: 12,
  },
});


function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

let timer = null;
function debounce(fn, delay) {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleMapStop = (params) => {

  const visibleBounds = params.location.bounds;
  const currentMapZoom = params.location.zoom;
  if (!visibleBounds) return;

  console.log(params);
  // Извлекаем все 4 значения, учитывая, что в парах (Lon, Lat)
  const lonA = visibleBounds[0][0];
  const latA = visibleBounds[0][1];
  const lonB = visibleBounds[1][0];
  const latB = visibleBounds[1][1];

  currentBounds.value = {
    lat_min: Math.min(latA, latB), // Юг
    lon_min: Math.min(lonA, lonB), // Запад
    lat_max: Math.max(latA, latB), // Север
    lon_max: Math.max(lonA, lonB), // Восток
  };

  console.log("API params:", currentBounds.value);
  const tilesList = calculateVisibleTiles(currentMapZoom, currentBounds.value, true);

  tilesList.forEach(tile => {
    getTilesData(
      {
        max_guests: 2,
        occupied: "2025-12-11;2025-12-24",
        format: "json",
        token: "Hy6U3z61fflbgT2yJ/VdlQ2719",
        count: 10,
        x: tile.x,
        y: tile.y,
        zoom: tile.z

      }).then(data => {
        console.log("Данные:", data);
      });
  })

};

const debouncedStop = debounce(handleMapStop, 300);
const onUpdateHandler = (params) => {
  const { mapInAction } = params;
  if (mapInAction) return;
  debouncedStop(params);
};


const markerData = [
  {
    "id": 1772911,
    "lat": 55.689618,
    "lng": 37.61384400000001,
    "price": 48950,
    "salePrice": 44055
  },
  {
    "id": 927097,
    "lat": 55.80825,
    "lng": 37.609388,
    "price": 48100,
    "salePrice": 45695
  },
  {
    "id": 927491,
    "lat": 55.80825,
    "lng": 37.609388,
    "price": 52000,
    "salePrice": 52000
  },
  {
    "id": 933805,
    "lat": 55.710280999999995,
    "lng": 37.665192000000005,
    "price": 74100,
    "salePrice": 74100
  },
  {
    "id": 1715686,
    "lat": 55.820561,
    "lng": 37.64798,
    "price": 75270,
    "salePrice": 71507
  },
  {
    "id": 1728781,
    "lat": 55.72816000000001,
    "lng": 37.623591,
    "price": 37700,
    "salePrice": 37700
  },
  {
    "id": 1025699,
    "lat": 55.791749,
    "lng": 37.748619000000005,
    "price": 62500,
    "salePrice": 60550
  },
  {
    "id": 945307,
    "lat": 55.708181,
    "lng": 37.68164899999999,
    "price": 58370,
    "salePrice": 58370
  },
  {
    "id": 1800032,
    "lat": 55.773596,
    "lng": 37.58826,
    "price": 247000,
    "salePrice": 247000
  },
  {
    "id": 926169,
    "lat": 55.75960100000001,
    "lng": 37.609449,
    "price": 81900,
    "salePrice": 81900
  },
  {
    "id": 1814127,
    "lat": 55.655975999999995,
    "lng": 37.613503,
    "price": 61000,
    "salePrice": 61000
  },
  {
    "id": 1763672,
    "lat": 55.689618,
    "lng": 37.61384400000001,
    "price": 49400,
    "salePrice": 44460
  },
  {
    "id": 1485227,
    "lat": 55.786642,
    "lng": 37.498276,
    "price": 109560,
    "salePrice": 109560
  },
  {
    "id": 1380201,
    "lat": 55.760282,
    "lng": 37.64887,
    "price": 76700,
    "salePrice": 76700
  },
  {
    "id": 1449531,
    "lat": 55.77076999999999,
    "lng": 37.604026000000005,
    "price": 140500,
    "salePrice": 140500
  },
  {
    "id": 1996201,
    "lat": 55.708181,
    "lng": 37.68164899999999,
    "price": 57370,
    "salePrice": 57370
  },
  {
    "id": 1409209,
    "lat": 55.799036,
    "lng": 37.532601,
    "price": 78500,
    "salePrice": 65155
  },
  {
    "id": 1252721,
    "lat": 55.735859999994005,
    "lng": 37.653442,
    "price": 79625,
    "salePrice": 74051
  },
  {
    "id": 1630597,
    "lat": 55.770821,
    "lng": 37.517976000000004,
    "price": 58500,
    "salePrice": 58500
  },
  {
    "id": 1715695,
    "lat": 55.820561,
    "lng": 37.64798,
    "price": 75270,
    "salePrice": 75270
  },
  {
    "id": 1014767,
    "lat": 55.845916,
    "lng": 37.576106,
    "price": 56010,
    "salePrice": 50409
  },
  {
    "id": 926067,
    "lat": 55.842438,
    "lng": 37.373356,
    "price": 60900,
    "salePrice": 57855
  },
  {
    "id": 1050911,
    "lat": 55.791749,
    "lng": 37.748619000000005,
    "price": 70200,
    "salePrice": 67600
  },
  {
    "id": 1032133,
    "lat": 55.849226,
    "lng": 37.586606999999994,
    "price": 34500,
    "salePrice": 34500
  },
  {
    "id": 1825966,
    "lat": 55.752607,
    "lng": 37.641405,
    "price": 80750,
    "salePrice": 80750
  },
  {
    "id": 1035609,
    "lat": 55.803186000000004,
    "lng": 37.785018,
    "price": 41560,
    "salePrice": 41560
  },
  {
    "id": 1773445,
    "lat": 55.689618,
    "lng": 37.61384400000001,
    "price": 46800,
    "salePrice": 46800
  },
  {
    "id": 1556134,
    "lat": 55.759734,
    "lng": 37.601475,
    "price": 65000,
    "salePrice": 65000
  },
  {
    "id": 1066303,
    "lat": 55.75960100000001,
    "lng": 37.609449,
    "price": 95550,
    "salePrice": 95550
  },
  {
    "id": 933669,
    "lat": 55.785749,
    "lng": 37.563114000000006,
    "price": 66300,
    "salePrice": 66300
  }
]
const markersWithPrice = ref([]);
setTimeout(() => {
  markerData.forEach((el, ind) => {
    setTimeout(() => {
      markersWithPrice.value.push({
        coordinates: [el.lng, el.lat],
        data: {
          id: el.id,
          price: el.price
        }
      })
    }, (10 * ind))

  })
}, 1000);

</script>

<template>
  <yandex-map class="map-instance" v-model="mapInstance" :settings="mapDefaultSettings">
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />

    <yandex-map-listener :settings="{
      onUpdate: onUpdateHandler,
    }" />

    <yandex-map-marker v-for="(marker, index) in markersWithPrice" :key="index" :settings="marker">
      <div class="marker">
        <span class="marker-price">
          {{ marker.data.price.toLocaleString('ru-RU') }} &#8381;
        </span>
      </div>
    </yandex-map-marker>

    <!-- <yandex-map-marker v-for="(marker, index) in markers" :key="index" :settings="marker">
      <div class="marker _yellow" />
    </yandex-map-marker> -->

  </yandex-map>
</template>


<style lang="scss">
.marker {
  cursor: pointer;
  position: relative;
  padding: 3px;
  background: blue;
  border-radius: 20px;
  border: 1px solid #fff;
  // box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
  font-weight: bold;
  animation: fromOpacity .5s ease-in-out forwards;
  font-size: 12px;
  line-height: 120%;

  &._yellow {
    background-color: yellow;
  }

  .marker-price {
    white-space: nowrap;
  }
}

@keyframes fromOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>