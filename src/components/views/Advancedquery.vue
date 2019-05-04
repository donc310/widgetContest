<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group
        label-cols-lg="3"
        label="Analysis"
        label-size
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >
        <b-form-group
          label-cols-sm="3"
          label="Search:"
          label-align-sm="right"
          label-for="seaarch-description"
        >
          <b-form-input id="seaarch-description" v-model="results.name" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Location :"
          label-align-sm="right"
          label-for="location"
        >
          <b-form-input id="location" v-model="results.location" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          v-if="results.Level1 !=''"
          label-cols-sm="3"
          label="Loocation category:"
          label-align-sm="right"
          label-for="level1"
        >
          <b-form-input id="level1" v-model="results.Level1" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Location sub-category:"
          label-align-sm="right"
          label-for="level2"
          v-if="results.Level2 !=''"
        >
          <b-form-input id="level2" v-model="results.Level2" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Audience "
          label-align-sm="right"
          label-for="audience"
        >
          <b-form-input id="audience" v-model="results.audience" disabled></b-form-input>
        </b-form-group>
        <b-form-group
          v-if="results.audience ==='States' "
          label-cols-sm="3"
          label="States "
          label-align-sm="right"
        >
          <b-form-input id="states" v-model="states" disabled></b-form-input>
        </b-form-group>
        <b-form-group
          v-if="frequencies !=''"
          label-align-sm="right"
          label="Frequency "
          label-cols-sm="3"
        >
          <b-form-input id="Frequency" v-model="frequencies" disabled></b-form-input>
        </b-form-group>

      </b-form-group>
    </b-card>
    <b-card bg-variant="light">
      <b-form-group
        label-cols-lg="3"
        label="Results"
        label-size
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >
        <b-form-group
          label-cols-sm="3"
          label="Audience Total"
          label-align-sm="right"
          label-for="ids"
        >
          <b-form-input id="ids" v-model="uniquecount" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Number of states :"
          label-align-sm="right"
          label-for="states"
        >
          <b-form-input id="states" v-model="stateCount" disabled></b-form-input>
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label="  Required units :"
          label-align-sm="right"
          label-for="units"
        >
          <b-form-input id="units" v-model="units" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label=" Availbles units : "
          label-align-sm="right"
          label-for="units2"
        >
          <b-form-input id="units" v-model="available" disabled></b-form-input>
        </b-form-group>
      </b-form-group>
      <br>
      <b-button
        v-if="computedcanbuy"
        type="submit"
        @click="evt=>evt.preventDefault()"
        variant="primary"
      >Download</b-button>
      <b-button
        v-if="!computedcanbuy"
        type
        @click="evt=>evt.preventDefault()"
        variant="info"
      >Purchase</b-button>
      <b-button v-if="canReset" type @click="handleReset($event)" variant="danger">Reset</b-button>
    </b-card>
  </div>
</template>
<script>
export default {
  components:{
    
  },
  props: {
    options: { type: Object },
    totalunique: { type: Number, default: 0 },
    locationcount: { type: Number },
    reset: { type: Boolean }
  },
  data() {
    return {
      results: {},
      uniquecount: 0,
      stateCount: 0,
      units: 0.0,
      available: 0.0,
      states: "",
      frequencies:''
    };
  },
  methods: {
    handleReset(evt) {
      evt.preventDefault();
      this.$emit("resetWidget", { reset: true });
    }
  },
  watch: {
    options(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.results = newValue;
      if(this.results ==={}){return;}
      if (this.results.stateTags.length != 0) {
        this.states = "";
        this.results.stateTags.forEach((item, index) => {
          if (index === 0) {
            this.states = this.states.concat(item);
          } else {
            this.states = this.states.concat(",").concat(item);
          }
        });
      }
      if(this.results.frequency.length != 0){
        this.frequencies = '';
        this.results.frequency.forEach((item, index) => {
          if (index === 0) {
            this.frequencies = this.frequencies.concat(item);
          } else {
            this.frequencies = this.frequencies.concat(",").concat(item);
          }
        });
        
      }
    },
    totalunique(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.uniquecount = newValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.units = newValue * 1.5444;
    },
    locationcount(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      this.stateCount = newValue;
    }
  },
  computed: {
    computedcanbuy() {
      return this.available > this.units;
    },
    canReset() {
      return this.reset;
    }
  }
};
</script>
