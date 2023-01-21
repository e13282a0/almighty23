<template>
  <rect class="bar__issue--overview" :x="issue.bar.x1" :width="issue.bar.width" height="10"></rect>
</template>

<script>
export default {
  name: "PlannerBar",
  props: ["issue", "type"],
}
</script>

<style scoped>
  .bar__issue--overview {
    stroke-width: 0;
  }
</style>