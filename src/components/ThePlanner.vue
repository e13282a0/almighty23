<template>

  <svg :width="state.width" :height="state.height" class="planner">

    <planner-grid-selector v-if="state.gridSelector" :x="state.namesColumnWidth+state.gridSelectionPos.x" :y="state.headerHeight+state.gridSelectionPos.y" :width="state.colWidth" :height="state.rowHeight" />
    <rect class="grid-background" :x="state.namesColumnWidth" :y="state.headerHeight" :width="state.gridWidth" :height="state.gridHeight" @mouseenter="gridMouseEnter" @mouseleave="gridMouseLeave" />

    <!-- Grid -->
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
      <line class="grid-lines--major" x1="0" :x2="state.width" :y1="state.headerHeight" :y2="state.headerHeight"></line>
    </g>
    <!-- Rows -->
    <g id="body" :style="`transform: translateY( ${state.headerHeight}px)`">
      <g id="row" v-for="(row, index) in rows" :style="`transform: translateY(${(index*state.rowHeight)}px`">
        <planner-name :row="row" type="issue" />
      </g>
      <g id="bars" v-for="bar in bars">
        <!-- preview -->
        <rect v-if="dragDrop.dragging" class="bar__preview" :x="dragDrop.previewBar.bar.x1" :width="dragDrop.previewBar.bar.width" height="10" :y="dragDrop.previewBar.bar.y" />
        <!-- bar -->
        <planner-bar :bar="bar" @mousedown="startSlide(bar.id,$event)" @click="setActive(bar.id,$event)" />
      </g>
    </g>


  </svg>
  <br>
  {{ issues }}
</template>

<script>

import {reactive, computed} from 'vue';
import {makeTimeBeam, getTimeBeamIndexByDate, getTimeBeamPositionByDate, getTimeBeamLengthByDate} from '@/mixins/timebeam'
import moment from "moment";
import _ from 'lodash'
import PlannerGridSelector from "@/components/planner/PlannerGridSelector.vue";
import PlannerBar from "@/components/planner/PlannerBar.vue";
import PlannerName from "@/components/planner/PlannerName.vue";

export default {
  name: "ThePlanner",
  components: {PlannerGridSelector,PlannerBar,PlannerName},
  props: ["issues"],

  setup(props) {
    let colWidth = 16
    let namesColumnWidth = 80
    let headerHeight = 45
    let rowHeight = 16
    let timeBeam = makeTimeBeam()
    let padding = 10
    //debugger

    const state = reactive({
      colWidth: colWidth,
      namesColumnWidth: namesColumnWidth,
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      width: namesColumnWidth + (timeBeam.length * colWidth),
      height: headerHeight + ((props.issues.length + 1) * rowHeight),
      minX:namesColumnWidth,
      maxX:namesColumnWidth + (timeBeam.length * colWidth),
      minY:0,
      maxY: ((props.issues.length + 1) * rowHeight)+padding,
      gridWidth: (timeBeam.length * colWidth),
      gridHeight: ((props.issues.length + 1) * rowHeight),
      timeBeam: timeBeam,
      gridSelector: false,
      selectedID:-1,
      gridSelectionPos: {x: 0, y: 0},
    })

    function makeBar(issue) {
      let x1 = getTimeBeamPositionByDate(issue.startDate, colWidth, timeBeam)
      let x2 = getTimeBeamPositionByDate(issue.endDate, colWidth, timeBeam)
      issue.isActive=issue.id=== state.selectedID
      issue.isPreselected=false
      issue.isHighlighted=false
      issue.bar = {x1: x1, x2: x2, width: x2 - x1, y:issue.row*rowHeight};
      return issue;
    }

    let _rows=[] // make rows available as array for bars
    let rows=computed(() => {
      props.issues.forEach((issue, index)=>{
        _rows.push({
          no:index,
          label:issue.name,
          id:issue.id
        })
      })
      return _rows.sort((a,b)=>a.no-b.no)
    })

    const bars=computed(() => {
      return props.issues.map((issue)=>{
        issue.row = _rows.find(elm=>elm.id === issue.id).no
        return makeBar(issue)
      })
    })

    const css = reactive({
      padding: padding + "px"
    })

    function formatDateTime(value, format = "YYYY-MM-DD") {
      return moment(value).format(format);
    }

    //function cursor() {
    //  return `cursor: ${state.dragOffsetX ? 'grabbing' : 'grab'}`
    //}

    function getGridSelectionPos(pageX, pageY) {
      let x = pageX - padding - namesColumnWidth;
      let y = pageY - padding - headerHeight;
      let roundedX = Math.floor(x / colWidth) * colWidth
      let roundedY = Math.floor(y / rowHeight) * rowHeight
      return {x: roundedX, y: roundedY}
    }

    function gridMouseEnter(event) {
      console.log('mouseenter');
      state.gridSelector = true;
      event.target.addEventListener('mousemove', mouseMove, false);
    }

    function gridMouseLeave(event) {
      //console.log('mouseleave');
      state.gridSelector = false;
      event.target.removeEventListener('mousemove', mouseMove);
    }

    function mouseMove(event) {
        //console.log(event.pageX, event.pageY);
        state.gridSelectionPos = getGridSelectionPos(event.pageX, event.pageY)
    }

    const dragDrop = reactive({
      dragging:false,
      previewBar:{},
      coords:{
        x:null,
        y:null
      },
    })

    function startSlide (id, e) {
      //this.actHandleID = e.target.parentElement.id;
      //debugger
      setActive(id)
      dragDrop.coords.x = e.pageX
      dragDrop.coords.y = e.pageY
      document.addEventListener("mousemove", doSlide);
      document.addEventListener("mouseup", endSlide);
      dragDrop.dragging = true;
      dragDrop.diff={}
    }

    function doSlide(e) {
      e.stopPropagation();
      //let gridSize = this.displayParams.colWidth;

      function filterDiff(val, diff, min, max) {
        return val - Math.min(Math.max(val - diff, min), max);
      }

      let rounded = getGridSelectionPos(e.pageX, e.pageY)

      dragDrop.diff = {
        x: dragDrop.coords.x - e.pageX,
        y: dragDrop.coords.y - e.pageY
      }

      //console.log('xDiff: ' + xDiff);
      //if (this.actHandleID === "val0") {

      dragDrop.previewBar.bar.x1 -= filterDiff(dragDrop.previewBar.bar.x1, dragDrop.diff.x, state.minX, state.maxX);
      dragDrop.previewBar.bar.x2 -= filterDiff(dragDrop.previewBar.bar.x2, dragDrop.diff.x, state.minX, state.maxX);
      dragDrop.previewBar.bar.y -= filterDiff(dragDrop.previewBar.bar.y, dragDrop.diff.y, state.minY, state.maxY);

      //console.log(dragDrop.previewBar.bar.x1)

      // } else if (this.actHandleID === "val2") {
      //  this.activePlanning.bar.x2 -= filterDiff(this.activePlanning.bar.x2, diff.x, this.activePlanning.bar.x1 + gridSize, this.viewBoxParams.plannerWidth - 5);
      //} else if (this.actHandleID === "val1") {
      //  this.activePlanning.bar.x1 -= filterDiff(this.activePlanning.bar.x1, diff.x, 0, this.activePlanning.bar.x2 - gridSize);
      //}
      //this.activePlanning.bar.width = this.activePlanning.bar.x2 - this.activePlanning.bar.x1;
      dragDrop.coords.x = e.pageX;
      dragDrop.coords.y = e.pageY;
    }

    function endSlide (e) {
      e.stopPropagation();

      document.removeEventListener("mousemove", doSlide);
      document.removeEventListener("mouseup", endSlide);

      // // round values
      // this.activePlanning.bar = this.previewBar;
      // // set dates
      // let indexX1 = Math.round(this.activePlanning.bar.x1 / this.displayParams.colWidth); //index in TimeBeam
      // let indexX2 = Math.round(this.activePlanning.bar.x2 / this.displayParams.colWidth) - 1; //index in TimeBeam
      // let startDate = this.timeBeam[indexX1].startDate;
      // let endDate = this.timeBeam[indexX2].endDate;
      // // this.activePlanning.start_date = startDate.toLocaleDateString("nl", {year: "numeric", month: "2-digit", day: "2-digit", timeZone: 'UTC'});
      // // this.activePlanning.end_date = endDate.toLocaleDateString("nl", {year: "numeric", month: "2-digit", day: "2-digit", timeZone: 'UTC'});
      // this.activePlanning.start_date = startDate.format('YYYY-MM-DD');
      // this.activePlanning.end_date = endDate.format('YYYY-MM-DD');
      // this.activePlanning.startDate = startDate;
      // this.activePlanning.endDate = endDate;
      // // set user
      // let row = Math.round(this.activePlanning.bar.y / this.displayParams.rowHeight);
      // let _people = this.people.find(elm => elm.row === row);
      // this.activePlanning.people_id = _people.id;
      // this.activePlanning.people = _people;
      // this.persistPlanning(this.activePlanning);

      // zurücksetzen
      dragDrop.dragging = false;
      dragDrop.coords = {};
      state.selectedID = -1;
    }

    function setActive(id) {
      state.selectedID=id
      dragDrop.previewBar = Object.assign({},makeBar(props.issues.find(elm=>elm.id===id)))
    }

    return {state, css, rows, bars, dragDrop, formatDateTime, gridMouseEnter, gridMouseLeave, setActive,startSlide}
  }

}
</script>

<style scoped>

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

.planner {
  padding: v-bind('css.padding')
}

.grid-background {
  fill: white;
  fill-opacity: 0.01;
}

.bar__preview {
  fill: white;
  fill-opacity: 0.01;
  stroke: blue;
  stroke-dasharray: 4 2;
}
</style>