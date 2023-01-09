<template>

    <svg :width="state.width" :height = "state.height" class="planner">
      <g id="grid">
        <line v-for="(elm, index) in state.timeBeam" :class=" {'grid-lines__head--major':elm.majorSeparator,'grid-lines__head--minor':!elm.majorSeparator,}" :x1="(index*state.colWidth)+state.namesColumnWidth" y1="0" :x2="(index*state.colWidth)+state.namesColumnWidth" :y2="state.height" stroke="black" />
        <line v-for="(elm, index) in issues" x1="0" :y1="(index*state.rowHeight)+state.headerHeight" :x2="state.width" :y2="(index*state.rowHeight)+state.headerHeight" stroke="black" />
      </g>
      <g id="headline">
        <g v-for="(elm, index) in state.timeBeam">
          <text v-if="elm.newYear" class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth" y="10">{{ formatDateTime(elm.startDate,"YY") }} </text>
          <text v-if="elm.newMonth" class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth" y="20">{{ formatDateTime(elm.startDate,"MMM") }} </text>
          <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth" y="30">{{ formatDateTime(elm.startDate,"DD") }} </text>
          <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth" y="40">{{ formatDateTime(elm.startDate,"dd") }} </text>
          </g>
      </g>
      <g id="body">
        <g id="names"></g>
        <g id="bars"></g>
      </g>
      <!--<rect x="10" y="10" width="100" height="200"></rect>-->
    </svg>

  {{ issues }}
</template>

<script>
import { reactive } from 'vue';
import { makeTimeBeam } from '@/mixins/timebeam'
import moment from "moment";

export default {
  name: "ThePlanner",
  props:["issues"],
  setup(props) {
    let colWith = 16
    let namesColumnWidth = 300
    let headerHeight=50
    let rowHeight=30
    let timeBeam = makeTimeBeam()
    debugger
    const state= reactive({
      colWidth:colWith,
      namesColumnWidth:namesColumnWidth,
      headerHeight:headerHeight,
      rowHeight:rowHeight,
      width:namesColumnWidth+(timeBeam.length*colWith),
      height:headerHeight+(props.issues.length*rowHeight),
      timeBeam:timeBeam,
    })

    function formatDateTime(value, format="YYYY-MM-DD") {
      return moment(value).format(format);
    }
  return {state,formatDateTime}
  }

}
</script>

<style scoped>
.planner {
  padding: 10px;
}

.grid-lines__head--minor{
  stroke-dasharray: 5 3;
  stroke-width: 1px;
  stroke: #aaaaaa;

}
.grid-lines__head--major{
  stroke-width: 1px;
  stroke: #000000;
}

.grid_font__head--day{
 font-size: 10px;
}
.grid-lines__body--minor{

}
.grid-lines__body--major{

}
</style>