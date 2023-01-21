<template>
  <rect :class="{'bar__standard':(!issue.isActive && !issue.isPreselected && !issue.isHighlighted), 'bar__preselected': issue.isPreselected, 'bar__active':issue.isActive, 'bar__highlighted':issue.isHighlighted}" :x="issue.bar.x1" :width="issue.bar.width" height="10"></rect>
</template>

<script>
export default {
  name: "PlannerBar",
  props: ["issue", "type"],
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