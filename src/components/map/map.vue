<template>
  <div>
    <GmapMap
      style="width:492px; height:622px;"
      :center="center"
      :zoom="zoom"
      :options="{styles: [], scrollwheel: scrollwheel}"
      @zoom_changed="update('zoom', $event)"
      @center_changed="update('reportedCenter', $event)"
    >
      <div v-if="!clustering">
        <GmapMarker
          v-for="m in mapmarkers"
          :position="m.position"
          label="★"
          :opacity="m.opacity"
          :draggable="m.draggable"
          @click="markerClicked(m,$event)"
          @position_changed="updateChild(m, 'position', $event)"
          :key="m.id"
        >
          <gmap-info-window :opened="m.ifw">{{m.ifw2text}}</gmap-info-window>
        </GmapMarker>
        <gmap-info-window :position="reportedCenter" :opened="ifw2">{{ifw2text}}</gmap-info-window>
      </div>
    </GmapMap>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      mapmarkers: [],
      lastId: 0,
      center: { lat: 38.58677159688291, lng: -100.54108291233062 },
      reportedCenter: { lat: 38.58677159688291, lng: -100.54108291233062 },
      clustering: false,
      zoom: 4,
      gridSize: 50,
      drag: 0,
      ifw: true,
      ifw2: true,
      ifw2text: "Heat Map will be generated here",
      scrollwheel: true
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
    markerClicked(obj, event) {},
    updateMap(newValue) {
      var update = newValue;
      this.mapmarkers = [];
      this.lastId = 0;
      update.forEach(marker => {
        this.addMarker(marker);
      });
    }
  },
  watch: {},
  updated() {},
  computed: {},
  created() {},
  mounted() {}
};
</script>