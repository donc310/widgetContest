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
          label="search name :"
          label-align-sm="right"
          label-for="seaarch-description"
        >
          <b-form-input id="seaarch-description" v-model="results.name" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Search location :"
          label-align-sm="right"
          label-for="location"
        >
          <b-form-input id="location" v-model="results.location" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Level 1 audience :"
          label-align-sm="right"
          label-for="level1"
        >
          <b-form-input id="level1" v-model="results.Level1" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Level 2 audience :"
          label-align-sm="right"
          label-for="level2"
        >
          <b-form-input id="level2" v-model="results.Level2" disabled></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Search audience "
          label-align-sm="right"
          label-for="audience"
        >
          <b-form-input id="audience" v-model="results.audience" disabled></b-form-input>
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
        <b-form-group label-cols-sm="3" label="Audience Total" label-align-sm="right" label-for="ids">
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
        <b-button v-if="computedcanbuy" type="submit" @click="evt=>evt.preventDefault()" variant="primary">Download</b-button>
        <b-button v-if="!computedcanbuy" type=""  @click="evt=>evt.preventDefault()" variant="info"> Purchase</b-button>
        <b-button v-if="canReset" type=""  @click="handleReset($event)" variant="danger"> Reset</b-button>
    </b-card>

  </div>
</template>
<script>
export default {
  props: {
    options: { type: Object },
    totalunique:{type: Number, default:0},
    locationcount:{type:Number},
    reset:{type:Boolean}
  },
  data() {
    return {
    results:{},
    uniquecount:0,
    stateCount: 0,
    units:0.0,
    available: 0.0
    };
  },
  methods:{
    handleReset(evt){
      evt.preventDefault();
      this.$emit("resetWidget",{reset:true})
    }
  },
  watch:{
      options(newValue, oldValue){
          if(newValue === oldValue){return}
            this.results = newValue;
      },
      totalunique(newValue,oldValue){
        if(newValue === oldValue){return}
        this.uniquecount = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.units = newValue * 1.5444;
      },
      locationcount(newValue, oldValue){
        if(newValue === oldValue){return}
        this.stateCount = newValue;
      }

  },
  computed:{
    computedcanbuy(){
        return this.available > this.units;

    },
    canReset(){
      return this.reset;
    }
  }
};
</script>
