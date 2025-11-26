<script setup>
import { ref, shallowRef, watch } from 'vue';
const emit = defineEmits(['updatePosition']);

import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapListener,
  YandexMapMarker,
} from 'vue-yandex-maps';


import { getTilesData } from '@/services/api.js';
import { calculateVisibleTiles } from '@/composables/useTileCalculator.js';

const props = defineProps({
  items: Array,
  settings: Object
})


const mapInstance = shallowRef(null);
const currentBounds = ref(null);
const markersWithPrice = ref([]);
const mapDefaultSettings = ref(props.settings);


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
  console.log(tilesList);
  emit('updatePosition', params);

  // tilesList.forEach(tile => {
  //   getTilesData(
  //     {
  //       max_guests: 2,
  //       occupied: "2025-12-11;2025-12-24",
  //       format: "json",
  //       token: "Hy6U3z61fflbgT2yJ/VdlQ2719",
  //       count: 10,
  //       x: tile.x,
  //       y: tile.y,
  //       zoom: Math.floor(tile.z)

  //     }).then(data => {
  //       console.log("Данные:", data);
  //     });
  // })

};

const debouncedStop = debounce(handleMapStop, 300);
const onUpdateHandler = (params) => {
  const { mapInAction } = params;
  if (mapInAction) return;
  debouncedStop(params);
};


watch(() => props.items, (newVal, oldVal) => {
  newVal.forEach((el, ind) => {
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
});

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