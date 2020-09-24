<template>
    <b-row v-if="feature">
        <b-col lg="12" xl="6">
            <b-card title="Property info" class="lift">
                <b-badge v-if="isRenting" style="background-color: darkslateblue; opacity: 0.8;">Subletting</b-badge>
                <b-badge v-if="isOwned" style="background-color: dodgerblue; opacity: 0.8;">Owned</b-badge>
                <b-badge v-if="!isRenting && !isOwned" variant="secondary">Available</b-badge>
                
                <b-card-text>
                    Area: {{ areaOutput }}m²<br/>
                    Height: {{ feature.properties.height }}m<br/>
                    Rent Price: {{ rentPriceOutput }} per month - Subletting income: {{ formatCurrency(feature.incomeRenting) }}<br/>
                    Buy Price: {{ buyPriceOutput }} - Renting income: {{ formatCurrency(feature.incomeOwned) }}<br/>
                    Level required: <b-badge pill :variant="requiredLevel <= level ? 'success' : 'danger'">{{ requiredLevel }}</b-badge>
                </b-card-text>

                <b-button
                    v-if="!isOwned"
                    variant="primary"
                    v-on:click="buy()"
                    v-bind:class="{ 'disabled': money < feature.buyPrice || requiredLevel > level }"
                    :disabled="money < feature.buyPrice || requiredLevel > level">
                    Buy
                </b-button>

                <b-button
                    v-if="!isRenting && !isOwned"
                    variant="primary"
                    class="ml-2"
                    v-on:click="rent()"
                    v-bind:class="{ 'disabled': money < feature.rentPrice || requiredLevel > level }"
                    :disabled="money < feature.rentPrice || requiredLevel > level">
                    Rent
                </b-button>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { formatCurrency, getLevelRequiredForBuilding, calculateRentExperience, calculateBuyExperience } from '../services/helperService';
import { SELECT_FEATURE, ADD_TO_OWNED_FEATURES, ADD_TO_RENTING_FEATURES, ADD_MONEY, REMOVE_FROM_RENTING_FEATURES, ADD_EXPERIENCE } from '../store/mutationTypes';

export default {
    name: 'PropertyInfoComponent',
    data () {
        return {
            isOwned: false,
            isRenting: false,
            areaOutput: null,
            rentPriceOutput: null,
            buyPriceOutput: null,
            requiredLevel: null
        };
    },
    mounted () {
        this.setFeatureOptions(this.feature);
    },
    computed: {
        feature () {
            return this.$store.state.selectedFeature;
        },
        money () {
            return this.$store.state.money;
        },
        level () {
            return this.$store.state.level;
        }
    },
    watch: {
        feature (feature) {
            this.setFeatureOptions(feature);
        }
    },
    methods: {
        formatCurrency,
        getLevelRequiredForBuilding,
        setFeatureOptions (feature) {
            this.isRenting = feature && this.$store.state.rentingFeatures.find(x => x.id === feature.id);
            this.isOwned = feature && this.$store.state.ownedFeatures.find(x => x.id === feature.id);
            this.areaOutput = feature ? feature.area.toFixed(0) : null;
            this.rentPriceOutput = feature ? formatCurrency(feature.rentPrice) : null;
            this.buyPriceOutput = feature ? formatCurrency(feature.buyPrice) : null;
            this.requiredLevel = feature ? getLevelRequiredForBuilding(feature) : null;
        },
        buy () {
            this.$store.dispatch(ADD_MONEY, -this.feature.buyPrice);
            this.$store.dispatch(ADD_TO_OWNED_FEATURES, this.feature);
            this.$store.dispatch(ADD_EXPERIENCE, calculateBuyExperience(this.feature));

            if (this.isRenting) {
                this.$store.dispatch(REMOVE_FROM_RENTING_FEATURES, this.feature.id);
            }

            this.$store.dispatch(SELECT_FEATURE, null);
        },
        rent () {
            this.$store.dispatch(ADD_MONEY, -this.feature.rentPrice);
            this.$store.dispatch(ADD_TO_RENTING_FEATURES, this.feature);
            this.$store.dispatch(ADD_EXPERIENCE, calculateRentExperience(this.feature));
            this.$store.dispatch(SELECT_FEATURE, null);
        }
    }
};
</script>

<style scoped>
.badge {
    margin-bottom: .75rem;
}
.card-title {
    margin-bottom: 0;
}
</style>
