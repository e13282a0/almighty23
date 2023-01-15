<template>

  <svg :width="state.width" :height="state.height" class="planner">

    <rect class="grid-background" :x="state.namesColumnWidth" :y="state.headerHeight" :width="state.gridWidth" :height="state.gridHeight"  @mouseenter="mouseEnter" @mouseleave="mouseLeave"></rect>
    <rect v-if="state.gridSelector" class="grid-mouseover" :x="state.namesColumnWidth+state.gridSelectionPos.x" :y="state.headerHeight+state.gridSelectionPos.y" :width="state.colWidth" :height="state.rowHeight"></rect>

    <g id="vertical" v-for="(elm, index) in state.timeBeam">
      <g id="grid">
        <line v-if="elm.type==='day'" :class="{'grid-lines__head--new':elm.newWeek, 'grid-lines--minor': !elm.newWeek}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="20"
              :y2="state.height"></line>
        <line v-if="elm.type==='week'" :class="{'grid-lines__head--new':elm.newMonth, 'grid-lines--minor': !elm.newMonth}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth"
              :y1="elm.newMonth?10:20" :y2="state.height"></line>
        <line v-if="elm.type==='month'" :class="{'grid-lines__head--new':elm.newYear, 'grid-lines--minor': !elm.newYear}" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth"
              :y1="elm.newYear?0:10" :y2="state.height"></line>

        <line v-if="index===0 || elm.majorSeparator" class="grid-lines--major" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="0" :y2="state.height"></line>
      </g>

      <g id="headline">
        <text v-if="elm.newYear" class="grid_font__head--year" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="10">{{ formatDateTime(elm.startDate, "YYYY") }}</text>
        <line v-if="elm.newYear" class="grid-lines__head--new" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="0" y2="10"></line>

        <text v-if="elm.newMonth" class="grid_font__head--month" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="20">{{ formatDateTime(elm.startDate, "MMM") }}</text>
        <line v-if="elm.newMonth" class="grid-lines__head--new" :x1="(index*state.colWidth)+state.namesColumnWidth" :x2="(index*state.colWidth)+state.namesColumnWidth" y1="10" y2="20"></line>

        <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="30">{{ formatDateTime(elm.startDate, "DD") }}</text>
        <text class="grid_font__head--day" :x="(index*state.colWidth)+state.namesColumnWidth+1" y="40">{{ formatDateTime(elm.startDate, "dd") }}</text>
      </g>
      <line  class="grid-lines--major" x1="0" :x2="state.width" :y1="state.headerHeight" :y2="state.headerHeight"></line>

    </g>

    <g id="body" :style="`transform: translateY( ${state.headerHeight}px)`">
      <g id="row" v-for="(elm, index) in issues">
        <g id="names">
          <text class="grid_font__issue--name" :x="0" :y="((index+1)*state.rowHeight)">{{ elm.name }}</text>
        </g>
        <g id="bars" :style="`transform: translateX(${state.namesColumnWidth}px`">
          <rect class="bar__issue--overview" :x="getTimeBeamPositionByDate(elm.startDate, state.colWidth, state.timeBeam)" :y="(index*state.rowHeight)" :width="getTimeBeamLengthByDate(elm.startDate, elm.endDate, state.colWidth, state.timeBeam)" height="10"></rect>
        </g>
      </g>
    </g>

  </svg>

  {{ issues }}
</template>

<script>
import {reactive, ref} from 'vue';
import {makeTimeBeam,getTimeBeamIndexByDate,getTimeBeamPositionByDate,getTimeBeamLengthByDate} from '@/mixins/timebeam'
import moment from "moment";

export default {
  name: "ThePlanner",
  props: ["issues"],
  setup(props) {
    let colWith = 16
    let namesColumnWidth = 80
    let headerHeight = 45
    let rowHeight = 16
    let timeBeam = makeTimeBeam()
    let padding = 10
    //debugger

    const state = reactive({
      colWidth: colWith,
      namesColumnWidth: namesColumnWidth,
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      width: namesColumnWidth + (timeBeam.length * colWith),
      height: headerHeight + ((props.issues.length+1) * rowHeight),
      gridWidth:(timeBeam.length * colWith),
      gridHeight:((props.issues.length+1) * rowHeight),
      timeBeam: timeBeam,
      gridSelector:false,
      gridSelectionPos:{x:0, y:0}
    })
    const css=reactive({
      padding:padding+"px"
    })

    function formatDateTime(value, format = "YYYY-MM-DD") {
      return moment(value).format(format);
    }

    function getGridSelectionPos(pageX, pageY) {
      let x = pageX-padding-namesColumnWidth;
      let y = pageY-padding-headerHeight;
      let roundedX=Math.floor(x/colWith)*colWith
      let roundedY=Math.floor(y/rowHeight)*rowHeight
      return {x:roundedX, y:roundedY}
    }

    function mouseEnter(event) {
      console.log('mouseenter');
      state.gridSelector = true;
      event.target.addEventListener('mousemove', mouseMove, false);
    }

    function mouseLeave(event) {
      console.log('mouseleave');
      state.gridSelector = false;
      event.target.removeEventListener('mousemove', mouseMove);
    }
    function mouseMove(event) {
      console.log(event.pageX, event.pageY);
      state.gridSelectionPos = getGridSelectionPos(event.pageX,event.pageY)
    }

    return {state,css, formatDateTime,getTimeBeamIndexByDate,getTimeBeamPositionByDate,getTimeBeamLengthByDate,mouseEnter,mouseLeave}
  }

}
</script>

<style scoped>

.grid-mouseover {
  fill:none;
  stroke:blue;
}


.grid-lines--minor {
  stroke-dasharray: 2 2;
  stroke-width: 1px;
  stroke: #999999;

}

.grid-lines__head--new {
  stroke-width: 1px;
  stroke: #CCCCCC;

}

.grid-lines--major {
  stroke-width: 1px;
  stroke: #000000;
}

.grid_font__head--day {
  font-size: 9px;
}

.grid_font__head--month {
  font-size: 9px;
}

.grid_font__head--year {
  font-size: 9px;
}

.grid_font__issue--name {
  font-size: 12px;
}

.bar__issue--overview {
  stroke-width: 0;
}

.planner {
  padding: v-bind('css.padding')
}

.grid-background {
  fill:white;
  fill-opacity: 0.99;
}
</style>