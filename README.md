![image_calendar](https://github.com/user-attachments/assets/9856031a-35d2-4483-88c8-d340f4da3d98)

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
| eventsColors | array | An array with event colors. There are already 7 colors included as standard, but you can specify your own. If the events property already has a color, then the array is ignored. | Массив с цветами событий. Стандартно включены уже есть 7 цветов, но вы можете указать свой. Если в свойстве events уже есть color, то массив игнорируется |
| locale | object | Used for localization, it works in English as standard, which you can change. The <b>weekDays</b> property contains an array of days of the week (7 days), the <b>MonthNames</b> property contains an array of month names | Используется для локализации, стандартно работает на английском языке, который вы можете поменять. Свойство <b>weekDays</b> содержит массив дней недели (7 дней), свойство <b>monthNames</b> содержит массив названий месяцев |
| fontSizeDays | integer | Font size for displaying days in the calendar | Размер шрифта для отображения дней в календаре |
| fontSizeIcon | integer/float | The size of the button icons is the size in <b>em</b>. Maximum size <b>2em</b> | Размер иконок кнопок размеры в <b>em</b>. Максимальный размер <b>2em</b> |
| iconLeft | string | The icon of the "left" button. If <b>isQuasar = true</b>, it is compatible with all icons from the Quasar framework.  | Иконка кнопки "влево". Если <b>isQuasar = true</b>, то совместим со всеми иконками из фреймворка Quasar |
| iconRight | string | The icon of the "right" button. If <b>isQuasar = true</b>, it is compatible with all icons from the Quasar framework. | Иконка кнопки "вправо". Если <b>isQuasar = true</b>, то совместим со всеми иконками из фреймворка Quasar |
| yearMin | integer | Minimum year to generate the list | Минимальный год, для генерации списка |
| yearMax | integer | The maximum year to generate a list | Максимальный год, для генерации списка |
| swipable | boolean | Can I scroll through? If the <b>value is true</b>, then you can swipe on computers and smartphones. By default, the property has the value <b>true</b> | Можно пролистывать? Если значение <b>true</b>, то можно свайпить на компьютерах и смартфонах. По дефолту свойство имеет значение <b>true</b> |

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
      { date: '2023-11-15', color: '#FF9800' },
      { date: '2023-11-22' },
      { date: '2023-11-05', color: '#F44336' }
    ]"
    :events-colors="['#FFA726', '#66BB6A', '#EF5350']"
    @date-selected="handleDateSelection"
  />
</div>
</template>

<script>
import AiCalendar from 'ai-calendar';

export default {
  components: {
    AiCalendar
  },
  methods: {
    handleDateSelection(date) {
      console.log('Select date:', date);
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
    :events="events"
    :events-colors="eventsColors"
    :locale="locale"
    :icon-left="iconLeft"
    :icon-right="icon-right"
    @date-selected="handleDateSelection"
  />
</div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';
import AiCalendar from 'ai-calendar';

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

// Обработчик выбора даты
const handleDateSelection = (date) => {
  emit('date-selected', date);
};

// Пример данных
const events = [
  { date: '2023-11-15', color: '#FF9800' },
  { date: '2023-11-22' },
  { date: '2023-11-05', color: '#F44336' }
];

const eventsColors = ['#FFA726', '#66BB6A', '#EF5350'];

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
