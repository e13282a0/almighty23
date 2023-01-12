<template>

    <svg :width="state.width" :height = "state.height" class="planner">
        <g id="vertical" v-for="(elm, index) in state.timeBeam">
          <g id="headline">
            <text v-if="elm.newYear" class="grid_font__head--year" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="10">{{ formatDateTime(elm.startDate,"YYYY") }} </text>
            <line v-if="elm.newYear" class="grid-lines__head--new" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="0" :y2="state.headerHeight"></line>

            <text v-if="elm.newMonth" class="grid_font__head--month" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="20">{{ formatDateTime(elm.startDate,"MMM") }} </text>
            <line v-if="elm.newMonth" class="grid-lines__head--new" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="10" :y2="state.headerHeight"></line>

            <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="30">{{ formatDateTime(elm.startDate,"DD") }} </text>
            <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="40">{{ formatDateTime(elm.startDate,"dd") }} </text>
            <line v-if="elm.type==='day'" :class="{'grid-lines__head--new':elm.newWeek,'grid-lines--major':elm.majorSeparator, 'grid-lines--minor':!elm.majorSeparator && !elm.newWeek}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="20" :y2="state.headerHeight"></line>
          </g>
          <g id="grid">
            <line v-if="elm.type==='day'" :class="{'grid-lines__head--new':elm.newWeek, 'grid-lines--minor': !elm.newWeek}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" :y1="state.headerHeight" :y2="state.height"></line>
            <line v-if="elm.type==='week'" :class="{'grid-lines__head--new':elm.newMonth, 'grid-lines--minor': !elm.newMonth}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" :y1="state.headerHeight" :y2="state.height"></line>
            <line v-if="elm.type==='month'" :class="{'grid-lines__head--new':elm.newYear, 'grid-lines--minor': !elm.newYear}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" :y1="state.headerHeight" :y2="state.height"></line>

            <line v-if="elm.majorSeparator" class="grid-lines--major" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="0" :y2="state.height"></line>
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
    let headerHeight=45
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

.grid-lines--minor{
  stroke-dasharray: 2 2;
  stroke-width: 1px;
  stroke: #aaaaaa;

}
.grid-lines__head--new{
  stroke-width: 1px;
  stroke: #CCCCCC;

}
.grid-lines--major{
  stroke-width: 1px;
  stroke: #000000;
}

.grid_font__head--day{
 font-size: 9px;
}
.grid_font__head--month{
  font-size: 9px;
}
.grid_font__head--year{
  font-size: 9px;
}

.grid-lines__body--minor{

}
.grid-lines__body--major{

}
</style>