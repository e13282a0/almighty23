<template>

    <svg :width="state.width" :height = "state.height" >
      <g id="grid">
        <line v-for="(elm, index) in state.timeBeam" :x1="(index*state.colWidth)+state.namesColumnWidth" y1="0" :x2="(index*state.colWidth)+state.namesColumnWidth" :y2="state.height" stroke="black" />
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
    let namesColumnWidth = 100
    let headerHeight=50
    let rowHeight=30
    let timeBeam = makeTimeBeam()

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

</style>