<template>
    <b-row v-if="listOfBuildingsOpen">
        <b-col lg="12" xl="6">
            <b-card class="lift" no-body>
                <b-tabs card>
                    <b-tab title="Owned" active>
                        <b-card-text v-if="!ownedFeatures.length">No owned buildings</b-card-text>
                        <table v-else class="table">
                            <thead>
                                <tr>
                                    <th scope="col">id</th>
                                    <th scope="col">income</th>
                                    <th scope="col">area m²</th>
                                    <th scope="col">height m</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="feature in ownedFeatures" :key="feature.id">
                                    <th scope="row">{{ feature.id }}</th>
                                    <td>{{ formatCurrency(feature.incomeOwned) }}</td>
                                    <td>{{ feature.area.toFixed(0) }}</td>
                                    <td>{{ feature.properties.height }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                    <b-tab title="Subletting">
                        <b-card-text v-if="!rentingFeatures.length">Not subletting any buildings</b-card-text>
                        <table v-else class="table" thStyle="padding: 0;">
                            <thead>
                                <tr>
                                    <th scope="col">id</th>
                                    <th scope="col">income</th>
                                    <th scope="col">area m²</th>
                                    <th scope="col">height m</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="feature in rentingFeatures" :key="feature.id">
                                    <th scope="row">{{ feature.id }}</th>
                                    <td>{{ formatCurrency(feature.incomeRenting) }}</td>
                                    <td>{{ feature.area.toFixed(0) }}</td>
                                    <td>{{ feature.properties.height }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { formatCurrency } from '../services/helperService';

export default {
    name: 'ListOfBuildingsComponent',
    data () {
        return {
            rentingFeaturesSorted: null,
            ownedFeaturesSorted: null
        };
    },
    mounted () {

    },
    computed: {
        feature () {
            return this.$store.state.selectedFeature;
        },
        listOfBuildingsOpen () {
            return this.$store.state.listOfBuildingsOpen;
        },
        rentingFeatures () {
            return this.$store.state.rentingFeatures;
        },
        ownedFeatures () {
            return this.$store.state.ownedFeatures;
        }
    },
    methods: {
        formatCurrency
    }
};
</script>

<style scoped>

</style>
