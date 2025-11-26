<script setup>
import CardItem from '@/components/CardItem.vue';
</script>

<template>
    <div class="cards-list">
        <CardItem v-for="(card, ind) in [1, 2, 3, 4]" :key="ind" />
    </div>
</template>

<style lang="scss"></style>