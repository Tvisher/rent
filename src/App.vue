<script setup>
import { onMounted, ref } from 'vue';
import MapComponent from '@/components/MapComponent.vue';
import FiltersGroup from '@/components/FiltersGroup.vue';
import Cards from '@/components/Cards.vue';

import { getMapData } from '@/services/api.js';

const items = ref([]);
const totalCount = ref(0);


function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

console.log(getSystemTheme());


const bounds = [
  [39.50408911718748, 43.276302584557925], // SW
  [39.99847388281246, 44.06874178223176]   // NE
];

const settings = {
  // theme: getSystemTheme(),
  location: {
    bounds,
    zoom: 13,
  },
}

const mokData = {
  'ne_lat': 44.06874178223176,
  'ne_lng': 39.99847388281246,
  'sw_lat': 43.276302584557925,
  'sw_lng': 39.50408911718748,
  'date_begin': '22-12-2025',
  'date_end': '22-01-2026',
  'offset': 50
}

const getDataDromNewPosition = (data) => {
  console.log('getDataDromNewPosition', data);
  const bounds = data.location.bounds;
  const dataForAjax = {
    'ne_lat': bounds[1][1],
    'ne_lng': bounds[1][0],
    'sw_lat': bounds[0][1],
    'sw_lng': bounds[0][0],
    'date_begin': '22-12-2025',
    'date_end': '22-01-2026',
    'offset': 50
  }
  getMapData(dataForAjax).then(res => {
    console.log("Данные от /ajax/sutdata.php:", res.data);
    items.value = [...Object.values(res.data.objects)];
    totalCount.value = res.data.totalCount;
  });
}


onMounted(() => {
  getMapData(mokData).then(res => {
    console.log("Данные от /ajax/sutdata.php:", res.data);
    items.value = [...Object.values(res.data.objects)];
    totalCount.value = res.data.totalCount;
  })

})

</script>

<template>
  <div class="search-app">
    <div class="sidebar-zone">
      <FiltersGroup />
      <Cards />
    </div>
    <MapComponent :items="items" :settings="settings" @updatePosition="getDataDromNewPosition" />
  </div>
</template>

<style lang="scss"></style>