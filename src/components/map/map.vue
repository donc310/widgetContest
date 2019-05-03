<template>
  <div>
    <GmapMap
      ref="mymap"
      style="width:492px; height:622px;"
      :center="center"
      :zoom="zoom"
      :options="{styles: [], scrollwheel: scrollwheel}"
      @zoom_changed="update('zoom', $event)"
      @center_changed="update('reportedCenter', $event)"
    >
      <div v-if="!clustering">
        <GmapMarker
          v-for="m in computedMarkers"
          :position="m.position"
          :label="m.abv"
          :opacity="m.opacity"
          :draggable="m.draggable"
          @click="markerClicked(m,$event)"
          @position_changed="updateChild(m, 'position', $event)"
          :key="m.id"
          heading=5
        >
          <gmap-info-window :opened="m.ifw">
            <div class="text-center">
              <b-button variant="info">
                {{m.state}}
                <b-badge pill variant="light">{{m.count}}<span class="sr-only"></span></b-badge>
              </b-button>
            </div>
          </gmap-info-window>
        </GmapMarker>

        <gmap-info-window :position="reportedCenter" :opened="computedcanopenmainwindow">
          <span v-if="!processingForm ">{{ifw2text}}</span>
          <div v-if="processingForm" class="d-flex justify-content-center mb-3">
            <b-spinner
              small
              style="width: 2.0rem; height: 2.0rem;"
              label="Small Spinner"
              type="grow"
              variant="info"
            ></b-spinner>
          </div>
        </gmap-info-window>
      </div>
    </GmapMap>
  </div>
</template>
<script>
export default {
  props: {
    processingForm: { type: Boolean },
    markers: { type: Array },
    heatmapCordinate:{type :Array}
  },
  data() {
    return {
      mapmarkers:[],
      lastId: 0,
      center: {lat: 40, lng: -100},
      reportedCenter: {lat: 40, lng: -100},
      clustering: false,
      zoom: 4,
      gridSize: 50,
      drag: 0,
      ifw: true,
      ifw2: true,
      ifw2text: "Heat Map will be generated here",
      scrollwheel: true,
      heatMap: {}
    };
  },
  methods: {
    updateMapCenter(which, value) {
      this.center = _.clone(this.reportedCenter);
    },
    addMarker(marker) {
      this.lastId++;
      this.mapmarkers.push({
        id: this.lastId,
        position: {
          lat: marker[0],
          lng: marker[1]
        },
        opacity: 1,
        draggable: false,
        enabled: true,
        ifw: true,
        ifw2text: marker[3] + "(" + marker[2] + ")" + marker[4]
      });
    },
    update(field, event) {
      if (field === "reportedCenter") {
        this.reportedCenter = {
          lat: event.lat(),
          lng: event.lng()
        };
      } else if (field === "bounds") {
        this.mapBounds = event;
      } else {
        this.$set(this, field, event);
      }
    },
    updateChild(object, field, event) {
      if (field === "position") {
        object.position = {
          lat: event.lat(),
          lng: event.lng()
        };
      }
    },
    markerClicked(obj, event){
      if (! obj.enabled){
        obj.enabled = true;
      }
    },
    updateMap(newValue) {
      var update = newValue;
      this.mapmarkers = [];
      this.lastId = 0;
      update.forEach(marker => {
        this.addMarker(marker);
      });
    }
  },
  watch:{
    heatmapCordinate:function(newValue,oldValue){
      if (newValue === oldValue) {
        return
      }
      if(this.heatmapPoints.length === 0){
        return 
        }
      let heatmap  = new google.maps.visualization.HeatmapLayer({
        map: this.$refs.mymap.$mapObject,
        data: this.heatmapPoints
      }); 
    }
    
  },
  updated() {},
  computed: {
    heatmapPoints () {
      if(this.heatmapCordinate.length === 0){return []}
      return this.heatmapCordinate.map(
          point => new google.maps.LatLng(point.lat, point.lng)
      )
    },
    computedMarkers() {
     if(this.markers.length === 0){return []}

      var result = Array.from(new Set(this.markers.map(s => s.count))).map(
        count => {
          return { count: count, map: this.markers.find(s => s.count === count).map };
        }
      );
      return result.map((mark,index)=>{return{
        id: index,
        position: {
          lat: mark.map.latitude,
          lng: mark.map.longitude
        },
        opacity: 1,
        draggable: false,
        enabled: true,
        ifw: true,
        state: mark.map.name,
        count: mark.count,
        abv:mark.map.abv

      }},0)
    },
    computedcanopenmainwindow() {
      return  this.heatmapCordinate.length === 0;
    },
  },

  created(){},
  mounted() {
    this.$nextTick(() => {
      this.$refs.mymap.$mapPromise.then(() => {
      });
    })

  }
};
</script>