<template>
  <div class="wrapper">
    <div class="header">
      <div class="change-date">
        <i class="fa-solid fa-chevron-left" @click="toPrevMonth"></i>
        <div class="current-date">{{ monthText }}</div>
        <i class="fa-solid fa-chevron-right" @click="toNextMonth"></i>
      </div>

      <div class="change-date">
        <i class="fa-solid fa-chevron-left" @click="toPrevYear"></i>
        <div class="current-date">{{ currYear }}</div>
        <i class="fa-solid fa-chevron-right" @click="toNextYear"></i>
      </div>
    </div>
    <div class="calendar">
      <ul class="weeks">
        <li class="weekday" v-for="weekday in weekdays" :key="weekday">
          {{ weekday }}
        </li>
      </ul>
      <ul class="days">
        <li
          class="day inactive"
          :class="{ active: prevday.isSelected }"
          v-for="prevday in prevMonthDays"
          :key="prevday.id"
          @click="onSelectDay(prevday)"
        >
          {{ prevday.day }}
        </li>
        <li
          class="day"
          :class="{ active: monthday.isSelected }"
          v-for="monthday in monthDays"
          :key="monthday.id"
          @click="onSelectDay(monthday)"
        >
          {{ monthday.day }}
        </li>
        <li
          class="day inactive"
          :class="{ active: nextday.isSelected }"
          v-for="nextday in nextMonthDays"
          :key="nextday.id"
          @click="onSelectDay(nextday)"
        >
          {{ nextday.day }}
        </li>
      </ul>
      <div class="footer">
        <div class="btn-today" @click="setDateToday">Today</div>
        <div class="btn-clear" @click="clearSelected">Clear</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    if (this.value && this.value.length > 0) {
      this.date = new Date(this.value);
    }
  },
  props: {
    value: {
      default: null,
      required: true,
    },
  },
  data() {
    return {
      date: new Date(),
      selected: null,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
  },
  computed: {
    today() {
      return new Date();
    },
    currMonth() {
      return this.date.getMonth();
    },
    currYear() {
      return this.date.getFullYear();
    },
    monthText() {
      return this.months[this.currMonth];
    },
    firstDayOfMonth() {
      return new Date(this.currYear, this.currMonth, 1).getDay();
    },
    lastDateOfMonth() {
      return new Date(this.currYear, this.currMonth + 1, 0).getDate();
    },
    lastDateOfLastMonth() {
      return new Date(this.currYear, this.currMonth, 0).getDate();
    },
    lastDayOfMonth() {
      return new Date(
        this.currYear,
        this.currMonth,
        this.lastDateOfMonth
      ).getDay();
    },
    monthDays() {
      return this.getMonthDays();
    },
    prevMonthDays() {
      return this.getPrevMonthDays();
    },
    nextMonthDays() {
      return this.getNextMonthDays();
    },
    convertSelected() {
      return this.convertDate(this.selected);
    },
  },
  watch: {
    value: {
      handler(val) {
        this.selected = new Date(val);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getPrevMonthDays() {
      let days = [];
      let month;
      let year;
      let day;
      if (this.currMonth == 0) {
        month = 11;
        year = this.currYear - 1;
      } else {
        month = this.currMonth - 1;
        year = this.currYear;
      }
      for (let i = this.firstDayOfMonth; i > 0; i--) {
        day = this.lastDateOfLastMonth - i + 1;
        days.push({
          day: day,
          month: month,
          year: year,
          date: new Date(year, month, day),
          isSelected: this.checkActive(day, month, year),
          active: false,
        });
      }

      return days;
    },
    getMonthDays() {
      let days = [];
      let day;
      let month = this.currMonth;
      let year = this.currYear;
      for (let i = 1; i <= this.lastDateOfMonth; i++) {
        day = i;
        days.push({
          day: day,
          month: month,
          year: year,
          date: new Date(year, month, i),
          isSelected: this.checkActive(day, month, year),
          active: true,
        });
      }

      return days;
    },
    getNextMonthDays() {
      let days = [];
      let month;
      let year;
      let day;
      if (this.currMonth === 11) {
        month = 0;
        year = this.currYear + 1;
      } else {
        month = this.currMonth + 1;
        year = this.currYear;
      }
      for (let i = this.lastDayOfMonth; i < 6; i++) {
        day = i - this.lastDayOfMonth + 1;
        days.push({
          day: day,
          month: month,
          year: year,
          date: new Date(year, month, day),
          isSelected: this.checkActive(day, month, year),
          active: false,
        });
      }
      return days;
    },
    checkActive(day, month, year) {
      return (
        day === this.selected?.getDate() &&
        month === this.selected?.getMonth() &&
        year === this.selected?.getFullYear()
      );
    },
    toPrevMonth() {
      this.date = new Date(this.date.setMonth(this.currMonth - 1));
    },
    toNextMonth() {
      this.date = new Date(this.date.setMonth(this.currMonth + 1));
    },
    toPrevYear() {
      this.date = new Date(this.date.setFullYear(this.currYear - 1));
    },
    toNextYear() {
      this.date = new Date(this.date.setFullYear(this.currYear + 1));
    },
    onSelectDay(day) {
      this.date = new Date(day.date);
      this.selected = new Date(day.date);
      this.$emit("onSelect", this.convertSelected);
      this.$emit("input", this.convertSelected);
    },
    setDateToday() {
      this.date = new Date();
      this.selected = this.date;
    },
    clearSelected() {
      this.selected = null;
      this.$emit("input", null);
      this.$emit("onClear");
    },
    convertDate(date) {
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      if (day < 10) {
        day = `0${day}`;
      }

      if (month < 9) {
        month = `0${month + 1}`;
      }

      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 270px;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  /* box-shadow: 5px; */
}
.wrapper .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 10px;
}
.header .current-date {
  font-size: 0.95rem;
  font-weight: 500;
}
.header .change-date {
  display: flex;
  gap: 10px;
}
.header .change-date i {
  height: 14px;
  width: 14px;
  background: #f2f2f2;
  color: #878787;
  font-size: 0.9rem;
  margin: 0 1px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  line-height: 14px;
}
.header .icons i:last-child {
  margin-right: -10px;
}
.header .icons i:hover {
  background: #f2f2f2;
}
.calendar {
  padding: 10px;
  font-size: 0.8rem;
}
.calendar ul {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  text-align: center;
}
.calendar .weeks li {
  font-weight: 400;
}
.calendar ul li {
  position: relative;
  width: calc(100% / 7);
}
.calendar .days {
  margin-bottom: 10px;
}
.calendar .days li {
  z-index: 1;
  cursor: pointer;
  margin-top: 30px;
}
.calendar ul li::before {
  position: absolute;
  content: "";
  height: 30px;
  width: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  /* background: #f2f2f2; */
  z-index: -1;
}
.calendar .days li:hover {
  color: #fff;
}
.calendar .days li:hover::before {
  background: #80aaff;
}
.calendar .days li.inactive {
  color: #aaa;
}
.calendar .days li.active {
  font-weight: 700;
  color: #fff;
}
.calendar .days li.active::before {
  background: #4d88ff;
}
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
}
.footer div {
  margin-right: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #aaa;
  cursor: pointer;
}
.footer div:hover {
  color: #333;
}
</style>
