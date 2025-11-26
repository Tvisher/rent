<script setup>
import MapComponent from './components/MapComponent.vue';
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  console.log('У пользователя тёмная тема');
} else {
  console.log('У пользователя светлая тема');
}
</script>

<template>
  <div class="search-app">
    <MapComponent />
  </div>
</template>

<style lang="scss"></style>