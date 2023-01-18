<template>
  <div id="app">
    <input-datepicker
      v-model="value"
      placeholder="Select Date"
      @onSelect="onSelect"
    />
  </div>
</template>

<script>
import InputDatepicker from "./components/InputDatepicker.vue";

export default {
  name: "App",
  data() {
    return {
      value: null,
    };
  },
  methods: {
    onSelect(val) {
      this.value = val;
      console.log(this.value);
    },
  },
  components: {
    InputDatepicker,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}
</style>
