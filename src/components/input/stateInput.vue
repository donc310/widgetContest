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
    }
  },
  data() {
    return {
      tag: "",
      tags: [],
      states: [
        {
          text: "Alabama",
          lat: 32.806671,
          lng: -86.79113
        },
        {
          text: "Alaska",
          lat: 61.370716,
          lng: -152.404419
        },
        {
          text: "Arizona",
          lat: 33.729759,
          lng: -111.431221
        },
        {
          text: "Arkansas",
          lat: 34.969704,
          lng: -92.373123
        },
        {
          text: "California",
          lat: 36.116203,
          lng: -119.681564
        },
        {
          text: "Colorado",
          lat: 39.059811,
          lng: -105.311104
        },
        {
          text: "Connecticut",
          lat: 41.597782,
          lng: -72.755371
        }
      ]
    };
  },
  methods: {
    getTags() {
      return this.tags;
    },
    updateTags(evt) {
      this.tags = evt;
      let postions = this.tags.map(marker => [marker.lat, marker.lng], 0);
      this.$emit("widgetmarkerchanged", postions, this.name);
    }
  },
  computed: {
    items() {
      return this.states.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    getStates() {
      // fetch cities from an a api
      //```cities: array[object]```
    }
  }
};
</script>
<style lang="css">
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
/* style the background and the text color of the input ... */
.tags-input .inputs {
  display: flex;
}
.tags-input .inputs i {
  font-size: 20px;
  cursor: pointer;
}
</style>