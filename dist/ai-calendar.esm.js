import { resolveComponent, openBlock, createElementBlock, normalizeClass, createCommentVNode, createElementVNode, createVNode, normalizeStyle, Fragment, renderList, withDirectives, vModelCheckbox, toDisplayString, createBlock, createTextVNode, withModifiers, Transition, withCtx } from 'vue';

var script = {
  props: {
    events: {
      type: Array,
      default: () => []
    },
    locale: {
      type: Object,
      default: () => ({
        weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      })
    },
    heightCalendar: {
      type: Boolean,
      default: false
    },
    isQuasar: {
      default: false,
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
      default: 3
    },
    yearMax: {
      default: 7,
    },
    swipable:{
      default: true
    },
    iconFilter:{
      default: false
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    colorButtonIcon:{
      default: '#333'
    },
    types: {
      type: Array,
      default: () => [
        { type: 'alert', name: 'Alert', color: '#e54e4e' },
        { type: 'warning', name: 'Warning', color: '#e5b34e' },
        { type: 'info', name: 'Info', color: '#4e6fe5' },
        { type: 'success', name: 'Success', color: '#4ee58b' }
      ]
    }
  },
  data() {
    return {
      currentDate: new Date(),
      activeFilters: [],
      swipeStartX: null,
      transitionName: 'slide-right',
      years: [],
      isMonthMenuOpen: false,
      isYearMenuOpen: false,
      filterMenu: false,
    };
  },
  computed: {
    // Все уникальные типы событий
    uniqueTypes() {
      const typeMap = new Map();

      this.events.forEach(eventGroup => {
        if (Array.isArray(eventGroup.events)) {
          eventGroup.events.forEach(event => {
            if (event.type && !typeMap.has(event.type)) {
              const typeDef = this.types.find(t => t.type === event.type);
              if (typeDef) {
                typeMap.set(event.type, { type: event.type, name: typeDef.name, color: typeDef.color });
              } else {
                // Резервный случай, если тип не найден в `types`
                typeMap.set(event.type, { type: event.type, name: null, color: '#999' });
              }
            }
          });
        }
      });

      return Array.from(typeMap.values());
    },

    // Фильтруем события по типу
    filteredEventsByType() {
      if (!this.activeFilters.length) return this.events;

      return this.events.map(group => ({
        ...group,
        events: group.events?.filter(e => this.activeFilters.includes(e.type)) || []
      })).filter(group => group.events.length > 0);
    },

    calendarDays() {
      const year = this.currentYear;
      const month = this.currentDate.getMonth();
      const today = new Date(); // ✅ Теперь будем использовать её

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const startDay = (firstDay.getDay() + 6) % 7;

      const days = [];

      // Предыдущий месяц
      for (let i = 0; i < startDay; i++) {
        const prevMonth = new Date(year, month, 0);
        const dayNum = prevMonth.getDate() - startDay + i + 1;
        days.push({
          date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNum),
          isPrevMonth: true,
          singleEvent: null,
          multipleEvents: null
        });
      }

      // Текущий месяц
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i);

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        const eventGroup = this.filteredEventsByType.find(e => e.date === dateStr);
        const dayEvents = eventGroup?.events || [];

        let singleEvent = null;
        let multipleEvents = null;

        if (dayEvents.length === 1) {
          singleEvent = dayEvents[0];
        } else if (dayEvents.length > 1) {
          multipleEvents = dayEvents;
        }

        days.push({
          date: currentDate,
          isToday: this.isSameDay(currentDate, today), // ✅ Используется здесь
          isPrevMonth: false,
          isNextMonth: false,
          singleEvent,
          multipleEvents
        });
      }

      // Следующий месяц
      const remainingDays = 7 - ((days.length) % 7 || 7);
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isNextMonth: true,
          singleEvent: null,
          multipleEvents: null
        });
      }

      return days;
    },

    // Отфильтрованные дни для отображения
    filteredCalendarDays() {
      return this.calendarDays.map(day => {
        if (!day.date || day.isPrevMonth || day.isNextMonth) {
          return {
            ...day,
            singleEvent: null,
            multipleEvents: null
          };
        }

        const dateStr = this.toDateString(day.date);
        const eventGroup = this.filteredEventsByType.find(e => e.date === dateStr);
        const dayEvents = eventGroup?.events || [];

        let singleEvent = null;
        let multipleEvents = null;

        if (dayEvents.length === 1) {
          singleEvent = {
            ...dayEvents[0],
            color: this.getTypeColor(dayEvents[0].type),
            icon: this.getIconByType(dayEvents[0].type)
          };
        } else if (dayEvents.length > 1) {
          multipleEvents = dayEvents.map(event => ({
            ...event,
            color: this.getTypeColor(event.type)
          }));
        }

        return {
          ...day,
          singleEvent,
          multipleEvents
        };
      });
    },

    currentYear() {
      return this.currentDate.getFullYear();
    },
    currentMonth() {
      return this.currentDate.getMonth();
    },
    currentMonthName() {
      return this.locale.monthNames[this.currentMonth];
    },
    weekDays() {
      return this.locale.weekDays;
    },
    monthNames() {
      return this.locale.monthNames;
    },
    selectedMonth: {
      get() {
        return this.currentDate.getMonth();
      },
      set(month) {
        const newDate = new Date(this.currentDate);
        newDate.setMonth(month);
        this.currentDate = newDate;
      }
    },
    selectedYear: {
      get() {
        return this.currentDate.getFullYear();
      },
      set(year) {
        const newDate = new Date(this.currentDate);
        newDate.setFullYear(year);
        this.currentDate = newDate;
      }
    },
  },
  created() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - this.yearMin;
    const endYear = currentYear + this.yearMax;

    for (let y = startYear; y <= endYear; y++) {
      this.years.push(y);
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    getTypeColor(type) {
      const found = this.types.find(t => t.type === type);
      return found ? found.color : '#999';
    },
    getIconByType(type) {
      const found = this.types.find(t => t.type === type);
      return found?.icon || null;
    },
    handleClickOutside(e) {
      const select = e.target.closest('.custom-select');
      const selectFilter = e.target.closest('.custom-select-filter');
      if (!select && !selectFilter && this.isMonthMenuOpen) {
        this.isMonthMenuOpen = false;
      }
      if (!select && !selectFilter && this.isYearMenuOpen) {
        this.isYearMenuOpen = false;
      }

      if (!selectFilter && !select && this.filterMenu) {
        this.filterMenu = false;
      }
    },
    toDateString(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    parseLocalDate(date) {
      const d = new Date(date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    },
    isSameDay(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
      );
    },
    getDayStyle(day) {
      //background-color: #fff; color: #7e57c2; multipleEvents
      if (day.singleEvent && !day.isPrevMonth && !day.isNextMonth) {
        return { backgroundColor: day.singleEvent.color, fontSize: (this.fontSizeDays < 2 ? this.fontSizeDays : 2)+'em',
          color: '#fff', aspectRatio:  this.heightCalendar ? '9/16' : '1/1'};
      }
      if (!day.singleEvent && !day.isPrevMonth && !day.isNextMonth && day.multipleEvents !== null) {
        if(day.multipleEvents.length < 4){
          return {  aspectRatio:  this.heightCalendar ? '9/16' : '1/1', fontSize: (this.fontSizeDays < 2 ? this.fontSizeDays : 2)+'em', color: this.$q.dark.isActive ? '#fff' : '#7e57c2'};
        }else {
          return {  backgroundColor: '#7e57c2', aspectRatio:  this.heightCalendar ? '9/16' : '1/1', fontSize: (this.fontSizeDays < 2 ? this.fontSizeDays : 2)+'em', color: '#fff'};
        }
      }
      if (!day.singleEvent && !day.isPrevMonth && !day.isNextMonth) {
        return {  aspectRatio:  this.heightCalendar ? '9/16' : '1/1', fontSize: (this.fontSizeDays < 2 ? this.fontSizeDays : 2)+'em', color: this.$q.dark.isActive ? '#fff' : ''};
      }
      return {}
    },
    selectDate(day) {
      if (!day.isPrevMonth && !day.isNextMonth) {
        const dayEvents = [];

        // Если есть одно событие
        if (day.singleEvent) {
          dayEvents.push(day.singleEvent);
        }

        // Если несколько событий
        if (Array.isArray(day.multipleEvents)) {
          dayEvents.push(...day.multipleEvents);
        }

        this.$emit('date-selected', {
          date: day.date,
          events: dayEvents.length ? dayEvents : null
        });
      }
    },
    prevMonth() {
      this.transitionName = 'slide-right';
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1);
    },
    nextMonth() {
      this.transitionName = 'slide-left';
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1);
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
    touchStart(e) {
      this.swipeStartX = e.touches[0].clientX;
    },
    touchEnd(e) {
      if (!this.swipeStartX) return;

      const deltaX = e.changedTouches[0].clientX - this.swipeStartX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) this.prevMonth();
        else this.nextMonth();
      }
      this.swipeStartX = null;
    },
    toggleMonthMenu() {
      this.isMonthMenuOpen = !this.isMonthMenuOpen;
      this.isYearMenuOpen = false; // закрываем год, если открыт
      this.filterMenu = false;
    },
    toggleYearMenu() {
      this.isYearMenuOpen = !this.isYearMenuOpen;
      this.isMonthMenuOpen = false; // закрываем месяц, если открыт
      this.filterMenu = false;
    },
    toggleFilterMenu(){
      this.filterMenu = !this.filterMenu;
      this.isMonthMenuOpen = false;
      this.isYearMenuOpen = false;
    },
    selectMonth(month) {
      this.selectedMonth = month;
      this.isMonthMenuOpen = false;
    },
    selectYear(year) {
      this.selectedYear = year;
      this.isYearMenuOpen = false;
    },
  }
};

const _hoisted_1 = {
  key: 0,
  style: {"width":"90vw","min-height":"40px"}
};
const _hoisted_2 = { class: "custom-select-filter" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = {
  key: 0,
  class: "down-right dropdown"
};
const _hoisted_6 = { key: 0 };
const _hoisted_7 = ["value"];
const _hoisted_8 = { class: "calendar-header" };
const _hoisted_9 = { key: 0 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = { key: 1 };
const _hoisted_12 = {
  key: 0,
  class: "down-left dropdown"
};
const _hoisted_13 = ["onClick"];
const _hoisted_14 = { key: 0 };
const _hoisted_15 = { key: 1 };
const _hoisted_16 = { key: 1 };
const _hoisted_17 = { key: 0 };
const _hoisted_18 = { key: 1 };
const _hoisted_19 = { key: 1 };
const _hoisted_20 = {
  key: 0,
  class: "down-right dropdown"
};
const _hoisted_21 = ["onClick"];
const _hoisted_22 = { key: 0 };
const _hoisted_23 = { key: 1 };
const _hoisted_24 = { key: 1 };
const _hoisted_25 = { class: "week-days" };
const _hoisted_26 = { class: "calendar-grid" };
const _hoisted_27 = ["onClick"];
const _hoisted_28 = ["title"];
const _hoisted_29 = {
  key: 1,
  class: "event-indicators"
};
const _hoisted_30 = {
  key: 0,
  class: "event-count"
};
const _hoisted_31 = ["title"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_q_icon = resolveComponent("q-icon");
  const _component_q_checkbox = resolveComponent("q-checkbox");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["calendar-container", { 'full-height': $props.heightCalendar }]),
    onTouchstart: _cache[9] || (_cache[9] = (...args) => ($options.touchStart && $options.touchStart(...args))),
    onTouchend: _cache[10] || (_cache[10] = (...args) => ($options.touchEnd && $options.touchEnd(...args)))
  }, [
    createCommentVNode(" Фильтр по типу "),
    ($props.showFilter)
      ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createElementVNode("div", _hoisted_2, [
            createElementVNode("button", {
              onClick: _cache[0] || (_cache[0] = (...args) => ($options.toggleFilterMenu && $options.toggleFilterMenu(...args))),
              class: "flat-button",
              style: {"float":"right","width":"40px","height":"40px"}
            }, [
              ($props.isQuasar)
                ? (openBlock(), createElementBlock("span", _hoisted_3, [
                    createVNode(_component_q_icon, {
                      name: "mdi-filter-outline",
                      size: "sm",
                      color: _ctx.$q.dark.isActive ? 'white' : 'black'
                    }, null, 8 /* PROPS */, ["color"])
                  ]))
                : (openBlock(), createElementBlock("span", {
                    key: 1,
                    style: normalizeStyle('color: '+$props.colorButtonIcon+'; font-size: '+$props.fontSizeIcon+'em')
                  }, [
                    ($props.iconFilter !== false)
                      ? (openBlock(), createElementBlock("span", {
                          key: 0,
                          class: normalizeClass($props.iconFilter)
                        }, null, 2 /* CLASS */))
                      : (openBlock(), createElementBlock("span", _hoisted_4, "⁝"))
                  ], 4 /* STYLE */))
            ]),
            ($data.filterMenu)
              ? (openBlock(), createElementBlock("div", _hoisted_5, [
                  (!$props.isQuasar)
                    ? (openBlock(), createElementBlock("div", _hoisted_6, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList($options.uniqueTypes, (typeObj) => {
                          return (openBlock(), createElementBlock("div", {
                            key: typeObj.type,
                            class: "option"
                          }, [
                            withDirectives(createElementVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($data.activeFilters) = $event)),
                              value: typeObj.type
                            }, null, 8 /* PROPS */, _hoisted_7), [
                              [vModelCheckbox, $data.activeFilters]
                            ]),
                            createElementVNode("span", {
                              style: normalizeStyle({color: typeObj.color, marginLeft: '8px'})
                            }, toDisplayString(typeObj.name), 5 /* TEXT, STYLE */)
                          ]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]))
                    : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList($options.uniqueTypes, (typeObj) => {
                        return (openBlock(), createBlock(_component_q_checkbox, {
                          class: "full-width text-center",
                          style: normalizeStyle({color: typeObj.color}),
                          key: typeObj.type,
                          label: typeObj.name,
                          color: "deep-purple-4",
                          modelValue: $data.activeFilters,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (($data.activeFilters) = $event)),
                          val: typeObj.type
                        }, null, 8 /* PROPS */, ["style", "label", "modelValue", "val"]))
                      }), 128 /* KEYED_FRAGMENT */))
                ]))
              : createCommentVNode("v-if", true)
          ])
        ]))
      : createCommentVNode("v-if", true),
    createCommentVNode(" Заголовок "),
    createElementVNode("div", _hoisted_8, [
      createCommentVNode(" Выбор месяца "),
      createElementVNode("button", {
        onClick: _cache[3] || (_cache[3] = (...args) => ($options.prevMonth && $options.prevMonth(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_9, [
              ($props.iconLeft !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    color: _ctx.$q.dark.isActive ? 'white' : 'black',
                    name: $props.iconLeft,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["color", "name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_10, "‹"))
            ]))
          : (openBlock(), createElementBlock("span", {
              key: 1,
              style: normalizeStyle('color: '+$props.colorButtonIcon+'; font-size: '+$props.fontSizeIcon+'em')
            }, [
              ($props.iconLeft !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconLeft)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_11, "‹"))
            ], 4 /* STYLE */))
      ]),
      createElementVNode("div", {
        class: "custom-select",
        onClick: _cache[4] || (_cache[4] = (...args) => ($options.toggleMonthMenu && $options.toggleMonthMenu(...args)))
      }, [
        createTextVNode(toDisplayString($options.monthNames[$options.selectedMonth]) + " ", 1 /* TEXT */),
        ($data.isMonthMenuOpen)
          ? (openBlock(), createElementBlock("div", _hoisted_12, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($options.monthNames, (monthName, index) => {
                return (openBlock(), createElementBlock("div", {
                  key: index,
                  class: "option",
                  onClick: withModifiers($event => ($options.selectMonth(index)), ["stop"])
                }, toDisplayString(monthName), 9 /* TEXT, PROPS */, _hoisted_13))
              }), 128 /* KEYED_FRAGMENT */))
            ]))
          : createCommentVNode("v-if", true)
      ]),
      createElementVNode("button", {
        onClick: _cache[5] || (_cache[5] = (...args) => ($options.nextMonth && $options.nextMonth(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_14, [
              ($props.iconRight !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    color: _ctx.$q.dark.isActive ? 'white' : 'black',
                    name: $props.iconRight,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["color", "name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_15, "›"))
            ]))
          : (openBlock(), createElementBlock("span", {
              key: 1,
              style: normalizeStyle('color: '+$props.colorButtonIcon+'; font-size: '+$props.fontSizeIcon+'em')
            }, [
              ($props.iconRight !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconRight)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_16, "›"))
            ], 4 /* STYLE */))
      ]),
      createCommentVNode(" Выбор года "),
      createElementVNode("button", {
        onClick: _cache[6] || (_cache[6] = (...args) => ($options.prevYear && $options.prevYear(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_17, [
              ($props.iconLeft !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    color: _ctx.$q.dark.isActive ? 'white' : 'black',
                    name: $props.iconLeft,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["color", "name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_18, "‹"))
            ]))
          : (openBlock(), createElementBlock("span", {
              key: 1,
              style: normalizeStyle('color: '+$props.colorButtonIcon+'; font-size: '+$props.fontSizeIcon+'em')
            }, [
              ($props.iconLeft !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconLeft)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_19, "‹"))
            ], 4 /* STYLE */))
      ]),
      createElementVNode("div", {
        class: "custom-select",
        onClick: _cache[7] || (_cache[7] = (...args) => ($options.toggleYearMenu && $options.toggleYearMenu(...args)))
      }, [
        createTextVNode(toDisplayString($options.selectedYear) + " ", 1 /* TEXT */),
        createCommentVNode(" Выпадающее меню "),
        ($data.isYearMenuOpen)
          ? (openBlock(), createElementBlock("div", _hoisted_20, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($data.years, (year) => {
                return (openBlock(), createElementBlock("div", {
                  key: year,
                  class: "option",
                  onClick: withModifiers($event => ($options.selectYear(year)), ["stop"])
                }, toDisplayString(year), 9 /* TEXT, PROPS */, _hoisted_21))
              }), 128 /* KEYED_FRAGMENT */))
            ]))
          : createCommentVNode("v-if", true)
      ]),
      createElementVNode("button", {
        onClick: _cache[8] || (_cache[8] = (...args) => ($options.nextYear && $options.nextYear(...args))),
        class: "flat-button"
      }, [
        ($props.isQuasar)
          ? (openBlock(), createElementBlock("span", _hoisted_22, [
              ($props.iconRight !== false)
                ? (openBlock(), createBlock(_component_q_icon, {
                    key: 0,
                    color: _ctx.$q.dark.isActive ? 'white' : 'black',
                    name: $props.iconRight,
                    size: $props.fontSizeIcon+'em'
                  }, null, 8 /* PROPS */, ["color", "name", "size"]))
                : (openBlock(), createElementBlock("span", _hoisted_23, "›"))
            ]))
          : (openBlock(), createElementBlock("span", {
              key: 1,
              style: normalizeStyle('color: '+$props.colorButtonIcon+'; font-size: '+$props.fontSizeIcon+'em')
            }, [
              ($props.iconRight !== false)
                ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass($props.iconRight)
                  }, null, 2 /* CLASS */))
                : (openBlock(), createElementBlock("span", _hoisted_24, "›"))
            ], 4 /* STYLE */))
      ])
    ]),
    createCommentVNode(" Дни недели "),
    createElementVNode("div", _hoisted_25, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.weekDays, (day) => {
        return (openBlock(), createElementBlock("div", { key: day }, toDisplayString(day), 1 /* TEXT */))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    createCommentVNode(" Анимированная сетка "),
    createVNode(Transition, {
      name: $data.transitionName,
      mode: "out-in"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock("div", {
          key: $data.currentDate.getTime(),
          class: "calendar-wrapper"
        }, [
          createElementVNode("div", _hoisted_26, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.filteredCalendarDays, (day, index) => {
              return (openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["calendar-day", {
              'today': day.isToday,
              'has-event': day.singleEvent && !day.isPrevMonth && !day.isNextMonth,
              'has-events': day.multipleEvents && !day.isPrevMonth && !day.isNextMonth,
              'prev-month': day.isPrevMonth,
              'next-month': day.isNextMonth
            }]),
                style: normalizeStyle($options.getDayStyle(day)),
                onClick: $event => ($options.selectDate(day))
              }, [
                createElementVNode("div", {
                  class: "day-number",
                  style: normalizeStyle('font-size: '+($props.fontSizeDays < 2 ? $props.fontSizeDays : 2)+'em')
                }, toDisplayString(day.date.getDate()), 5 /* TEXT, STYLE */),
                createCommentVNode(" Одно событие "),
                (day.singleEvent && !day.isPrevMonth && !day.isNextMonth)
                  ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: "single-event",
                      title: `${day.singleEvent.name}\n${day.singleEvent.description}`,
                      style: normalizeStyle({ backgroundColor: day.singleEvent.color })
                    }, null, 12 /* STYLE, PROPS */, _hoisted_28))
                  : createCommentVNode("v-if", true),
                createCommentVNode(" Много событий "),
                (day.multipleEvents && day.multipleEvents.length > 0 && !day.isPrevMonth && !day.isNextMonth)
                  ? (openBlock(), createElementBlock("div", _hoisted_29, [
                      createCommentVNode(" Показываем цифру, если событий больше 3 "),
                      (day.multipleEvents.length > 3)
                        ? (openBlock(), createElementBlock("div", _hoisted_30, toDisplayString(day.multipleEvents.length), 1 /* TEXT */))
                        : createCommentVNode("v-if", true),
                      createCommentVNode(" Показываем индикаторы только для первых 3 событий "),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(day.multipleEvents.slice(0, 3), (event, i) => {
                        return (openBlock(), createElementBlock("div", {
                          key: i,
                          class: "event-indicator",
                          title: `${event.name}\n${event.description}`,
                          style: normalizeStyle({ backgroundColor: event.color })
                        }, null, 12 /* STYLE, PROPS */, _hoisted_31))
                      }), 128 /* KEYED_FRAGMENT */))
                    ]))
                  : createCommentVNode("v-if", true)
              ], 14 /* CLASS, STYLE, PROPS */, _hoisted_27))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["name"])
  ], 34 /* CLASS, NEED_HYDRATION */))
}

script.render = render;
script.__file = "src/AiCalendar.vue";

export { script as default };
//# sourceMappingURL=ai-calendar.esm.js.map
