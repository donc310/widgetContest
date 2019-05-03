<template>
  <div>
    <vue-tags-input
      placeholder=" Enter states"
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :add-only-from-autocomplete="true"
      :autocomplete-items="stateInput"
      class="tags-input"
      @tags-changed="newTags => tags = newTags"
    >
      <div
        slot="tag-center"
        slot-scope="props"
      >
        <span
          v-if="!props.edit"
          @click="props.performOpenEdit(props.index)"
        >
          {{ props.tag.text }}
        </span>
        <div
          v-else
          class="inputs"
        >
          <select
            v-model="props.tag.text"
            @change="props.validateTag(props.index)"
          >
            <option v-for="(state, index) in computedStates" :key="index">{{ state }}</option>
          </select>
          <i
            class="material-icons"
            @click="props.performSaveEdit(props.index)"
          >
            check
          </i>
        </div>
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
    _autocompleteItems: { type: Array, required: true },
    processingForm:{type:Boolean},
    reset:{type:Boolean}
  },
  data() {
    return {
      tag: "",
      tags: [],
      loading: true,
      errored: false,
      debounce: null,
      autocompleteItems:this._autocompleteItems
    };
  },
  methods: {},
  created() {},
  watch:{
    tags: function(newValue,oldValue){
      if(newValue.length === oldValue.length){
        return
      }
      var states = this.tags.map(state => {return state.abv}, 0);
      var positions = this.tags.map(cordinate=>{return {lat:cordinate.lat , lng:cordinate.lng}},0);
      this.$emit("stateTags",states);
      this.$emit("stateCordinates",positions);
    },
    reset:function(newValue){
      if(newValue){
        this.tags = [];
      }
    }
  },
  computed:{
    stateInput(){
      return this.autocompleteItems.filter(s=>{
        return s.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1; })
    },
    computedStates(){
      return this.stateInput.map(x=>{return x.text},0);
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