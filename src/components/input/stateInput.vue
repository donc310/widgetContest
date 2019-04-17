<template>
  <div>
    <vue-tags-input
      v-model="tag"
      placeholder="Enter Locations"
      :tags="tags"
      @tags-changed="updateTags"
      :allow-edit-tags="true"
      :autocomplete-items="autocompleteItems"
      :add-only-from-autocomplete="true"
      class="tags-input border-top-0 border-right-0 border-left-0"
    >
      <div
        slot="tag-left"
        slot-scope="props"
        class="my-tag-left"
        @click="props.performOpenEdit(props.index)"
      >
        <i :style="{ color: props.tag.iconColor }" class="material-icons">{{ props.tag.myicon }}</i>
      </div>
    </vue-tags-input>
    <br>
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
    autocompleteItems: { type: Array, required: true }
  },
  data() {
    return {
      tag: "",
      tags: [],
      loading: true,
      errored: false,
      debounce: null
    };
  },
  methods: {
    updateTags(event) {
      this.tags = event;
      //let postions = this.tags.map(marker => [marker.lat, marker.lng, marker.abv, marker.text, marker.Est], 0);
      //EventBus.$emit("widgetmarkerchanged", postions);
    },
    getStates() {
      this.loading = true;
      fetch("http://127.0.0.1:5000/api/states")
        .then(resp => resp.json())
        .then(data => {
          this.autocompleteItems = data.data.map(state => {
            return {
              text: state.name,
              lat: state.latitude,
              lng: state.longitude,
              abv: state.abv,
              Est: state.AudienceTotal
            };
          }, 0);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },
  created() {},
  watch: {},
  computed: {}
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