![image_calendar2](https://github.com/user-attachments/assets/9cdeef99-a993-4f0b-a9d5-1131d6f3307b)
# AiCalendar (Vue or Quasar)
Customizable and stylized calendar with events. It is compatible with Vue and is suitable as an alternative to q-date from Quasar.</br>
Настраиваемый и стилизованный календарь с событиями. Он совместим с Vue и подходит в качестве альтернативы q-data от Quasar.
# Versions / Версии
vue:  <b>^3.0</b> </br>
quasar: <b>^2.0</b>
# Installation / Установка
```bash
npm install ai-calendar
       or
npm i ai-calendar
```
# Description of properties / Описание свойств
| props | type | en | ru |  
|-------|-----|-----|-------|  
| isQuasar | boolean | Do you use Quasar? If the value <b>is true</b>, then the <b>q-icon</b> will be used for the <b>button</b> and you can use any icons from quasar.conf (eva, mdi,...). And if the value <b> is false</b>, then there will be a standard switch symbol "‹›", but it is also possible to connect mdi icons by specifying: "mdi mdi-chevron-left" | Используете ли вы Quasar? Если значение <b>true</b>, то будет использован <b>q-icon</b> для <b>button</b> и вы можете использовать любые иконки из quasar.conf (eva, mdi,...). А если значение <b>false</b>, то будет стандартный символ переключателей "‹›", но возможно и подключение mdi иконок, указав: "mdi mdi-chevron-left"  |
| eventsColors | array | An array with event colors. There are already 7 colors included as standard, but you can specify your own. If the events property already has a color, then the array is ignored | Массив с цветами событий. Стандартно включены уже есть 7 цветов, но вы можете указать свой. Если в свойстве events уже есть color, то массив игнорируется |
| locale | object | Used for localization, it works in English as standard, which you can change. The <b>weekDays</b> property contains an array of days of the week (7 days), the <b>MonthNames</b> property contains an array of month names | Используется для локализации, стандартно работает на английском языке, который вы можете поменять. Свойство <b>weekDays</b> содержит массив дней недели (7 дней), свойство <b>monthNames</b> содержит массив названий месяцев |
| fontSizeDays | integer | Font size for displaying days in the calendar | Размер шрифта для отображения дней в календаре |
| fontSizeIcon | integer/float | The size of the button icons is the size in <b>em</b>. Maximum size <b>2em</b> | Размер иконок кнопок размеры в <b>em</b>. Максимальный размер <b>2em</b> |
| iconLeft | string | The icon of the "left" button. If <b>isQuasar = true</b>, it is compatible with all icons from the Quasar framework  | Иконка кнопки "влево". Если <b>isQuasar = true</b>, то совместим со всеми иконками из фреймворка Quasar |
| iconRight | string | The icon of the "right" button. If <b>isQuasar = true</b>, it is compatible with all icons from the Quasar framework | Иконка кнопки "вправо". Если <b>isQuasar = true</b>, то совместим со всеми иконками из фреймворка Quasar |
| yearMin | integer | Minimum year to generate the list | Минимальный год, для генерации списка |
| yearMax | integer | The maximum year to generate a list | Максимальный год, для генерации списка |
| swipable | boolean | Can I scroll through? If the <b>value is true</b>, then you can swipe on computers and smartphones. By default, the property has the value <b>true</b> | Можно пролистывать? Если значение <b>true</b>, то можно свайпить на компьютерах и смартфонах. По дефолту свойство имеет значение <b>true</b> |
| heightCalendar | boolean | Property for changing the height of the calendar. By default, the property has the value <b>false</b> | Свойство для изменения высоты календаря. По дефолту свойство имеет значение <b>false</b> |
| showFilter | boolean | Activating the filtering function by event type | Активация функции фильтрации по типу событии |  
| iconFilter | string | The icon of the "filter" button. If <b>isQuasar = true</b>, it is compatible with all icons from the Quasar framework | Иконка кнопки "фильтр". Если <b>isQuasar = true</b>, то совместим со всеми иконками из фреймворка Quasar |  
| colorButtonIcon | string | Sets the color of the button. If <b>isQuasar = true</b>, it takes the system color dark or light | Задаёт цвет кнопки. Если <b>isQuasar = true</b>, то принимает цвет системы dark или light |  
| types | array | An array of event types. Each array property contains a type, a name, and a color. | Массив типов событий. Каждое свойство массива содержит тип, имя и цвет |  

# Connection example / Пример подключения
Minimal with default properties / Минимальный тип с дефолтными свойствами:
```vue
<ai-calendar/>
```
Old syntax without "setup" / Старый синтаксис без "setup"
```vue
<template>
  <div style="width: 100%; max-width: 450px; margin: 0 auto;">
    <ai-calendar
        :events="[
            {
              date: '2025-06-15',
              events: [{ type: 'alert', name: 'Alert name', description: '...' }]
            }
           ]"
        @date-selected="handleDateSelection"
    />
  </div>
</template>

<script>
import AiCalendar from 'ai-calendar';
import 'ai-calendar/dist/ai-calendar.css'; //Add CSS style
export default {
  components: {
    AiCalendar
  },
  methods: {
    handleDateSelection({ date, events }) {
      console.log('Date: '+new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }))
      console.log(events)
    }
  }
};
</script>
```
New syntax for setup (Composition API). An example with many properties.<br>
Новый синтаксис setup (Composition API). Пример с множеством свойств.
```vue
<template>
  <div style="width: 100%; max-width: 450px; margin: 0 auto;">
    <ai-calendar
        @date-selected="handleDateSelection"
        :events="events"
        :is-quasar="true"
        icon-left="eva-arrow-ios-back-outline"
        icon-right="eva-arrow-ios-forward-outline"
        :font-size-days="1.1"
        :font-size-icon="1.2"
        :year-min="3"
        :year-max="5"
        :locale="locale"
        :swipable="true"
        :height-calendar="false"
        :show-filter="true"
        color-button-icon="#333"
        :types="types"
    />
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';
import AiCalendar from 'ai-calendar';
import 'ai-calendar/dist/ai-calendar.css'
// Определяем props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  eventsColors: {
    type: Array,
    default: () => ['#FF9800', '#4CAF50', '#F44336']
  },
  locale: {
    type: Object,
    default: () => ({
      weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      monthNames: [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]
    })
  },
  iconLeft: {
    type: String,
    default: null
  },
  iconRight: {
    type: String,
    default: null
  }
});

// Определяем emit
const emit = defineEmits(['date-selected']);
const emitEvents = defineEmits(['events']);
// Обработчик выбора даты
const handleDateSelection = ({ date, events }) => {
  emit('date-selected', date);
  emitEvents('events', events);
};

// Пример данных
const events = [
  {
    date: '2025-06-15',
    events: [
      { type: 'alert', name: 'Alert name', description: '...' }
    ]
  },
  {
    date: '2025-06-16',
    events: [
      { type: 'alert', name: 'Alert name', description: '...' },
      { type: 'warning', name: 'Warning name', description: '...' },
      { type: 'info', name: 'Info name', description: '...'},
    ]
  }
];
const types = [
  { type: 'alert', name: 'Alert', color: '#e54e4e' },
  { type: 'warning', name: 'Warning', color: '#e5b34e' },
  { type: 'info', name: 'Info', color: '#4e6fe5' },
  { type: 'success', name: 'Success', color: '#4ee58b' }
];
const locale = {
  weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthNames: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
};

const iconLeft = 'arrow_left';
const iconRight = 'arrow_right';
</script>
```
