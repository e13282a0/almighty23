<template>
  <g>
    <rect class="grid-mouseover" :x="x" :y="y" :width="width" :height="height"></rect>
    <line class="grid-mouseover" :x1="x+(width/2)" :x2="x+(width/2)" :y1="y+4" :y2="y+height-4"></line>
    <line class="grid-mouseover" :x1="x+4" :x2="x+width-4" :y1="y+(height/2)" :y2="y+(height/2)"></line>
  </g>
</template>

<script>
export default {
  name: "PlannerGridSelector",
  props: ["x","y","width","height"],
}
</script>

<style scoped>
.grid-mouseover {
  fill: lightskyblue;
  fill-opacity: 0.7;
  stroke: blue;
  stroke-opacity: 0.7;
}
</style>