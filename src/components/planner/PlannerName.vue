<template>
  <text class="grid_font__issue--name" :x="0" y="10">{{ row.label }}</text>
</template>

<script>
export default {
  name: "PlannerName",
  props: ["row"],
}
</script>

<style scoped>
  .grid_font__issue--name {
    font-size: 12px;
  }
</style>