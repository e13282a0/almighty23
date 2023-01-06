const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    moment: {
      locales: [
        'de',
        'de_at',
        'en'
      ]
    }
  }
})
