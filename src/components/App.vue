<template>
  <b-container fixed id="Widgetcontainer">
    <div>
      <NavBar></NavBar>
    </div>
    <br>
    <div v-if="isLoading" class="d-flex justify-content-center mb-3">
      <b-spinner
        variant="primary"
        style="width: 10rem; height: 10rem;"
        label="Large Spinner"
        type="grow"
      ></b-spinner>
    </div>
    <div v-if=" !errors.length==0">
      <b-alert
        v-for="(e, index) in errors"
        :key="index"
        show
        dismissible
        variant="{{e.type}}"
      >{{e.message}}</b-alert>
    </div>
    <div v-if="!isLoading">
      <b-row>
        <b-col class="col-6">
          <div>
            <b-card no-body bg-variant="light">
              <b-tabs v-model="tabIndex" small card pills end>
                <b-tab title="General" v-if="showForm" @submit="onSubmit" @reset="onReset">
                  <div>
                    <b-form @reset="onReset">
                      <hr>

                      <b-form-group
                        id="fieldset-1"
                        :key="lg"
                        :invalid-feedback="invalidFeedback"
                        :valid-feedback="validFeedback"
                        :state="namestate"
                        description="*Search tittle "
                      >
                        <b-input-group id="WidgetInputname" size="lg" :state="namestate" trim>
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
                            id="input-with-list"
                            size="lg"
                            class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                            v-b-tooltip.hover
                            title="Tooltip content"
                            v-model="audience1"
                          ></b-form-input>
                          <b-form-datalist id="Level1options" :options="Level1options"></b-form-datalist>
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
                                <b-spinner small label="Small Spinner" type="grow" variant="info"></b-spinner>
                              </div>
                            </b-input-group-text>
                            <b-form-input
                              list="Level2options"
                              id="input-with-list"
                              size="lg"
                              class="border-top-0 border-right-0 border-left-0 border-bottom-10"
                              v-b-tooltip.hover
                              title="Tooltip content"
                              v-model="audience2"
                            ></b-form-input>
                            <b-form-datalist id="Level2options" :options="Level2options"></b-form-datalist>
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
                            v-model="frequency.selected"
                            :options="frequency.frequencyoptions"
                            name="frequencies"
                            class="ml-4"
                            aria-label="Individual frequency"
                            stacked
                            switches
                          ></b-form-checkbox-group>
                        </b-form-group>
                      </div>
                      <div v-if="checked.states">
                        <hr>
                        <StateInput v-if="!isLoading" :autocompleteItems="computedInitialstates"></StateInput>
                      </div>
                      <div v-if="checked.advancedQuery">
                        <hr>
                        <AdvancedSearch></AdvancedSearch>
                      </div>
                      <br>
                      <b-button type="submit" variant="primary">Analyze audience</b-button>
                      <b-button type="reset" variant="danger">Reset</b-button>
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
          <GForm></GForm>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { ApiFactory } from "./../api/ApiFactory";
import NameInput from "./input/nameInput.vue";
import AudienceInput from "./input/audienceInput.vue";
import CategoryInput from "./input/categoryInput.vue";
import StateInput from "./input/stateInput.vue";
import GForm from "./map/map.vue";
import NavBar from "./views/Nav.vue";
import AdvancedSearch from "./views/Advancedquery.vue";
import debounce from "lodash/debounce";
const StateApi = ApiFactory.get("states");
const LevelsApi = ApiFactory.get("levels");
export default {
  components: {
    StateInput,
    NameInput,
    AudienceInput,
    CategoryInput,
    GForm,
    NavBar,
    AdvancedSearch
  },
  props: {},
  data() {
    return {
      errors: [],
      tabIndex: 1,
      showForm: true,
      showMap: true,
      isLoading: false,
      checked: {
        nationwide: false,
        states: false,
        advancedQuery: false
      },
      isLevel2optionloading: false,
      frequency: {
        frequencyoptions: ["Mild(1-2)", "Moderate(3-4)", "Frequent(+5)"],
        selected: [],
        allSelected: false,
        indeterminate: false
      },
      form: {
        name: ""
      },
      audience1: "",
      audience2: "",
      Level1options: [],
      Level2options: [],
      initialStates: []
    };
  },
  methods: {
    next() {
      console.log(tabIndex);
    },
    onSubmit(evt) {},
    onReset(evt) {
      evt.preventDefault();
      this.form.name = "";
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
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
      this.frequency.selected = checked
        ? this.frequency.frequencyoptions.slice()
        : [];
    },
    initializeapp() {
      this.isLoading = true;
      var vm = this 
      StateApi.get()
      .then(function (response) {
        vm.initialStates = response.data.data;
        vm.isLoading = false
      })
      .catch(function (error) {
        console.log(error)
        vm.isLoading = false
      });     
      
    },
    initOptions() {
      this.isLoading = true;
      var vm = this 
      LevelsApi.get()
      .then(function(response){
        vm.Level1options = response.data.data;
        vm.isLoading = false
      })
      .catch(function(error){
        console.log(error)
        vm.isLoading = false
      });
    },
    getLevel2options() {
      if (this.audience1 in this.Level1options) {
        var vm = this;
        fetch(`http://127.0.0.1:5000/api/leveloptions?level=${this.audience1}`)
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
    }
  },
  watch: {
    audience1: function(newValue, oldValue) {
      this.isLevel2optionloading = true;
      this.debouncedGetLevel2options();
    }
  },
  created() {
    this.initializeapp();
    this.initOptions();
    this.debouncedGetLevel2options = debounce(this.getLevel2options, 500);
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
    computedLevelOneOptions(){
    	return this.Level1options.map(levelone=>{
        return levelone.Level_1.toUpperCase();

      },0);
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