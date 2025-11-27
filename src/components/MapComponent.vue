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


// import { calculateVisibleTiles } from '@/composables/useTileCalculator.js';

const props = defineProps({
  items: Array,
  settings: Object
})


const mapInstance = shallowRef(null);
// const currentBounds = ref(null);
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


  const mapdata = {
    params
  }
  emit('updatePosition', mapdata);
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