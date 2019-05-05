<template>
  <b-container fixed id="Widgetcontainer">
    <br>
    <div v-if="isLoading" class="d-flex justify-content-center mb-3">
      <b-spinner variant="primary" label="Large Spinner" type="grow"></b-spinner>
    </div>
    <div v-if=" !errors.length==0">
      <b-alert
        v-for="(e, index) in errors"
        :key="index"
        show
        dismissible
        :variant="e.type"
        @dismissed="handleErrorDismis(index)"
      >{{e.message}}</b-alert>
    </div>
    <div v-if="isprocessingForm" class="d-flex justify-content-center mb-3">
      <b-spinner
        label="Loading..."
        variant="primary"
        type="grow"
        style="width: 2.0rem; height: 2.0rem;"
      ></b-spinner>
    </div>
    <div v-if="!isLoading">
      <b-row>
        <b-col class="col-6">
          <div>
            <b-card no-body bg-variant="light">
              <b-tabs v-model="tabIndex" small card pills>
                <b-tab title="search" v-if="showForm">
                  <div>
                    <b-form @submit="onSubmit" @reset="onReset">
                      <hr>
                      <b-form-group
                        id="fieldset-1"
                        label="Search title"
                        :invalid-feedback="invalidFeedback"
                        :valid-feedback="validFeedback"
                        :state="namestate"
                      >
                        <b-input-group id="WidgetInputname" :state="namestate" trim>
                          <b-input-group-text
                            slot="append"
                            class="border-top-0 border-right-0 border-left-0"
                            v-b-tooltip.hover
                            title="Something descriptive"
                          >
                            <span style="font-size: 20px; color: Dodgerblue;">
                              <i class="fas fa-info-circle"></i>
                            </span>
                          </b-input-group-text>
                          <b-form-input
                            class="border-top-0 border-right-0 border-left-0"
                            v-model="form.name"
                            placeholder=" 'NY travels Moderate'"
                            required
                            type="text"
                            v-b-tooltip.hover
                            :title="computedName"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <hr>
                      <b-form inline>
                        <label
                          class="mr-sm-2"
                          for="inline-form-custom-select-pref"
                        >Audience selection</label>
                        <b-form-checkbox
                          v-model="checked.nationwide"
                          name="nation-wide-check-button"
                          switch
                          inline
                          @change="Handlecheck('nationwide',$event)"
                        >
                          Nation Wide.
                          <span></span>
                        </b-form-checkbox>
                        <b-form-checkbox
                          @change="Handlecheck('state',$event)"
                          v-model="checked.states"
                          name="state-check-button"
                          switch
                          inline
                        >
                          States.
                          <span></span>
                        </b-form-checkbox>
                      </b-form>
                      <div v-if="checked.states">
                        <br>
                        <StateInput
                          v-if="!isLoading"
                          :_autocompleteItems="computedInitialstates"
                          :processingForm="isprocessingForm"
                          @stateTags="StateTags =>form.stateTags = StateTags"
                          @stateCordinates="stateCordinates=>statecordinates=stateCordinates"
                          :reset="ResetWidget"
                        ></StateInput>
                      </div>
                      <hr>
                      <div>
                        <b-form-group label="Select a Location ">
                          <b-input-group>
                            <b-form-input
                              list="LocationOptions"
                              id="input-with-list-three"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              :title="computedLocationToolTip"
                              v-model="location"
                              required
                            ></b-form-input>
                            <b-form-datalist
                              id="LocationOptions"
                              :options="computedLocationOptions"
                            ></b-form-datalist>
                          </b-input-group>
                        </b-form-group>
                      </div>
                      <br>
                      <b-form inline>
                        <b-form-checkbox
                          v-model="enablefilter"
                          name="nation-wide-check-button"
                          switch
                          inline
                          :disabled="canenablefilter"
                        >Enable location filters
                        <span></span>
                        </b-form-checkbox>
                      </b-form>
                      <hr>
                      <div v-if="enablefilter">
                      <div>
                        <b-form-group label="Location category">
                          <b-input-group>
                            <b-input-group-text
                              v-if="isLocationCatloading"
                              slot="append"
                              class="border-top-0 border-right-0 border-left-0"
                              v-b-tooltip.hover
                              title="Loading..."
                            >
                              <div>
                                <b-spinner
                                  small
                                  style="width: 1.5rem; height: 1.5rem;"
                                  label="Small Spinner"
                                  type="grow"
                                  variant="info"
                                ></b-spinner>
                              </div>
                            </b-input-group-text>
                            <b-form-input
                              list="locationcats"
                              id="input-with-list-one"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              :title="computedLocationCatToolTip"
                              v-model="LocationCat"
                              
                            ></b-form-input>
                            <b-form-datalist
                              id="locationcats"
                              :options="computedLocationCatOptions"
                            ></b-form-datalist>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label="Location sub-category">
                          <b-input-group>
                            <b-input-group-text
                              v-if="isLocationSubCatloading"
                              slot="append"
                              class="border-top-0 border-right-0 border-left-0"
                              v-b-tooltip.hover
                              title="Loading..."
                            >
                              <div>
                                <b-spinner
                                  small
                                  style="width: 1.5rem; height: 1.5rem;"
                                  label="Small Spinner"
                                  type="grow"
                                  variant="info"
                                ></b-spinner>
                              </div>
                            </b-input-group-text>
                            <b-form-input
                              list="locationsubcats"
                              id="input-with-list-two"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              :title="computedLocationSubCatToolTip"
                              v-model="LocationSubCat"
                            ></b-form-input>
                            <b-form-datalist
                              id="locationsubcats"
                              :options="computedLocationsubCatOptions"
                            ></b-form-datalist>
                          </b-input-group>
                        </b-form-group>
                      </div>
                      <div>
                        <b-form-group>
                          <template slot="label">
                            Choose Audience frequency:
                            <br>
                            <b-form-checkbox
                              v-model="frequency.allSelected"
                              :indeterminate="frequency.indeterminate"
                              aria-describedby="frequencies"
                              aria-controls="frequencies"
                              @change="toggleAll"
                              switch
                            >{{ frequency.allSelected ? 'Un-select All' : 'Select All' }}</b-form-checkbox>
                          </template>

                          <b-form-checkbox-group
                            id="frequencies"
                            v-model="frequencyselected"
                            :options="frequency.frequencyoptions"
                            name="frequencies"
                            class="ml-4"
                            aria-label="Individual frequency"
                            stacked
                            switches
                          ></b-form-checkbox-group>
                        </b-form-group>
                      </div>
                      </div>
                       <br>
                      <b-button type="submit" variant="primary">Analyze audience</b-button>
                      <b-button type="reset" variant="danger">Reset</b-button>
                    </b-form>
                  </div>
                </b-tab>

                <b-tab ref="Wviewtab" title="view">
                  <div v-if="checked.advancedQuery">
                    <hr>
                    <AdvancedSearch
                      :options="advancedFilters"
                      :totalunique="computedTotalUniqueID"
                      :locationcount="computedcount"
                      :reset="computedcanreset"
                      @resetWidget="evt=>ResetWidget=true"
                    ></AdvancedSearch>
                  </div>
                </b-tab>

                <b-tab ref="Wsummarytab" title="summary">
                  <hr>
                  <Summary
                  :options="advancedFilters"
                  :_summary="computedResponse"
                  ></Summary>
                  <hr>
                </b-tab>
              </b-tabs>
            </b-card>
            <br>
          </div>
        </b-col>
        <b-col class="col-6" v-if="showMap">
          <Chart
            :_response="computedResponse"
            :processingForm="isprocessingForm"
            :searchCaption="form.name"
            :selectedstates="form.stateTags "
            :_type="computedCharttype"
            :_states="initialStates"
            :mode="mode"
          ></Chart>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { ApiFactory } from "./../api/ApiFactory";
import StateInput from "./input/stateInput.vue";
import Chart from "./map/chart.vue";
import AdvancedSearch from "./views/Advancedquery.vue";
import Summary from "./views/summary.vue";

import debounce from "lodash/debounce";
import clone from "lodash/clone";

const StateApi = ApiFactory.get("states");
const LevelsApi = ApiFactory.get("levels");
const QueryApi = ApiFactory.get("query");
export default {
  components: {
    StateInput,
    Chart,
    AdvancedSearch,
    Summary
  },
  props: {},
  data() {
    return {
      errors: [],
      notifications: [],
      tabIndex: 0,
      mode: 0,
      showForm: true,
      showMap: true,
      isLoading: false,
      ResetWidget: false,
      isprocessingForm: false,
      enablefilter:false,
      checked: {
        nationwide: true,
        states: false,
        advancedQuery: true
      },
      isLocationSubCatloading: false,
      isLocationCatloading: false,
      frequency: {
        frequencyoptions: ["Mild", "Moderate", "Frequent"],
        allSelected: false,
        indeterminate: false
      },
      frequencyselected: [],
      form: {
        name: "",
        stateTags: []
      },
      LocationCat: "",
      LocationSubCat: "",
      location: "",
      LocationCatOptions: [],
      LocationSubCatOptions: [],
      LocationOptions: [],
      initialStates: [],
      query: [],
      response: [],
      advancedFilters: {}
    };
  },
  methods: {
    next() {
      console.log(tabIndex);
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.name === "") {
        this.errors.push({
          type: "danger",
          message: "The Search Title Field is required"
        });
        return;
      }
      this.isprocessingForm = true;
      this.form.Level1 = this.LocationCat;
      this.form.Level2 = this.LocationSubCat;
      this.form.location = this.location;
      this.form.frequency = this.frequencyselected;
      this.form.audience = this.checked.states ? "States" : "Nationwide";
      this.form.enableadvance = this.checked.advancedQuery;
      this.advancedFilters = clone(this.form);
      var lastquery = this.query.push(this.form) - 1;
      var vm = this;
      QueryApi.total(this.query[lastquery])
        .then(function(response) {
          let resholder = {};
          resholder.meta = response.data.meta;
          resholder.data = response.data.data;
          vm.response.push(resholder);
          vm.$nextTick(() => {
            vm.isprocessingForm = false;
            vm.mode = 1;
            vm.tabIndex = 1;
          });
        })
        .catch(function(error) {
          vm.isprocessingForm = false;
          vm.errors.push({
            type: "danger",
            message: " your search wasn'nt successfull "
          });
        });
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.name = "";
      this.show = false;
      this.LocationCat = "";
      this.LocationSubCat = "";
      this.LocationSubCatOptions = [];
      this.LocationSubCatOptions = [];
      this.enablefilter = false;
      this.location = "";
      this.frequencyselected =[];
      this.checked.states = false;
      this.checked.nationwide = true;
      this.form.stateTags = [];
      this.response = [];
      this.advancedFilters={
        stateTags:this.form.stateTags,
        frequency:this.frequencyselected,
        Level2: this.LocationSubCat,
        Level1: this.LocationCat,
        location: this.location
      };
      this.$nextTick(() => {
        this.show = true;
      });
    },
    handleErrorDismis(index) {
      if (!this.errors[index]) return;
      this.errors.splice(index, 1);
    },
    Handlecheck(name, event) {
      if (name === "state" && event == true) {
        this.checked.nationwide = false;
      }
      if (name === "nationwide" && event == true) {
        this.checked.states = false;
      }
    },
    toggleAll(checked) {
      this.frequencyselected = checked
        ? this.frequency.frequencyoptions.slice()
        : [];
    },
    initializeapp() {
      this.isLoading = true;
      var vm = this;
      StateApi.get()
        .then(function(response) {
          vm.initialStates = response.data.data;
          vm.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.isLoading = false;
        });
    },
    initOptions() {
      this.isLoading = true;
      var vm = this;
      LevelsApi.get()
        .then(function(response) {
          vm.LocationOptions = response.data.data;
          vm.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.isLoading = false;
        });
    },
    getLocationCatOptions() {
      if (this.computedCanLoadCat) {
        var vm = this;
        let location = this.location.replace(/&/, ":");
        LevelsApi.getcat(location)
          .then(res => {
            vm.isLocationCatloading = false;
            vm.LocationCatOptions = res.data.data.map(x => {
              return x.Level_1;
            }, 0);
          })
          .catch(error => {
            console.log(error);
            vm.isLocationCatloading = false;
            vm.errors.push({
              type: "warning",
              message: `An error occured while retriving location category for ${
                vm.location
              }`
            });
          });
      } else {
        this.isLocationCatloading = false;
        return;
      }
    },
    getLocationSubCatOptions() {
      if (this.computedCanLoadLocationssub) {
        var vm = this;
        let location = this.location.replace(/&/, ":");
        let cat = this.LocationCat;
        LevelsApi.getsubcat(location, cat)
          .then(res => {
            vm.isLocationSubCatloading = false;
            vm.LocationSubCatOptions = res.data.data.map(x => {
              return x.Level_2;
            }, 0);
          })
          .catch(error => {
            console.log(error);
            vm.isLocationSubCatloading = false;
            vm.errors.push({
              type: "warning",
              message: `An error occured while retriving sub categories  for ${
                vm.LocationCat
              }`
            });
          });
      } else {
        this.isLocationSubCatloading = false;
        return;
      }
    }
  },
  watch: {
    location: function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.LocationCat = "";
      this.LocationSubCat = "";
      this.LocationCatOptions = [];
      this.LocationSubCatOptions = [];
      this.isLocationCatloading = true;
      this.debouncedGetLocationCatOptions();
    },
    frequencyselected: function(newVal, oldVal) {
      if (newVal.length === 0) {
        this.frequency.indeterminate = false;
        this.frequency.allSelected = false;
      } else if (newVal.length === this.frequency.frequencyoptions.length) {
        this.frequency.indeterminate = false;
        this.frequency.allSelected = true;
      } else {
        this.frequency.indeterminate = true;
        this.frequency.allSelected = false;
      }
    },
    LocationCat: function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.LocationSubCatOptions = [];
      this.isLocationSubCatloading = true;
      this.debouncedGetLocationSubCatOptions();
    },
    ResetWidget: function(newValue) {
      if (newValue) {
        this.tabIndex = 0;
        this.mode = 0;
        this.form.name = "";
        this.checked.nationwide = true;
        this.checked.states = false;
        this.enablefilter = false;
        this.location = "";
        this.LocationCat = "";
        this.LocationSubCat = "";
        this.form.stateTags = [];
        this.frequencyselected =[];
        this.LocationCatOptions = [];
        this.LocationSubCatOptions = [];
        this.advancedFilters = {
          stateTags:this.form.stateTags,
          frequency:this.frequencyselected,
          Level2: this.LocationSubCat,
          Level1: this.LocationCat,
          location: this.location
        };
        this.response = [];
        this.$nextTick(() => {
          this.ResetWidget = false;
        });
      }
    }
  },
  created() {
    this.initializeapp();
    this.initOptions();
    this.debouncedGetLocationCatOptions = debounce(
      this.getLocationCatOptions,
      500
    );
    this.debouncedGetLocationSubCatOptions = debounce(
      this.getLocationSubCatOptions,
      500
    );
  },
  computed: {
    computedName(){
      return this.form.name === "Enter a search title"? "":`${this.form.name}`;
    },
    namestate() {
      return this.form.name.length >= 10 ? true : false;
    },
    invalidFeedback() {
      if (this.form.name.length > 10) {
        return "";
      } else if (this.form.name.length > 0) {
        return "Enter at least 10 characters";
      } else {
        return "Please enter a search title ";
      }
    },
    validFeedback() {
      return this.namestate === true ? "Nice" : "";
    },
    computedInitialstates() {
      return this.initialStates.map(state => {
        return {
          text: state.name,
          abv: state.abv,
          iconColor: "#000000",
          myicon: "location_on",
          lat: state.latitude,
          lng: state.longitude
        };
      }, 0);
    },
    computedCanLoadCat() {
      return this.computedLocationOptions.indexOf(this.location) != -1;
    },
    computedLocationOptions() {
      return this.LocationOptions.map(x => {
        return x.LOCATION;
      }, 0);
    },
    canenablefilter(){
      return this.location === ""? true:false;   
    },
    computedCanLoadLocationssub() {
      return this.computedCanLoadCat;
    },
    computedLocationToolTip() {
      return this.location === ""
        ? "select a location"
        : `selected location : ${this.location}`;
    },
    computedLocationCatOptions() {
      return this.LocationCatOptions.map(option => {
        return option;
      }, 0);
    },
    computedLocationCatToolTip() {
      return this.LocationCat === ""
        ? "select a category"
        : `selected category :${this.LocationCat}`;
    },
    computedLocationsubCatOptions() {
      return this.LocationSubCatOptions.map(option => {
        return option;
      }, 0);
    },
    computedLocationSubCatToolTip() {
      return this.LocationSubCat === ""
        ? "select a sub-category"
        : `selected-category :${this.LocationSubCat}`;
    },
    computedmarkers() {
      if (this.response.length === 0) {
        return [];
      }
      var lastEntry = this.response[this.response.length - 1];
      var lastEntryMeta = lastEntry.meta;
      const lastEntryData = lastEntry.data;
      const unique = [];
      const map = new Map();
      for (const item of lastEntryData) {
        if (!map.has(item.ID)) {
          map.set(item.ID, true);
          unique.push(item.ID);
        }
      }
      return lastEntryData
        .filter(marker => {
          return unique.indexOf(marker.ID) != -1;
        })
        .map(marker => {
          return { map: marker._map, count: marker.count };
        }, 0);
    },
    computedcanreset() {
      return this.computedResponse.length === 0 ? false : true;
    },

    //update
    computedMarkersUpdate() {
      if (this.response.length === 0) {
        return [];
      }
      var lastEntry = this.response[this.response.length - 1];
      var lastEntryMeta = lastEntry.meta;
      const lastEntryData = lastEntry.data;
      return lastEntryData
        .filter(marker => {
          return typeof marker._map.latitude != "undefined";
        })
        .map(marker => {
          return { map: marker._map, count: marker.count };
        }, 0);
    },
    computedResponse() {
      var data = this.computedMarkersUpdate;
      if (data.length === 0) {
        return [];
      }
      var result = Array.from(new Set(data.map(s => s.count))).map(count => {
        return { count: count, map: data.find(s => s.count === count).map };
      });
      return result;
    },
    computedTotalUniqueID() {
      return this.computedResponse.reduce(
        (totalIds, currentobj) => totalIds + currentobj.count,
        0
      );
    },
    computedcount() {
      return this.computedResponse.length;
    },
    computedCharttype() {
      return this.checked.nationwide ? 1 : 0;
    }
  },
  mounted() {}
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