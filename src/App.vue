<script setup>
import MapComponent from '@/components/MapComponent.vue';
import FiltersGroup from '@/components/FiltersGroup.vue';
import Cards from '@/components/Cards.vue';
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  console.log('У пользователя тёмная тема');
} else {
  console.log('У пользователя светлая тема');
}
</script>

<template>
  <div class="search-app">
    <div class="sidebar-zone">
      <FiltersGroup />
      <Cards />
    </div>
    <MapComponent />
  </div>
</template>

<style lang="scss"></style>