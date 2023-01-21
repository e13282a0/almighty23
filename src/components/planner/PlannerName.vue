<template>
  <text class="grid_font__issue--name" :x="0" y="10">{{ issue.name }}</text>
</template>

<script>
export default {
  name: "PlannerName",
  props: ["issue", "type"],
}
</script>

<style scoped>
  .grid_font__issue--name {
    font-size: 12px;
  }
</style>