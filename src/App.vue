<script setup>
import { onMounted, ref } from 'vue';
import MapComponent from '@/components/MapComponent.vue';
import FiltersGroup from '@/components/FiltersGroup.vue';
import Cards from '@/components/Cards.vue';
import { getMapData, getTilesData } from '@/services/api.js';
import { calculateVisibleTiles } from '@/composables/useTileCalculator.js';

const items = ref([]);
const totalCount = ref(0);
const tilesObjects = ref([]);
const count = 50;
const offset = ref(0);

const bounds = [
  [39.50408911718748, 43.276302584557925], // SW
  [39.99847388281246, 44.06874178223176]   // NE
];

const mapSettings = {
  // theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  location: {
    bounds,
    zoom: 13,
  },
}

const mokData = {
  'sw_lng': 39.50408911718748,
  'sw_lat': 43.276302584557925,
  'ne_lng': 39.99847388281246,
  'ne_lat': 44.06874178223176,
  'date_begin': '22-12-2025',
  'date_end': '22-01-2026',
  "count": count,
  'offset': 0,
  "zoom": 13,
}

const getDataDromNewPosition = ({ params }) => {
  console.log('onUpdate данные:', params);
  // offset.value = offset.value + count;
  const { bounds, zoom } = params.location;
  const dataForAjax = {
    'sw_lat': bounds[1][1],
    'sw_lng': bounds[1][0],
    'ne_lat': bounds[0][1],
    'ne_lng': bounds[0][0],
    'date_begin': '22-12-2025',
    'date_end': '22-01-2026',
    "count": count,
    'offset': 0,
    "zoom": 13,
  }

  getMapData(dataForAjax).then(res => {
    console.log("Данные от /ajax/sutdata.php:", res.data);
    items.value = [...Object.values(res.data.objects)];
    totalCount.value = res.data.totalCount;
  });

  // createTilesList(params)
}

function createTilesList(params) {
  const bounds = params.location.bounds;
  const currentMapZoom = params.location.zoom;
  if (!bounds) return;

  // Извлекаем все 4 значения, учитывая, что в парах (Lon, Lat)
  const lonA = bounds[0][0];
  const latA = bounds[0][1];
  const lonB = bounds[1][0];
  const latB = bounds[1][1];

  const currentBounds = {
    lat_min: Math.min(latA, latB), // Юг
    lon_min: Math.min(lonA, lonB), // Запад
    lat_max: Math.max(latA, latB), // Север
    lon_max: Math.max(lonA, lonB), // Восток
  };

  const tilesList = calculateVisibleTiles(currentMapZoom, currentBounds, true);

  const processedSet = new Set(
    tilesObjects.value.map(t => `${t.x}_${t.y}_${Math.floor(t.z)}`)
  );

  tilesList.forEach(tile => {
    const key = `${tile.x}_${tile.y}_${Math.floor(tile.z)}`;

    if (processedSet.has(key)) return;
    tilesObjects.value.push(tile);

    getTilesData({
      date_begin: "08-12-2025",
      date_end: "15-12-2025",
      count: 10,
      x: tile.x,
      y: tile.y,
      zoom: Math.floor(tile.z)
    }).then(res => {
      console.log("getTilesData res:", res);
    });

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
    <MapComponent :items="items" :settings="mapSettings" @updatePosition="getDataDromNewPosition" />
  </div>
</template>

<style lang="scss"></style>