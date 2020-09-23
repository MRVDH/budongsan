<template>
    <div class="container-fluid">
        <GameStatsComponent/>
        <PropertyInfoComponent/>
        <ListOfBuildingsComponent/>
        <BankComponent/>
        <ExperienceComponent/>
    </div>
</template>

<script>
import GameStatsComponent from './GameStatsComponent.vue';
import PropertyInfoComponent from './PropertyInfoComponent.vue';
import ListOfBuildingsComponent from './ListOfBuildingsComponent.vue';
import BankComponent from './BankComponent.vue';
import ExperienceComponent from './ExperienceComponent.vue';

export default {
    name: 'UiItemsComponent',
    data () {
        return { };
    },
    components: {
        GameStatsComponent,
        PropertyInfoComponent,
        ListOfBuildingsComponent,
        BankComponent,
        ExperienceComponent
    }
};
</script>

<style scoped>
.container-fluid {
    padding: 15px;
}
</style>
