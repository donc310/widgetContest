<template>
  <div>
    <br>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="autocompleteItems"
      :add-only-from-autocomplete="true"
      class="tags-input"
      placeholder="Enter states"
      @tags-changed="updateTags"
    ></vue-tags-input>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
export default {
  name: "WidgetStateInput",
  components: {
    VueTagsInput
  },
  props: {
    name: {
      type: String,
      default: "STATE",
      validator: name => {
        return name === "STATE";
      }
    },
    source: {
      type: String,
      required: true,
      default: "http://127.0.0.1:5000/api/states"
    }
  },
  data() {
    return {
      tag: "",
      tags: [],
      autocompleteItems:[],
      loading: true,
      errored: false,
      debounce: null,
    };
  },
  methods: {
    getTags() {
      return this.tags;
    },
    updateTags(event){
      this.autocompleteItems = [];
      this.tags = event
      //let postions = this.tags.map(marker => [marker.lat, marker.lng, marker.abv, marker.text], 0);
      //this.$emit("widgetmarkerchanged", postions, this.name);
    },
    initStates(){
      if (this.tag.length < 2) return;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
	      fetch( `http://127.0.0.1:5000/api/states?like=${this.tag}&limit=10`)
	      .then((resp) => resp.json())
	      .then(data => {
	        this.autocompleteItems = data.data.map(state => {
	          return {
	            text: state.name,
	            lat: state.latitude,
	            lng: state.longitude,
	            abv: state.abv
	          };
	        }, 0);
	      })
	      .catch(error => {
	        console.log(error);
	        this.errored = true;
	      })
      },500)

    }
  },
  created(){

  },
  watch:{
    'tag': 'initStates',
  },
  computed:{
    
}};
</script>
<style lang="css">
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
.tags-input .inputs {
  display: flex;
}
.tags-input .inputs i {
  font-size: 20px;
  cursor: pointer;
}
</style>