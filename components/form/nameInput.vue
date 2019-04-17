<template>
  
    <b-form-group
      id="fieldset-1"
      :key="lg"
      :invalid-feedback="invalidFeedback"
      :valid-feedback="validFeedback"
      :state="state"
      description="Choose a name "
    >
    <b-input-group id="WidgetInputname"  size="lg" v-model="name" :state="state" trim >
        <b-input-group-text slot="append" class="border-top-0 border-right-0 border-left-0" v-b-tooltip.hover title="Tooltip content">
            <span style="font-size: 20px; color: Dodgerblue;">
<i class="fas fa-info-circle"></i>            </span>
        </b-input-group-text>
    <b-form-input class="border-top-0 border-right-0 border-left-0">
    </b-form-input>
  </b-input-group>
  </b-form-group>
</template>
<script>
  export default {
    computed: {
      state() {
        return this.name.length >= 4 ? true : false
      },
      invalidFeedback() {
      },
      validFeedback() {
        return this.state === true ? 'Thank you' : ''
      }
    },
    data() {
      return {
        name: ''
      }
    }
  }
</script>