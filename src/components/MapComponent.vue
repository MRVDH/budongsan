<template>
    <div id="map"></div>
</template>

<script>
import { calculateAreaOfFeature, calculateIncomeRentingOfFeature, calculateIncomeOwnedOfFeature, calculateRentPrice, calculatePropertyPrice } from '../services/helperService';
import { addBaseLayersToMap, defineLayerId, newMap } from '../services/mapService';
import { SELECT_FEATURE } from '../store/mutationTypes';

export default {
    name: 'MapComponent',
    data () {
        return {
            map: null
        };
    },
    mounted () {
        let that = this;

        this.map = newMap();

        this.map.on('load', function() {
            const labelLayerId = defineLayerId(that.map);

            addBaseLayersToMap(that.map, labelLayerId);
        });
        
        this.map.on('click', function(e) {
            // Get all features at the mouse click
            var features = that.map.queryRenderedFeatures(e.point);

            // Only select things from the buildings layer
            features = features.filter(x => x.sourceLayer === 'building' && x.properties.underground === "false");
            
            let feature = features.length ? features[0] : null;

            let featureToSave = null;

            if (feature) {
                featureToSave = {
                    id: feature.id,
                    source: feature.source,
                    sourceLayer: feature.sourceLayer,
                    layerId: feature.layer.id,
                    properties: feature.properties,
                    geometry: feature._geometry || feature.geometry,
                    values: feature._vectorTileFeature._values
                }

                featureToSave.area = calculateAreaOfFeature(featureToSave);
                featureToSave.rentPrice = calculateRentPrice(featureToSave);
                featureToSave.buyPrice = calculatePropertyPrice(featureToSave);
                featureToSave.incomeRenting = calculateIncomeRentingOfFeature(featureToSave);
                featureToSave.incomeOwned = calculateIncomeOwnedOfFeature(featureToSave);
            }

            // Store the selected feature
            that.$store.dispatch(SELECT_FEATURE, featureToSave);

            // Set this feature as the only feature in the selected buildings layer
            that.map.getSource('building-selected').setData({
                "type": "FeatureCollection",
                "features": feature ? [feature] : []
            });
        });

        // Render features on data changes. This makes sure that features are loaded when scrolling the map
        this.map.on('data', function(data) {
            if (data.sourceId && data.sourceId === "composite") {
                that.renderFeatures();
            }
        });
    },
    computed: {
        rentingFeatures () {
            return this.$store.state.rentingFeatures;
        },
        ownedFeatures () {
            return this.$store.state.ownedFeatures;
        },
        feature () {
            return this.$store.state.selectedFeature;
        }
    },
    watch: {
        rentingFeatures () {
            this.renderFeatures();
        },
        ownedFeatures () {
            this.renderFeatures();
        },
        feature (current) {
            if (!current) {
                this.map.getSource('building-selected').setData({
                    "type": "FeatureCollection",
                    "features": []
                });
            }
        }
    },
    methods: {
        renderFeatures () {
            if (!this.map.getSource("buildings-owned")) {
                return;
            }

            let features = this.map.querySourceFeatures('composite', { sourceLayer: 'building' });

            let rentingFeaturesIds = this.$store.state.rentingFeatures.map(x => x.id);
            let rentingFeatures = features.filter(x => rentingFeaturesIds.includes(x.id));

            this.map.getSource("buildings-renting").setData({
                "type": "FeatureCollection",
                "features": rentingFeatures
            });

            let ownedFeaturesIds = this.$store.state.ownedFeatures.map(x => x.id);
            let ownedFeatures = features.filter(x => ownedFeaturesIds.includes(x.id));

            this.map.getSource("buildings-owned").setData({
                "type": "FeatureCollection",
                "features": ownedFeatures
            });
        }
    }
};
</script>

<style scoped>
#map {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>
