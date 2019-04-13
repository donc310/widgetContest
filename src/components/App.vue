<template>
  <b-container fixed id="Widgetcontainer">
    <div>
      <b-navbar toggleable type="light" variant="light" id="widgetNav" class="ml-1 ml-3">
        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
        <b-navbar-brand>Widget</b-navbar-brand>
      </b-navbar>
    </div>
    <br>
    <b-row>
      <b-col class="col-6">
        <div>
          <b-card no-body bg-variant="light">
            <b-tabs v-model="tabIndex" small card pills end>
              <b-tab title="General" v-if="showForm">
                <div>
                  <b-form @reset="onReset">
                    <NameInput></NameInput>
                    <CategoryInput></CategoryInput>
                    <AudienceInput></AudienceInput>
                    <hr>
                    <br>
                    <div>
                      <b-form inline>
                        <label
                          class="mr-sm-2"
                          for="inline-form-custom-select-pref"
                        >Location selector ...</label>
                        <div>
                          <b-button>Nation wide</b-button>
                          <b-button variant="primary">States</b-button>
                          <b-button variant="outline-primary">Cities</b-button>
                        </div>
                      </b-form>
                    </div>
                    <br>
                    <div v-if="querystates">
                      <StateInput @widgetmarkerchanged="updateMapLoactions"></StateInput>
                    </div>
                    <br>
                    <div v-if="querycities">
                      <CityInput
                        @widgetcityinputchanged="changePlace($event)"
                        @widgetuseplace="usePlace($event)"
                        @Widgetplacepoped="mapMarkerspop($event)"
                      ></CityInput>
                    </div>
                  </b-form>
                </div>
              </b-tab>
              <b-tab title="Edit profile" disabled></b-tab>
              <b-tab title="Premium Plan" disabled></b-tab>
              <b-tab title="Info" disabled></b-tab>
            </b-tabs>
          </b-card>
          <br>
          <div class="text-center">
            <b-button-group class="mt-2">
              <b-button @click="tabIndex--">Previous</b-button>
              <b-button @click="tabIndex++">Next</b-button>
            </b-button-group>
          </div>
        </div>
      </b-col>
      <b-col class="col-6" v-if="showMap">
        <GForm
          :markers="currentMaker"
          :placeprop="place"
          :useplaceprop="usePlaceMarker"
          @widgetplaceadded="placemakerAdded"
        ></GForm>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import NameInput from "./input/nameInput.vue";
import AudienceInput from "./input/audienceInput.vue";
import CategoryInput from "./input/categoryInput.vue";
import StateInput from "./input/stateInput.vue";
import CityInput from "./input/citiesInput.vue";
import GForm from "./map/map.vue";
export default {
  components: {
    StateInput,
    CityInput,
    NameInput,
    AudienceInput,
    CategoryInput,
    GForm
  },
  props: {
    _mapview: {
      type: String,
      default: "STATE",
      validator: mapview => {
        return _mapview === "STATE" || _mapview === "CITES";
      }
    },
    _markers: { type: Object, default: { cites: [], states: [] } },
    _place: { type: Object, default: null }
  },
  data() {
    return {
      tabIndex: 1,
      showForm: true,
      showMap: true,
      querycities: true,
      querystates: true,
      form: {},
      markers: this._markers,
      currentMaker: [],
      place: null,
      mapview: "CITES",
      usePlaceMarker: false
    };
  },
  methods: {
    next() {
      console.log(tabIndex);
    },
    updateMapLoactions(event, name) {
      if (name === "STATE") {
        this.markers.states = event;
      }
      if (name === "CITES") {
        this.markers.cites = event;
      }
      this.currentMaker = event;
    },
    changePlace(event) {
      if (this.mapview === "CITES") {
        this.place = event;
      }
    },
    usePlace(event) {
      if (this.mapview === "CITES" && this.place) {
        this.usePlaceMarker = true;
      }
    },
    placemakerAdded(event) {
      this.usePlaceMarker = false;
      this.place = null;
      //this.currentMaker = event
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.email = "";
      this.form.name = "";
      this.form.food = null;
      this.form.checked = [];
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    mapMarkerspop(event){
      //this.currentMaker.pop();
      console.log( this.currentMaker);

    }
  },
  watch: {},
  computed: {
    mapMarkers() {
      if (this._mapview === "CITES") {
        return this.markers.cites;
      } else {
        return this.markers.states;
      }
    }
  }
};
</script>
<style lang="css">
@import "https://use.fontawesome.com/releases/v5.8.1/css/all.css";

.tab-pane {
  height: 490px;
  overflow-y: scroll;
}
#Widgetcontainer {
  background-color: #ced4da;
  border-radius: 7px;
  border: 2px solid #ced4da;
  padding: 20px;
}
#widgetNav {
  padding-top: 0px;
}
</style>