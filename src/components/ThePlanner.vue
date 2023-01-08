<template>

    <svg :width="state.width" :height = "state.height" class="planner">
      <g id="grid">
        <line v-for="(elm, index) in state.timeBeam" :class=" {'grid-lines__head--major':elm.majorSeparator,'grid-lines__head--minor':!elm.majorSeparator,}" :x1="(index*state.colWidth)+state.namesColumnWidth" y1="0" :x2="(index*state.colWidth)+state.namesColumnWidth" :y2="state.height" stroke="black" />
        <line v-for="(elm, index) in issues" x1="0" :y1="(index*state.rowHeight)+state.headerHeight" :x2="state.width" :y2="(index*state.rowHeight)+state.headerHeight" stroke="black" />
      </g>
      <g id="headline">
        <g id="empty"></g>
        <g id="grid"></g>
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

export default {
  name: "ThePlanner",
  props:["issues"],
  setup(props) {
    let colWith = 14
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
  return {state}
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
.grid-lines__body--minor{

}
.grid-lines__body--major{

}
</style>