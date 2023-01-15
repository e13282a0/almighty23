import { createStore } from 'vuex'
import moment from "moment";
export default createStore({
  state: {
    issues: [
      {
        id:1,
        name: "issue 1 5days",
        startDate:moment().startOf('day'),
        endDate:moment().add(5, 'days').endOf('day'),
      },
      {
        id:2,
        name: "issue 2",
        startDate:moment("02.04.2023", "DD.MM.YYYY").startOf('day'),
        endDate:moment("12.05.2023", "DD.MM.YYYY").endOf('day'),
      },
      {
        id:3,
        name: "issue 3",
        startDate:moment("14.03.2023", "DD.MM.YYYY").startOf('day'),
        endDate:moment("27.06.2023", "DD.MM.YYYY").endOf('day'),
      },
      {
        id:4,
        name: "issue 4",
        startDate:moment("08.07.2023", "DD.MM.YYYY").startOf('day'),
        endDate:moment("24.12.2024", "DD.MM.YYYY").endOf('day'),
      }
    ]


  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
