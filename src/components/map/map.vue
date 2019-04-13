<template>
  <div>
    <GmapMap
      style="width:492px; height:622px;"
      :center="center"
      :zoom="zoom"
      :options="{styles: mapStyles, scrollwheel: scrollwheel}"
      @click="mapClicked($event)"
      @rightclick="mapRclicked($event)"
      @zoom_changed="update('zoom', $event)"
      @center_changed="update('reportedCenter', $event)"
    >
      <div v-if="!clustering">
        <GmapMarker
          v-for="m in activeMarkers"
          :position="m.position"
          :opacity="m.opacity"
          :draggable="m.draggable"
          @click="markerClicked(m,$event)"
          @position_changed="updateChild(m, 'position', $event)"
          :key="m.id"
        >
          <gmap-info-window :opened="m.ifw">{{m.ifw2text}}</gmap-info-window>
        </GmapMarker>
        <GmapMarker
          v-if="this.place"
          label="x"
          :position="{ lat: this.place.geometry.location.lat(),lng: this.place.geometry.location.lng(),}"
          @click="markerClicked(this,$event)"
        >
          <gmap-info-window :opened="true">
            <p v-html="this.place.adr_address"></p>
          </gmap-info-window>
        </GmapMarker>
        <gmap-info-window :position="reportedCenter" :opened="ifw2">{{ifw2text}}</gmap-info-window>
      </div>
    </GmapMap>
  </div>
</template>

<script>
export default {
  props: {
    markers: { type: Array },
    placeprop: { type: Object },
    useplaceprop: { type: Boolean }
  },
  data() {
    return {
      mapmarkers: [],
      lastId: 1,
      center: { lat: 32.806671, lng: -86.79113 },
      reportedCenter: { lat: 32.806671, lng: -86.79113 },
      clustering: false,
      zoom: 7,
      gridSize: 50,
      drag: 0,
      ifw: true,
      ifw2: false,
      ifw2text: "",
      scrollwheel: true,
      mapStyle: "normal",
      place: null,
      addPlace: false
    };
  },
  methods: {
    updateMapCenter(which, value) {
      this.center = _.clone(this.reportedCenter);
    },
    mapClicked(mouseArgs) {
      console.log("map clicked", mouseArgs);
    },
    setDescription(description) {
      this.description = description;
    },
    addMarker() {
      this.lastId++;
      this.mapmarkers.push({
        id: this.lastId,
        position: {
          lat: { type: Number },
          lng: { type: Number }
        },
        opacity: 1,
        draggable: false,
        enabled: true,
        ifw: true,
        ifw2text: "Will display location details"
      });
      if (this.mapmarkers[this.mapmarkers.length - 1]) {
        return this.mapmarkers[this.mapmarkers.length - 1];
      } else {
        console.log(this.mapmarkers);
      }
    },
    loopThrough(obj) {
      var postions = [];
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if (typeof obj[key] !== "object") {
          console.log(key + " = " + obj[key]);
          postions.push(obj[key]);
        } else {
          loopThrough(obj[key]);
        }
      }
      return postions;
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
    mapRclicked(mouseArgs) {
      const createdMarker = this.addMarker();
      createdMarker.position.lat = mouseArgs.latLng.lat();
      createdMarker.position.lng = mouseArgs.latLng.lng();
    },
    mapclicked(mouseArgs) {
      const createdMarker = this.addMarker();
      createdMarker.position.lat = mouseArgs.latLng.lat();
      createdMarker.position.lng = mouseArgs.latLng.lng();
    },
    markerClicked(obj, event) {
      console.log(obj);
      console.log(event);
    }
  },
  watch: {
    markers: function(newValue, oldValue) {
      var update = newValue;
      update.forEach(marker => {
        const newMarker = this.addMarker();
        newMarker.position.lat = marker[0];
        newMarker.position.lng = marker[1];
      });
    },
    placeprop: function(newValue, oldValue) {
      this.place = newValue;
    },
    useplaceprop: function(newValue, oldValue) {
      this.addPlace = newValue;
      if (this.addPlace && this.place) {
        const newPlace = this.addMarker();
        newPlace.position.lat = this.place.geometry.location.lat();
        newPlace.position.lng = this.place.geometry.location.lng();
        newPlace.position.ifw2text = this.place.adr_address;
        this.$emit("widgetplaceadded");
      }
    }
  },
  updated() {
    console.log("map updated");
  },
  computed: {
    mapStyles() {
      switch (this.mapStyle) {
        case "normal":
          return [];
        case "red":
          return [];
        default:
          return [];
      }
    },
    activeMarkers() {
      return this.mapmarkers;
    }
  }
};
</script>