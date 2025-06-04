<template>
  <div class="calendar-container" @touchstart="touchStart" @touchend="touchEnd">
    <div class="calendar-header">
      <button @click="prevMonth" class="flat-button">
        <span v-if="isQuasar">
          <q-icon v-if="iconLeft !== false"  :name="iconLeft" :size="fontSizeIcon+'em'"/>
          <span v-else>‹</span>
        </span>
        <span v-else>
          <span v-if="iconLeft !== false" :class="iconLeft"></span>
          <span v-else>‹</span>
        </span>
      </button>
      <div class="month-year-selectors">
        <select v-model="selectedMonth">
          <option v-for="(month, index) in monthNames" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
        <button @click="nextMonth" class="flat-button">
          <span v-if="isQuasar">
            <q-icon v-if="iconRight !== false"  :name="iconRight" :size="fontSizeIcon+'em'"/>
            <span v-else>›</span>
          </span>
          <span v-else>
            <span v-if="iconRight !== false" :class="iconRight"></span>
            <span v-else>›</span>
          </span>
        </button>
        <button @click="prevYear" class="flat-button">
        <span v-if="isQuasar">
          <q-icon v-if="iconLeft !== false"  :name="iconLeft" :size="fontSizeIcon+'em'"/>
          <span v-else>‹</span>
        </span>
          <span v-else>
          <span v-if="iconLeft !== false" :class="iconLeft"></span>
          <span v-else>‹</span>
        </span>
        </button>
        <select v-model="selectedYear">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <button @click="nextYear" class="flat-button">
          <span v-if="isQuasar">
            <q-icon v-if="iconRight !== false"  :name="iconRight" :size="fontSizeIcon+'em'"/>
            <span v-else>›</span>
          </span>
        <span v-else>
            <span v-if="iconRight !== false" :class="iconRight"></span>
            <span v-else>›</span>
          </span>
      </button>
    </div>
    <div class="week-days">
      <div v-for="day in weekDays" :key="day" class="day-label">
        {{ day }}
      </div>
    </div>
    <transition :name="transitionName" mode="out-in">
      <div :key="currentMonth + '-' + currentYear" class="calendar-wrapper">
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :style="(day.hasEvent ? 'background-color: '+day.eventColor : '')+('; font-size: '+(fontSizeDays < 2 ? fontSizeDays : 2)+'em')"
            :class="{
              'prev-month': day.isPrevMonth,
              'next-month': day.isNextMonth,
              'today': day.isToday,
              'has-event': day.hasEvent,
              'text-white': day.hasEvent
            }"
            @click="selectDate(day)">
            <div class="day-number">{{ day.date.getDate() }}</div>
            <div v-if="day.hasEvent" class="event-indicator" :style="{ borderColor: day.eventColor }"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CalendarComponent",
  props:{
    isQuasar: {
      default: false,
    },
    eventsColors:{
      default: ['#e54e4e', '#4e6fe5', '#4ee58b', '#e5b34e','#e54e9f','#bd4ee5','#4eb8e5']
    },
    events: {
      default: [{date: '2025-06-15', color: '#e54e4e'}, {date: '2025-06-22', color: '#4e6fe5'}, {date: '2025-06-05', color: '#4ee58b'}]
    },
    locale: {
      type: Object,
      default: () => ({
        weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      })
    },
    fontSizeDays:{
      default: 1
    },
    fontSizeIcon:{
      default: 1.2
    },
    iconLeft:{
      default: false
    },
    iconRight:{
      default: false
    },
    yearMin: {
      default: 5
    },
    yearMax: {
      default: 5,
    },
    swipable:{
      default: true
    }
  },
  data: () => ({
    currentDate: new Date(),
    swipeStartX: null,
    transitionName: 'slide-right',
  }),
  computed: {
    currentYear() {
      return this.currentDate.getFullYear();
    },
    currentMonth() {
      return this.currentDate.getMonth();
    },
    selectedMonth: {
      get() {
        return this.currentMonth;
      },
      set(value) {
        const newDate = new Date(this.currentYear, value, 1);
        this.currentDate = newDate;
      }
    },
    selectedYear: {
      get() {
        return this.currentYear;
      },
      set(value) {
        const newDate = new Date(value, this.currentMonth, 1);
        this.currentDate = newDate;
      }
    },
    weekDays() {
      return this.locale.weekDays || this.$options.propsData.locale.weekDays;
    },
    monthNames() {
      return this.locale.monthNames || this.$options.propsData.locale.monthNames;
    },
    years() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - this.yearMin; i <= currentYear + this.yearMax; i++) {
        years.push(i);
      }
      return years;
    },
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth;
      const today = new Date();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);


      const startDay = (firstDay.getDay() + 6) % 7;

      const days = [];


      for (let i = 0; i < startDay; i++) {
        const prevMonth = new Date(year, month, 0);
        const day = prevMonth.getDate() - startDay + i + 1;
        days.push({
          date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
          isPrevMonth: true,
          isNextMonth: false,
          isToday: false
        });
      }


      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i);
        const event = this.events.find(e => this.isSameDay(e.date, currentDate));

        days.push({
          date: currentDate,
          isPrevMonth: false,
          isNextMonth: false,
          isToday: this.isSameDay(currentDate, today),
          hasEvent: !!event,
          eventColor: event && event.color
            ? event.color
            : this.eventsColors[this.getEventColorIndex(currentDate)]
        });
      }


      const remainingDays = 7 - (days.length % 7 || 7);
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isPrevMonth: false,
          isNextMonth: true,
          isToday: false
        });
      }

      return days;
    }
  },
  methods:{
    isSameDay(date1, date2) {
      if (!(date1 instanceof Date)) {
        date1 = new Date(date1);
      }
      if (!(date2 instanceof Date)) {
        date2 = new Date(date2);
      }
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },
    getEventColorIndex(date) {

      const hash = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
      return Math.abs(hash) % this.eventsColors.length;
    },
    prevMonth() {
      this.transitionName = 'slide-right';
      const prevDate = new Date(this.currentYear, this.currentMonth - 1);
      this.currentDate = prevDate;
    },
    nextMonth() {
      this.transitionName = 'slide-left';
      const nextDate = new Date(this.currentYear, this.currentMonth + 1);
      this.currentDate = nextDate;
    },
    prevYear() {
      this.transitionName = 'slide-right';
      const prevYearDate = new Date(this.currentYear - 1, this.currentMonth, 1);
      this.currentDate = prevYearDate;
    },

    nextYear() {
      this.transitionName = 'slide-left';
      const nextYearDate = new Date(this.currentYear + 1, this.currentMonth, 1);
      this.currentDate = nextYearDate;
    },
    selectDate(day) {
      if (!day.isPrevMonth && !day.isNextMonth) {
        this.$emit('date-selected', day.date);
      }
    },
    touchStart(e) {
      if(this.swipable)
        this.swipeStartX = e.touches[0].clientX;
    },
    touchEnd(e) {
      if(this.swipable){
        if (!this.swipeStartX) return;

        const deltaX = e.changedTouches[0].clientX - this.swipeStartX;

        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.transitionName = 'slide-right';
            this.prevMonth();
          } else {
            this.transitionName = 'slide-left';
            this.nextMonth();
          }
        }
        this.swipeStartX = null;
      }
    }
  }
}
</script>

<style scoped>
.flat-button {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 30px;
  transition: background-color 0.3s;
}

.flat-button:hover {
  background-color: #f0f0f0;
}
.calendar-container {
  width: 100%;
  max-width: 100%;
  padding: 5px 24px 4px 24px;
  #font-family: Arial, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.month-year-selectors {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.month-year-selectors select {
  appearance: none;
  background: transparent;
  border: none;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.day-label {
  text-align: center;
  font-weight: bold;
  color: #555;
  padding: 8px 0;
}

.calendar-wrapper {
  overflow: hidden;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  min-height: 300px;
}

.calendar-day {
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 30px;
  transition: all 0.3s ease;
  color: #333;
}
.day-number {
  position: relative;
  z-index: 1;
  font-size: 0.9em;
}
.calendar-day:hover {
  background-color: #f0f0f0;
}

.calendar-day.prev-month,
.calendar-day.next-month {
  color: #bbb;
}

.calendar-day.today {
  border: 2px solid #ccc;
  border-radius: 30px;
  #background-color: #e3f2fd;
  #color: #1976d2;
}

.calendar-day.has-event {
  font-weight: bold;
}

@keyframes slideLeft {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-100%); opacity: 0.5; }
}

@keyframes slideRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0.5; }
}

.slide-left-enter-active {
  animation: slideLeft 0.3s ease-in-out;
}

.slide-right-enter-active {
  animation: slideRight 0.3s ease-in-out;
}
</style>
