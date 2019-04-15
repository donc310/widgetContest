<template>
  <div>
    <br>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="items"
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
      states:[],
      loading: true,
      errored: false
    };
  },
  methods: {
    getTags() {
      return this.tags;
    },
    updateTags(event){
      console.log(event)
      this.tags = event
      let postions = this.tags.map(marker => [marker.lat, marker.lng, marker.abv, marker.text], 0);
      console.log(postions)
      this.$emit("widgetmarkerchanged", postions, this.name);
    }
  },
  created(){
      fetch(this.source)
      .then((resp) => resp.json())
      .then(data => {
        let response = data.data
        this.states = response.map(state => {
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
  },
  computed: {
    items() {
      return this.states.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    }
  }
};
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