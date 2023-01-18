<template>
  <div class="datepicker-container">
    <div class="datepicker" :class="{ focus: isFocused }">
      <input
        type="text"
        class="datepicker-input"
        :placeholder="placeholder"
        v-model="datetime"
        :ref="refs"
        @focus="focus"
        @blur="blur"
      />
      <span class="datepicker-icon-right" @click="toggleDatePicker">
        <i class="fa-regular fa-calendar"></i>
      </span>
    </div>
    <CalendarComponent
      v-model="datetime"
      v-show="showDatepicker"
      @onSelect="onSelect"
    />
  </div>
</template>

<script>
import CalendarComponent from "./CalendarComponent.vue";
export default {
  created() {
    this.datetime = this.value;
  },
  components: {
    CalendarComponent,
  },
  props: {
    value: {
      default: null,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    refs: {
      type: String,
      default: "datepicker-input",
    },
  },
  data() {
    return {
      datetime: null,
      isFocused: false,
      showDatepicker: false,
    };
  },
  methods: {
    toggleDatePicker() {
      this.isFocused = !this.isFocused;
      this.$refs[this.refs].focus();
    },
    focus() {
      this.isFocused = true;
      this.showDatepicker = true;
      this.$emit("onFocus");
    },
    blur() {
      this.isFocused = false;
      this.$emit("onBlur");
    },
    onSelect(val) {
      this.isFocused = false;
      this.showDatepicker = false;
      this.datetime = val;
      this.$emit("onSelect", val);
    },
    onClear() {
      this.$emit("onClear");
    },
  },
};
</script>

<style scoped>
.datepicker-container {
  display: inline-block;
  position: relative;
}
.datepicker {
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  padding: 6px 12px;
  transition: all 0.25s ease-in-out;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.datepicker-input {
  color: #333;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  border: none;
  outline: 0;
  padding-right: 8px;
}
.datepicker-icon-right {
  color: #888;
  cursor: pointer;
  margin-top: 2px;
}
.datepicker-icon-right:hover {
  color: #333;
}
.focus {
  border: 1px solid #0085d1;
}
</style>
