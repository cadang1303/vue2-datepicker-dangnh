<template>
  <div class="date-picker">
    <div class="overlay-popup" @click="closePopup"></div>
    <div class="wrapper">
      <div class="header" v-if="mode === 'chooseDate'">
        <div class="change-date">
          <i class="fa-solid fa-chevron-left" @click="toPrevMonth"></i>
          <p class="current-date" @click="chooseMonth">
            {{ monthText }}
          </p>
          <i class="fa-solid fa-chevron-right" @click="toNextMonth"></i>
        </div>

        <div class="change-date">
          <i class="fa-solid fa-chevron-left" @click="toPrevYear"></i>
          <div class="current-date" @click="chooseYear">
            {{ currYear }}
          </div>
          <i class="fa-solid fa-chevron-right" @click="toNextYear"></i>
        </div>
      </div>
      <div class="calendar" v-if="mode == 'chooseDate'">
        <ul class="weeks">
          <li class="weekday" v-for="weekday in weekdays" :key="weekday.key">
            {{ weekday.shortDay }}
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
      <div class="calendar-month" v-if="mode == 'chooseMonth'">
        <div class="current-date">{{ monthText }}</div>
        <ul class="months">
          <li
            class="month"
            v-for="month in months"
            :key="month.key"
            @click="onSelectMonth(month.key)"
          >
            {{ month.shortMonth }}
          </li>
        </ul>
      </div>
      <div class="calendar-year" v-if="mode == 'chooseYear'">
        <i class="fa-solid fa-chevron-left" @click="toPrevYearRange"></i>
        <ul class="years">
          <li
            class="year"
            v-for="year in years"
            :key="year"
            @click="onSelectYear(year)"
          >
            {{ year }}
          </li>
        </ul>
        <i class="fa-solid fa-chevron-right" @click="toNextYearRange"></i>
      </div>
    </div>
  </div>
</template>
;
<script>
export default {
  created() {
    this.mode = "chooseDate";
    this.getMonthList();
    this.getWeekdays();
    if (this.value && this.value.length > 0) {
      this.date = new Date(this.value);
    }
    this.getYearList(this.currYear);
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
      months: [],
      years: [],
      mode: "chooseDate",
      weekdays: [],
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
      return this.date.toLocaleString("default", { month: "long" });
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
    getWeekdays() {
      let baseDate = new Date(2023, 0, 1);
      this.weekdays = [];
      for (let i = 0; i < 7; i++) {
        let data = {
          key: i,
          shortDay: baseDate.toLocaleDateString("default", {
            weekday: "short",
          }),
          longDay: baseDate.toLocaleDateString("default", { weekday: "long" }),
        };
        this.weekdays.push(data);
        baseDate.setDate(baseDate.getDate() + 1);
      }
    },
    getMonthList() {
      this.months = [];
      for (let i = 0; i < 12; i++) {
        let data = {
          key: i + 1,
          shortMonth: new Date(null, i + 1, null).toLocaleDateString(
            "default",
            { month: "short" }
          ),
          longMonth: new Date(null, i + 1, null).toLocaleDateString("default", {
            month: "long",
          }),
          isSelected: this.selected?.getMonth() === i,
        };
        this.months.push(data);
      }
    },
    getYearList(from) {
      this.years = [];
      for (let j = 1; j < 9; j++) {
        this.years.push(from - j);
      }

      this.years.reverse();

      for (let i = 0; i < 10; i++) {
        this.years.push(from + i);
      }
    },
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
    chooseMonth() {
      this.mode = "chooseMonth";
    },
    chooseYear() {
      this.mode = "chooseYear";
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
    toPrevYearRange() {
      let year = this.years[0] - 10;
      this.getYearList(year);
    },
    toNextYearRange() {
      let year = this.years.slice(-1).pop() + 9;
      this.getListYear(year);
    },
    onSelectDay(day) {
      this.date = new Date(day.date);
      this.selected = new Date(day.date);
      this.$emit("onSelect", this.convertSelected);
      this.$emit("input", this.convertSelected);
    },
    onSelectYear(year) {
      this.date = new Date(this.date.setFullYear(year));
      this.mode = "chooseDate";
    },
    onSelectMonth(month) {
      this.date = new Date(this.date.setMonth(month - 1));
      this.mode = "chooseDate";
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
    closePopup() {
      this.$emit("closePopup", false);
    },
    convertDate(date) {
      let day = date.toLocaleDateString("default", { day: "2-digit" });
      let month = date.toLocaleDateString("default", { month: "2-digit" });
      let year = date.getFullYear();

      return year + "-" + month + "-" + day;
    },
  },
};
</script>

<style scoped>
.date-picker {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 999;
}
.date-picker .overlay-popup {
  position: fixed;
  content: "";
  z-index: -1;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: 0 0;
}
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
.current-date {
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
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
.calendar ul,
.calendar-year ul,
.calendar-month ul {
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
  font-weight: 500;
  color: #aaa;
  cursor: pointer;
}
.footer div:hover {
  color: #333;
}
.calendar-month,
.calendar-year {
  padding: 20px;
  font-size: 1rem;
}
.calendar-month ul li {
  position: relative;
  width: calc(100% / 3);
  font-weight: 500;
  padding: 10px;
  cursor: pointer;
}
.calendar-month .current-date {
  font-size: 1.4rem;
  margin-bottom: 10px;
  text-align: center;
}
.calendar-year {
  display: flex;
  align-items: center;
}
.calendar-year i {
  cursor: pointer;
}
.calendar-year ul li {
  position: relative;
  padding: 10px;
  width: calc(100% / 3);
  font-weight: 600;
  cursor: pointer;
}
</style>
