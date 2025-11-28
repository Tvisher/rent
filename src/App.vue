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
  [39.50408911718748, 44.06874178223176], // SW
  [39.99847388281246, 43.276302584557925]   // NE
];

const mapSettings = {
  // theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
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
  "count": count,
  'offset': 0,
  "zoom": 13,
}

const getDataFromNewPosition = ({ params }) => {
  // offset.value = offset.value + count;
  const { bounds, zoom } = params.location;


  const dataForAjax = {
    'ne_lat': bounds[0][1],
    'ne_lng': bounds[1][0],
    'sw_lat': bounds[1][1],
    'sw_lng': bounds[0][0],
    'date_begin': '22-12-2025',
    'date_end': '22-01-2026',
    "count": count,
    'offset': 0,
    "zoom": 13,
  }

  const start = Date.now();
  getMapData(dataForAjax).then(res => {
    console.log("Время запроса к sutdata.php:", Date.now() - start, "ms");

    items.value = [...Object.values(res.data.objects)];
    totalCount.value = res.data.totalCount;
  });

  createTilesList(bounds, Math.round(zoom))
}

function createTilesList(bounds, zoom) {

  const tilesList = calculateVisibleTiles(zoom, bounds, true);
  console.log(tilesList);

  const processedSet = new Set(
    tilesObjects.value.map(t => `${t.x}_${t.y}_${Math.floor(t.z)}`)
  );

  tilesList.forEach(tile => {
    const key = `${tile.x}_${tile.y}_${Math.floor(tile.z)}`;
    if (processedSet.has(key)) return;
    tilesObjects.value.push(tile);
    // getTilesData({
    //   date_begin: "08-12-2025",
    //   date_end: "15-12-2025",
    //   count: 10,
    //   x: tile.x,
    //   y: tile.y,
    //   zoom: tile.z
    // }).then(res => {
    //   console.log("getTilesData res:", res);
    // });

  });
}


onMounted(() => {
  const start = Date.now();
  getMapData(mokData).then(res => {
    console.log("Время базового запроса к sutdata.php:", Date.now() - start, "ms");
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
    <MapComponent :items="items" :settings="mapSettings" @updatePosition="getDataFromNewPosition" />
  </div>
</template>

<style lang="scss"></style>