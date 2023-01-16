<template>
  <div class="container">
    <div class="calendar">
      <div class="month">
        <i class="fas fa-angle-left prev" @click="prevMonth"></i>
        <div class="date">
          <h1>{{ shortMonth }}</h1>
          <p>{{ selected }}</p>
        </div>
        <i class="fas fa-angle-right next" @click="nextMonth"></i>
      </div>
      <div class="weekdays">
        <div v-for="weekday in weekdays" :key="weekday">{{ weekday }}</div>
      </div>
      <div class="days">
        <div
          :class="{}"
          @click="onSelect(day)"
          v-for="day in daysContent"
          :key="day.id"
        >
          {{ day }}
        </div>
      </div>
      <div class="footer">
        <div class="btn-clear">Clear</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";

export default {
  created() {
    this.date.setDate(1);
    // for (let x = this.firstDayIndex; x > 0; x--) {
    //   this.days += `<div class="prev-date" @click="onSelect()">${
    //     this.prevLastDay - x + 1
    //   }</div>`;
    // }
    // for (let i = 1; i <= this.lastDayOfMonth; i++) {
    //   if (
    //     i === new Date().getDate() &&
    //     this.date.getMonth() === new Date().getMonth()
    //   ) {
    //     this.days += `<div class="today" @click="onSelect()">${i}</div>`;
    //   } else this.days += `<div @click="onSelect()">${i}</div>`;
    // }
    // for (let j = 1; j <= this.nextDays; j++) {
    //   this.days += `<div class="next-date" @click="onSelect()">${j}</div>`;
    // }
  },
  data() {
    return {
      date: new Date(),
      days: [],
      selectedDay: "",
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
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    shortMonth() {
      return this.months[this.date.getMonth()];
    },
    prevLastDay() {
      return new Date(this.year, this.month, 0).getDate();
    },
    lastDayOfMonth() {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        0
      ).getDate();
    },
    firstDayIndex() {
      return this.date.getDay();
    },
    lastDayIndex() {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        0
      ).getDay();
    },
    nextDays() {
      return 7 - this.lastDayIndex;
    },
    daysContent() {
      return this.getDays();
    },
    selected() {
      return this.selectedDay ? formatDate(this.selectedDay) : "";
    },
  },
  methods: {
    getDays() {
      for (let i = 1; i <= this.lastDayOfMonth; i++) {
        this.days.push(i);
      }
      return this.days;
    },
    onSelect(day) {
      console.log(day);
      this.selectedDay = new Date(`${this.year}-${this.month}-${day}`);
    },
    nextMonth() {
      console.log(this.date);
      this.date.setMonth(this.date.getMonth() + 1);
      console.log(this.date);
    },
    prevMonth() {
      this.date.setMonth(this.date.getMonth() - 1);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #12121f;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
.calendar {
  width: 45rem;
  height: 52rem;
  background: #222227;
  box-shadow: 0 0.5rem 3rem rgba(0, 0, 0, 0.4);
}
.month {
  width: 100%;
  height: 12rem;
  background: #167e56;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  text-align: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}
.month i {
  font-size: 2.5rem;
  cursor: pointer;
}
.month h1 {
  font-size: 3rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 1rem;
}
.month p {
  font-size: 1.6rem;
}
.weekdays {
  width: 100%;
  height: 5rem;
  padding: 0 0.4rem;
  display: flex;
  align-items: center;
}
.weekdays div {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
  width: calc(44.2rem / 7);
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}
.days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem;
}
.days div {
  font-size: 1.4rem;
  margin: 0.3rem;
  width: calc(40.2rem / 7);
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s;
}
.days div:hover:not(.today) {
  background-color: #262626;
  border: 0.2rem solid #777;
}
.days .prev-date,
.days .next-date {
  opacity: 0.5;
}
.days .today {
  background: #167e56;
}
.footer {
  right: 0;
}
.footer .btn-clear {
  cursor: pointer;
}
</style>
