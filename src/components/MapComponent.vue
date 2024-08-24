<template>
      <div id="map" style="width: 100%; height: 100vh;"></div>
     
   
</template>

<script>
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet.glify';
 import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
const MAPTILER_KEY = 'JGnUJDheCEq8cbTbAO8q';
const apiUrl = 'https://toncenter.com/api/v3/nft/collections';
export default {
    name: 'MapComponent',
    data () {
        return {
            map: null
        };
    },
    
    mounted () {
      
         let that = this;
        
        // Leaflet haritasını oluştur
    //    this.map = new OSMBuildings({
    //   container: 'map',
    //   position: { latitude: 52.51836, longitude: 13.40438 },
    //   zoom: 16,
    //   minZoom: 15,
    //   maxZoom: 20,
    //   attribution: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
    // });
    const map = new maplibregl.Map({
  style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,  
  center: [28.9784, 41.0082], // İstanbul'un merkezi: [longitude, latitude]
  zoom: 15.5, 
  pitch: 45, 
  bearing: -17.6, 
  container: 'map', 
  antialias: true, 
  interactive: true 
});
// map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }));
//    map.addMapTiles('https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png');

// new maplibregl.Marker()
//       .setLngLat([-74.0066, 40.7135]) // İşaretçinin konumunu belirleyin
//       .addTo(this.map); // İşaretçiyi haritaya ekleyin

// OSM Buildings GeoJSON döşemelerini ekle
//  map.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');
//         // OpenStreetMap döşemelerini ekle
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(map);
      

map.on('click', '3d-buildings', function (e) {
    // Tıklanan bina verilerini al
    var properties = e.features[0].properties;

    // Örneğin bina adı veya diğer özellikleri alabilirsiniz
    var buildingName = properties.name || 'Bilinmeyen Bina';

    // Popup oluştur ve içine buton ekle
    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <div>
                <h3>${buildingName}</h3>
                 <div id="nft-info">
                <p>Loading NFT data...</p> <!-- İlk başta yükleniyor mesajı gösterebiliriz -->
            </div>

  
                <button id="popup-button">NFT Get Properties</button>
            </div>
        `)
        .addTo(map);

    // Butonun tıklanma olayını dinle
    document.getElementById('popup-button').addEventListener('click', async function() {
        const params = {
    collection_address: 'EQATEOwUgT01I1FcVbWN0_9HvlOBCT_quBvHaELgIUnl3uDa',
    owner_address: 'UQBQPQcxTxLIq81epSjHwRseaZ51fSgW4I8JhqDhnoBrL2Lk',
    limit: 128,
    offset: 0
};
axios.get(apiUrl, { params })
        .then(response => {
            const nftCollections = response.data.nft_collections;

            // İlk koleksiyonun URI'sini al (örnek olarak ilkini kullanalım)
            if (nftCollections.length > 0) {
                const contentUri = nftCollections[0].collection_content.uri;

                // Content URI'ye GET isteği yap
                axios.get(contentUri)
                    .then(contentResponse => {
                        const nftName = contentResponse.data.name;
                        const nftDescription = contentResponse.data.description;
                        const nftImage = contentResponse.data.image;
                        
                        // PopUp içeriğini güncelle
                        document.getElementById('nft-info').innerHTML = `
                            <strong>Name :</strong><h1>${nftName}</h1>
                            <strong>Description :</strong><p>${nftDescription}</p>
                            <img src="${nftImage}" alt="NFT Image" style="width: 120px; height: 100px;" />
                        `;
                    })
                    .catch(contentError => {
                        console.error('Error fetching content URI:', contentError);
                        document.getElementById('nft-info').innerHTML = '<p>Error loading NFT data.</p>';
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });    
    });
});





let hoveredBuildingId = null;




        map.on('load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
          }
      }

      map.addSource('openmaptiles', {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
          type: 'vector',
      });

      map.addLayer(
          {
              'id': '3d-buildings',
              'source': 'openmaptiles',
              'source-layer': 'building',
              'type': 'fill-extrusion',
              'minzoom': 15,
              'filter': ['!=', ['get', 'hide_3d'], true],
              'paint': {
                  'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'red',   // Üzerine gelinen bina rengi
            [
                'interpolate',
                ['linear'],
                ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
            ] // Varsayılan renk
        ],
                  'fill-extrusion-height': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      15,
                      0,
                      16,
                      ['get', 'render_height']
                  ],
                  'fill-extrusion-base': ['case',
                      ['>=', ['get', 'zoom'], 16],
                      ['get', 'render_min_height'], 0
                  ]
              }
          },
          labelLayerId
      );
  });

  map.on('mouseenter', '3d-buildings', function (e) {

if (e.features.length > 0) {
    
    if (hoveredBuildingId) {
        map.setFeatureState(
            { source: 'openmaptiles', sourceLayer: 'building', id: hoveredBuildingId },
            { hover: false }
        );
    }

    // Yeni binayı vurgula
    hoveredBuildingId = e.features[0].id;
    map.setFeatureState(
        { source: 'openmaptiles', sourceLayer: 'building', id: hoveredBuildingId },
        { hover: true }
    );

    map.getCanvas().style.cursor = 'pointer'; // Fare imlecini pointer yap
}
});

map.on('mouseleave', '3d-buildings', function () {
// Fare bina üzerinden çıkarsa, vurgulama durumunu sıfırla
if (hoveredBuildingId) {
    map.setFeatureState(
        { source: 'openmaptiles', sourceLayer: 'building', id: hoveredBuildingId },
        { hover: false }
    );
}
hoveredBuildingId = null;
map.getCanvas().style.cursor = ''; // Fare imlecini varsayılan yap
});



//     var latlng = e.latlng;

//     L.marker([latlng.lat, latlng.lng]).addTo(this.map)
//         .bindPopup('Koordinatlar: ' + latlng.lat + ', ' + latlng.lng)
//         .openPopup();
// });


        // this.map.on('click', function(e) {
        //     // Get all features at the mouse click
        //     var features = that.map.queryRenderedFeatures(e.point);

        //     // Only select things from the buildings layer
        //     features = features.filter(x => x.sourceLayer === 'building' && x.properties.underground === "false");
            
        //     let feature = features.length ? features[0] : null;

        //     let featureToSave = null;

        //     if (feature) {
        //         featureToSave = {
        //             id: feature.id,
        //             source: feature.source,
        //             sourceLayer: feature.sourceLayer,
        //             layerId: feature.layer.id,
        //             properties: feature.properties,
        //             geometry: feature._geometry || feature.geometry,
        //             values: feature._vectorTileFeature._values
        //         }

        //         featureToSave.area = calculateAreaOfFeature(featureToSave);
        //         featureToSave.rentPrice = calculateRentPrice(featureToSave);
        //         featureToSave.buyPrice = calculatePropertyPrice(featureToSave);
        //         featureToSave.incomeRenting = calculateIncomeRentingOfFeature(featureToSave);
        //         featureToSave.incomeOwned = calculateIncomeOwnedOfFeature(featureToSave);
        //     }

        //     // Store the selected feature
        //     that.$store.dispatch(SELECT_FEATURE, featureToSave);

        //     // Set this feature as the only feature in the selected buildings layer
        //     that.map.getSource('building-selected').setData({
        //         "type": "FeatureCollection",
        //         "features": feature ? [feature] : []
        //     });
        // });

        // Render features on data changes. This makes sure that features are loaded when scrolling the map
        map.on('data', function(data) {
            if (data.sourceId && data.sourceId === "composite") {
                that.renderFeatures();
            }
        });
    },
    computed: {
        rentingFeatures () {
            console.log("sdasd")
            return this.$store.state.rentingFeatures;
        },
        ownedFeatures () {
            console.log("sdasd")
            return this.$store.state.ownedFeatures;
        },
        feature () {
            console.log("sdasd")
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
    height: 100vh;
 
}
</style>
