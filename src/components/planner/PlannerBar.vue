<template>
  <rect :class="{'bar__standard':(!bar.isActive && !bar.isPreselected && !bar.isHighlighted), 'bar__preselected': bar.isPreselected, 'bar__active':bar.isActive, 'bar__highlighted':bar.isHighlighted}" :x="bar.bar.x1" :width="bar.bar.width" height="10" :y="bar.bar.y" />
</template>

<script>
export default {
  name: "PlannerBar",
  props: ["bar"],
}
</script>

<style scoped>
  .bar__standard{
    stroke-width: 0;
    fill:blue;
  }
  .bar__preselected{
    stroke-width: 0;
    fill:lightgreen;
  }
  .bar__active{
    stroke-width: 0;
    fill:green;
  }
  .bar__highlighted{
    stroke-width: 0;
    fill:yellow;
  }

</style>