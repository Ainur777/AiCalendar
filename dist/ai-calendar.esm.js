import { resolveComponent, openBlock, createElementBlock, createElementVNode, createBlock, normalizeClass, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, createVNode, Transition, withCtx, normalizeStyle, createCommentVNode } from 'vue';

var script = {
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
};

const _hoisted_1 = { class: "calendar-header" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { key: 1 };
const _hoisted_6 = { class: "month-year-selectors" };
const _hoisted_7 = ["value"];
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { key: 1 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = { key: 1 };
const _hoisted_12 = { key: 0 };
const _hoisted_13 = { key: 1 };
const _hoisted_14 = { key: 1 };
const _hoisted_15 = { key: 1 };
const _hoisted_16 = ["value"];
const _hoisted_17 = { key: 0 };
const _hoisted_18 = { key: 1 };
const _hoisted_19 = { key: 1 };
const _hoisted_20 = { key: 1 };
const _hoisted_21 = { class: "week-days" };
const _hoisted_22 = { class: "calendar-grid" };
const _hoisted_23 = ["onClick"];
const _hoisted_24 = { class: "day-number" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_icon = resolveComponent("q-icon");

  return (openBlock(), createElementBlock("div", {
    class: "calendar-container",
    onTouchstart: _cache[6] || (_cache[6] = (...args) => ($options.touchStart && $options.touchStart(...args))),
    onTouchend: _cache[7] || (_cache[7] = (...args) => ($options.touchEnd && $options.touchEnd(...args)))
  }, [
    createElementVNode("div", _hoisted_1, [
      createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => ($options.prevMonth && $options.prevMonth(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_2, [
              ($props.iconLeft !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    name: $props.iconLeft,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_3, "‹"))
            ]))
          : (openBlock(), createElementBlock("span", _hoisted_4, [
              ($props.iconLeft !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconLeft)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_5, "‹"))
            ]))
      ]),
      createElementVNode("div", _hoisted_6, [
        withDirectives(createElementVNode("select", {
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($options.selectedMonth) = $event))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($options.monthNames, (month, index) => {
            return (openBlock(), createElementBlock("option", {
              key: index,
              value: index
            }, toDisplayString(month), 9 /* TEXT, PROPS */, _hoisted_7))
          }), 128 /* KEYED_FRAGMENT */))
        ], 512 /* NEED_PATCH */), [
          [vModelSelect, $options.selectedMonth]
        ]),
        createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => ($options.nextMonth && $options.nextMonth(...args))),
          class: "flat-button"
        }, [
          ($props.isQuasar)
            ? (openBlock(), createElementBlock("span", _hoisted_8, [
                ($props.iconRight !== false)
                  ? (openBlock(), createBlock(_component_q_icon, {
                      key: 0,
                      name: $props.iconRight,
                      size: $props.fontSizeIcon+'em'
                    }, null, 8 /* PROPS */, ["name", "size"]))
                  : (openBlock(), createElementBlock("span", _hoisted_9, "›"))
              ]))
            : (openBlock(), createElementBlock("span", _hoisted_10, [
                ($props.iconRight !== false)
                  ? (openBlock(), createElementBlock("span", {
                      key: 0,
                      class: normalizeClass($props.iconRight)
                    }, null, 2 /* CLASS */))
                  : (openBlock(), createElementBlock("span", _hoisted_11, "›"))
              ]))
        ]),
        createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => ($options.prevYear && $options.prevYear(...args))),
          class: "flat-button"
        }, [
          ($props.isQuasar)
            ? (openBlock(), createElementBlock("span", _hoisted_12, [
                ($props.iconLeft !== false)
                  ? (openBlock(), createBlock(_component_q_icon, {
                      key: 0,
                      name: $props.iconLeft,
                      size: $props.fontSizeIcon+'em'
                    }, null, 8 /* PROPS */, ["name", "size"]))
                  : (openBlock(), createElementBlock("span", _hoisted_13, "‹"))
              ]))
            : (openBlock(), createElementBlock("span", _hoisted_14, [
                ($props.iconLeft !== false)
                  ? (openBlock(), createElementBlock("span", {
                      key: 0,
                      class: normalizeClass($props.iconLeft)
                    }, null, 2 /* CLASS */))
                  : (openBlock(), createElementBlock("span", _hoisted_15, "‹"))
              ]))
        ]),
        withDirectives(createElementVNode("select", {
          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => (($options.selectedYear) = $event))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($options.years, (year) => {
            return (openBlock(), createElementBlock("option", {
              key: year,
              value: year
            }, toDisplayString(year), 9 /* TEXT, PROPS */, _hoisted_16))
          }), 128 /* KEYED_FRAGMENT */))
        ], 512 /* NEED_PATCH */), [
          [vModelSelect, $options.selectedYear]
        ])
      ]),
      createElementVNode("button", {
        onClick: _cache[5] || (_cache[5] = (...args) => ($options.nextYear && $options.nextYear(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_17, [
              ($props.iconRight !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    name: $props.iconRight,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_18, "›"))
            ]))
          : (openBlock(), createElementBlock("span", _hoisted_19, [
              ($props.iconRight !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconRight)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_20, "›"))
            ]))
      ])
    ]),
    createElementVNode("div", _hoisted_21, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.weekDays, (day) => {
        return (openBlock(), createElementBlock("div", {
          key: day,
          class: "day-label"
        }, toDisplayString(day), 1 /* TEXT */))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    createVNode(Transition, {
      name: _ctx.transitionName,
      mode: "out-in"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock("div", {
          key: $options.currentMonth + '-' + $options.currentYear,
          class: "calendar-wrapper"
        }, [
          createElementVNode("div", _hoisted_22, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.calendarDays, (day, index) => {
              return (openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["calendar-day", {
              'prev-month': day.isPrevMonth,
              'next-month': day.isNextMonth,
              'today': day.isToday,
              'has-event': day.hasEvent,
              'text-white': day.hasEvent
            }]),
                style: normalizeStyle((day.hasEvent ? 'background-color: '+day.eventColor : '')+('; font-size: '+($props.fontSizeDays < 2 ? $props.fontSizeDays : 2)+'em')),
                onClick: $event => ($options.selectDate(day))
              }, [
                createElementVNode("div", _hoisted_24, toDisplayString(day.date.getDate()), 1 /* TEXT */),
                (day.hasEvent)
                  ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: "event-indicator",
                      style: normalizeStyle({ borderColor: day.eventColor })
                    }, null, 4 /* STYLE */))
                  : createCommentVNode("v-if", true)
              ], 14 /* CLASS, STYLE, PROPS */, _hoisted_23))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["name"])
  ], 32 /* NEED_HYDRATION */))
}

script.render = render;
script.__scopeId = "data-v-ced4ed82";
script.__file = "src/AiCalendar.vue";

export { script as default };
//# sourceMappingURL=ai-calendar.esm.js.map
