<template>
  <v-app>
    <v-main>
      <the-planner :issues="issues"/>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ThePlanner from './components/ThePlanner.vue'

export default {
  name: 'App',

  components: {
    ThePlanner
  },
  setup() {
    const store = useStore()

    const issues = computed(() => store.state.issues)
    return {
      issues,
    }
  },

  data: () => ({
    //
  }),
}
</script>
