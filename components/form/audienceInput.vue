<template>
<div>
  <b-form-input list="input-list" id="input-with-list" class="border-top-0 border-right-0 border-left-0" v-b-tooltip.hover title="Tooltip content"></b-form-input>
  <b-form-datalist id="input-list" :options="options"></b-form-datalist>
</div>
</template>

<script>
export default {
  data() {
    return{
      options: ['Apple', 'Banana', 'Grape', 'Kiwi', 'Orange']
    }
  }
  
}
</script>