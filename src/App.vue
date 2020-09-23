<template>
    <div id="app" v-cloak>
        <UiItemsComponent/>
        <MapComponent/>
    </div>
</template>

<script>
import UiItemsComponent from './components/UiItemsComponent.vue';
import MapComponent from './components/MapComponent.vue';

export default {
    name: 'App',
    components: {
        UiItemsComponent,
        MapComponent
    }
};
</script>

<style scoped>
    [v-cloak] { display: none; }
</style>
