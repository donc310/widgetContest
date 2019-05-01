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
                        :invalid-feedback="invalidFeedback"
                        :valid-feedback="validFeedback"
                        :state="namestate"
                        description="*Search tittle "
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
                      <hr>
                      <div>
                        <b-form-group label="Audience Level 1">
                          <b-form-input
                            list="Level1options"
                            id="input-with-list-one"
                            class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                            v-b-tooltip.hover
                            :title="computedLevelOneotoolTip"
                            v-model="audience1"
                            required
                          ></b-form-input>
                          <b-form-datalist id="Level1options" :options="computedLevelOneOptions"></b-form-datalist>
                        </b-form-group>
                        <b-form-group label="Audience Level 2">
                          <b-input-group>
                            <b-input-group-text
                              v-if="isLevel2optionloading"
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
                              list="Level2options"
                              id="input-with-list-two"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              :title="computedLevelTwotoolTip"
                              v-model="audience2"
                            ></b-form-input>
                            <b-form-datalist id="Level2options" :options="computedLevelTwoOptions"></b-form-datalist>
                          </b-input-group>
                        </b-form-group>
                      </div>
                      <div v-if="checked.states">
                        <hr>
                        <StateInput
                          v-if="!isLoading"
                          :_autocompleteItems="computedInitialstates"
                          :processingForm="isprocessingForm"
                          @stateTags="StateTags =>form.stateTags = StateTags"
                        ></StateInput>
                      </div>
                      <div>
                        <b-form-group label="Select a Location ">
                          <b-input-group>
                            <b-input-group-text
                              v-if="isLocationOptionloading"
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
                              list="LocationOptions"
                              id="input-with-list-three"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              :title="computedLocationToolTip"
                              v-model="location"
                            ></b-form-input>
                            <b-form-datalist
                              id="LocationOptions"
                              :options="computedLocationOptions"
                            ></b-form-datalist>
                          </b-input-group>
                        </b-form-group>
                      </div>
                      <div>
                        <hr>
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
                    :locationcount ="computedcount"
                    ></AdvancedSearch>
                  </div>
                </b-tab>
              </b-tabs>
            </b-card>
            <br>
          </div>
        </b-col>
        <b-col class="col-6" v-if="showMap">
          <GForm :processingForm="isprocessingForm" :markers="computedMarkersUpdate"></GForm>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { ApiFactory } from "./../api/ApiFactory";
import StateInput from "./input/stateInput.vue";
import GForm from "./map/map.vue";
import AdvancedSearch from "./views/Advancedquery.vue";
import debounce from "lodash/debounce";
import clone from "lodash/clone";
const StateApi = ApiFactory.get("states");
const LevelsApi = ApiFactory.get("levels");
const QueryApi = ApiFactory.get("query");
export default {
  components: {
    StateInput,
    GForm,
    AdvancedSearch
  },
  props: {},
  data() {
    return {
      errors: [],
      notifications: [],
      tabIndex: 0,
      showForm: true,
      showMap: true,
      isLoading: false,
      isprocessingForm: false,
      checked: {
        nationwide: true,
        states: false,
        advancedQuery: true
      },
      isLevel2optionloading: false,
      isLocationOptionloading: false,
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
      audience1: "",
      audience2: "",
      location: "",
      Level1options: [],
      Level2options: [],
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
      this.form.Level1 = this.audience1;
      this.form.Level2 = this.audience2;
      this.form.location = this.location;
      this.form.frequency = this.frequencyselected;
      this.form.audience = this.checked.states ? "states" : "nationwide";
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
      this.audience1 = "";
      this.audience2 = "";
      this.checked.nationwide = true;
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
          vm.Level1options = response.data.data;
          vm.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.isLoading = false;
        });
    },
    getLevel2options() {
      if (this.computedCanLoadLevelTwo) {
        var vm = this;
        let level = this.audience1.toLocaleLowerCase();
        fetch(`http://127.0.0.1:5000/api/leveloptions?level=${level}`)
          .then(resp => resp.json())
          .then(data => {
            vm.isLevel2optionloading = false;
            vm.Level2options = data.data.map(res => {
              return res.Level_2.toUpperCase();
            }, 0);
          })
          .catch(error => {
            console.log(error);
            vm.isLevel2optionloading = false;
            vm.errors.push({
              type: "warning",
              message: `An error occured while retriving level 2 audience for ${
                vm.audience1
              }`
            });
          });
      } else {
        this.isLevel2optionloading = false;
        return;
      }
    },
    getLocations() {
      if (this.computedCanLoadLocations) {
        var vm = this;
        let level1 = this.audience1.toLocaleLowerCase();
        let level2 = this.audience2.toLocaleLowerCase();
        let url = `http://127.0.0.1:5000/api/leveloptions?level=${level1}&sublevel=${level2}`;
        fetch(url)
          .then(resp => resp.json())
          .then(data => {
            vm.isLocationOptionloading = false;
            vm.LocationOptions = data.data.map(res => {
              return res.LOCATION;
            }, 0);
          })
          .catch(error => {
            console.log(error);
            vm.isLevel2optionloading = false;
            vm.errors.push({
              type: "warning",
              message: `An error occured while retriving Location optons for ${
                vm.audience1
              }`
            });
          });
      } else {
        this.isLocationOptionloading = false;
        return;
      }
    }

  },
  watch: {
    audience1: function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.audience2 = "";
      this.location = "";
      this.Level2options = [];
      this.LocationOptions = [];
      this.isLevel2optionloading = true;
      this.debouncedGetLevel2options();
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
    audience2: function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.location = "";
      this.LocationOptions = [];
      this.isLocationOptionloading = true;
      this.debouncedGetLocationoptions();
    }
  },
  created() {
    this.initializeapp();
    this.initOptions();
    this.debouncedGetLevel2options = debounce(this.getLevel2options, 500);
    this.debouncedGetLocationoptions = debounce(this.getLocations, 500);
  },
  computed: {
    namestate() {
      return this.form.name.length >= 4 ? true : false;
    },
    invalidFeedback() {
      if (this.form.name.length > 4) {
        return "";
      } else if (this.form.name.length > 0) {
        return "Enter at least 4 characters";
      } else {
        return "Please enter something";
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
          myicon: "location_on"
        };
      }, 0);
    },
    computedLevelOneOptions() {
      return this.Level1options.map(levelone => {
        return levelone.Level_1.toUpperCase();
      }, 0);
    },
    computedCanLoadLevelTwo() {
      return this.computedLevelOneOptions.indexOf(this.audience1) != -1;
    },
    computedLevelTwotoolTip() {
      return this.computedCanLoadLevelTwo
        ? `Optimize your search by selecting a sub level for ${this.audience1.toLocaleLowerCase()} `
        : " Select Audience main level first ";
    },
    computedLevelOneotoolTip() {
      return this.computedLevelOneOptions.indexOf(this.audience1) != -1
        ? `Selected  level : ${this.audience1.toLocaleLowerCase()}`
        : "Select Main audience level..";
    },
    computedLevelTwoOptions() {
      return this.Level2options.map(leveltwo => {
        return leveltwo.toUpperCase();
      }, 0);
    },
    computedLocationOptions() {
      return this.LocationOptions.map(location => {
        return location.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
      }, 0);
    },
    computedCanLoadLocations() {
      return this.computedCanLoadLevelTwo;
    },
    computedLocationToolTip() {
      return this.computedLevelOneOptions.indexOf(this.audience1) != -1
        ? `Location options for ${this.audience1}`
        : " Select Main audience level first.";
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

    //update
    computedMarkersUpdate(){
      if (this.response.length === 0) {
        return [];
      }
      var lastEntry = this.response[this.response.length - 1];
      var lastEntryMeta = lastEntry.meta;
      const lastEntryData = lastEntry.data;
      return lastEntryData
      .filter(marker=>{return typeof(marker._map.latitude)!="undefined"})
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
      return result
    },
    computedTotalUniqueID() {
      return this.computedResponse.reduce(
        (totalIds, currentobj) => totalIds + currentobj.count,
        0
      );
    },
    computedcount() {
      return this.computedResponse.length;
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