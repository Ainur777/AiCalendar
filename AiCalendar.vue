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

<script>
import AiCalendar from 'ai-calendar'
import 'ai-calendar/dist/ai-calendar.css'
export default {
  name: "EventsComponent",
  components:{
    AiCalendar
  },
  data: () => ({
    locale:{
      weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    },
    types:[
      { type: 'alert', name: 'Alert', color: '#e54e4e' },
      { type: 'warning', name: 'Warning', color: '#e5b34e' },
      { type: 'info', name: 'Info', color: '#4e6fe5' },
      { type: 'success', name: 'Success', color: '#4ee58b' }
    ],
    status:[
      {type: 'alert', icon: 'eva-alert-circle-outline', color: '#e54e4e'},
      {type: 'warning', icon: 'eva-alert-triangle-outline', color: '#e5b34e'},
      {type: 'info', icon: 'eva-info-outline', color: '#4e6fe5'},
      {type: 'success', icon: 'eva-checkmark-circle-2-outline', color: '#4ee58b'},
    ],
    events:[
      {
        date: '2025-06-15',
        events: [
          { type: 'alert', name: 'Сдать РМ-12333', description: '...' }
        ]
      },
      {
        date: '2025-06-16',
        events: [
          { type: 'alert', name: 'Сдать РМ-12333', description: '...' },
          { type: 'warning', name: 'Замечание', description: '...' },
          { type: 'info', name: 'Замечание', description: '...'},
        ]
      }
    ]
  }),
  methods:{
    load(){

    },
    handleDateSelection({ date, events }) {
      console.log('Date: '+new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }))
      console.log(events)
    }
  }
}
</script>

<style scoped>

</style>
