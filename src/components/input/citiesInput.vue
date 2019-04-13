<template>
  <div>
    <div class="input-group input-group-lg" role="group">
      <b-input-group class="mt-3">
        <GmapAutocomplete
          @place_changed="setPlace"
          class="tags-input border-top-0 border-right-0 border-left-0 form-control"
        ></GmapAutocomplete>
        <b-input-group-append>
          <b-button variant="info" @click.prevent="usePlace">Add</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <br>
    <div>
      <vue-tags-input
        placeholder="Locations"
        disabled="true"
        v-model="tag"
        :tags="tags"
        @tags-changed="newTags => tags = newTags"
        class="tags-input border-top-0 border-right-0 border-left-0"
      >
        <div
          slot="autocomplete-item"
          slot-scope="props"
          class="my-item"
          @click="props.performAdd(props.item)"
        >
          <i :style="{ color: props.item.iconColor }" class="material-icons">{{ props.item.text }}</i>
          {{ props.item.text }}
        </div>
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
      <b-input-group-append>
        <b-button size="s" variant="danger" @click.prevent="popTags()">Remove</b-button>
      </b-input-group-append>
    </div>
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
      default: "CITES",
      validator: name => {
        return name === "CITES";
      }
    },
    placeprop: { type: Object }
  },
  data() {
    return {
      place: null,
      tag: "",
      tags: []
    };
  },
  methods: {
    setPlace(place){
      if (place ==='') return;
      this.place = place;
      this.$emit("widgetcityinputchanged", this.place);
    },
    usePlace() {
      if (this.place) {
        this.tags.push({
          text: this.place.formatted_address,
          iconColor: "#000000",
          myicon: "location_on"
        });
        this.$emit("widgetuseplace", this.place);
        this.tag ='';
      }
    },
    popTags(){
      this.tags.pop();
      this.$emit('Widgetplacepoped', this.tags);
    }
  },
  watch: {
    placeprop: function(newValue, oldValue) {
      this.place = newValue;
    }
  }
};
</script>